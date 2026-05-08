import fs from 'node:fs';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`SEO FAIL: ${message}`); process.exit(1); }
const c=JSON.parse(fs.readFileSync('site.contract.json','utf8'));
const html=fs.readFileSync('dist/index.html','utf8');
const $=cheerio.load(html);
const title=$('title').first().text().trim();
if(title.length<10||title.length>70) fail(`Title should be 10-70 chars. Got ${title.length}`);
const desc=$('meta[name="description"]').attr('content')?.trim()||'';
if(desc.length<50||desc.length>160) fail(`Meta description should be 50-160 chars. Got ${desc.length}`);
if($('h1').length!==1) fail(`Expected exactly one h1. Found ${$('h1').length}`);
for(const sel of ['meta[name="viewport"]','link[rel="canonical"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]']) if(!$(sel).attr('content')&&!$(sel).attr('href')) fail(`Missing ${sel}`);
if(c.environment==='production'){
  const lower=html.toLowerCase();
  for(const word of ['todo','lorem ipsum','example.com']) if(lower.includes(word)) fail(`Production HTML contains forbidden placeholder text: ${word}`);
}
console.log('SEO PASS');
