# Deploy Runbook

Current production deploy: GitHub Pages.

- Live URL: `https://castiliad.github.io/agentsite-control-plane/`
- Production branch: `gh-pages`
- Source branch: `main`
- Build command: `npm run build`
- Publish directory: `dist`

## Deploy steps

1. Run `npm run qa` locally.
2. Push branch and open PR.
3. Wait for GitHub Actions QA.
4. Merge to `main`.
5. Build `dist` from `main` and publish to `gh-pages`.
6. Verify live URL, favicon, OG image, success/cancel pages.

Netlify is configured via `netlify.toml` but is not the current live deployment until authentication and site linking are completed.
