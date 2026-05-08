import fs from 'node:fs';
import { spawn } from 'node:child_process';
function fail(message){ console.error(`SMOKE FAIL: ${message}`); process.exit(1); }
if(!fs.existsSync('dist/index.html')) fail('Missing dist/index.html. Run npm run build first.');
const port=4277;
const base='/agentsite-control-plane/';
const server=spawn('node',['scripts/serve-gh-pages-local.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  await wait(800);
  for (const route of [base, `${base}success/`, `${base}cancel/`, `${base}favicon.svg`, `${base}og.svg`]) {
    const res=await fetch(`http://localhost:${port}${route}`);
    if(!res.ok) fail(`${route} returned HTTP ${res.status}`);
  }
  const html=await (await fetch(`http://localhost:${port}${base}`)).text();
  if(!html.includes('Let AI agents ship your landing pages')) fail('Homepage does not contain revised hero text');
  if(html.includes('undefined')) fail('Found undefined in HTML');
  console.log('SMOKE PASS');
} finally { server.kill(); }
