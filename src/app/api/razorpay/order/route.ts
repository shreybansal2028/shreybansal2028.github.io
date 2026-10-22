import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayClient, RAZORPAY_PRODUCTS, RazorpayTier } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const tier: RazorpayTier = body.tier === 'lifetime' ? 'lifetime' : 'monthly'
    const product = RAZORPAY_PRODUCTS[tier]

    let userEmail: string | undefined
    let userName: string | undefined
    let userId: string = 'guest'

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
      // Guest mode is permitted
    }

    const razorpay = getRazorpayClient()
    const activeKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID

    if (razorpay && activeKeyId) {
      try {
        const order = await razorpay.orders.create({
          amount: product.amountPaise,
          currency: 'INR',
          receipt: `rcpt_${tier}_${Date.now().toString().slice(-8)}`,
          notes: {
            tier,
            userId,
            productName: product.name,
          },
        })

        return NextResponse.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: activeKeyId,
          productName: product.name,
          tier,
          prefill: {
            name: userName || '',
            email: userEmail || '',
          },
          isDemo: false,
        })
      } catch (err: any) {
        console.error('Razorpay order creation error:', err?.message || err)
        // Fall back to demo mode if keys are invalid/restricted
      }
    }

    // Demo fallback for testing without blocking
    return NextResponse.json({
      orderId: `order_demo_${Date.now()}`,
      amount: product.amountPaise,
      currency: 'INR',
      keyId: activeKeyId || 'rzp_test_placeholder',
      productName: product.name,
      tier,
      prefill: {
        name: userName || 'Vibe VIP Guest',
        email: userEmail || 'guest@vibecheckmood.me',
      },
      isDemo: true,
      notice: 'Razorpay keys not yet provided. Simulating interactive checkout.',
    })
  } catch (error: any) {
    console.error('Failed to create Razorpay order:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize Razorpay order' },
      { status: 500 }
    )
  }
}
