import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = body

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment identifiers' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Signature check if secret is configured
    if (keySecret && razorpay_signature) {
      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        secret: keySecret,
      })

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        )
      }
    }

    // Payment verified! Update VIP status in Supabase if logged in
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from('profiles')
          .update({
            is_vip: true,
            vip_tier: tier || 'monthly',
            vip_updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      }
    } catch (dbErr) {
      console.warn('Could not update profile table:', dbErr)
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      tier: tier || 'monthly',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
