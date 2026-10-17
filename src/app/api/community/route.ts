import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CommunityPost, Mood } from '@/lib/types'

// Initial vibrant community vibes so the feed is never dead
const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    username: 'kai_zen',
    avatar_emoji: '⚡️',
    mood: 'dead',
    date: 'Today',
    weather: 'Overcast, 18°C',
    outfit: 'Oversized charcoal acid-wash hoodie + slouchy fleece sweatpants + foam slides',
    meal: 'Extra spicy Shin ramen with American cheese melted on top & soft egg',
    watch: 'Derry Girls (Netflix) — on season 2 rewatch',
    note: 'Zero percent battery today. Ramen doing the heavy lifting.',
    likes: 42,
    reactions: { fire: 18, relatable: 35, hug: 28, skull: 12 },
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'post_2',
    username: 'zoya.w',
    avatar_emoji: '🖤',
    mood: 'chaotic',
    date: 'Today',
    weather: 'Clear, 26°C',
    outfit: 'Mesh graphic long-sleeve, vintage baggy cobalt cargos & metallic silver runners',
    meal: 'Korean gochujang glazed chicken wings with molten mozzarella tteokbokki',
    watch: 'Euphoria Season 1 (Hotstar) — need that soundtrack in my veins',
    note: 'Accidentally bought concert tickets at 3 AM. No regrets.',
    likes: 67,
    reactions: { fire: 54, relatable: 22, hug: 8, skull: 41 },
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'post_3',
    username: 'milo_vibes',
    avatar_emoji: '🎧',
    mood: 'okay',
    date: 'Today',
    weather: 'Partly Cloudy, 21°C',
    outfit: 'Textured ecru quarter-zip knit, wide-leg tailored chinos & Samba OGs',
    meal: 'Fresh salmon poke bowl with sriracha mayo & iced matcha latte',
    watch: 'Arcane (Netflix) — still the cleanest animation in existence',
    note: 'Low stress coffee shop day. Just existing peacefully.',
    likes: 29,
    reactions: { fire: 15, relatable: 19, hug: 14, skull: 2 },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'post_4',
    username: 'tanya_x',
    avatar_emoji: '✨',
    mood: 'good',
    date: 'Today',
    weather: 'Sunny, 24°C',
    outfit: 'Cropped boxy leather jacket, vintage wash 501s & lug-sole platform loafers',
    meal: 'Wood-fired burrata & hot honey sourdough pizza with sparkling yuzu',
    watch: 'Challengers (Prime Video) — the techno soundtrack is crazy',
    note: 'Finally got my sleep schedule back. Feeling like a protagonist today.',
    likes: 38,
    reactions: { fire: 31, relatable: 18, hug: 11, skull: 4 },
    created_at: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
  },
  {
    id: 'post_5',
    username: 'arav_09',
    avatar_emoji: '🫠',
    mood: 'meh',
    date: 'Today',
    weather: 'Foggy, 19°C',
    outfit: 'Waffle-knit thermal long sleeve + double-knee carpenter trousers',
    meal: 'Crispy smash burger with caramelized onions & truffle parmesan fries',
    watch: 'The Bear (Disney+/Hotstar) — intense enough to wake me up',
    note: 'Staring into space between zoom calls. Smash burger will fix me.',
    likes: 51,
    reactions: { fire: 24, relatable: 47, hug: 33, skull: 19 },
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'post_6',
    username: 'dev_hyper',
    avatar_emoji: '🚀',
    mood: 'great',
    date: 'Today',
    weather: 'Sunny, 27°C',
    outfit: 'Tailored oversized blazer in charcoal, wide pleated trousers & square-toe boots',
    meal: 'Smoky tandoori feast with slow-simmered dal makhani & hot butter garlic naan',
    watch: 'Baby Driver (Netflix) — peak flow state cinema',
    note: 'Crushed my sprint demo. Everything is hitting right today.',
    likes: 44,
    reactions: { fire: 40, relatable: 16, hug: 9, skull: 5 },
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
]

// In-memory cache for fast, seamless live posts across guest sessions
let runtimeCommunityPosts: CommunityPost[] = [...SEED_COMMUNITY_POSTS]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const moodFilter = searchParams.get('mood')

  let supabasePosts: CommunityPost[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('community_vibes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    if (moodFilter && moodFilter !== 'all') {
      query = query.eq('mood', moodFilter)
    }

    const { data } = await query
    if (data && data.length > 0) {
      supabasePosts = data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        username: item.username || 'Anonymous Vibe',
        avatar_emoji: item.avatar_emoji || '⚡️',
        mood: item.mood as Mood,
        date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weather: 'Live Vibe',
        outfit: item.outfit_pick,
        meal: item.meal_pick,
        watch: item.watch_pick,
        note: item.vibe_note || undefined,
        likes: item.likes_count || 1,
        reactions: { fire: 1, relatable: 1, hug: 0, skull: 0 },
        created_at: item.created_at,
      }))
    }
  } catch {
    // Supabase table might not exist; fallback to seed
  }

  // Combine live runtime posts and supabase posts
  const combined = [...supabasePosts, ...runtimeCommunityPosts]
  // Deduplicate by ID
  const seen = new Set<string>()
  const deduped: CommunityPost[] = []

  for (const post of combined) {
    if (!seen.has(post.id)) {
      seen.add(post.id)
      if (!moodFilter || moodFilter === 'all' || post.mood === moodFilter) {
        deduped.push(post)
      }
    }
  }

  return NextResponse.json({
    posts: deduped,
    active_now: 384,
    mood_pulse: {
      dead: 24,
      meh: 18,
      okay: 22,
      good: 16,
      great: 10,
      chaotic: 10,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, postId, reactionType, vibe } = body

    if (action === 'react' && postId) {
      const post = runtimeCommunityPosts.find(p => p.id === postId)
      if (post && reactionType && post.reactions[reactionType as keyof typeof post.reactions] !== undefined) {
        post.reactions[reactionType as keyof typeof post.reactions] += 1
        post.likes += 1
      }
      return NextResponse.json({ success: true, post })
    }

    if (action === 'share' && vibe) {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        username: body.username?.trim() || 'Anonymous Vibe',
        avatar_emoji: body.avatar_emoji || '⚡️',
        mood: vibe.mood,
        date: 'Today',
        weather: `${vibe.weather_condition}, ${vibe.weather_temp}°C`,
        outfit: vibe.outfit_pick,
        meal: vibe.meal_pick,
        watch: vibe.watch_pick,
        note: body.note?.trim() || 'Dropped my daily vibe check.',
        likes: 1,
        reactions: { fire: 1, relatable: 0, hug: 0, skull: 0 },
        created_at: new Date().toISOString(),
      }

      runtimeCommunityPosts = [newPost, ...runtimeCommunityPosts]

      // Try saving to Supabase if configured
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('community_vibes').insert({
          user_id: user?.id || null,
          username: newPost.username,
          avatar_emoji: newPost.avatar_emoji,
          mood: newPost.mood,
          outfit_pick: newPost.outfit,
          meal_pick: newPost.meal,
          watch_pick: newPost.watch,
          vibe_note: newPost.note,
          likes_count: 1,
        })
      } catch {
        // Continue with memory store
      }

      return NextResponse.json({ success: true, post: newPost })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 })
  }
}
