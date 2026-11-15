'use strict';
const assert=require('assert');
const fs=require('fs');const path=require('path');const os=require('os');const http=require('http');
const crypto=require('crypto');
process.env.CANONICAL_DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'canonical-test-'));
process.env.CANONICAL_USERS_JSON=JSON.stringify({alice:'A'.repeat(32),bob:'B'.repeat(32)});
process.env.CANONICAL_ADAPTERS_JSON=JSON.stringify({'alice:muse':'C'.repeat(32)});
const {createServer}=require('../src/interface/server');
const {verifyOriginal}=require('../src/infrastructure/canonical-source');
const {CAPABILITIES}=require('../src/domain/policy');
function httpRequest(port,resource,token,payload){
  return new Promise((resolve,reject)=>{
    const body=JSON.stringify(payload);
    const req=http.request({hostname:'127.0.0.1',port,path:resource,method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json, text/event-stream','Authorization':token?'Bearer '+token:'','Content-Length':Buffer.byteLength(body)}},res=>{
      let raw='';res.on('data',x=>raw+=x);
      res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(raw)});}catch(e){reject(e);}});
    });
    req.on('error',reject);req.end(body);
  });
}
async function main(){
  assert(Object.keys(CAPABILITIES).length>=10);
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  let passed=0;
  async function rpc(name,args={},token='A'.repeat(32)) {
    return httpRequest(port,'/mcp',token,{jsonrpc:'2.0',id:++passed,method:'tools/call',params:{name,arguments:args}});
  }
  try{
    const noAuth=await rpc('listar_agentes',{},'');assert.strictEqual(noAuth.status,401);
    const init=await httpRequest(port,'/mcp','A'.repeat(32),{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18'}});
    assert.strictEqual(init.data.result.serverInfo.name,'canonical-ai-control');
    const tools=await httpRequest(port,'/mcp','A'.repeat(32),{jsonrpc:'2.0',id:2,method:'tools/list'});
    assert.strictEqual(tools.data.result.tools.length,8);
    const src=await rpc('estado_canonico');assert.strictEqual(src.data.result.structuredContent.law_paths.length,25);
    let list=await rpc('listar_agentes');assert.strictEqual(list.data.result.structuredContent.version,0);
    let reg=await rpc('registrar_agente',{agent_id:'muse',display_name:'Muse da agência',expected_version:0});
    assert.strictEqual(reg.data.result.structuredContent.version,1);
    let again=await rpc('registrar_agente',{agent_id:'muse',display_name:'Outra',expected_version:0});
    assert.strictEqual(again.data.result.isError,true);
    let verify=await rpc('avaliar_acao',{agent_id:'muse',capability:'web_read'});
    assert.strictEqual(verify.data.result.structuredContent.decision,'deny');
    let on=await rpc('configurar_capacidade',{agent_id:'muse',capability:'web_read',enabled:true,expected_version:1});
    assert.strictEqual(on.data.result.structuredContent.version,2);
    let good=await rpc('avaliar_acao',{agent_id:'muse',capability:'web_read'});
    assert.strictEqual(good.data.result.structuredContent.decision,'allow');
    let other=await rpc('listar_agentes',{},'B'.repeat(32));
    assert.strictEqual(other.data.result.structuredContent.version,0);
    let gate=await httpRequest(port,'/gate','C'.repeat(32),{agent_id:'muse',capability:'web_read',action_id:'test_nonce_001'});
    assert.strictEqual(gate.data.decision,'allow');
    let replay=await httpRequest(port,'/gate','C'.repeat(32),{agent_id:'muse',capability:'web_read',action_id:'test_nonce_001'});
    assert.strictEqual(replay.status,409);
    let off=await rpc('configurar_capacidade',{agent_id:'muse',capability:'web_read',enabled:false,expected_version:2});
    assert.strictEqual(off.data.result.structuredContent.version,3);
    let denied=await httpRequest(port,'/gate','C'.repeat(32),{agent_id:'muse',capability:'web_read',action_id:'test_nonce_002'});
    assert.strictEqual(denied.data.decision,'deny');
    const update=await rpc('configurar_capacidade',{agent_id:'muse',capability:'purchases',enabled:true,expected_version:3});
    assert.strictEqual(update.data.result.structuredContent.version,4);
    const safety=await httpRequest(port,'/gate','C'.repeat(32),{agent_id:'muse',capability:'purchases',action_id:'test_nonce_003'});
    assert.strictEqual(safety.data.decision,'needs_confirmation');
    let switchOff=await rpc('definir_agente',{agent_id:'muse',enabled:false,expected_version:4});
    assert.strictEqual(switchOff.data.result.structuredContent.agents.muse.enabled,false);
    let audit=await rpc('consultar_auditoria');assert(audit.data.result.structuredContent.events.length>=5);
    const unknown=await rpc('configurar_capacidade',{agent_id:'muse',capability:'hack',enabled:true,expected_version:5});
    assert.strictEqual(unknown.data.result.isError,true);
    const bad=Buffer.from('malicious law substitute');
    assert.throws(()=>verifyOriginal('laws/law01_authority.md',bad),/integrity/i);
    process.env.VERCEL='1';
    const publicTools=await httpRequest(port,'/mcp','',{jsonrpc:'2.0',id:100,method:'tools/list'});
    assert.strictEqual(publicTools.data.result.tools.length,2);
    const blockedWrite=await rpc('registrar_agente',{agent_id:'rogue',display_name:'Rogue',expected_version:0},'');
    assert.strictEqual(blockedWrite.data.result.isError,true);
    const blockedGate=await httpRequest(port,'/gate','C'.repeat(32),{agent_id:'muse',capability:'web_read',action_id:'test_nonce_004'});
    assert.strictEqual(blockedGate.status,503);
    delete process.env.VERCEL;
    console.log('PASS: MCP initialize, tool discovery, auth isolation, version conflicts, 25-law lock, fail-closed, reversible toggles, gate, replay denial, sensitive confirmation, audit, integrity checks.');
  }finally{await new Promise(resolve=>server.close(resolve));fs.rmSync(process.env.CANONICAL_DATA_DIR,{recursive:true,force:true});}
}
main().catch(e=>{console.error('FAIL',e);process.exitCode=1;});
