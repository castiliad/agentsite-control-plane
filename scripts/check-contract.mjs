import fs from 'node:fs';
function fail(message){ console.error(`CONTRACT FAIL: ${message}`); process.exit(1); }
const path='site.contract.json';
if(!fs.existsSync(path)) fail('Missing site.contract.json');
const c=JSON.parse(fs.readFileSync(path,'utf8'));
for(const f of ['siteName','baseUrl','environment','paymentMode','contactEmail']) if(!c[f]||typeof c[f]!== 'string') fail(`Missing or invalid string field: ${f}`);
if(!['demo','production'].includes(c.environment)) fail('environment must be demo or production');
if(!['demo','live'].includes(c.paymentMode)) fail('paymentMode must be demo or live');
if(!Array.isArray(c.requiredSections)||c.requiredSections.length<3) fail('requiredSections must contain at least 3 sections');
if(!Array.isArray(c.stripePaymentLinks)) fail('stripePaymentLinks must be an array');
if(!/^https?:\/\//.test(c.baseUrl)) fail('baseUrl must start with http:// or https://');
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.contactEmail)) fail('contactEmail must be a valid email');
console.log('CONTRACT PASS');
