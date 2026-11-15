'use strict';const {handler}=require('../src/server');module.exports=async(req,res)=>{req.url='/mcp';try{await handler(req,res)}catch{res.statusCode=500;res.end('Internal error')}};
