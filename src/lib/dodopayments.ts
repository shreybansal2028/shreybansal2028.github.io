import DodoPayments from 'dodopayments'

// Dodo Payments client singleton
export function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY

  if (!apiKey) {
    return null
  }

  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode'

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  })
}

export const DODO_PRODUCTS = {
  monthly: {
    id: process.env.DODO_PAYMENTS_PRODUCT_VIP_MONTHLY || 'pdt_vibe_monthly',
    name: 'Vibe Check VIP — Monthly',
    priceINR: 199,
    priceUSD: 4.99,
    billing: 'billed monthly',
  },
  lifetime: {
    id: process.env.DODO_PAYMENTS_PRODUCT_VIP_LIFETIME || 'pdt_vibe_lifetime',
    name: 'Vibe Check VIP — Lifetime Pass',
    priceINR: 999,
    priceUSD: 19.99,
    billing: 'one-time payment',
  },
} as const

export type VipTier = keyof typeof DODO_PRODUCTS
