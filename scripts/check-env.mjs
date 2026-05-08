import fs from 'node:fs';
function fail(message){ console.error(`ENV FAIL: ${message}`); process.exit(1); }
const contract = JSON.parse(fs.readFileSync('.agent/env.contract.json','utf8'));
for (const variable of contract.variables || []) {
  const value = process.env[variable.name];
  if (!value) continue;
  if (variable.validation) {
    const re = new RegExp(variable.validation);
    if (!re.test(value)) fail(`${variable.name} does not match contract validation`);
  }
  if (variable.name === 'STRIPE_PAYMENT_LINK' && value.includes('sk_')) fail('STRIPE_PAYMENT_LINK must never contain a secret key');
}
console.log('ENV PASS');
