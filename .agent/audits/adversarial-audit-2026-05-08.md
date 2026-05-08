# AgentSite Adversarial Audit — 2026-05-08

Live URL: https://castiliad.github.io/agentsite-control-plane/
Repo: https://github.com/castiliad/agentsite-control-plane

## Executive verdict

The site is a solid internal proof-of-concept, but not yet a compelling product landing page. It proves the workflow can exist; it does not yet make a skeptical buyer want the system.

The strongest idea is: **safe agentic maintenance for revenue pages**. The current page buries that under infrastructure language.

## Highest-priority issues

1. **Deployment truth mismatch** — page says Netlify, live site is GitHub Pages. For a site selling “every step visible,” this is credibility damage.
2. **GitHub Pages base-path bugs** — root-relative home/favicon links escape `/agentsite-control-plane/`; favicon is 404 live.
3. **Contract drift risk** — root `site.contract.json`, `.agent/site.contract.json`, `.agent/payment.contract.json`, and runtime `site.ts` are separate sources of truth.
4. **Payment safety not truly enforced** — QA checks contract placeholder links, not actual built CTA/env-supplied Stripe URL.
5. **Hero/value prop too abstract** — current copy sells process, not the buyer fear/desire: agents can ship without breaking checkout, claims, or brand.
6. **Design feels like polished dark SaaS starter** — purple/cyan gradients, placeholder A mark, uniform glass cards. Competent, not premium.
7. **No visible product artifact** — hero should show a believable control plane / contract ledger / QA trace, not a generic status card.
8. **CTA is weak** — “Inspect demo checkout rule” is honest but not compelling.
9. **QA claim is false in edge viewports** — “CTA visible above the fold” is listed, but measured below fold at 320x568 and 1440x900.
10. **Agent operability underspecified** — future agents lack clear safe-edit boundaries, deployment contract, env contract, claim provenance, and test mapping.

## Best next iteration

Do one integrated revision, not a scatter of tweaks:

### Sprint 1: Make the artifact truthful, sharper, and safer

- Fix base-path links/favicon.
- Change deployment copy to “GitHub Pages / Netlify-ready” or move to real Netlify.
- Unify canonical contracts under `.agent/` and make QA read them.
- Validate actual built payment CTA hrefs against payment contract.
- Replace hero copy with:

> Let AI agents ship your landing pages without breaking checkout, claims, or brand.

- Replace hero status card with a control-plane artifact showing:
  - contract approved
  - payment link locked
  - QA gates passed
  - deployment target
  - latest commit/check
- Tone down generic neon gradients; use tighter Linear/Vercel-like surfaces.
- Add a “bad AI change blocked” demo section.

## Recommended hero copy

Eyebrow: `Contract-driven landing pages for AI agents`

H1: `Let AI agents ship your landing pages without breaking checkout, claims, or brand.`

Lede: `AgentSite turns your offer, brand rules, payment constraints, and QA checks into a machine-readable contract. Coding agents can build, review, deploy, and maintain the site without silently changing approved claims or checkout behavior.`

Primary CTA: `View the live contract`

Secondary CTA: `See the agent workflow`

Microcopy: `This demo uses a safe placeholder checkout link. Live Stripe Payment Links require explicit contract approval.`

## Design direction

Current: competent dark SaaS starter.

Target: precise control-plane product.

Moves:

- Kill 70% of purple/cyan atmosphere.
- Replace placeholder gradient “A” mark.
- Use one real artifact as the visual centerpiece.
- Format source CSS for maintainable diffs.
- Add explicit focus-visible styles and better semantics for code excerpt.

## Technical fixes to queue

- Base-aware links/assets via `import.meta.env.BASE_URL`.
- Crawl all built HTML for root-relative links and broken internal links.
- Add deployed smoke test for live URL, favicon, OG image, success/cancel pages.
- Add `robots noindex` or route-specific canonical handling for success/cancel pages.
- Move live Stripe allowlist into payment contract.
- Add `deployment.contract.json`, `env.contract.json`, `qa.contract.json`, and `content.contract.json`.
- Add contract-to-DOM section validation.
- Add audit gate for forbidden/unsupported claims.

## Team consensus

The concept is more compelling than the current page. The page should stop sounding like a responsible engineering workflow and start dramatizing the missing category:

> A production control layer that lets AI agents build and maintain revenue pages safely.
