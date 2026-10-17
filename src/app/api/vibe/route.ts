import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { sampleInventory, getTodayDate } from '@/lib/utils'
import { InventoryItem, Mood, DailyVibe } from '@/lib/types'
import { generateVibeResult, buildOutfitDetails, buildFoodDetails, CURATED_WATCH_BY_MOOD } from '@/lib/vibeGenerator'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const VibeSchema = z.object({
  outfit_pick: z.string().describe('One punchy outfit summary under 12 words'),
  outfit_title: z.string().describe('Aesthetic name for the look, e.g. Cyber Streetwear, Slouchy Ghost Core'),
  outfit_top: z.string(),
  outfit_bottom: z.string(),
  outfit_shoes: z.string(),
  outfit_accessories: z.string(),
  meal_pick: z.string().describe('Specific mouthwatering meal name under 10 words'),
  meal_cuisine: z.string(),
  meal_vibe_type: z.string().describe('e.g. Comfort Broth, Dopamine Smash, Serotonin Bowl'),
  meal_description: z.string().describe('1-sentence sensory description'),
  watch_pick: z.string().describe('Lead movie or show recommendation under 15 words'),
  watch_items: z.array(
    z.object({
      title: z.string(),
      year: z.string(),
      type: z.enum(['Movie', 'Series', 'Anime', 'Docuseries']),
      genre: z.string(),
      rating: z.string(),
      platform: z.enum(['Netflix', 'Prime Video', 'Disney+/Hotstar', 'Apple TV+', 'YouTube', 'Hulu', 'Max']),
      why_it_vibes: z.string(),
    })
  ).describe('3 curated movies or series that fit this mood'),
})

