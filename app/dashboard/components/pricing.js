export const billingCycles = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    period: "per month, billed monthly",
    discountLabel: null,
    multiplier: 1,
  },
  yearly: {
    id: "yearly",
    label: "Yearly",
    period: "per month, billed annually",
    discountLabel: "Save 20%",
    multiplier: 0.8,
  },
};

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 49,
    featured: false,
    description: "For solo operators getting started with AI workflows.",
    ctaLabel: "Get Started",
    features: [
      "AI Chat Assistant",
      "3 workflow automations",
      "50,000 AI tokens/month",
      "1 user account",
      "Email support",
      { text: "Voice receptionist", muted: true },
      { text: "Document intelligence", muted: true },
    ],
    capabilities: {
      claude: false,
      receptionist: false,
      documentIntelligence: false,
      teamSeats: 1,
      automations: 3,
    },
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 149,
    featured: true,
    description: "For growing schools that want automation, voice, and better AI control.",
    ctaLabel: "Start Pro Free",
    features: [
      "Everything in Starter",
      "AI Voice Receptionist",
      "Document Intelligence (RAG)",
      "5 workflow automations",
      "200,000 AI tokens/month",
      "3 user accounts",
      "Priority support",
    ],
    capabilities: {
      claude: true,
      receptionist: true,
      documentIntelligence: true,
      teamSeats: 3,
      automations: 5,
    },
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 399,
    featured: false,
    description: "For multi-location teams that need scale, white-labeling, and onboarding support.",
    ctaLabel: "Contact Sales",
    features: [
      "Everything in Pro",
      "White-label branding",
      "Custom subdomain",
      "Unlimited automations",
      "Unlimited tokens",
      "Unlimited team members",
      "Dedicated onboarding call",
    ],
    capabilities: {
      claude: true,
      receptionist: true,
      documentIntelligence: true,
      teamSeats: null,
      automations: null,
    },
  },
];

export function getPlanById(planId) {
  return pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[0];
}

export function getPlanPrice(plan, billingCycle = "monthly") {
  const cycle = billingCycles[billingCycle] ?? billingCycles.monthly;
  return Math.round(plan.monthlyPrice * cycle.multiplier);
}

export function getPlanPeriod(billingCycle = "monthly") {
  const cycle = billingCycles[billingCycle] ?? billingCycles.monthly;
  return cycle.period;
}

export function getPlanYearlyTotal(plan) {
  return getPlanPrice(plan, "yearly") * 12;
}
