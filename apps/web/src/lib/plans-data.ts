// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = "monthly" | "annual" | "lifetime"

export type SubscriptionPlan = {
  id: PlanId
  name: string
  /** Headline price, e.g. "$49.99 / month" */
  price: string
  /** Billing note under the price, e.g. "Billed monthly" */
  billingNote: string
  /** Optional savings badge, e.g. "Save 17%" */
  badge?: string
  overview: string
  /** What the plan includes — shown in the "Features" block */
  features: string[]
  /** Extras that come with the plan — shown in "Additional Resources" */
  resources: string[]
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$49.99 / month",
    billingNote: "Billed monthly",
    overview:
      "Experience all the core features with the flexibility of a monthly subscription. Stay up-to-date with the latest tools, receive ongoing support, and enjoy uninterrupted access to key functionalities designed to enhance your productivity.",
    features: [
      "Community Access & Forum Participation",
      "Customizable Settings & Preferences",
      "Standard Email Support",
      "Cancel Anytime",
    ],
    resources: ["Access to Knowledge Base", "Community Tutorials"],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$41.40 / month",
    billingNote: "$499.99 yearly",
    badge: "Save 17%",
    overview:
      "Commit for a year and pay less every month. You get everything in the monthly plan plus priority support and early access to new features, billed once so you can forget about it until next year.",
    features: [
      "Everything in Monthly",
      "Dedicated Account Manager",
      "Priority Support with 24h Response",
      "Regular Performance Reports",
      "Early Access to New Features",
    ],
    resources: [
      "Access to Knowledge Base",
      "Community Tutorials",
      "Quarterly Strategy Workshop",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$899.99",
    billingNote: "1x billed",
    overview:
      "Pay once and keep access forever. Every current feature, every future update, and no renewal to track — the best value if you plan to stay for the long run.",
    features: [
      "Everything in Annual",
      "Lifetime Access to All Future Updates",
      "Unlimited Seats for Your Workspace",
      "Custom Onboarding Session",
      "No Recurring Billing",
    ],
    resources: [
      "Access to Knowledge Base",
      "Community Tutorials",
      "Quarterly Strategy Workshop",
      "Mentorship Program",
      "Private Founders Channel",
    ],
  },
]
