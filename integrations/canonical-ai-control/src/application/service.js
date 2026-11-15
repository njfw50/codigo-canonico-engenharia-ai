'use strict';
const {CAPABILITIES,evaluate,validateId}=require('../domain/policy');
const store=require('../infrastructure/store');
function registerAgent(user,args) {
  const {agent_id,display_name,expected_version}=args;
  if(!validateId(agent_id)||typeof display_name!=='string'||display_name.length<2||display_name.length>80)throw Error('Invalid agent registration');
  return store.mutate(user,expected_version,policy=>{
    if(policy.agents[agent_id])throw Error('Agent already exists');
    policy.agents[agent_id]={display_name,enabled:true,capabilities:{}};
    return policy;
  },{kind:'register_agent',detail:{agent_id,display_name}});
}
function setCapability(user,args) {
  const {agent_id,capability,enabled,expected_version}=args;
  if(!validateId(agent_id)||!Object.prototype.hasOwnProperty.call(CAPABILITIES,capability)||typeof enabled!=='boolean')throw Error('Invalid capability change');
  return store.mutate(user,expected_version,policy=>{
    if(!policy.agents[agent_id])throw Error('Agent not registered');
    policy.agents[agent_id].capabilities[capability]=enabled;
    return policy;
  },{kind:'change_capability',detail:{agent_id,capability,enabled}});
}
function setAgent(user,args) {
  const {agent_id,enabled,expected_version}=args;
  if(!validateId(agent_id)||typeof enabled!=='boolean')throw Error('Invalid agent state');
  return store.mutate(user,expected_version,policy=>{
    if(!policy.agents[agent_id])throw Error('Agent not registered');
    policy.agents[agent_id].enabled=enabled;
    return policy;
  },{kind:'change_agent_state',detail:{agent_id,enabled}});
}
module.exports={registerAgent,setCapability,setAgent,read:store.read,tailAudit:store.tailAudit,evaluate,CAPABILITIES,appendAudit:store.appendAudit};
