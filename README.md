# AgentSite Control Plane

A live, contract-driven landing-page starter for agent-maintained revenue websites.

Current live site: https://castiliad.github.io/agentsite-control-plane/

Stack: Astro static site, GitHub Pages current deploy, Netlify-ready config, Stripe Payment Link support, AgentSite contracts, and automated QA gates.

## Local

```bash
npm install
npm run qa
```

## Contracts

Canonical contracts live under `.agent/`:

- `.agent/site.contract.json`
- `.agent/payment.contract.json`
- `.agent/deployment.contract.json`
- `.agent/content.contract.json`
- `.agent/qa.contract.json`
- `.agent/env.contract.json`

Update contracts before implementation changes that affect copy, claims, payments, deployment, or QA rules.

## Payment mode

This deploy intentionally uses demo-safe Stripe Payment Link behavior. To go live, create a Stripe Payment Link, add it to `.agent/payment.contract.json.approvedLivePaymentLinks`, set `STRIPE_PAYMENT_LINK` in the deployment environment, and switch payment mode only after explicit approval.
