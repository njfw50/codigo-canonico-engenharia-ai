'use strict';
// Execute from your OWN backend, not inside untrusted AI prompts.
// The adapter key must never be given to a language model or browser.
const crypto=require('crypto');
const https=require('https');
const http=require('http');
function checkBeforeAction({endpoint,token,agentId,capability}) {
  const url=new URL(endpoint+'/gate');
  const body=JSON.stringify({agent_id:agentId,capability,action_id:crypto.randomBytes(16).toString('hex')});
  const transport=url.protocol==='https:'?https:http;
  return new Promise(resolve=>{
    const req=transport.request(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{
      let raw='';res.on('data',x=>raw+=x);
      res.on('end',()=>{try{const reply=JSON.parse(raw);resolve(res.statusCode===200&&reply.decision==='allow'?reply:{decision:'deny',reason:reply.reason||'confirmation_or_block_required'});}catch{resolve({decision:'deny',reason:'invalid_response'});}});
    });
    req.on('error',()=>resolve({decision:'deny',reason:'gate_network_failure'}));
    req.setTimeout(5000,()=>req.destroy());req.end(body);
  });
}
module.exports={checkBeforeAction};
