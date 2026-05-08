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

## Subagent operating rules

- Contract changes come before implementation changes.
- Current production is GitHub Pages; do not claim Netlify is live until it is actually linked and verified.
- GitHub Pages requires base-path-safe links under `/agentsite-control-plane/`; `npm run check:links` guards this.
- Payment changes require explicit human approval and must pass `npm run check:stripe` against the built HTML.
- Do not remove or weaken QA gates to make a change pass.
- For deployment, follow `.agent/runbooks/deploy.md`.
- For future maintenance boundaries, follow `.agent/runbooks/agent-maintenance.md`.
