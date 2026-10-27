import { NextRequest, NextResponse } from 'next/server'
import {
  createCashfreeOrder,
  getCashfreeConfig,
  CASHFREE_PRODUCTS,
  CashfreeTier,
} from '@/lib/cashfree'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const tier: CashfreeTier = body.tier === 'lifetime' ? 'lifetime' : 'monthly'
    const product = CASHFREE_PRODUCTS[tier]

    // Determine host origin
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      'https://vibecheckmood.me'

    // Optional Supabase user
    let userEmail: string | undefined
    let userName: string | undefined
    let userId: string = 'guest_' + Math.random().toString(36).substring(2, 9)

    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        userId = user.id
        userEmail = user.email
        userName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0]
      }
    } catch {
      // Guest mode
    }

    const config = getCashfreeConfig()

    // If credentials are not configured yet, return demo fallback
    if (!config) {
      return NextResponse.json({
        isDemo: true,
        tier,
        amount: product.amount,
        message: 'Cashfree credentials (CASHFREE_APP_ID / CASHFREE_SECRET_KEY) not configured yet.',
        fallbackUrl: `${origin}/checkout/success?tier=${tier}&demo=true&gateway=cashfree`,
      })
    }

    const orderId = `vibe_${tier}_${Date.now()}`
    const returnUrl = `${origin}/checkout/success?order_id={order_id}&tier=${tier}&gateway=cashfree`
    const notifyUrl = `${origin}/api/webhooks/cashfree`

    const order = await createCashfreeOrder({
      orderId,
      amount: product.amount,
      tier,
      customer: {
        id: userId,
        email: userEmail,
        name: userName,
      },
      returnUrl,
      notifyUrl,
    })

    return NextResponse.json({
      orderId: order.orderId,
      paymentSessionId: order.paymentSessionId,
      environment: order.environment,
      tier,
      isDemo: false,
    })
  } catch (error: any) {
    console.error('Cashfree order creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create Cashfree order' },
      { status: 500 }
    )
  }
}
