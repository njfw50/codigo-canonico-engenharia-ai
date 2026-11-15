'use strict';
const app=require('../application/service');
const source=require('../infrastructure/canonical-source');
const readOnly={readOnlyHint:true,destructiveHint:false,openWorldHint:false};
const write={readOnlyHint:false,destructiveHint:false,openWorldHint:false};
const S={type:'object',additionalProperties:false};
const schemas={
  estado_canonico:{...S,properties:{}},
  listar_agentes:{...S,properties:{}},
  registrar_agente:{...S,properties:{agent_id:{type:'string'},display_name:{type:'string'},expected_version:{type:'integer'}},required:['agent_id','display_name','expected_version']},
  definir_agente:{...S,properties:{agent_id:{type:'string'},enabled:{type:'boolean'},expected_version:{type:'integer'}},required:['agent_id','enabled','expected_version']},
  configurar_capacidade:{...S,properties:{agent_id:{type:'string'},capability:{type:'string',enum:Object.keys(app.CAPABILITIES)},enabled:{type:'boolean'},expected_version:{type:'integer'}},required:['agent_id','capability','enabled','expected_version']},
  avaliar_acao:{...S,properties:{agent_id:{type:'string'},capability:{type:'string'}},required:['agent_id','capability']},
  consultar_canon:{...S,properties:{path:{type:'string',enum:source.index().law_paths}},required:['path']},
  consultar_auditoria:{...S,properties:{limit:{type:'integer'}}}
};
const TOOLS=[
  {name:'estado_canonico',title:'Estado do Código Canônico',description:'Identifique a revisão original imutável no GitHub e enumere os cânones. Não afirma controlar uma IA externa.',inputSchema:schemas.estado_canonico,annotations:readOnly},
  {name:'listar_agentes',title:'Listar agentes e capacidades',description:'Veja agentes registrados, versão da política e quais opções estão configuradas; um agente sem adaptador NÃO está efetivamente controlado.',inputSchema:schemas.listar_agentes,annotations:readOnly},
  {name:'registrar_agente',title:'Registrar IA para governança',description:'Registre um perfil lógico de uma IA. Isso não conecta automaticamente sua API nem controla o dispositivo. Requer versão atual da política; solicite autorização explícita.',inputSchema:schemas.registrar_agente,annotations:write},
  {name:'definir_agente',title:'Ativar/desativar perfil de IA',description:'Ative ou desative o perfil de uma IA registrada apenas na política do plugin, com auditoria. Requer pedido explícito e expected_version.',inputSchema:schemas.definir_agente,annotations:write},
  {name:'configurar_capacidade',title:'Ativar/desativar capacidade',description:'Configure uma capacidade específica para um agente já registrado. Não altera permissões nativas sem adaptador. Explique claramente o efeito e peça solicitação explícita. Requer expected_version.',inputSchema:schemas.configurar_capacidade,annotations:write},
  {name:'avaliar_acao',title:'Avaliar ação de IA',description:'Simule a decisão da política para um agente e capacidade, sem executar a ação.',inputSchema:schemas.avaliar_acao,annotations:readOnly},
  {name:'consultar_canon',title:'Ler cânon ORIGINAL',description:'Leia um único arquivo original do Código Canônico, fixado em commit e validado por hash Git. Nunca parafraseie o texto como se fosse original.',inputSchema:schemas.consultar_canon,annotations:{...readOnly,openWorldHint:true}},
  {name:'consultar_auditoria',title:'Consultar histórico de governança',description:'Veja a trilha local de alterações verificada por encadeamento de hashes. Não é um arquivo WORM de imutabilidade legal.',inputSchema:schemas.consultar_auditoria,annotations:readOnly}
];
function checkArgs(name,args){
  const s=schemas[name];if(!s||!args||typeof args!=='object'||Array.isArray(args))throw Error('Invalid arguments');
  for(const key of Object.keys(args))if(!s.properties[key])throw Error('Unknown argument: '+key);
  for(const key of s.required||[])if(!(key in args))throw Error('Missing argument: '+key);
  for(const [key,v] of Object.entries(args)){
    const t=s.properties[key].type;
    if(t==='integer'?!Number.isSafeInteger(v):typeof v!==t)throw Error('Wrong argument type: '+key);
    if(s.properties[key].enum&&!s.properties[key].enum.includes(v))throw Error('Invalid value: '+key);
  }
}
async function call(user,name,args,connected) {
  checkArgs(name,args);
  switch(name){
    case 'estado_canonico':return source.index();
    case 'listar_agentes': {
      const p=app.read(user);
      return {...p,capabilities:app.CAPABILITIES,adapter_credentials_configured_for:Object.keys(p.agents).filter(x=>connected(user,x)),note:'Ativado na política não equivale a ativado em outros aplicativos; bloqueios reais exigem adaptador e chamada ao gate.'};
    }
    case 'registrar_agente':return app.registerAgent(user,args);
    case 'definir_agente':return app.setAgent(user,args);
    case 'configurar_capacidade':return app.setCapability(user,args);
    case 'avaliar_acao':return app.evaluate(app.read(user),args.agent_id,args.capability,connected(user,args.agent_id));
    case 'consultar_canon':return {...await source.readCanonical(args.path),path:args.path,source:source.index().source,commit:source.index().commit};
    case 'consultar_auditoria':return {events:app.tailAudit(user,args.limit||20)};
    default:throw Error('Unknown tool');
  }
}
module.exports={TOOLS,call};
