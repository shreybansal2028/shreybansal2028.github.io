import Razorpay from 'razorpay'
import crypto from 'crypto'

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export const RAZORPAY_PRODUCTS = {
  monthly: {
    id: 'plan_vip_monthly',
    name: 'Vibe Check VIP — Monthly',
    priceINR: 199,
    amountPaise: 19900,
    billing: 'billed monthly',
  },
  lifetime: {
    id: 'plan_vip_lifetime',
    name: 'Vibe Check VIP — Lifetime Pass',
    priceINR: 999,
    amountPaise: 99900,
    billing: 'one-time payment',
  },
} as const

export type RazorpayTier = keyof typeof RAZORPAY_PRODUCTS

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string
  paymentId: string
  signature: string
  secret: string
}): boolean {
  try {
    const generated = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(signature))
  } catch (err) {
    console.error('Signature verification error:', err)
    return false
  }
}
