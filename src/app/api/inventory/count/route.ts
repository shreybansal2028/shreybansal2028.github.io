import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ closet: 0, fridge: 0 })

  const { data } = await supabase
    .from('inventory_items')
    .select('category')
    .eq('user_id', user.id)
    .eq('active', true)

  const closet = data?.filter(i => i.category === 'closet').length ?? 0
  const fridge = data?.filter(i => i.category === 'fridge').length ?? 0

  return NextResponse.json({ closet, fridge })
}
