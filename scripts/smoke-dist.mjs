import fs from 'node:fs';
import { spawn } from 'node:child_process';
function fail(message){ console.error(`SMOKE FAIL: ${message}`); process.exit(1); }
if(!fs.existsSync('dist/index.html')) fail('Missing dist/index.html. Run npm run build first.');
const port=4177;
const server=spawn('npx',['serve','dist','-l',String(port)],{stdio:'ignore',shell:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  await wait(1800);
  const res=await fetch(`http://localhost:${port}/`);
  if(!res.ok) fail(`Homepage returned HTTP ${res.status}`);
  const html=await res.text();
  if(!html.includes('<html')) fail('Homepage response does not look like HTML');
  if(html.length<1000) fail('Homepage HTML is suspiciously small');
  if(html.includes('undefined')) fail('Found undefined in HTML');
  console.log('SMOKE PASS');
} finally { server.kill(); }
