import fs from 'node:fs';
function fail(message){ console.error(`CONTRACT FAIL: ${message}`); process.exit(1); }
function readJson(path){ if(!fs.existsSync(path)) fail(`Missing ${path}`); return JSON.parse(fs.readFileSync(path,'utf8')); }
const site = readJson('.agent/site.contract.json');
const deployment = readJson('.agent/deployment.contract.json');
const payment = readJson('.agent/payment.contract.json');
for (const field of ['siteName','baseUrl','environment','purpose','primaryCta','secondaryCta','contactEmail']) {
  if (!site[field] || typeof site[field] !== 'string') fail(`Missing or invalid site field: ${field}`);
}
if (!Array.isArray(site.requiredSections) || site.requiredSections.length < 6) fail('site.requiredSections must list the page narrative sections');
if (!site.baseUrl.endsWith('/')) fail('site.baseUrl must include trailing slash');
if (deployment.liveUrl !== site.baseUrl) fail('deployment.liveUrl must match site.baseUrl');
if (deployment.basePath !== '/agentsite-control-plane/') fail('deployment.basePath must be /agentsite-control-plane/ for current GitHub Pages deploy');
if (!['demo','production'].includes(site.environment)) fail('site.environment must be demo or production');
if (!['demo','live'].includes(payment.mode)) fail('payment.mode must be demo or live');
if (!Array.isArray(payment.allowedHosts) || payment.allowedHosts.length === 0) fail('payment.allowedHosts required');
if (payment.mode === 'live' && (!Array.isArray(payment.approvedLivePaymentLinks) || payment.approvedLivePaymentLinks.length === 0)) fail('live mode requires approvedLivePaymentLinks');
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contactEmail)) fail('contactEmail must be valid');
if (fs.existsSync('site.contract.json')) fail('Root site.contract.json is deprecated; use .agent/site.contract.json');
console.log('CONTRACT PASS');
