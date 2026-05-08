import fs from 'node:fs';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`SECTIONS FAIL: ${message}`); process.exit(1); }
const contract = JSON.parse(fs.readFileSync('.agent/site.contract.json','utf8'));
const html = fs.readFileSync('dist/index.html','utf8');
const $ = cheerio.load(html);
let lastIndex = -1;
for (const id of contract.requiredSections) {
  const matches = $(`#${id}`);
  if (matches.length !== 1) fail(`Expected exactly one section with id=${id}; found ${matches.length}`);
  const idx = $('section[id], aside[id]').toArray().findIndex(el => $(el).attr('id') === id);
  if (idx <= lastIndex) fail(`Section ${id} is out of contract order`);
  lastIndex = idx;
}
console.log('SECTIONS PASS');
