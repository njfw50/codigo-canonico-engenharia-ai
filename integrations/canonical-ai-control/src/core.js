'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const CANONICAL_REPOSITORY = 'njfw50/codigo-canonico-engenharia-ai';
const CANONICAL_COMMIT = '5de1ca45a60ca0f9e516b6ece54e366d59f0e79c';
const CAPABILITIES = Object.freeze(['web_read','files_read','files_write','microphone','camera','location','memory','code_execution','send_messages','purchases','account_security','physical_control']);
const SENSITIVE = new Set(['files_write','location','code_execution','send_messages','purchases','account_security','physical_control']);
const idOK = x => typeof x === 'string' && /^[a-z0-9][a-z0-9_-]{0,47}$/.test(x);
const json = (res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj));};
function auth(value,name) {
  const token=/^Bearer ([A-Za-z0-9._~+\/-]{24,})$/.exec(value||'');
  if(!token)return null;
  let entries;try{entries=JSON.parse(process.env[name]||'{}')}catch{return null}
  if(!entries||typeof entries!=='object'||Array.isArray(entries))return null;
  let matched=null;
  for(const [id,secret] of Object.entries(entries)){
    if(typeof secret!=='string'||secret.length<24)continue;
    const a=crypto.createHash('sha256').update(token[1]).digest();
    const b=crypto.createHash('sha256').update(secret).digest();
    if(crypto.timingSafeEqual(a,b))matched=id;
  }
  return matched;
}
const durable = () => !process.env.VERCEL && !!process.env.CANONICAL_DATA_DIR;
function storePath(user){if(!idOK(user))throw Error('invalid_user');return path.join(process.env.CANONICAL_DATA_DIR,'users',user+'.json');}
function read(user){const f=storePath(user);if(!fs.existsSync(f))return {user,version:0,agents:{}};const obj=JSON.parse(fs.readFileSync(f,'utf8'));if(obj.user!==user || !Number.isSafeInteger(obj.version)||!obj.agents)throw Error('invalid_store');return obj;}
function change(user,expected,modify){if(!durable())throw Error('persistent_store_required');const p=read(user);if(!Number.isSafeInteger(expected)||p.version!==expected)throw Error('version_conflict');modify(p);p.version++;const file=storePath(user);fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});const tmp=file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';fs.writeFileSync(tmp,JSON.stringify(p),{mode:0o600,flag:'wx'});fs.renameSync(tmp,file);return p;}
function evaluate(p,id,cap){if(!CAPABILITIES.includes(cap))return {decision:'deny',reason:'unknown_capability'};const a=p.agents[id];if(!a||!a.enabled||a.capabilities[cap]!==true)return {decision:'deny',reason:'not_permitted'};if(SENSITIVE.has(cap))return {decision:'needs_confirmation',reason:'consequence_boundary'};return {decision:'allow',reason:'explicit_permission'};}
function lawNames(){return ['law00_precedence','law01_authority','law02_classification','law03_change_procedure','law04_criticality','law05_book_of_life','law06_architecture','law07_pattern_library','law08_pattern_selection','law09_no_ornamental_patterns','law10_layer_separation','law11_amendments','law12_pattern_implementation','law13_normative_expansion','law14_cybersecurity','law15_user_experience','law16_text_integrity','law17_justified_complexity','law18_cognitive_sovereignty','law19_integrity_of_references','law20_agentic_coordination','law21_evaluation_driven_development','law22_code_provenance','law23_natural_error_containment','law24_embodied_agency_living_integrity'];}
async function canonicalText(name){if(!lawNames().includes(name))throw Error('unknown_law');const url=`https://raw.githubusercontent.com/${CANONICAL_REPOSITORY}/${CANONICAL_COMMIT}/laws/${name}.md`;const control=new AbortController();const timer=setTimeout(()=>control.abort(),6500);try{const res=await fetch(url,{signal:control.signal});if(!res.ok)throw Error('canonical_source_unavailable');const txt=await res.text();if(txt.length>40000)throw Error('canonical_file_too_large');return {source:url,text:txt}}finally{clearTimeout(timer)}}
module.exports={CANONICAL_REPOSITORY,CANONICAL_COMMIT,CAPABILITIES,idOK,auth,durable,read,change,evaluate,lawNames,canonicalText,json};
