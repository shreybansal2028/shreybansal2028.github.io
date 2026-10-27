import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeOrder } from '@/lib/cashfree'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const order = await getCashfreeOrder(orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found on Cashfree' }, { status: 404 })
    }

    const isPaid = order.order_status === 'PAID'

    if (isPaid) {
      try {
        const supabase = await createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const tier = order.order_tags?.tier || 'monthly'
          await supabase
            .from('profiles')
            .update({
              is_vip: true,
              vip_tier: tier,
              vip_gateway: 'cashfree',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
        }
      } catch (err) {
        console.error('Error updating VIP status in Supabase:', err)
      }
    }

    return NextResponse.json({
      success: isPaid,
      orderStatus: order.order_status,
      orderAmount: order.order_amount,
      orderCurrency: order.order_currency,
      customerDetails: order.customer_details,
    })
  } catch (error: any) {
    console.error('Cashfree verification error:', error)
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
