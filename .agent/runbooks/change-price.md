# Price / Stripe Link Changes

Requires explicit human approval.

1. Create or update the Stripe Payment Link in Stripe.
2. Add the exact approved URL to `.agent/payment.contract.json`.
3. Set `STRIPE_PAYMENT_LINK` in Netlify environment variables.
4. Switch payment mode from `demo` to `live` only after QA passes.
5. Verify CTA opens an approved `buy.stripe.com` or `checkout.stripe.com` URL.
