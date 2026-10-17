export type Mood = 'dead' | 'meh' | 'okay' | 'good' | 'great' | 'chaotic'

export interface MoodOption {
  value: Mood
  emoji: string
  label: string
  tagline: string
  color: string
  glowColor: string
  accentBorder: string
}

export interface WeatherData {
  temp: number
  condition: string
  icon: string
  location: string
  city?: string
  locality?: string
  latitude?: number
  longitude?: number
  accuracy?: number
  source?: 'gps' | 'ip' | 'manual'
}

export interface InventoryItem {
  id: string
  user_id: string
  category: 'closet' | 'fridge'
  name: string
  active: boolean
  last_used_at: string | null
  created_at: string
}

export interface WatchItem {
  title: string
  year: string
  type: 'Movie' | 'Series' | 'Anime' | 'Docuseries'
  genre: string
  rating: string
  platform: 'Netflix' | 'Prime Video' | 'Disney+/Hotstar' | 'Apple TV+' | 'YouTube' | 'Hulu' | 'Max'
  why_it_vibes: string
  stream_url: string
  poster_url?: string
}

export interface OutfitLook {
  title: string
  aesthetic: string
  top: string
  bottom: string
  shoes: string
  accessories: string
  zara_search: string
  hm_search: string
  myntra_search: string
  asos_search: string
}

export interface FoodOption {
  title: string
  cuisine: string
  vibe_type: string
  description: string
  pairing: string
  zomato_search: string
  swiggy_search: string
  maps_search: string
  quick_recipe?: string
}

export interface DailyVibe {
  id: string
  user_id?: string
  date: string
  mood: Mood
  weather_condition: string
  weather_temp: number
  outfit_pick: string
  meal_pick: string
  watch_pick: string
  watch_details?: WatchItem[]
  outfit_details?: OutfitLook
  meal_details?: FoodOption
  is_guest?: boolean
  shared_to_community?: boolean
  gpt_prompt_tokens?: number
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id?: string
  username: string
  avatar_emoji: string
  mood: Mood
  date: string
  weather: string
  outfit: string
  meal: string
  watch: string
  note?: string
  likes: number
  reactions: {
    fire: number
    relatable: number
    hug: number
    skull: number
  }
  user_reactions?: string[]
  created_at: string
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 'dead',
    emoji: '😵',
    label: 'Dead',
    tagline: 'Zero battery, leave me alone',
    color: 'from-slate-700 via-zinc-800 to-black',
    glowColor: 'rgba(100, 116, 139, 0.4)',
    accentBorder: 'border-slate-600',
  },
  {
    value: 'meh',
    emoji: '😐',
    label: 'Meh',
    tagline: 'Existing on autopilot today',
    color: 'from-zinc-700 via-neutral-800 to-zinc-950',
    glowColor: 'rgba(161, 161, 170, 0.4)',
    accentBorder: 'border-zinc-500',
  },
  {
    value: 'okay',
    emoji: '🙂',
    label: 'Okay',
    tagline: 'Cozy, balanced, floating along',
    color: 'from-sky-900 via-cyan-950 to-neutral-950',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    accentBorder: 'border-sky-500',
  },
  {
    value: 'good',
    emoji: '😊',
    label: 'Good',
    tagline: 'Soft serotonin, main character energy',
    color: 'from-emerald-900 via-teal-950 to-neutral-950',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    accentBorder: 'border-emerald-500',
  },
  {
    value: 'great',
    emoji: '😄',
    label: 'Great',
    tagline: 'Electric focus, conquering the world',
    color: 'from-violet-900 via-purple-950 to-neutral-950',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    accentBorder: 'border-violet-500',
  },
  {
    value: 'chaotic',
    emoji: '🤪',
    label: 'Chaotic',
    tagline: 'Unfiltered adrenaline, anything goes',
    color: 'from-rose-900 via-fuchsia-950 to-amber-950',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    accentBorder: 'border-rose-500',
  },
]
