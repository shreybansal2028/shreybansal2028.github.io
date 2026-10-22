import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event

    console.log(`[Razorpay Webhook] Received: ${eventType}`)

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload?.payment?.entity
      const orderNotes = event.payload?.order?.entity?.notes || payment?.notes
      const userId = orderNotes?.userId
      const tier = orderNotes?.tier || 'monthly'

      if (userId && userId !== 'guest') {
        try {
          const supabase = await createClient()
          await supabase
            .from('profiles')
            .update({
              is_vip: true,
              vip_tier: tier,
              vip_updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
        } catch (dbErr) {
          console.error('Failed to update VIP profile from webhook:', dbErr)
        }
      }
    }

    return NextResponse.json({ status: 'ok', event: eventType })
  } catch (err: any) {
    console.error('Razorpay Webhook error:', err)
    return NextResponse.json({ error: err?.message || 'Webhook error' }, { status: 500 })
  }
}
