# AgentSite Iteration 1: Truth + Trust + Hero Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the current AgentSite proof-of-concept into a truthful, sharper, safer, more compelling landing page that demonstrates the core promise: agents can ship revenue pages without breaking checkout, claims, or brand.

**Architecture:** Keep the site static Astro. First fix credibility and safety foundations, then revise the homepage narrative/design around a believable control-plane artifact. Contracts become the source of truth; QA enforces contract-to-DOM, payment-link, deployment, and routing invariants.

**Tech Stack:** Astro static site, TypeScript, Node QA scripts, Playwright, GitHub Pages current deploy, Netlify-ready config retained but not claimed as live.

---

## Locked decisions

- **Current live deployment:** GitHub Pages at `https://castiliad.github.io/agentsite-control-plane/`.
- **Netlify:** Netlify-ready but not current production until auth/deploy is actually configured.
- **Payment mode:** Demo-safe Stripe Payment Link placeholder. Live Stripe links require explicit human approval.
- **Primary page promise:** “Let AI agents ship your landing pages without breaking checkout, claims, or brand.”
- **Implementation discipline:** subagents implement; controller verifies; reviewers check spec and quality before deploy.
- **Scope for this sprint:** One integrated revision; no custom Stripe backend, no CMS, no Netlify migration unless explicitly chosen later.

## Acceptance criteria

A successful iteration must satisfy all of these:

1. Live page no longer falsely says Netlify is current deployment.
2. GitHub Pages base-path links/assets work; favicon is not 404.
3. Contracts have a single canonical source under `.agent/` or root files are clearly generated/removed.
4. Payment QA validates the actual built CTA/payment URLs, not just placeholder contract fields.
5. Homepage hero clearly communicates the buyer value prop in under 5 seconds.
6. Hero includes a credible “control-plane” artifact: contract, payment lock, QA gates, deploy target, commit/check state.
7. Page includes a visible “unsafe AI change blocked” demo section.
8. Source CSS is formatted for maintainable diffs.
9. QA includes link/base-path crawl, section validation, forbidden-claim checks, and deployed/static route checks.
10. `npm run qa` passes locally.
11. GitHub Actions QA passes after push.
12. Live GitHub Pages URL returns 200 and displays the revised page.

---

## Task 1: Create implementation branch and preserve audit artifacts

**Objective:** Start from a clean branch and commit the audit plan/artifacts so subagents share context.

**Files:**
- Existing: `.agent/audits/adversarial-audit-2026-05-08.md`
- Create: `.hermes/plans/20260508_054413-agentsite-iteration-1-truth-trust-hero.md`

**Steps:**

1. Verify clean baseline except known untracked audit/plan files.
   - Run: `git status --short --branch`
   - Expected: main branch, only `.agent/audits/` and `.hermes/plans/` untracked/modified.
2. Create branch.
   - Run: `git checkout -b feat/truth-trust-hero`
3. Add audit + plan.
   - Run: `git add .agent/audits .hermes/plans && git commit -m "docs: add adversarial audit and iteration plan"`
4. Verify.
   - Run: `git status --short --branch`
   - Expected: clean branch.

**Review gate:** Spec reviewer verifies audit and plan are committed and no production files changed.

---

## Task 2: Fix GitHub Pages base-path links and favicon

