import fs from 'node:fs';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`SEO FAIL: ${message}`); process.exit(1); }
const site = JSON.parse(fs.readFileSync('.agent/site.contract.json','utf8'));
const htmlPath = 'dist/index.html';
if (!fs.existsSync(htmlPath)) fail('Missing dist/index.html. Run npm run build first.');
const html = fs.readFileSync(htmlPath,'utf8');
const $ = cheerio.load(html);
const title = $('title').first().text().trim();
if (title.length < 10 || title.length > 70) fail(`Title should be 10-70 chars. Got ${title.length}`);
const desc = $('meta[name="description"]').attr('content')?.trim() || '';
if (desc.length < 50 || desc.length > 160) fail(`Meta description should be 50-160 chars. Got ${desc.length}`);
if ($('h1').length !== 1) fail(`Expected exactly one h1. Found ${$('h1').length}`);
for (const sel of ['meta[name="viewport"]','link[rel="canonical"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]']) {
  if (!$(sel).attr('content') && !$(sel).attr('href')) fail(`Missing ${sel}`);
}
const canonical = $('link[rel="canonical"]').attr('href');
if (canonical !== site.baseUrl) fail(`Homepage canonical mismatch: ${canonical}`);
for (const path of ['dist/success/index.html','dist/cancel/index.html']) {
  const p = cheerio.load(fs.readFileSync(path,'utf8'));
  if (p('meta[name="robots"]').attr('content') !== 'noindex,follow') fail(`${path} must be noindex,follow`);
}
console.log('SEO PASS');
