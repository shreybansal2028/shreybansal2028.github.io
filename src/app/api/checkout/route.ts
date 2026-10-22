import { NextRequest, NextResponse } from 'next/server'
import { getDodoClient, DODO_PRODUCTS, VipTier } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const tier: VipTier = body.tier === 'lifetime' ? 'lifetime' : 'monthly'
    const product = DODO_PRODUCTS[tier]

    // Determine host origin
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      'https://vibecheckmood.me'

    // Optional Supabase user
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
      // Guest mode
    }

    const dodo = getDodoClient()

    if (dodo && process.env.DODO_PAYMENTS_API_KEY) {
      try {
        const session = await dodo.checkoutSessions.create({
          product_cart: [
            {
              product_id: product.id,
              quantity: 1,
            },
          ],
          return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
          cancel_url: `${origin}/pricing`,
          customer: userEmail
            ? {
                email: userEmail,
                name: userName || 'Vibe Member',
              }
            : undefined,
          metadata: {
            userId,
            tier,
            productName: product.name,
          },
        })

        if (session.checkout_url) {
          return NextResponse.json({
            url: session.checkout_url,
            sessionId: session.session_id,
            isDemo: false,
          })
        }
      } catch (dodoError: any) {
        console.error('Dodo Payments API error:', dodoError?.message || dodoError)

        if (
          dodoError?.message?.includes('INSUFFICIENT_PERMISSION') ||
          dodoError?.status === 403
        ) {
          return NextResponse.json({
            error:
              'Your Dodo Payments API Key has Read-Only permissions. Please create a key with "Write" or "Full Access" permissions on the Dodo dashboard.',
            code: 'INSUFFICIENT_PERMISSION',
            fallbackUrl: `${origin}/checkout/success?tier=${tier}&demo=true`,
            isDemo: true,
          })
        }

        return NextResponse.json({
          url: `${origin}/checkout/success?tier=${tier}&demo=true&reason=dodo_api_fallback`,
          sessionId: `demo_session_${Date.now()}`,
          isDemo: true,
          notice: dodoError?.message || 'Running in demo mode.',
        })
      }
    }

    return NextResponse.json({
      url: `${origin}/checkout/success?tier=${tier}&demo=true`,
      sessionId: `demo_session_${Date.now()}`,
      isDemo: true,
      notice: 'Dodo Payments ready. Set DODO_PAYMENTS_API_KEY in Vercel to go live.',
    })
  } catch (error: any) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize checkout session' },
      { status: 500 }
    )
  }
}
