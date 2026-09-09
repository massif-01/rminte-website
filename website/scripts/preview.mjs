// Local-only preview. Uses the same Worker implementation for visitor-language.js.
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {dirname,resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from '../_worker.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.argv.find(v=>v.startsWith('--port='))?.split('=')[1] || 8769);
const country=process.argv.find(v=>v.startsWith('--country='))?.split('=')[1] || 'US';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.pdf':'application/pdf','.ttf':'font/ttf','.woff2':'font/woff2','.md':'text/markdown; charset=utf-8'};
createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(url.pathname==='/visitor-language.js') {
   const request=new Request(url); request.cf={country};
   const response=worker.fetch(request,{});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  let file=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(file!==root && !file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try {
   if((await stat(file)).isDirectory()) {
    if(!url.pathname.endsWith('/')) {res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
    file=resolve(file,'index.html');
   }
  }catch{
   if(!extname(file))file+='.html';
  }
  const data=await readFile(file);const headers={'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){
   const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;
   if(start> end || start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}
   res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));return;
  }
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
 }catch(error){res.writeHead(error.code==='ENOENT'?404:500);res.end(error.code==='ENOENT'?'Not found':'Preview error');}
}).listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}/ (IP country simulation: ${country})`));
