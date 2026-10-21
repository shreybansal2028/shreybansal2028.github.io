import { NextRequest, NextResponse } from 'next/server'
import { getDodoClient } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const dodo = getDodoClient()
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY

    let event: any = null

    // Verify webhook signature if key is provided and client exists
    if (dodo && webhookKey) {
      try {
        const headers: Record<string, string> = {}
        req.headers.forEach((value, key) => {
          headers[key] = value
        })

        event = dodo.webhooks.unwrap(rawBody, {
          headers,
          key: webhookKey,
        })
      } catch (verifyError: any) {
        console.error('Webhook signature verification failed:', verifyError?.message)
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
      }
    } else {
      // In development or when webhook secret is not configured, parse body safely
      try {
        event = JSON.parse(rawBody)
      } catch {
        return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 })
      }
    }

    if (!event) {
      return NextResponse.json({ error: 'No event received' }, { status: 400 })
    }

    const eventType = event.type || event.event_type
    console.log(`[Dodo Payments Webhook] Received event: ${eventType}`)

    // Handle payment or subscription events
    switch (eventType) {
      case 'payment.succeeded': {
        const paymentData = event.data
        const userId = paymentData?.metadata?.userId || paymentData?.customer?.metadata?.userId
        const customerEmail = paymentData?.customer?.email || paymentData?.customer_email

        console.log(`[Dodo Payments] Payment succeeded for user ${userId || customerEmail}`)

        // Update profile in Supabase if user exists
        if (userId && userId !== 'guest') {
          try {
            const supabase = await createClient()
            await supabase
              .from('profiles')
              .update({
                is_vip: true,
                vip_updated_at: new Date().toISOString(),
              })
              .eq('id', userId)
          } catch (dbErr) {
            console.error('Failed to update VIP status in database:', dbErr)
          }
        }
        break
      }

      case 'subscription.active':
      case 'subscription.renewed': {
        const subData = event.data
        const userId = subData?.metadata?.userId
        if (userId && userId !== 'guest') {
          try {
            const supabase = await createClient()
            await supabase
              .from('profiles')
              .update({
                is_vip: true,
                vip_expires_at: subData?.next_billing_date || null,
              })
              .eq('id', userId)
          } catch (dbErr) {
            console.error('Failed to update VIP subscription in database:', dbErr)
          }
        }
        break
      }

      case 'subscription.cancelled': {
        const subData = event.data
        const userId = subData?.metadata?.userId
        if (userId && userId !== 'guest') {
          try {
            const supabase = await createClient()
            await supabase
              .from('profiles')
              .update({
                is_vip: false,
              })
              .eq('id', userId)
          } catch (dbErr) {
            console.error('Failed to update cancelled VIP in database:', dbErr)
          }
        }
        break
      }

      default:
        console.log(`[Dodo Payments] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true, event: eventType })
  } catch (err: any) {
    console.error('Dodo Webhook handler error:', err)
    return NextResponse.json({ error: err?.message || 'Webhook handler error' }, { status: 500 })
  }
}
