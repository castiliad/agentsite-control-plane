import fs from 'node:fs';
import * as cheerio from 'cheerio';
function fail(message){ console.error(`STRIPE FAIL: ${message}`); process.exit(1); }
const payment = JSON.parse(fs.readFileSync('.agent/payment.contract.json','utf8'));
const html = fs.readFileSync('dist/index.html','utf8');
const $ = cheerio.load(html);
const allowedHosts = new Set(payment.allowedHosts || []);
const approvedLive = new Set(payment.approvedLivePaymentLinks || []);
const ctaHrefs = $('[data-payment-cta]').toArray().map(el => $(el).attr('href')).filter(Boolean);
if (ctaHrefs.length === 0) fail('No data-payment-cta links found');
const stripeUrlsInHtml = Array.from(html.matchAll(/https:\/\/(?:buy|checkout)\.stripe\.com\/[^"'\s<)]+/g)).map(m => m[0]);
function isPlaceholder(link){ return link.includes('PLACEHOLDER') || link.includes('test_') || link.includes('/test') || link.toLowerCase().includes('demo'); }
for (const href of [...ctaHrefs, ...stripeUrlsInHtml]) {
  if (href.startsWith('#')) continue;
  let url; try { url = new URL(href); } catch { fail(`Invalid payment href: ${href}`); }
  if (url.hostname.includes('stripe.com') && !allowedHosts.has(url.hostname)) fail(`Stripe host not allowlisted: ${url.hostname}`);
  if (payment.mode === 'demo') {
    if (url.hostname.includes('stripe.com') && !isPlaceholder(href)) fail(`Demo mode cannot expose live Stripe URL: ${href}`);
  } else {
    if (!url.hostname.includes('stripe.com')) fail(`Live mode payment CTA must be Stripe URL: ${href}`);
    if (isPlaceholder(href)) fail(`Live mode cannot use placeholder/test/demo Stripe link: ${href}`);
    if (!approvedLive.has(href)) fail(`Live Stripe link is not approved in contract: ${href}`);
  }
}
console.log('STRIPE PASS');
