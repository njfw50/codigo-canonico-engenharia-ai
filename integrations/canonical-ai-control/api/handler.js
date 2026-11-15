'use strict';
const {handler}=require('../src/interface/server');
module.exports=function(endpoint){return async function(req,res){
  req.url=endpoint;
  try{await handler(req,res);}catch(_error){
    if(!res.headersSent){res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Internal error'}));}
    else res.end();
  }
};};