export async function POST(req: NextRequest) {
  let body: { mood?: Mood; weatherCondition?: string; weatherTemp?: number } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const mood: Mood = body.mood || 'good'
  const weatherCondition = body.weatherCondition || 'Clear Sky'
  const weatherTemp = body.weatherTemp ?? 22

  // Generate fallback base in case AI or DB fails
  const fallbackVibe = generateVibeResult(mood, weatherCondition, weatherTemp)

  let supabase
  let user: { id: string } | null = null

  try {
    supabase = await createClient()
    const authResult = await supabase.auth.getUser()
    user = authResult.data?.user ?? null
  } catch {
    // If Supabase server client fails or is unconfigured, proceed in guest mode
    user = null
  }

  const today = getTodayDate()

  // If user is authenticated, check for existing vibe today
  if (user && supabase) {
    try {
      const { data: existing } = await supabase
        .from('daily_vibes')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({
          ...existing,
          watch_details: existing.watch_details || CURATED_WATCH_BY_MOOD[mood] || CURATED_WATCH_BY_MOOD.okay,
          outfit_details: existing.outfit_details || buildOutfitDetails(mood, weatherCondition, weatherTemp),
          meal_details: existing.meal_details || buildFoodDetails(mood, weatherTemp),
        })
      }
    } catch {
      // Proceed if query failed
    }
  }

  // Sample inventory if user has items
  let sampledCloset: string[] = []
  let sampledFridge: string[] = []

  if (user && supabase) {
    try {
      const { data: inventory } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)

      const closetItems = (inventory ?? []).filter((i: InventoryItem) => i.category === 'closet')
      const fridgeItems = (inventory ?? []).filter((i: InventoryItem) => i.category === 'fridge')

      sampledCloset = sampleInventory(closetItems, 8).map(i => i.name)
      sampledFridge = sampleInventory(fridgeItems, 8).map(i => i.name)
    } catch {
      // Inventory fetch non-critical
    }
  }

  // If OpenAI API key is missing, return curated high-vibe response immediately
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai')) {
    return NextResponse.json(fallbackVibe)
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const moodDescriptions: Record<Mood, string> = {
      dead: 'completely exhausted, burnt out, depleted battery, needing extreme comfort',
      meh: 'bored autopilot, neutral grey energy, needing a slight dopamine spark',
      okay: 'steady and tranquil, balanced, cozy chill focus',
      good: 'positive, main character energy, ready to enjoy the day',
      great: 'hyper-energetic, euphoric, confident, ambitious',
      chaotic: 'unhinged adrenaline, impulsive, spontaneous, ready for wild fun',
    }

    const systemPrompt = `You are Vibe Check — a brutally decisive, hyper-aesthetic Gen Z daily curator.
You provide:
1) EXACTLY ONE decisive aesthetic outfit (styled with specific pieces: top, bottom, shoes, accessories).
2) EXACTLY ONE mouthwatering meal craving suited for the weather and mood.
3) A batch of 3 brilliant movies or series to watch (with real platforms like Netflix, Prime Video, Disney+/Hotstar, Apple TV+).
Speak with confident Gen-Z style: no filler, no indecisiveness.`

    const userPrompt = `Mood: ${moodDescriptions[mood] || mood}
Weather: ${weatherCondition}, ${weatherTemp}°C
Closet pieces: ${sampledCloset.length > 0 ? sampledCloset.join(', ') : 'no specific items listed'}
Fridge pieces: ${sampledFridge.length > 0 ? sampledFridge.join(', ') : 'no specific items listed'}

Output the 1 outfit, 1 meal, and 3 movies/series for this exact vibe.`

    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(VibeSchema, 'vibe_output'),
      max_tokens: 800,
    })

    const parsed = completion.choices[0].message.parsed
    if (!parsed) {
      return NextResponse.json(fallbackVibe)
    }

    // Build rich store links
    const outfitSearchTerm = encodeURIComponent(`${parsed.outfit_title} ${parsed.outfit_top}`)
    const baseOutfit = buildOutfitDetails(mood, weatherCondition, weatherTemp)
    const baseFood = buildFoodDetails(mood, weatherTemp)

    const fullVibe: DailyVibe = {
      id: user?.id ? `vibe_${user.id.slice(0, 8)}_${today}` : fallbackVibe.id,
      user_id: user?.id,
      date: today,
      mood,
      weather_condition: weatherCondition,
      weather_temp: weatherTemp,
      outfit_pick: parsed.outfit_pick,
      meal_pick: parsed.meal_pick,
      watch_pick: parsed.watch_pick,
      watch_details: parsed.watch_items.map((item, idx) => ({
        ...item,
        stream_url: `https://www.google.com/search?q=${encodeURIComponent(item.title + ' where to watch ' + item.platform)}`,
        poster_url: CURATED_WATCH_BY_MOOD[mood]?.[idx]?.poster_url || fallbackVibe.watch_details?.[idx]?.poster_url,
      })),
      outfit_details: {
        title: parsed.outfit_title,
        aesthetic: baseOutfit.aesthetic,
        top: parsed.outfit_top,
        bottom: parsed.outfit_bottom,
        shoes: parsed.outfit_shoes,
        accessories: parsed.outfit_accessories,
        zara_search: `https://www.zara.com/in/en/search?searchTerm=${outfitSearchTerm}`,
        hm_search: `https://www2.hm.com/en_in/search-results.html?q=${outfitSearchTerm}`,
        myntra_search: `https://www.myntra.com/${encodeURIComponent(parsed.outfit_top.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`,
        asos_search: `https://www.asos.com/search/?q=${outfitSearchTerm}`,
      },
      meal_details: {
        title: parsed.meal_pick,
        cuisine: parsed.meal_cuisine,
        vibe_type: parsed.meal_vibe_type,
        description: parsed.meal_description,
        pairing: baseFood.pairing,
        zomato_search: `https://www.zomato.com/search?q=${encodeURIComponent(parsed.meal_pick)}`,
        swiggy_search: `https://www.swiggy.com/search?query=${encodeURIComponent(parsed.meal_pick)}`,
        maps_search: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.meal_pick + ' restaurants near me')}`,
        quick_recipe: baseFood.quick_recipe,
      },
      is_guest: !user,
      gpt_prompt_tokens: completion.usage?.prompt_tokens ?? 0,
      created_at: new Date().toISOString(),
    }

    // Persist to Supabase if authenticated
    if (user && supabase) {
      try {
        await supabase.from('daily_vibes').upsert({
          user_id: user.id,
          date: today,
          mood,
          weather_condition: weatherCondition,
          weather_temp: weatherTemp,
          outfit_pick: fullVibe.outfit_pick,
          meal_pick: fullVibe.meal_pick,
          watch_pick: fullVibe.watch_pick,
          gpt_prompt_tokens: fullVibe.gpt_prompt_tokens,
        })
      } catch {
        // Table might not have columns or RLS; return in-memory vibe
      }
    }

    return NextResponse.json(fullVibe)
  } catch (err) {
    console.error('Error generating AI vibe, returning curated fallback:', err)
    return NextResponse.json(fallbackVibe)
  }
}
