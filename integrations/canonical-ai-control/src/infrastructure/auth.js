'use strict';
const crypto=require('crypto');
function sha(s) {return crypto.createHash('sha256').update(s).digest();}
function equalKey(provided, expected) {
  if (!provided || !expected) return false;
  return crypto.timingSafeEqual(sha(provided),sha(expected));
}
function readEnv(name) {
  let data={};
  try {data=JSON.parse(process.env[name]||'{}');} catch {throw Error('Invalid '+name+' JSON');}
  if (!data || Array.isArray(data) || typeof data !== 'object') throw Error('Invalid '+name);
  for(const key of Object.keys(data)) {
    if(typeof data[key]!=='string' || data[key].length<24) throw Error('Short or invalid key in '+name);
  }
  return data;
}
function resolveToken(token, dict) {
  // Hash every candidate to avoid early match timing leakage across tokens.
  let result=null;
  for(const [id,key] of Object.entries(dict)) if(equalKey(token,key)) result=id;
  return result;
}
function userFromAuthorization(value) {
  const match=/^Bearer ([A-Za-z0-9_.~+/-]{24,})$/.exec(value||'');
  const id=match&&resolveToken(match[1],readEnv('CANONICAL_USERS_JSON'));
  return id&&/^[a-z0-9][a-z0-9_-]{0,47}$/.test(id)?id:null;
}
function agentFromAuthorization(value) {
  const match=/^Bearer ([A-Za-z0-9_.~+/-]{24,})$/.exec(value||'');
  const id=match&&resolveToken(match[1],readEnv('CANONICAL_ADAPTERS_JSON'));
  if(!id) return null;
  const parts=id.split(':');
  return parts.length===2 && parts.every(p=>/^[a-z0-9][a-z0-9_-]{0,47}$/.test(p))?{user:parts[0],agent:parts[1]}:null;
}
module.exports={userFromAuthorization,agentFromAuthorization};
