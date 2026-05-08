import fs from 'node:fs';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`CLAIMS FAIL: ${message}`); process.exit(1); }
const content = JSON.parse(fs.readFileSync('.agent/content.contract.json','utf8'));
const payment = JSON.parse(fs.readFileSync('.agent/payment.contract.json','utf8'));
const htmlFiles = ['dist/index.html','dist/success/index.html','dist/cancel/index.html'].filter(p => fs.existsSync(p));
const text = htmlFiles.map(p => cheerio.load(fs.readFileSync(p,'utf8')).text()).join('\n').replace(/\s+/g,' ').toLowerCase();
for (const claim of content.forbiddenClaims || []) {
  if (text.includes(claim.toLowerCase())) fail(`Forbidden claim appears in built HTML: ${claim}`);
}
if (payment.requiresDemoDisclosure && payment.mode === 'demo') {
  if (!text.includes('safe placeholder checkout link') && !text.includes('demo mode intentionally blocks real checkout')) fail('Demo payment disclosure missing');
}
console.log('CLAIMS PASS');