**Objective:** Eliminate live path bugs where root-relative links escape `/agentsite-control-plane/`.

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/success.astro`
- Modify: `src/pages/cancel.astro`

**Implementation details:**

Use Astro’s base URL for project-root links and assets.

In `BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import { site } from '../content/site';
const { title = site.title, description = site.description, robots } = Astro.props;
const base = import.meta.env.BASE_URL;
const canonical = new URL(Astro.url.pathname.replace(base, ''), site.url.endsWith('/') ? site.url : `${site.url}/`).toString();
---
```

Use:

```astro
<link rel="icon" href={`${base}favicon.svg`} />
{robots && <meta name="robots" content={robots} />}
```

In page links back home, use:

```astro
const base = import.meta.env.BASE_URL;
```

Then:

```astro
<a class="brand" href={base} aria-label="AgentSite home">
<a class="button secondary" href={base}>Return home</a>
```

For success/cancel pages, pass noindex:

```astro
<BaseLayout title="Payment Success — AgentSite" robots="noindex,follow">
```

**Verification:**

- Run: `npm run build`
- Inspect `dist/index.html`, `dist/success/index.html`, `dist/cancel/index.html`.
- Expected: no `href="/"` or `href="/favicon.svg"` for project links/assets.

**Commit:** `fix: make links base-path safe for github pages`

---

## Task 3: Add base-path and link-crawl QA

**Objective:** Make the previously missed live path bug impossible to reintroduce silently.

**Files:**
- Create: `scripts/check-links.mjs`
- Modify: `package.json`
- Modify: `scripts/serve-gh-pages-local.mjs` if needed
- Modify: `tests/responsive.spec.ts` if needed

**Implementation details:**

Add script `scripts/check-links.mjs` that:

1. Reads every `dist/**/*.html` file.
2. Parses all `a[href]`, `link[href]`, `script[src]`, `img[src]`.
3. Fails on root-relative paths that do not start with `/agentsite-control-plane/`, except external protocol-relative links if any.
4. Verifies internal links resolve to an existing built file or asset.
5. Verifies `favicon.svg`, `og.svg`, `/success/`, and `/cancel/` exist under base path.

Add package script:

```json
"check:links": "node scripts/check-links.mjs"
```

Update `qa` order:

```json
"qa": "npm run build && npm run check:contract && npm run check:sections && npm run check:stripe && npm run check:claims && npm run check:seo && npm run check:links && npm run test:smoke && npm run test:responsive"
```

If `check:sections` / `check:claims` are added later, add them in their tasks and adjust final script then.

**Verification:**

- First run after adding should pass after Task 2.
- Temporarily test mentally or in a subagent scratch branch that `href="/"` would fail.

**Commit:** `test: add base-path link crawl gate`

---

## Task 4: Unify contracts under `.agent/` and remove root drift

**Objective:** Make `.agent/` the canonical contract layer and prevent root/runtime/config divergence.

**Files:**
- Modify: `.agent/site.contract.json`
- Modify: `.agent/payment.contract.json`
- Create: `.agent/deployment.contract.json`
- Create: `.agent/env.contract.json`
- Create: `.agent/content.contract.json`
- Create: `.agent/qa.contract.json`
- Modify or remove: `site.contract.json`
- Modify: `scripts/check-contract.mjs`
- Modify: `src/content/site.ts`
- Modify: `README.md`

**Contract shape:**

`.agent/site.contract.json` should include:

```json
{
  "siteName": "AgentSite Control Plane",
  "baseUrl": "https://castiliad.github.io/agentsite-control-plane/",
  "environment": "demo",
  "purpose": "Demonstrate a contract-driven control layer for agent-maintained revenue landing pages.",
  "audience": ["founders", "operators", "developers evaluating agent-maintained sites"],
  "primaryCta": "View the live contract",
  "secondaryCta": "See the agent workflow",
  "requiredSections": ["hero", "problem", "control-plane", "blocked-change", "workflow", "payment-contract", "qa", "cta"]
}
```

`.agent/deployment.contract.json`:

```json
{
  "provider": "github_pages",
  "liveUrl": "https://castiliad.github.io/agentsite-control-plane/",
  "basePath": "/agentsite-control-plane/",
  "branch": "gh-pages",
  "buildCommand": "npm run build",
  "publishDirectory": "dist",
  "netlifyStatus": "ready_not_authenticated"
}
```

`.agent/payment.contract.json`:

```json
{
  "provider": "stripe_payment_link",
  "mode": "demo",
  "allowedHosts": ["buy.stripe.com", "checkout.stripe.com"],
  "demoPaymentLinks": ["https://buy.stripe.com/test_PLACEHOLDER"],
  "approvedLivePaymentLinks": [],
  "activePaymentLinkEnv": "STRIPE_PAYMENT_LINK",
  "requiresDemoDisclosure": true,
  "agentRules": [
    "Never change live Stripe links without explicit user approval.",
    "Never invent pricing.",
    "Demo mode must visibly disclose that checkout is not live."
  ]
}
```

`.agent/content.contract.json`:

```json
{
  "approvedClaims": [
    {"claim": "AgentSite uses contracts to guide agent edits", "status": "live", "evidence": ".agent/*.contract.json"},
    {"claim": "The demo uses a safe placeholder checkout link", "status": "live", "evidence": ".agent/payment.contract.json"},
    {"claim": "Netlify-ready", "status": "live", "evidence": "netlify.toml"}
  ],
  "forbiddenClaims": [
    "guaranteed revenue",
    "fully autonomous without review",
    "live Netlify deploy",
    "live Stripe checkout enabled"
  ]
}
```

Root `site.contract.json` options:

- Preferred: remove it and update scripts to read `.agent/site.contract.json`.
- If retained for compatibility: generate it from `.agent/site.contract.json` and mark as derived. For this sprint, prefer removal unless tooling breaks.

**Verification:**

- `npm run check:contract` reads `.agent/site.contract.json`.
- No script reads root `site.contract.json`.
- README points users/agents to `.agent/` only.

**Commit:** `refactor: make agent contracts canonical`

---

## Task 5: Enforce section and claim contracts against built HTML

**Objective:** Ensure the page implements the contracted narrative and does not ship unsupported/forbidden claims.

**Files:**
- Create: `scripts/check-sections.mjs`
- Create: `scripts/check-claims.mjs`
- Modify: `package.json`

**Implementation details:**

`check-sections.mjs`:

- Reads `.agent/site.contract.json`.
- Reads `dist/index.html`.
- Uses `cheerio`.
- For every `requiredSections[]`, asserts exactly one element with matching `id`.
- Fails if order differs from contract order.

`check-claims.mjs`:

- Reads `.agent/content.contract.json`.
- Reads all built HTML text.
- Fails if any `forbiddenClaims[]` appears case-insensitively.
- Optionally asserts demo disclosure appears when payment contract requires it.

Add package scripts:

```json
"check:sections": "node scripts/check-sections.mjs",
"check:claims": "node scripts/check-claims.mjs"
```

Update `qa` script to include both after build.

**Verification:**

- Run `npm run qa`.
- Expected: pass after homepage section IDs are updated in later tasks. If added before homepage task, acceptable temporary fail; complete before final commit or commit as a coordinated task with homepage changes.

**Commit:** `test: enforce section and claim contracts`

---

## Task 6: Harden payment QA against actual built CTA URLs

**Objective:** Ensure deployed CTA/payment URLs cannot bypass the payment contract through env variables or source changes.

**Files:**
- Modify: `scripts/check-stripe-links.mjs`
- Modify: `.agent/payment.contract.json`
- Modify: `src/pages/index.astro` if needed to tag payment CTA

**Implementation details:**

Add stable attributes to payment CTAs:

```astro
<a class="button primary" data-payment-cta="primary" href={ctaHref}>...</a>
```

Checker should:

1. Read `.agent/payment.contract.json`.
2. Read `dist/index.html`.
3. Extract all `a[data-payment-cta]` hrefs.
4. If mode is `demo`:
   - Built payment CTA must not point to a live external Stripe URL.
   - Demo disclosure text must exist in built HTML.
5. If mode is `live`:
   - Every payment CTA must be exact match in `approvedLivePaymentLinks`.
   - Host must be in `allowedHosts`.
   - No placeholder/test/demo URL allowed.
6. Fail if any `buy.stripe.com` / `checkout.stripe.com` URL appears in HTML that is not allowed by mode.

**Verification:**

- `npm run build && npm run check:stripe` passes in demo mode.
- Manually inspect `dist/index.html` to confirm CTA points to internal `#payment-contract` in demo.

