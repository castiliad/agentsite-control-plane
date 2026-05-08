# Deploy Runbook

1. Edit contracts first; code follows the contracts.
2. Run `npm run qa` locally.
3. Push a branch and open a PR.
4. Review Netlify deploy preview.
5. Merge only after QA and preview pass.

Production deploys from `main` to Netlify. Rollback via Netlify deploy history or Git revert.
