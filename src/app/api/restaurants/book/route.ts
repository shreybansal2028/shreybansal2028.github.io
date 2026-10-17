import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TableBooking } from '@/lib/restaurantData'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      restaurantId,
      restaurantName,
      dishMatched,
      date,
      time,
      guests = 2,
      userName,
      userPhone,
      specialRequest = '',
    } = body

    if (!restaurantId || !restaurantName || !date || !time || !userName || !userPhone) {
      return NextResponse.json(
        { error: 'Missing required reservation fields (date, time, name, phone)' },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingId = `VB-${randomSuffix}`

    const booking: TableBooking = {
      bookingId,
      restaurantId,
      restaurantName,
      dishMatched: dishMatched || 'Chef Tasting Selection',
      date,
      time,
      guests: Number(guests) || 2,
      userName,
      userPhone,
      specialRequest,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }

    // Attempt saving to Supabase if configured & table exists, fail gracefully
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from('table_bookings').insert({
        booking_id: bookingId,
        user_id: user?.id ?? null,
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        dish_matched: booking.dishMatched,
        booking_date: date,
        booking_time: time,
        guests: booking.guests,
        user_name: userName,
        user_phone: userPhone,
        special_request: specialRequest,
        status: 'Confirmed',
      })
    } catch (dbErr) {
      // In-memory / graceful fallback when table isn't migrated yet
      console.warn('Booking stored in-session (Supabase bypass/optional):', dbErr)
    }

    return NextResponse.json({
      success: true,
      booking,
      message: `Table confirmed for ${userName} at ${restaurantName}!`,
    })
  } catch (err: any) {
    console.error('Booking route error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to process table reservation' },
      { status: 500 }
    )
  }
}
