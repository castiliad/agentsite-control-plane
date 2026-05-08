# Agent Maintenance Runbook

Current production: GitHub Pages at `https://castiliad.github.io/agentsite-control-plane/`.
Netlify is configured but not authenticated/live yet.

## Safe edit classes

### Copy/layout changes
- Update relevant `.agent/*contract.json` first when the public claim, CTA, section, or positioning changes.
- Then update `src/pages/index.astro` and/or `src/styles/global.css`.
- Run `npm run qa`.

### Payment changes
Requires explicit human approval.
- Do not invent pricing.
- Do not add live Stripe links unless they appear in `.agent/payment.contract.json.approvedLivePaymentLinks` with approval metadata in the surrounding change/PR.
- Never weaken `scripts/check-stripe-links.mjs` to make a payment change pass.

### Deployment changes
Requires explicit human approval.
- Update `.agent/deployment.contract.json`.
- Update `astro.config.mjs`, `src/content/site.ts`, `.env.example`, and docs consistently.
- Verify live URL after deploy.

## Approval-required changes
- Stripe/payment links, pricing, checkout behavior.
- Deployment provider, domain, DNS, base path.
- Environment variables/secrets.
- Removing or weakening QA gates.
- New legal/business claims not present in `.agent/content.contract.json`.

## Required order
1. Update contracts.
2. Update implementation.
3. Run `npm run qa`.
4. Review diff for contract drift.
5. Verify deployed URL.

Do not delete tests to pass QA. Add regression tests for discovered bugs.
