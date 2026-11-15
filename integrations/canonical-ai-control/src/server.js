'use strict';
const c=require('./core');
const TOOLSET=[
 {name:'estado_canonico',description:'Mostra a revisão e os 25 textos canônicos originais sem alterações.',inputSchema:{type:'object',properties:{}}},
 {name:'consultar_canon',description:'Consulta o texto original de um cânon no GitHub, na revisão fixada.',inputSchema:{type:'object',properties:{canon:{type:'string',description:'Ex.: law14_cybersecurity'}},required:['canon']}},
 {name:'listar_agentes',description:'Consulta os perfis locais de agentes integrados (requer autenticação e armazenamento durável).',inputSchema:{type:'object',properties:{}}},
 {name:'registrar_agente',description:'Registra agente externo (não instala agentes nem altera o dispositivo).',inputSchema:{type:'object',properties:{agent_id:{type:'string'},display_name:{type:'string'},expected_version:{type:'integer'}},required:['agent_id','display_name','expected_version']}},
 {name:'configurar_capacidade',description:'Ativa/desativa uma capacidade para um agente integrado.',inputSchema:{type:'object',properties:{agent_id:{type:'string'},capability:{type:'string',enum:c.CAPABILITIES},enabled:{type:'boolean'},expected_version:{type:'integer'}},required:['agent_id','capability','enabled','expected_version']}},
 {name:'definir_agente',description:'Ativa ou desativa um perfil de agente integrado.',inputSchema:{type:'object',properties:{agent_id:{type:'string'},enabled:{type:'boolean'},expected_version:{type:'integer'}},required:['agent_id','enabled','expected_version']}},
 {name:'avaliar_acao',description:'Avalia uma permissão sem executar ação no dispositivo.',inputSchema:{type:'object',properties:{agent_id:{type:'string'},capability:{type:'string'}},required:['agent_id','capability']}}
];
async function body(req){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>65536)throw Error('payload_too_large')}return JSON.parse(raw)}
function response(id,result){return {jsonrpc:'2.0',id,result};}
async function invoke(name,args,uid){
 if(name==='estado_canonico')return {source:'https://github.com/'+c.CANONICAL_REPOSITORY,commit:c.CANONICAL_COMMIT,law_paths:c.lawNames().map(x=>'laws/'+x+'.md'),canonical_laws_modified:false};
 if(name==='consultar_canon')return await c.canonicalText(args.canon);
 if(!uid)throw Error('authentication_required');
 if(!c.durable())throw Error('persistent_store_required: write tools disabled on ephemeral hosting');
 if(name==='listar_agentes')return c.read(uid);
 if(name==='avaliar_acao')return c.evaluate(c.read(uid),args.agent_id,args.capability);
 if(name==='registrar_agente')return c.change(uid,args.expected_version,p=>{if(!c.idOK(args.agent_id)||typeof args.display_name!=='string'||args.display_name.length<2||args.display_name.length>80||p.agents[args.agent_id])throw Error('invalid_agent');p.agents[args.agent_id]={display_name:args.display_name,enabled:false,capabilities:{}};});
 if(name==='definir_agente')return c.change(uid,args.expected_version,p=>{if(!c.idOK(args.agent_id)||typeof args.enabled!=='boolean'||!p.agents[args.agent_id])throw Error('invalid_request');p.agents[args.agent_id].enabled=args.enabled;});
 if(name==='configurar_capacidade')return c.change(uid,args.expected_version,p=>{if(!c.idOK(args.agent_id)||!c.CAPABILITIES.includes(args.capability)||typeof args.enabled!=='boolean'||!p.agents[args.agent_id])throw Error('invalid_request');p.agents[args.agent_id].capabilities[args.capability]=args.enabled;});
 throw Error('unknown_tool');
}
async function handler(req,res){
 const path=(req.url||'/').split('?')[0];
 if(path==='/health')return c.json(res,200,{ok:true,name:'Canonical AI Control',canonical_commit:c.CANONICAL_COMMIT,remote_controls_active:c.durable()});
 if(path==='/gate')return c.json(res,503,{decision:'deny',reason:'no_verified_adapter_gateway'});
 if(path!=='/mcp')return c.json(res,404,{error:'not_found'});
 if(req.method!=='POST')return c.json(res,405,{error:'post_required'});
 let msg;try{msg=await body(req)}catch{return c.json(res,400,{error:'invalid_json'})}
 if(msg.jsonrpc!=='2.0'||typeof msg.method!=='string')return c.json(res,400,{jsonrpc:'2.0',id:null,error:{code:-32600,message:'invalid_request'}});
 if(msg.id===undefined){res.writeHead(202,{'Cache-Control':'no-store'});return res.end();}
 const uid=c.auth(req.headers.authorization,'CANONICAL_USERS_JSON');
 if(msg.method==='initialize')return c.json(res,200,response(msg.id,{protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo:{name:'canonical-ai-control',version:'0.2.0'},instructions:'Não altera permissões nativas de outras IAs. Fonte normativa original intacta.'}));
 if(msg.method==='ping')return c.json(res,200,response(msg.id,{}));
 if(msg.method==='tools/list')return c.json(res,200,response(msg.id,{tools:uid&&c.durable()?TOOLSET:TOOLSET.slice(0,2)}));
 if(msg.method==='tools/call'){
   const name=msg.params&&msg.params.name;const args=msg.params&&msg.params.arguments||{};
   if(!TOOLSET.some(x=>x.name===name))return c.json(res,200,{jsonrpc:'2.0',id:msg.id,error:{code:-32601,message:'unknown_tool'}});
   try{const result=await invoke(name,args,uid);return c.json(res,200,response(msg.id,{content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result}))}
   catch(e){return c.json(res,200,response(msg.id,{isError:true,content:[{type:'text',text:e.message}]}))}
 }
 return c.json(res,200,{jsonrpc:'2.0',id:msg.id,error:{code:-32601,message:'method_not_found'}});
}
module.exports={handler,TOOLSET};