**Commit:** `test: validate built payment ctas against contract`

---

## Task 7: Rewrite homepage narrative and section structure

**Objective:** Replace abstract workflow copy with buyer-relevant, sharper positioning.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `.agent/site.contract.json`
- Modify: `.agent/content.contract.json`

**Required section order:**

1. `hero`
2. `problem`
3. `control-plane`
4. `blocked-change`
5. `workflow`
6. `payment-contract`
7. `qa`
8. `cta`

**Hero copy:**

Eyebrow:

```text
Contract-driven landing pages for AI agents
```

H1:

```text
Let AI agents ship your landing pages without breaking checkout, claims, or brand.
```

Lede:

```text
AgentSite turns your offer, brand rules, payment constraints, and QA checks into a machine-readable contract. Coding agents can build, review, deploy, and maintain the site without silently changing approved claims or checkout behavior.
```

Primary CTA:

```text
View the live contract
```

Link to GitHub contract file or `#control-plane` if avoiding external link.

Secondary CTA:

```text
See the agent workflow
```

Microcopy:

```text
This demo uses a safe placeholder checkout link. Live Stripe Payment Links require explicit contract approval.
```

**Problem section copy:**

H2:

```text
AI can generate a landing page. The hard part is keeping it correct.
```

Body should name concrete risks: invented claims, unsafe checkout edits, lost context, mobile/SEO regressions.

