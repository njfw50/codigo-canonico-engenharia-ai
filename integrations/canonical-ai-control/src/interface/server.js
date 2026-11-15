'use strict';
const http=require('http');
const {userFromAuthorization,agentFromAuthorization}=require('../infrastructure/auth');
const {TOOLS,call}=require('./tools');
const app=require('../application/service');
const source=require('../infrastructure/canonical-source');
const {validateId}=require('../domain/policy');
const VERSION='0.2.0';
const isEphemeral = () => Boolean(process.env.VERCEL); // No serverless writes without a durable adapter
function json(res,status,data,headers={}) {
  const body=JSON.stringify(data);
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve,reject)=>{
    let chunks=[],bytes=0,done=false;
    req.on('data',b=>{
      bytes+=b.length;
      if(bytes>64*1024){done=true;reject(Error('Request body too large'));req.destroy();return;}
      chunks.push(b);
    });
    req.on('end',()=>{if(done)return;try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));}catch{reject(Error('Invalid JSON'));}});
    req.on('error',reject);
  });
}
function connected(user,agent){
  if(!validateId(user)||!validateId(agent))return false;
  const config=process.env.CANONICAL_ADAPTERS_JSON||'{}';
  const list=JSON.parse(config);
  return typeof list[user+':'+agent]==='string'&&list[user+':'+agent].length>=24;
}
function validActionId(s){return typeof s==='string'&&/^[A-Za-z0-9_-]{12,80}$/.test(s);}
function previouslySeen(user,action_id) {
  const store=require('../infrastructure/store');
  // Audit history is verified on read. Refuse replays within retained history.
  return store.tailAudit(user,0).some(x=>x.kind==='gate_decision'&&x.detail.action_id===action_id);
}
async function handler(req,res){
  if(req.url==='/health'&&req.method==='GET')return json(res,200,{ok:true,plugin:'canonical-ai-control',version:VERSION,canonical_commit:source.index().commit,policy_mutations_enabled:!isEphemeral()});
  if(req.url==='/mcp'&&req.method==='GET')return json(res,405,{error:'Streamable HTTP stateless MCP: use POST'}, {'Allow':'POST'});
  if(req.url==='/mcp'&&req.method==='POST') {
    const user=userFromAuthorization(req.headers.authorization);
    const publicReadOnly=Boolean(process.env.VERCEL);
    if(!user && !publicReadOnly)return json(res,401,{error:'Authentication required'}, {'WWW-Authenticate':'Bearer realm="Canonical AI Control"'});
    let msg;try{msg=await readBody(req);}catch(e){return json(res,400,{error:e.message});}
    if(msg&&msg.method&&msg.id===undefined){res.writeHead(202,{'Cache-Control':'no-store'});return res.end();}
    const id=msg&&msg.id!==undefined?msg.id:null;
    if(!msg||msg.jsonrpc!=='2.0'||typeof msg.method!=='string'||id===null)return json(res,400,{jsonrpc:'2.0',id,error:{code:-32600,message:'Invalid JSON-RPC request'}});
    const reply=(result)=>json(res,200,{jsonrpc:'2.0',id,result});
    const fail=(code,message)=>json(res,200,{jsonrpc:'2.0',id,error:{code,message}});
    if(msg.method==='initialize')return reply({protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo:{name:'canonical-ai-control',version:VERSION},instructions:'Controle apenas agentes integrados; o Código Canônico vem do GitHub original e jamais pode ser alterado. Verifique a versão antes de escrever. Capacidades não suportadas não são ativadas em aplicativos externos. Ações sensíveis exigem confirmação específica fora do modelo.'});
    if(msg.method==='ping')return reply({});
    if(msg.method==='tools/list')return reply({tools:publicReadOnly?TOOLS.filter(t=>['estado_canonico','consultar_canon'].includes(t.name)):TOOLS});
    if(msg.method==='tools/call') {
      const writeTools=new Set(['registrar_agente','definir_agente','configurar_capacidade']);
      if(isEphemeral() && writeTools.has(msg.params && msg.params.name)) return reply({isError:true,content:[{type:'text',text:'Persistencia duravel nao configurada: nenhuma permissao foi alterada.'}]});
      const p=msg.params||{};
      if(publicReadOnly && !['estado_canonico','consultar_canon'].includes(p.name))return reply({isError:true,content:[{type:'text',text:'Permission controls require an authenticated durable service.'}]});
      if(typeof p.name!=='string')return fail(-32602,'Tool name required');
      try{
        const result=await call(user||'public',p.name,p.arguments||{},connected);
        return reply({content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result});
      }catch(e){return reply({isError:true,content:[{type:'text',text:e.message}]});}
    }
    return fail(-32601,'Unknown MCP method');
  }
  if(req.url==='/gate'&&req.method==='POST') {
    if(isEphemeral())return json(res,503,{decision:'deny',reason:'persistent_storage_required'});
    const identity=agentFromAuthorization(req.headers.authorization);
    if(!identity)return json(res,401,{decision:'deny',reason:'unauthorized_adapter'});
    let body;try{body=await readBody(req);}catch(e){return json(res,400,{decision:'deny',reason:e.message});}
    if(!body||body.agent_id!==identity.agent||!validActionId(body.action_id)||typeof body.capability!=='string')return json(res,400,{decision:'deny',reason:'invalid_gate_request'});
    try{
      if(previouslySeen(identity.user,body.action_id))return json(res,409,{decision:'deny',reason:'replayed_action_id'});
      const verdict=app.evaluate(app.read(identity.user),identity.agent,body.capability,true);
      // The adapter must enforce 'allow', 'deny', and 'needs_confirmation' BEFORE any side effect.
      app.appendAudit(identity.user,{kind:'gate_decision',user:identity.user,detail:{agent_id:identity.agent,action_id:body.action_id,capability:body.capability,decision:verdict.decision}});
      return json(res,200,{...verdict,agent_id:identity.agent,action_id:body.action_id});
    }catch(e){return json(res,500,{decision:'deny',reason:'gate_unavailable',detail:e.message});}
  }
  return json(res,404,{error:'Not found'});
}
function createServer(){return http.createServer((req,res)=>{handler(req,res).catch(()=>json(res,500,{error:'Internal error'}));});}
if(require.main===module){
  if(!process.env.CANONICAL_USERS_JSON)throw Error('CANONICAL_USERS_JSON must be configured; refusing anonymous start');
  const port=Number(process.env.PORT||3000);
  createServer().listen(port,'0.0.0.0',()=>process.stdout.write('Canonical AI Control MCP listening on '+port+' (use HTTPS reverse proxy)\n'));
}
module.exports={createServer,handler};
