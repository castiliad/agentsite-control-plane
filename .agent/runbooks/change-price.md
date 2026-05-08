# Price / Stripe Link Changes

Requires explicit human approval.

1. Create or update the Stripe Payment Link in Stripe.
2. Add the exact approved URL to `.agent/payment.contract.json.approvedLivePaymentLinks`.
3. Set `STRIPE_PAYMENT_LINK` in the production deployment environment.
4. Switch `.agent/payment.contract.json.mode` from `demo` to `live` only after approval.
5. Run `npm run qa`; the built payment CTA must exactly match the approved URL.
6. Verify the deployed CTA opens an approved `buy.stripe.com` or `checkout.stripe.com` URL.

Do not edit QA scripts to bypass payment approval.
