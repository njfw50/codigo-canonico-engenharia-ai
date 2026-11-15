'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {validateId}=require('../domain/policy');
const root=process.env.CANONICAL_DATA_DIR||path.join(process.cwd(),'.canonical-data');
function location(user) {
  if(!validateId(user)) throw Error('Invalid user id');
  return path.join(root,'users',user+'.json');
}
function init(user){return {user,version:0,agents:{}};}
function read(user) {
  const f=location(user);
  if(!fs.existsSync(f)) return init(user);
  const obj=JSON.parse(fs.readFileSync(f,'utf8'));
  if(obj.user!==user || !Number.isSafeInteger(obj.version)||!obj.agents||typeof obj.agents!=='object') throw Error('Corrupt policy');
  return obj;
}
function appendAudit(user,event) {
  const dir=path.join(root,'audit');fs.mkdirSync(dir,{recursive:true,mode:0o700});
  const file=path.join(dir,user+'.jsonl');let prev='0'.repeat(64);
  if(fs.existsSync(file)) {
    const lines=fs.readFileSync(file,'utf8').trim().split('\n').filter(Boolean);
    for(const line of lines){
      const item=JSON.parse(line);
      const digest=crypto.createHash('sha256').update(item.previous+'\n'+JSON.stringify(item.event)).digest('hex');
      if(item.previous!==prev || item.hash!==digest)throw Error('Audit chain tampering detected');
      prev=item.hash;
    }
  }
  const item={previous:prev,event:{...event,at:new Date().toISOString()}};
  item.hash=crypto.createHash('sha256').update(item.previous+'\n'+JSON.stringify(item.event)).digest('hex');
  fs.appendFileSync(file,JSON.stringify(item)+'\n',{mode:0o600,flag:'a'});
}
function mutate(user,expectedVersion,build,event) {
  if(!Number.isSafeInteger(expectedVersion)||expectedVersion<0)throw Error('expected_version required');
  const policy=read(user);
  if(policy.version!==expectedVersion)throw Error('version_conflict: reload latest policy');
  const next=build(JSON.parse(JSON.stringify(policy)));
  next.version=policy.version+1;
  fs.mkdirSync(path.dirname(location(user)),{recursive:true,mode:0o700});
  // Best-effort fail closed: record event BEFORE policy update, detect failures on next read.
  appendAudit(user,{kind:event.kind,user,version:next.version,detail:event.detail});
  const tmp=location(user)+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';
  fs.writeFileSync(tmp,JSON.stringify(next,null,2)+'\n',{mode:0o600,flag:'wx'});
  fs.renameSync(tmp,location(user));
  return next;
}
function tailAudit(user,limit=20) {
  const file=path.join(root,'audit',user+'.jsonl');
  if(!fs.existsSync(file))return [];
  // Verifies chain before exposing any audit metadata.
  let prev='0'.repeat(64),events=[];
  for(const line of fs.readFileSync(file,'utf8').trim().split('\n').filter(Boolean)) {
    const item=JSON.parse(line);const digest=crypto.createHash('sha256').update(item.previous+'\n'+JSON.stringify(item.event)).digest('hex');
    if(item.previous!==prev||item.hash!==digest)throw Error('Audit chain tampering detected');
    prev=item.hash;events.push({hash:item.hash,...item.event});
  }
  return limit===0?events:events.slice(-Math.max(1,Math.min(50,limit)));
}
module.exports={read,mutate,tailAudit,appendAudit};
