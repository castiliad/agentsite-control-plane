export const site = {
  name: 'AgentSite Control Plane',
  title: 'AgentSite Control Plane — Safe AI-Maintained Landing Pages',
  description: 'A live demo of contract-driven landing pages agents can build, review, deploy, and safely maintain without breaking checkout, claims, or brand.',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://castiliad.github.io/agentsite-control-plane/',
  stripeLink: import.meta.env.STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_PLACEHOLDER',
  repoUrl: 'https://github.com/castiliad/agentsite-control-plane',
  contractUrl: 'https://github.com/castiliad/agentsite-control-plane/blob/main/.agent/site.contract.json'
};

export const isDemoPayment = site.stripeLink.includes('PLACEHOLDER') || site.stripeLink.includes('test_') || site.stripeLink.includes('/test');
