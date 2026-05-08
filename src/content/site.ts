export const site = {
  name: 'AgentSite Control Plane',
  title: 'AgentSite Control Plane — Contract-Driven Websites',
  description: 'A live demo of contract-driven landing pages agents can build, review, deploy, and safely maintain with GitHub, Netlify, and Stripe Payment Links.',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://castiliad.github.io/agentsite-control-plane',
  stripeLink: import.meta.env.STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_PLACEHOLDER'
};

export const isDemoPayment = site.stripeLink.includes('PLACEHOLDER') || site.stripeLink.includes('test_') || site.stripeLink.includes('/test');
