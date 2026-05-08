# AgentSite Control Plane

A live, contract-driven landing-page starter for agent-maintained websites.

Stack: Astro static site, GitHub, Netlify, Stripe Payment Link support, AgentSite contracts, and automated QA gates.

## Local

```bash
npm install
npm run qa
```

## Payment mode

This first deploy intentionally uses demo-safe Stripe Payment Link behavior. To go live, create a Stripe Payment Link, add it to `.agent/payment.contract.json`, set `STRIPE_PAYMENT_LINK` in Netlify, and switch the contract to live mode only after explicit approval.
