const PLAN_LABELS: Record<string, string> = { starter: 'Starter', professional: 'Professional', business: 'Business', agency: 'Agentur', lifetime: 'Dauerlizenz' }

export const planLabel = (plan: string) => PLAN_LABELS[plan] || plan

// Recipient for the "Agentur" plan, which is sold individually (no Stripe price).
export const SALES_CONTACT_EMAIL = 'info@my-digital-world.de'
