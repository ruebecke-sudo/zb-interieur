const PLAN_LABELS: Record<string, string> = { starter: 'Starter', professional: 'Professional', business: 'Business', agency: 'Agentur', lifetime: 'Dauerlizenz' }

export const planLabel = (plan: string) => PLAN_LABELS[plan] || plan