**Payment section framing:**

H2:

```text
Payment links are controlled, not improvised.
```

Replace “Payment link placeholder active” with:

```text
See the payment safety rule
```

**Final CTA:**

H2:

```text
Start from a landing page agents can understand.
```

CTA:

```text
View source and contract on GitHub
```

**Verification:**

- `npm run build && npm run check:sections && npm run check:claims && npm run check:seo`
- Visually inspect generated page locally.

**Commit:** `copy: sharpen agentsite positioning and narrative`

---

## Task 8: Replace hero status card with control-plane artifact

**Objective:** Make the product’s differentiation visible above the fold.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Artifact requirements:**

The hero right panel should look like a real operational surface, not a generic card.

Include visible rows/cards:

- `Contract` → `Approved`
- `Payment link` → `Locked in demo mode`
- `Deploy target` → `GitHub Pages · Netlify-ready`
- `QA gates` → `Contract · Claims · Stripe · Links · Responsive`
- `Latest check` → `npm run qa passed`

Suggested markup:

```astro
<aside class="control-plane" aria-label="AgentSite control plane summary">
  <div class="panel-header">
    <span class="status-dot"></span>
    <span>AgentSite control plane</span>
  </div>
  <div class="gate-list">
    <div class="gate-row"><span>Contract</span><strong>Approved</strong></div>
    ...
  </div>
  <div class="trace-card">
    <span class="trace-label">Blocked change</span>
    <p>Attempted checkout swap rejected: live Stripe links require approval.</p>
  </div>
</aside>
```

**Design guidance:**

- Reduce glow intensity.
- Use finer borders, smaller radius variation, tighter spacing.
- Make it feel like a product UI, not a marketing card.

**Verification:**

- Playwright screenshot at 1440 and 390.
- CTA should be visible above fold at 390x844 and 1440x900 if practical. If not practical, remove/alter the claim.

**Commit:** `design: add control-plane hero artifact`

---

## Task 9: Add “unsafe AI change blocked” demo section

**Objective:** Dramatize the product’s core superpower: agents are constrained by contracts.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `.agent/site.contract.json` if section IDs change

**Content:**

Section id: `blocked-change`

H2:

```text
The contract blocks the edits that should never slip through.
```

Three-column or terminal-like sequence:

1. **Unsafe request**
   - `Swap checkout to a new Stripe link and claim guaranteed revenue.`
2. **Contract response**
   - `Blocked: live payment links and unsupported claims require approval.`
3. **Allowed change**
   - `Safe copy/layout improvement can proceed after QA passes.`

**Verification:**

- No forbidden claims appear as assertions. If using “guaranteed revenue” as an example, ensure claims checker supports contextual examples or phrase it as quoted blocked input. Safer wording:
  - `Add an unsupported revenue guarantee and swap checkout.`
- `npm run check:claims` passes.

**Commit:** `feat: show unsafe agent change blocked by contract`

---

## Task 10: Redesign visual system toward precision, not generic neon

