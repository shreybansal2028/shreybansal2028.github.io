import { createClient } from '@/lib/supabase/server'
import { MOOD_OPTIONS } from '@/lib/types'
import Link from 'next/link'

export const instant = false

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: vibes } = await supabase
    .from('daily_vibes')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen px-6 py-10 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Past Vibes</h1>
          <p className="text-zinc-500 text-sm">Your last 30 days</p>
        </div>
        <Link href="/check-in" className="text-violet-400 hover:text-violet-300 font-semibold text-sm">
          Today →
        </Link>
      </div>

      {(!vibes || vibes.length === 0) ? (
        <div className="text-center text-zinc-600 py-16">
          <div className="text-5xl mb-4">🕳️</div>
          <p>No vibes yet. Start your first check-in!</p>
          <Link href="/check-in" className="inline-block mt-4 text-violet-400 hover:underline">
            Check in now →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {vibes.map(vibe => {
            const mood = MOOD_OPTIONS.find(m => m.value === vibe.mood)
            const date = new Date(vibe.date + 'T00:00:00')
            const isToday = vibe.date === new Date().toISOString().split('T')[0]
            return (
              <li key={vibe.id}>
                <Link
                  href={`/vibe?id=${vibe.id}`}
                  className="block p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mood?.emoji}</span>
                      <span className="text-sm font-bold">
                        {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {isToday && <span className="text-xs bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full">Today</span>}
                    </div>
                    <span className="text-xs text-zinc-600">{vibe.weather_temp}°C</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">👕 <span className="text-zinc-300">{vibe.outfit_pick}</span></p>
                    <p className="text-xs text-zinc-500">🍜 <span className="text-zinc-300">{vibe.meal_pick}</span></p>
                    <p className="text-xs text-zinc-500">📺 <span className="text-zinc-300">{vibe.watch_pick}</span></p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
