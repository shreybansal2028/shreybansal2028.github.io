import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { sampleInventory } from '@/lib/utils'
import { InventoryItem, Mood } from '@/lib/types'
import { buildOutfitDetails, buildFoodDetails, CURATED_WATCH_BY_MOOD } from '@/lib/vibeGenerator'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

export async function POST(req: NextRequest) {
  let user: { id: string } | null = null
  let supabase = null

  try {
    supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    user = authData?.user ?? null
  } catch {
    user = null
  }

  const { category, mood, weatherCondition, weatherTemp, currentPick, vibeId } = await req.json()
  const moodVal: Mood = mood || 'good'
  const tempVal = weatherTemp ?? 22
  const weatherVal = weatherCondition || 'Clear Sky'

  // If no OpenAI key, use curated alternative
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai')) {
    if (category === 'outfit') {
      const outfit = buildOutfitDetails(moodVal, weatherVal, tempVal)
      return NextResponse.json({
        outfit_pick: `${outfit.title} — ${outfit.top} with ${outfit.bottom}`,
        outfit_details: outfit,
      })
    } else if (category === 'meal') {
      const food = buildFoodDetails(moodVal, tempVal)
      return NextResponse.json({
        meal_pick: food.title,
        meal_details: food,
      })
    } else {
      const watches = CURATED_WATCH_BY_MOOD[moodVal] || CURATED_WATCH_BY_MOOD.good
      const alt = watches.find(w => w.title !== currentPick) || watches[1] || watches[0]
      return NextResponse.json({
        watch_pick: `${alt.title} (${alt.year}) on ${alt.platform}`,
        watch_details: [alt, ...watches.filter(w => w.title !== alt.title)],
      })
    }
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    let schema: z.ZodObject<Record<string, z.ZodString>>
    let promptDetail: string
    let inventoryCategory: 'closet' | 'fridge' | null = null

    if (category === 'outfit') {
      schema = z.object({ outfit_pick: z.string() })
      promptDetail = 'a different aesthetic outfit recommendation (under 12 words)'
      inventoryCategory = 'closet'
    } else if (category === 'meal') {
      schema = z.object({ meal_pick: z.string() })
      promptDetail = 'a different delicious craving or meal (under 10 words)'
      inventoryCategory = 'fridge'
    } else {
      schema = z.object({ watch_pick: z.string() })
      promptDetail = 'a different brilliant movie or show with streaming platform (under 15 words)'
    }

    let inventoryContext = ''
    if (inventoryCategory && user && supabase) {
      try {
        const { data: items } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('category', inventoryCategory)
          .eq('active', true)
        const sampled = sampleInventory(items ?? [], 8).map((i: InventoryItem) => i.name)
        if (sampled.length > 0) inventoryContext = `Available items: ${sampled.join(', ')}. `
      } catch {
        // Continue
      }
    }

    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Vibe Check. Give exactly one decisive answer. No options, no hedging.' },
        {
          role: 'user',
          content: `Mood: ${moodVal}. Weather: ${weatherVal}, ${tempVal}°C. ${inventoryContext}Give me ${promptDetail}. DO NOT suggest this: "${currentPick}".`,
        },
      ],
      response_format: zodResponseFormat(schema, 'spin'),
      max_tokens: 300,
    })

    const result = completion.choices[0].message.parsed!
    const key = `${category}_pick`
    const pickedValue = (result as Record<string, string>)[key] || Object.values(result)[0]

    // Update in Supabase if user is logged in
    if (user && supabase && vibeId && !vibeId.startsWith('vibe_')) {
      try {
        await supabase
          .from('daily_vibes')
          .update({ [key]: pickedValue })
          .eq('id', vibeId)
          .eq('user_id', user.id)
      } catch {
        // Table update non-fatal
      }
    }

    // Build companion links
    if (category === 'outfit') {
      const outfit = buildOutfitDetails(moodVal, weatherVal, tempVal)
      return NextResponse.json({
        outfit_pick: pickedValue,
        outfit_details: {
          ...outfit,
          title: pickedValue,
          zara_search: `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(pickedValue)}`,
          hm_search: `https://www2.hm.com/en_in/search-results.html?q=${encodeURIComponent(pickedValue)}`,
          myntra_search: `https://www.myntra.com/${encodeURIComponent(pickedValue.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`,
          asos_search: `https://www.asos.com/search/?q=${encodeURIComponent(pickedValue)}`,
        },
      })
    } else if (category === 'meal') {
      const food = buildFoodDetails(moodVal, tempVal)
      return NextResponse.json({
        meal_pick: pickedValue,
        meal_details: {
          ...food,
          title: pickedValue,
          zomato_search: `https://www.zomato.com/search?q=${encodeURIComponent(pickedValue)}`,
          swiggy_search: `https://www.swiggy.com/search?query=${encodeURIComponent(pickedValue)}`,
          maps_search: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickedValue + ' restaurants near me')}`,
        },
      })
    } else {
      const watches = CURATED_WATCH_BY_MOOD[moodVal] || CURATED_WATCH_BY_MOOD.good
      return NextResponse.json({
        watch_pick: pickedValue,
        watch_details: [
          {
            title: pickedValue,
            year: '2024',
            type: 'Movie',
            genre: 'Curated Pick',
            rating: '8.2/10',
            platform: 'Netflix',
            why_it_vibes: 'Fresh spin to reset your focus today.',
            stream_url: `https://www.google.com/search?q=${encodeURIComponent(pickedValue + ' where to watch')}`,
            poster_url: watches[0].poster_url,
          },
          ...watches,
        ],
      })
    }
  } catch (err) {
    console.error('Spin error, returning fallback:', err)
    if (category === 'outfit') {
      const outfit = buildOutfitDetails(moodVal, weatherVal, tempVal)
      return NextResponse.json({ outfit_pick: `${outfit.title} — ${outfit.top}`, outfit_details: outfit })
    } else if (category === 'meal') {
      const food = buildFoodDetails(moodVal, tempVal)
      return NextResponse.json({ meal_pick: food.title, meal_details: food })
    } else {
      const watches = CURATED_WATCH_BY_MOOD[moodVal] || CURATED_WATCH_BY_MOOD.good
      return NextResponse.json({ watch_pick: `${watches[1].title} on ${watches[1].platform}`, watch_details: watches })
    }
  }
}