**Objective:** Improve overall appeal while preserving static simplicity.

**Files:**
- Modify: `src/styles/global.css`
- Modify: `.agent/brand.contract.json`

**Design changes:**

- Format CSS into readable multi-line sections.
- Reduce purple/cyan background intensity by ~70%.
- Replace universal glass-card treatment with distinct components:
  - `.control-plane`
  - `.trace-card`
  - `.proof-strip`
  - `.section-card`
- Add explicit focus-visible styles.
- Use tighter border color: `rgba(255,255,255,.08)` for most surfaces.
- Use cyan only for status/check moments.
- Reduce `h1` max size if CTA falls below fold too often.
- Replace `brand-mark` gradient A with a more precise minimal mark, e.g. outlined square/bracket/contract glyph built in CSS or SVG.

**CSS maintainability requirement:**

Source CSS must be formatted, not one minified line.

**Verification:**

- Run: `npm run qa`
- Capture screenshots:
  - `npx playwright screenshot` or use existing tests/screenshot helper.
- Manually inspect desktop/mobile.

**Commit:** `design: refine visual system for control-plane feel`

---

## Task 11: Improve accessibility and SEO details

**Objective:** Fix semantic issues and template-quality gaps found in audit.

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/success.astro`
- Modify: `src/pages/cancel.astro`
- Modify: `src/styles/global.css`
- Modify: `scripts/check-seo.mjs`
- Create: `public/sitemap.xml` or `scripts/generate-sitemap.mjs`

**Changes:**

- Add skip link:

```astro
<a class="skip-link" href="#main">Skip to main content</a>
<main id="main">
```

- Replace `role="img"` on code panel with semantic `figure`/`figcaption`.
- Add explicit focus-visible styles.
- Add route-specific canonical or noindex success/cancel pages.
- Add sitemap or update robots with sitemap if static sitemap is created.
- Consider PNG OG later; for this sprint SVG OG is acceptable unless easy to generate.

**Verification:**

- Run: `npm run qa`
- Keyboard tab through page locally.
- Ensure `check-seo` still passes.

**Commit:** `fix: improve accessibility and seo semantics`

---

## Task 12: Strengthen responsive and above-fold QA

**Objective:** Align tests with claims and prevent layout regressions.

**Files:**
- Modify: `tests/responsive.spec.ts`
- Modify: `src/pages/index.astro` or `src/styles/global.css` if CTA positioning needs adjustment

**Test changes:**

- Add viewport `320x568`.
- Check no horizontal overflow at all viewports.
- Check primary hero CTA is above fold only if page continues claiming it.
- If not claiming above-fold, remove that QA bullet from homepage and contract.
- Click primary/secondary CTA and assert destination remains within expected site or approved external repo.
- Assert no console errors.

**Suggested rule:**

The hero CTA should be visible above fold at `390x844`, `768x1024`, and `1440x900`. For `320x568`, it can be below fold if the hero remains readable; do not claim universal above-fold visibility.

**Verification:**

- `npm run test:responsive`
- `npm run qa`

**Commit:** `test: align responsive checks with page claims`

---

## Task 13: Update runbooks for future agent maintenance

**Objective:** Make future subagents less likely to drift, overbuild, or weaken safety gates.

**Files:**
- Create: `.agent/runbooks/agent-maintenance.md`
- Modify: `.agent/runbooks/deploy.md`
- Modify: `.agent/runbooks/change-price.md`
- Modify: `README.md`

**Agent maintenance runbook must define:**

- Safe-to-edit files:
  - `src/pages/index.astro`
  - `src/styles/global.css`
  - `.agent/content.contract.json` for approved copy changes
- Approval-required changes:
  - payment links/pricing
  - deployment provider/base URL
  - domain/DNS
  - secrets/env vars
  - weakening QA checks
  - unsupported legal/business claims
- Required order:
  1. Update relevant contract.
  2. Update implementation.
  3. Run QA.
  4. Review deployed preview/live URL.
- Failure handling:
  - Do not delete/disable tests to pass QA.
  - Add a regression test for any discovered bug.
- Deployment truth:
  - Current production is GitHub Pages.
  - Netlify is configured but not authenticated/live until explicitly changed.

**Verification:**

- Read runbook as if a future subagent has no chat context.
- It should answer: what can I edit, what must I ask about, what tests prove it worked?

**Commit:** `docs: add agent maintenance runbook`

---

## Task 14: Final integration review and deploy

**Objective:** Verify the full iteration and publish.

**Files:**
- Potentially all changed files.

**Steps:**

1. Run full QA.
   - `npm run qa`
   - Expected: all gates pass.
2. Run dependency/security audit.
   - `npm audit --omit=dev`
   - Expected: record result. Do not block this sprint on known Astro advisory unless fix is low-risk; create follow-up if needed.
3. Review diff.
   - `git diff --stat main...HEAD`
   - `git diff main...HEAD -- src .agent scripts tests README.md package.json`
4. Dispatch final integration reviewer subagent.
   - Goal: verify plan compliance, no contract drift, no unsupported claims, no weakened safety checks.
5. Dispatch design reviewer subagent.
   - Goal: compare new page against audit goals: less generic, clearer value prop, credible artifact.
6. Fix any critical/important reviewer issues.
7. Commit final fixes if needed.
8. Push branch and open PR.
   - `git push -u origin feat/truth-trust-hero`
   - `gh pr create --title "feat: sharpen AgentSite truth, trust, and hero" --body ...`
9. Confirm GitHub Actions QA passes.
10. Merge after approval.
11. Publish GitHub Pages by existing process or codified workflow.
12. Verify live URL:
   - `https://castiliad.github.io/agentsite-control-plane/` returns 200.
   - Favicon works at `/agentsite-control-plane/favicon.svg`.
   - Main page contains new hero text.

