import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`LINKS FAIL: ${message}`); process.exit(1); }
const deployment = JSON.parse(fs.readFileSync('.agent/deployment.contract.json','utf8'));
const base = deployment.basePath;
function walk(dir){
  const out=[];
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,entry.name);
    if (entry.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
function builtPathForUrl(urlPath){
  let p = urlPath;
  if (p.startsWith(base)) p = p.slice(base.length - 1);
  if (p === '/' || p === '') return 'dist/index.html';
  const without = p.replace(/^\//,'');
  if (without.endsWith('/')) return path.join('dist', without, 'index.html');
  const direct = path.join('dist', without);
  if (fs.existsSync(direct)) return direct;
  return path.join('dist', without, 'index.html');
}
for (const required of ['dist/index.html','dist/success/index.html','dist/cancel/index.html','dist/favicon.svg','dist/og.svg']) {
  if (!fs.existsSync(required)) fail(`Missing built route/asset: ${required}`);
}
const htmlFiles = walk('dist').filter(p => p.endsWith('.html'));
for (const file of htmlFiles) {
  const $ = cheerio.load(fs.readFileSync(file,'utf8'));
  const attrs = [];
  $('[href]').each((_,el)=>attrs.push($(el).attr('href')));
  $('[src]').each((_,el)=>attrs.push($(el).attr('src')));
  for (const raw of attrs.filter(Boolean)) {
    if (raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    if (/^https?:\/\//.test(raw)) continue;
    if (raw.startsWith('/')) {
      if (!raw.startsWith(base)) fail(`${file} has root path outside base ${base}: ${raw}`);
      const noHash = raw.split('#')[0].split('?')[0];
      const target = builtPathForUrl(noHash);
      if (!fs.existsSync(target)) fail(`${file} links to missing built path ${raw} -> ${target}`);
    }
  }
}
console.log('LINKS PASS');
