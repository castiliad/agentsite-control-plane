import fs from 'node:fs';
function fail(message){ console.error(`STRIPE FAIL: ${message}`); process.exit(1); }
const c=JSON.parse(fs.readFileSync('site.contract.json','utf8'));
const allowedHosts=new Set(['buy.stripe.com','checkout.stripe.com']);
const allowedLive=[];
for(const link of c.stripePaymentLinks||[]){
  let url; try{ url=new URL(link); } catch { fail(`Invalid Stripe URL: ${link}`); }
  if(!allowedHosts.has(url.hostname)) fail(`Stripe URL host is not allowlisted: ${url.hostname}`);
  const isPlaceholder=link.includes('PLACEHOLDER')||link.includes('test_')||link.includes('/test')||link.includes('demo');
  if(c.paymentMode==='demo'&&!isPlaceholder) fail(`Demo mode only allows placeholder/test/demo Stripe links: ${link}`);
  if(c.paymentMode==='live'){
    if(isPlaceholder) fail(`Live mode cannot use placeholder/test/demo Stripe link: ${link}`);
    if(!allowedLive.includes(link)) fail(`Live Stripe link is not explicitly allowlisted: ${link}`);
  }
}
console.log('STRIPE PASS');