**Commit/PR title:** `feat: sharpen AgentSite truth, trust, and hero`

---

## Recommended subagent execution roster

Use fresh subagents per task, but batch independent reviews.

### Implementation subagents

1. **Foundation/QA subagent**
   - Tasks 2–6.
   - Focus: contracts, path bugs, payment validation, link/section/claim checks.

2. **Narrative/UI subagent**
   - Tasks 7–10.
   - Focus: hero copy, control-plane artifact, blocked-change section, visual system.

3. **Accessibility/docs subagent**
   - Tasks 11–13.
   - Focus: semantics, focus, SEO, runbooks, future operability.

Avoid simultaneous edits to `src/pages/index.astro` and `src/styles/global.css` unless using separate worktrees and merging carefully.

### Review subagents

After implementation:

1. **Spec compliance reviewer**
   - Checks against this plan and audit file.
2. **Design/appeal reviewer**
   - Checks whether page is actually more compelling, less generic.
3. **Technical/security reviewer**
   - Checks path, payment, contract, SEO, accessibility, test quality.
4. **Agent-operability reviewer**
   - Pretends to maintain this six months later.

---

## Risks and tradeoffs

- **Contract unification can balloon.** Keep schemas simple JSON + scripts; avoid introducing a full validation framework unless needed.
- **Design can overrun.** The goal is sharper trust/control-plane feel, not a complete brand identity system.
- **Payment validation must not become fake safety.** Always validate built HTML and env-derived outputs, not just static contract files.
- **GitHub Pages vs Netlify ambiguity must be resolved in copy.** Do not claim live Netlify until it is true.
- **Forbidden-claim checker may need nuance.** If showing examples of blocked bad claims, ensure the checker can distinguish quoted unsafe input or avoid using risky exact phrases.

## Deferred follow-ups

- Real Netlify deploy once Netlify auth is available.
- PNG OG image generation.
- Astro major-version security upgrade if safe.
- GitHub Pages deploy workflow codification instead of manual branch publish.
- Reusable Hermes skill/template after this site iteration stabilizes.

---

## Handoff instruction

Plan complete. To execute: use `subagent-driven-development`, read this plan once, create todos for every task, dispatch fresh implementation subagents with full task text, run spec review then quality review after each task group, and do not deploy until `npm run qa` and reviewer gates pass.
