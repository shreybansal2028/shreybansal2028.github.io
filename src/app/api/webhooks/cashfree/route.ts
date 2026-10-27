import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeConfig, verifyCashfreeWebhookSignature } from '@/lib/cashfree'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-webhook-signature')
    const timestamp = req.headers.get('x-webhook-timestamp')

    const config = getCashfreeConfig()

    // If signature headers are present, verify them
    if (config && signature && timestamp) {
      const isValid = verifyCashfreeWebhookSignature({
        rawBody,
        timestamp,
        signature,
        secretKey: config.secretKey,
      })

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(rawBody)

    // Check for successful payment
    // Event type: PAYMENT_SUCCESS_WEBHOOK
    if (
      event.type === 'PAYMENT_SUCCESS_WEBHOOK' ||
      event.data?.order?.order_status === 'PAID'
    ) {
      const orderData = event.data?.order
      const customerData = event.data?.customer_details
      const tier = orderData?.order_tags?.tier || 'monthly'
      const customerId = customerData?.customer_id

      if (customerId && !customerId.startsWith('guest')) {
        try {
          const supabase = await createClient()
          await supabase
            .from('profiles')
            .update({
              is_vip: true,
              vip_tier: tier,
              vip_gateway: 'cashfree',
              updated_at: new Date().toISOString(),
            })
            .eq('id', customerId)
        } catch (dbErr) {
          console.error('Supabase update error on Cashfree webhook:', dbErr)
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true })
  } catch (error: any) {
    console.error('Cashfree webhook processing error:', error)
    return NextResponse.json({ error: error?.message || 'Webhook error' }, { status: 500 })
  }
}
