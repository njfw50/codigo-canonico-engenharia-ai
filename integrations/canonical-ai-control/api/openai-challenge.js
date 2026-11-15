'use strict';
module.exports = function(req,res){
  res.setHeader('cache-control','no-store');
  if(req.method!=='GET'){res.statusCode=405;return res.end('Method Not Allowed')}
  const token=process.env.OPENAI_APPS_CHALLENGE_TOKEN;
  if(typeof token!=='string'||token.length<8||token.length>4096){res.statusCode=404;return res.end('Not configured')}
  res.statusCode=200;
  res.setHeader('content-type','text/plain; charset=utf-8');
  res.end(token);
};
