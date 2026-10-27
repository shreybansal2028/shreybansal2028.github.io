import crypto from 'crypto'

export interface CashfreeConfig {
  appId: string
  secretKey: string
  environment: 'sandbox' | 'production'
  baseUrl: string
}

export function getCashfreeConfig(): CashfreeConfig | null {
  const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY

  if (!appId || !secretKey) {
    return null
  }

  const isProduction =
    process.env.CASHFREE_ENVIRONMENT === 'production' ||
    process.env.CASHFREE_ENVIRONMENT === 'PROD'

  return {
    appId,
    secretKey,
    environment: isProduction ? 'production' : 'sandbox',
    baseUrl: isProduction
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg',
  }
}

export const CASHFREE_PRODUCTS = {
  monthly: {
    id: 'vibe_vip_monthly',
    name: 'Vibe Check VIP — Monthly',
    amount: 199.0,
    currency: 'INR',
  },
  lifetime: {
    id: 'vibe_vip_lifetime',
    name: 'Vibe Check VIP — Lifetime Pass',
    amount: 999.0,
    currency: 'INR',
  },
} as const

export type CashfreeTier = keyof typeof CASHFREE_PRODUCTS

/**
 * Creates an order on Cashfree PG
 */
export async function createCashfreeOrder({
  orderId,
  amount,
  tier,
  customer,
  returnUrl,
  notifyUrl,
}: {
  orderId: string
  amount: number
  tier: CashfreeTier
  customer: {
    id: string
    email?: string
    phone?: string
    name?: string
  }
  returnUrl: string
  notifyUrl: string
}) {
  const config = getCashfreeConfig()
  if (!config) {
    throw new Error('Cashfree credentials missing (CASHFREE_APP_ID or CASHFREE_SECRET_KEY)')
  }

  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: customer.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50),
      customer_name: customer.name || 'Vibe Member',
      customer_email: customer.email || 'customer@vibecheckmood.me',
      customer_phone: customer.phone || '9999999999',
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
      payment_methods: 'upi,cc,dc,nb',
    },
    order_note: `Vibe Check ${tier === 'lifetime' ? 'Lifetime Pass' : 'Monthly VIP'}`,
    order_tags: {
      tier,
      app: 'vibe-check',
    },
  }

  const res = await fetch(`${config.baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || `Cashfree API error ${res.status}: ${JSON.stringify(data)}`)
  }

  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    orderStatus: data.order_status,
    environment: config.environment,
  }
}

/**
 * Fetches order details directly from Cashfree
 */
export async function getCashfreeOrder(orderId: string) {
  const config = getCashfreeConfig()
  if (!config) return null

  const res = await fetch(`${config.baseUrl}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'x-api-version': '2023-08-01',
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
    },
  })

  if (!res.ok) return null
  return await res.json()
}

/**
 * Verifies webhook signature sent by Cashfree
 */
export function verifyCashfreeWebhookSignature({
  rawBody,
  timestamp,
  signature,
  secretKey,
}: {
  rawBody: string
  timestamp: string
  signature: string
  secretKey: string
}): boolean {
  try {
    const data = `${timestamp}${rawBody}`
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(data)
      .digest('base64')

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  } catch (err) {
    console.error('Cashfree signature verification error:', err)
    return false
  }
}
