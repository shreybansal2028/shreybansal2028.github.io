'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MOOD_OPTIONS, Mood, WeatherData, DailyVibe } from '@/lib/types'
import { getWeather } from '@/lib/weather'
import { generateVibeResult } from '@/lib/vibeGenerator'
import { Sparkles, MapPin, Shirt, ArrowRight, RotateCcw, Flame } from 'lucide-react'

const LOADING_PHASES = [
  '⚡ Reading your vibe wavelength...',
  '👕 Matching silhouette to weather...',
  '🍜 Hunting nearby food cravings on Zomato & Swiggy...',
  '📺 Curating top movie & series binge list...',
  '✨ Finalizing your 10-second decisions...',
]

export default function CheckInPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0)
  const [inventoryCount, setInventoryCount] = useState({ closet: 12, fridge: 8 })
  const [refreshingGps, setRefreshingGps] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getWeather()
      .then((w) => {
        setWeather(w)
        setLoadingWeather(false)
      })
      .catch(() => {
        setWeather({ temp: 24, condition: 'Partly Cloudy', icon: '⛅', location: 'Local Area' })
        setLoadingWeather(false)
      })
  }, [])

  const handleRefreshGps = async () => {
    setRefreshingGps(true)
    try {
      const fresh = await getWeather(true)
      setWeather(fresh)
    } finally {
      setRefreshingGps(false)
    }
  }

  useEffect(() => {
    fetch('/api/inventory/count')
      .then((r) => r.json())
      .then((data) => {
        if (data && (data.closet > 0 || data.fridge > 0)) {
          setInventoryCount(data)
        }
      })
      .catch(() => {})
  }, [])

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood)
    setTimeout(() => setStep(2), 220)
  }

  const handleVibe = useCallback(async () => {
    if (!selectedMood || submitting) return
    setSubmitting(true)

    // Cycle through exciting loading phases
    const interval = setInterval(() => {
      setLoadingPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length)
    }, 450)

    try {
      const weatherData = weather || { temp: 23, condition: 'Clear Sky', icon: '☀️', location: 'Local Area' }

      const res = await fetch('/api/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          weatherCondition: weatherData.condition,
          weatherTemp: weatherData.temp,
        }),
      })

      let data: DailyVibe

      if (res.ok) {
        data = await res.json()
      } else {
        // Fallback gracefully so user NEVER sees a broken experience
        data = generateVibeResult(selectedMood, weatherData.condition, weatherData.temp)
      }

      // Store in localStorage for instant access & offline resiliency
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_vibe', JSON.stringify(data))
      }

      clearInterval(interval)
      router.push(`/vibe?id=${encodeURIComponent(data.id || 'today')}`)
    } catch (err) {
      console.error('Vibe check failed, using curated fallback:', err)
      const fallback = generateVibeResult(selectedMood, weather?.condition || 'Clear Sky', weather?.temp || 24)
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_vibe', JSON.stringify(fallback))
      }
      clearInterval(interval)
      router.push(`/vibe?id=${encodeURIComponent(fallback.id)}`)
    }
  }, [selectedMood, weather, submitting, router])

  // ── Step 1: Mood Tap Grid ─────────────────────────────────────
  if (step === 1) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-swish-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Daily 10-Second Ritual
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
              How&apos;s the vibe?
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Tap once. Be honest. We&apos;ll decide everything else.
            </p>
          </div>

          {/* Mood Options Grid with Swish Hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`group relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200 card-swish-hover ${
                  selectedMood === mood.value
                    ? 'border-violet-500 bg-violet-950/40 shadow-lg shadow-violet-500/20 scale-[1.02]'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-white/20'
                }`}
              >
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-200 drop-shadow-md">
                  {mood.emoji}
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {mood.label}
                </span>
                <span className="text-[11px] text-zinc-400 leading-tight mt-1 line-clamp-1">
                  {mood.tagline}
                </span>
              </button>
            ))}
          </div>

          {/* Footer badge */}
          <div className="mt-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
            <span>✨ Weather auto-sync active</span>
            <span>•</span>
            <span>Zara, H&M, Zomato & Netflix ready</span>
          </div>
        </div>
      </main>
    )
  }

  // ── Step 2: Context Review + Instant "VIBE ME" ────────────────
  const moodData = MOOD_OPTIONS.find((m) => m.value === selectedMood) || MOOD_OPTIONS[3]

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {submitting ? (
        // High-energy Gen-Z Loading State
        <div className="text-center max-w-sm px-6 py-12 glass-panel-glow rounded-3xl animate-swish-up">
          <div className="text-7xl mb-6 animate-bounce">
            {moodData.emoji}
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 mb-3">
            Synthesizing Your Day
          </h2>
          <p className="text-sm font-medium text-zinc-300 h-10 flex items-center justify-center px-2">
            {LOADING_PHASES[loadingPhaseIndex]}
          </p>

          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 animate-pulse w-full" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md animate-swish-up">
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-violet-600/20 to-pink-600/10 border border-violet-500/30 mb-3">
              <span className="text-6xl drop-shadow-lg">{moodData.emoji}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {moodData.label} Energy
            </h2>
            <p className="text-sm text-zinc-400 mt-0.5">
              &ldquo;{moodData.tagline}&rdquo;
            </p>
          </div>

          {/* Context Badges */}
          <div className="space-y-3 mb-6">
            {/* Weather Card with Live GPS Radar */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{loadingWeather ? '⏳' : weather?.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live GPS Weather Sync</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {loadingWeather ? 'Detecting weather...' : `${weather?.condition}, ${weather?.temp}°C`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[140px]">{weather?.location || 'Local'}</span>
                </div>
                <button
                  onClick={handleRefreshGps}
                  disabled={refreshingGps}
                  title="Re-ping GPS"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${refreshingGps ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Smart Inventory / Connected Stores */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Smart Wardrobe & Fridge
                  </div>
                  <div className="text-xs font-semibold text-zinc-300">
                    {inventoryCount.closet} closet pieces · {inventoryCount.fridge} fridge items active
                  </div>
                </div>
              </div>
              <a href="/inventory" className="text-xs font-bold text-violet-400 hover:text-violet-300">
                Edit →
              </a>
            </div>
          </div>

          {/* Giant Swish Button */}
          <button
            onClick={handleVibe}
            disabled={submitting}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 font-black text-xl tracking-wider text-white shadow-xl shadow-violet-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group pulse-ring"
          >
            <span>VIBE ME NOW</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full mt-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Switch mood
          </button>
        </div>
      )}
    </main>
  )
}
