'use strict';
const https=require('https');
const crypto=require('crypto');
const path=require('path');
const lock=require('../../canonical-lock.json');
const base='https://raw.githubusercontent.com/njfw50/codigo-canonico-engenharia-ai/'+lock.commit+'/';
function verifyOriginal(original,body) {
  const blob=Buffer.concat([Buffer.from('blob '+body.length+'\0','utf8'),body]);
  const hash=crypto.createHash('sha1').update(blob).digest('hex');
  if(hash!==lock.git_blob_sha1_by_path[original])throw Error('Canonical text integrity failure: do not use this source');
  return {content:body.toString('utf8'),git_blob:hash,sha256:crypto.createHash('sha256').update(body).digest('hex')};
}
function readCanonical(original) {
  if(!Object.prototype.hasOwnProperty.call(lock.git_blob_sha1_by_path,original))return Promise.reject(Error('Unknown Canon; original files only'));
  return new Promise((resolve,reject)=>{
    const req=https.get(base+original,{timeout:8000,headers:{'User-Agent':'canonical-ai-control/0.1.0'}},res=>{
      if(res.statusCode!==200){res.resume();return reject(Error('Original GitHub text unavailable: HTTP '+res.statusCode));}
      let chunks=[],bytes=0;
      res.on('data',chunk=>{
        bytes+=chunk.length;
        if(bytes>128*1024){req.destroy(Error('Canonical file oversized'));return;}
        chunks.push(chunk);
      });
      res.on('end',()=>{try{resolve(verifyOriginal(original,Buffer.concat(chunks)));}catch(e){reject(e);}});
    });
    req.on('timeout',()=>req.destroy(Error('Canonical source timeout')));
    req.on('error',reject);
  });
}
function index(){return {source:lock.source,commit:lock.commit,law_paths:Object.keys(lock.git_blob_sha1_by_path),original_author:lock.original_author};}
module.exports={readCanonical,index,verifyOriginal};
