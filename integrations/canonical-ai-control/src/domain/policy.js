'use strict';
// Domain: pure logic. These are SOFTWARE SWITCHES, not new Canons or amendments.
// A policy gate cannot enable a native capability that the device/provider does not expose.
const CAPABILITIES = Object.freeze({
  web_read: {label:'Consulta à web', sensitive:false},
  files_read: {label:'Leitura de arquivos', sensitive:false},
  files_write: {label:'Alteração de arquivos', sensitive:true},
  microphone: {label:'Microfone', sensitive:false},
  camera: {label:'Câmera', sensitive:false},
  location: {label:'Localização', sensitive:true},
  memory: {label:'Memória de contexto', sensitive:false},
  code_execution: {label:'Execução de código', sensitive:true},
  send_messages: {label:'Envio de mensagens', sensitive:true},
  purchases: {label:'Compras e pagamentos', sensitive:true},
  account_security: {label:'Configurações de segurança de contas', sensitive:true},
  physical_control: {label:'Controles físicos/dispositivos', sensitive:true}
});
const VALID_ID = /^[a-z0-9][a-z0-9_-]{0,47}$/;
const validateId = id => typeof id === 'string' && VALID_ID.test(id);
function evaluate(policy, agentId, capability, connected) {
  if (!Object.prototype.hasOwnProperty.call(CAPABILITIES, capability))
    return {decision:'deny',reason:'unknown_capability',effective:false};
  const agent = policy.agents[agentId];
  if (!agent) return {decision:'deny',reason:'agent_not_registered',effective:false};
  if (!agent.enabled) return {decision:'deny',reason:'agent_disabled',effective:false};
  if (agent.capabilities[capability] !== true)
    return {decision:'deny',reason:'capability_disabled',effective:false};
  if (!connected) return {decision:'not_enforced',reason:'agent_has_no_gate_adapter',effective:false};
  if (CAPABILITIES[capability].sensitive)
    return {decision:'needs_confirmation',reason:'sensitive_consequence_boundary',effective:false};
  return {decision:'allow',reason:'policy_allows',effective:true};
}
module.exports = { CAPABILITIES, evaluate, validateId };
