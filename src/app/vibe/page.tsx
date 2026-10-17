'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DailyVibe, MOOD_OPTIONS, WatchItem } from '@/lib/types'
import { generateVibeResult, buildOutfitDetails, buildFoodDetails, CURATED_WATCH_BY_MOOD } from '@/lib/vibeGenerator'
import Link from 'next/link'
import {
  Sparkles,
  RefreshCw,
  Share2,
  ExternalLink,
  MapPin,
  ShoppingBag,
  Tv,
  UtensilsCrossed,
  Shirt,
  Users,
  Copy,
  Check,
  Film,
  Calendar,
  Phone,
  Clock,
  BookOpen,
  ChefHat,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

import { StoreModal } from '@/components/StoreModal'
import { StoreBrand, ProductCategory } from '@/lib/storeCatalog'
import { MOOD_RESTAURANTS, RestaurantInfo } from '@/lib/restaurantData'
import RestaurantBookingModal from '@/components/RestaurantBookingModal'

function VibePageContent() {
  const searchParams = useSearchParams()
  const vibeId = searchParams.get('id')
  const router = useRouter()

  const [vibe, setVibe] = useState<DailyVibe | null>(null)
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [activeWatchIndex, setActiveWatchIndex] = useState(0)
  const [storeModalOpen, setStoreModalOpen] = useState(false)
  const [storeModalBrand, setStoreModalBrand] = useState<StoreBrand>('Zara')
  const [storeModalCategory, setStoreModalCategory] = useState<ProductCategory>('All')
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [showStayInHack, setShowStayInHack] = useState(false)

  // Load vibe from Supabase OR localStorage fallback
  useEffect(() => {
    let loaded = false

    // First check localStorage for immediate render (zero lag)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('current_vibe')
      if (cached) {
        try {
          const parsed: DailyVibe = JSON.parse(cached)
          // If no specific vibeId requested or if cached matches
          if (!vibeId || vibeId === 'today' || parsed.id === vibeId || vibeId.startsWith('vibe_')) {
            // Enrich with details if missing
            const enriched: DailyVibe = {
              ...parsed,
              watch_details: parsed.watch_details || CURATED_WATCH_BY_MOOD[parsed.mood] || CURATED_WATCH_BY_MOOD.okay,
              outfit_details: parsed.outfit_details || buildOutfitDetails(parsed.mood, parsed.weather_condition, parsed.weather_temp),
              meal_details: parsed.meal_details || buildFoodDetails(parsed.mood, parsed.weather_temp),
            }
            setVibe(enriched)
            setLoading(false)
            loaded = true
          }
        } catch {
          // Continue to remote fetch
        }
      }
    }

    // Attempt Supabase fetch if valid UUID and not yet loaded
    if (vibeId && !vibeId.startsWith('vibe_') && vibeId !== 'today' && vibeId !== 'undefined') {
      try {
        const supabase = createClient()
        const fetchRemote = async () => {
          try {
            const { data, error } = await supabase
              .from('daily_vibes')
              .select('*')
              .eq('id', vibeId)
              .single()

            if (!error && data) {
              const full: DailyVibe = {
                ...data,
                watch_details: data.watch_details || CURATED_WATCH_BY_MOOD[data.mood as keyof typeof CURATED_WATCH_BY_MOOD] || CURATED_WATCH_BY_MOOD.okay,
                outfit_details: data.outfit_details || buildOutfitDetails(data.mood, data.weather_condition, data.weather_temp),
                meal_details: data.meal_details || buildFoodDetails(data.mood, data.weather_temp),
              }
              setVibe(full)
              setLoading(false)
              loaded = true
            } else if (!loaded) {
              const fresh = generateVibeResult('good', 'Clear Sky', 24)
              setVibe(fresh)
              setLoading(false)
            }
          } catch {
            if (!loaded) {
              const fresh = generateVibeResult('good', 'Clear Sky', 24)
              setVibe(fresh)
              setLoading(false)
            }
          }
        }
        fetchRemote()
      } catch {
        if (!loaded) {
          const fresh = generateVibeResult('good', 'Clear Sky', 24)
          setVibe(fresh)
          setLoading(false)
        }
      }
    } else if (!loaded) {
      // If no valid ID, create vibrant result
      const fresh = generateVibeResult('good', 'Clear Sky', 24)
      setVibe(fresh)
      setLoading(false)
    }
  }, [vibeId])

  // Single Category Spin Again
  const handleSpin = useCallback(
    async (category: 'outfit' | 'meal' | 'watch') => {
      if (!vibe || spinning) return
      setSpinning(category)

      const currentPick =
        category === 'outfit'
          ? vibe.outfit_pick
          : category === 'meal'
          ? vibe.meal_pick
          : vibe.watch_pick

      try {
        const res = await fetch('/api/vibe/spin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            mood: vibe.mood,
            weatherCondition: vibe.weather_condition,
            weatherTemp: vibe.weather_temp,
            currentPick,
            vibeId: vibe.id,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setVibe((prev) => {
            if (!prev) return prev
            const updated = {
              ...prev,
              ...(category === 'outfit' && {
                outfit_pick: data.outfit_pick,
                outfit_details: data.outfit_details || prev.outfit_details,
              }),
              ...(category === 'meal' && {
                meal_pick: data.meal_pick,
                meal_details: data.meal_details || prev.meal_details,
              }),
              ...(category === 'watch' && {
                watch_pick: data.watch_pick,
                watch_details: data.watch_details || prev.watch_details,
              }),
            }
            if (typeof window !== 'undefined') {
              localStorage.setItem('current_vibe', JSON.stringify(updated))
            }
            return updated
          })
        }
      } catch (err) {
        console.error('Failed to spin category:', err)
      } finally {
        setSpinning(null)
      }
    },
    [vibe, spinning]
  )

  // Share to community feed
  const handleShareToCommunity = async () => {
    if (!vibe || shared) return
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share',
          vibe,
          note: `Vibing with ${vibe.outfit_details?.title || vibe.outfit_pick} and ${vibe.meal_details?.title || vibe.meal_pick}`,
        }),
      })
      setShared(true)
      setTimeout(() => {
        router.push('/community')
      }, 700)
    } catch {
      setShared(true)
    }
  }

  // Copy share link
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center animate-spin mb-4">
          <Sparkles className="w-8 h-8 text-violet-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-400 animate-pulse">
          Opening today&apos;s aesthetic...
        </p>
      </main>
    )
  }

  if (!vibe) return null

  const moodData = MOOD_OPTIONS.find((m) => m.value === vibe.mood) || MOOD_OPTIONS[3]
  const watchList = vibe.watch_details && vibe.watch_details.length > 0 ? vibe.watch_details : CURATED_WATCH_BY_MOOD[vibe.mood] || CURATED_WATCH_BY_MOOD.okay
  const currentWatch = watchList[activeWatchIndex] || watchList[0]
  const outfit = vibe.outfit_details || buildOutfitDetails(vibe.mood, vibe.weather_condition, vibe.weather_temp)
  const food = vibe.meal_details || buildFoodDetails(vibe.mood, vibe.weather_temp)
  const restaurant: RestaurantInfo = (MOOD_RESTAURANTS[vibe.mood] || MOOD_RESTAURANTS.good)('Delhi')

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      {/* ── Top Hero Bar ─────────────────────────────────────────── */}
      <div className="text-center mb-8 animate-swish-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 mb-3">
          <span className="text-lg">{moodData.emoji}</span>
          <span>{moodData.label} Mood</span>
          <span>•</span>
          <span>{vibe.weather_condition}, {vibe.weather_temp}°C</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Your Daily Decisions
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          One outfit. One meal. One watch. Zero doomscrolling.
        </p>
      </div>

      {/* ── 3 Swishing Decision Panels ───────────────────────────── */}
      <div className="space-y-6">
        {/* ── 1. WHAT TO WEAR (Outfit + Connected Stores) ──────── */}
        <section className="glass-panel-glow rounded-3xl p-6 sm:p-8 animate-swish-up card-swish-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-violet-400">
                  DECISION 01 • WHAT TO WEAR
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {outfit.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => handleSpin('outfit')}
              disabled={spinning === 'outfit'}
              title="Spin for another outfit"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${spinning === 'outfit' ? 'animate-spin text-violet-400' : ''}`} />
            </button>
          </div>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3">
              Aesthetic: {outfit.aesthetic}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-zinc-300">
              <div
                onClick={() => {
                  setStoreModalCategory('Top')
                  setStoreModalOpen(true)
                }}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-pink-500/50 cursor-pointer transition-all card-swish-hover group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">👕 Top Layer</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-pink-300 flex items-center gap-0.5">
                    Browse Tops <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-white font-bold text-sm leading-snug">{outfit.top}</div>
              </div>

              <div
                onClick={() => {
                  setStoreModalCategory('Bottom')
                  setStoreModalOpen(true)
                }}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-pink-500/50 cursor-pointer transition-all card-swish-hover group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">👖 Bottom</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-pink-300 flex items-center gap-0.5">
                    Browse Bottoms <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-white font-bold text-sm leading-snug">{outfit.bottom}</div>
              </div>

              <div
                onClick={() => {
                  setStoreModalCategory('Shoes')
                  setStoreModalOpen(true)
                }}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-pink-500/50 cursor-pointer transition-all card-swish-hover group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">👟 Footwear</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-pink-300 flex items-center gap-0.5">
                    Browse Shoes <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-white font-bold text-sm leading-snug">{outfit.shoes}</div>
              </div>

              <div
                onClick={() => {
                  setStoreModalCategory('Accessories')
                  setStoreModalOpen(true)
                }}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-pink-500/50 cursor-pointer transition-all card-swish-hover group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">🎒 Accent / Bag</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-pink-300 flex items-center gap-0.5">
                    Browse Accents <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-white font-bold text-sm leading-snug">{outfit.accessories}</div>
              </div>
            </div>
          </div>

          {/* Connected Store Quick Launchers */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                Integrated Fashion Websites &amp; Categorized Drops:
              </span>
              <span className="text-[11px] text-pink-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                6 Stores Synced
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { brand: 'Zara', icon: '🏷️', label: 'Zara' },
                { brand: 'H&M', icon: '🛍️', label: 'H&M' },
                { brand: 'Myntra', icon: '📦', label: 'Myntra' },
                { brand: 'ASOS', icon: '👟', label: 'ASOS' },
                { brand: 'Uniqlo', icon: '🎌', label: 'Uniqlo' },
                { brand: 'Snitch', icon: '⚡', label: 'Snitch' },
              ].map(({ brand, icon, label }) => (
                <button
                  key={brand}
                  onClick={() => {
                    setStoreModalBrand(brand as StoreBrand)
                    setStoreModalOpen(true)
                  }}
                  className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-pink-500/50 text-xs font-bold text-white transition-all group card-swish-hover"
                >
                  <span className="text-lg">{icon}</span>
                  <span className="leading-none">{label}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-pink-300 font-bold uppercase">
                    Browse
                  </span>
                </button>
              ))}
            </div>

            {/* Link to Full Hub */}
            <div className="mt-3 text-right">
              <Link
                href="/stores"
                className="text-xs text-zinc-400 hover:text-pink-400 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>Explore Full Multi-Brand Store Catalog (30+ Pieces)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. WHAT TO EAT (Decisive Food Pick + Visible Restaurant + Table Booking) ───── */}
        <section className="glass-panel-glow rounded-3xl p-6 sm:p-8 animate-swish-up card-swish-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  DECISION 02 • WHAT TO EAT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {restaurant.dishMatched || food.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => handleSpin('meal')}
              disabled={spinning === 'meal'}
              title="Spin for another meal"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${spinning === 'meal' ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Dish Vibe & Pairing Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {restaurant.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-zinc-300 border border-white/10">
                {food.vibe_type}
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              {restaurant.tagline || food.description}
            </p>
            <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-xs text-zinc-400 flex items-center justify-between">
              <span>🥤 <strong>Best pairing:</strong> {food.pairing}</span>
              <span className="text-xs text-emerald-400 font-bold">⭐ Verified Match</span>
            </div>
          </div>

          {/* Featured Visible Restaurant Spotlight Card */}
          <div className="pt-4 border-t border-white/10">
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Visible Spot Serving This Today:
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Tables Available Now
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-amber-300">
                      ⭐ {restaurant.rating}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      ({restaurant.reviewsCount.toLocaleString()} reviews)
                    </span>
                    <span className="text-[11px] text-zinc-500">•</span>
                    <span className="text-[11px] text-zinc-300 font-medium">
                      {restaurant.priceForTwo}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {restaurant.name}
                  </h3>

                  <div className="space-y-1 mt-1 text-xs text-zinc-400">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span>{restaurant.openingHours}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <a
                        href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        {restaurant.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Highlights preview */}
              <div className="mb-4 pt-3 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Menu Highlights &amp; Pricing:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {restaurant.menu.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 truncate pr-2 font-medium">
                        {item.name}
                      </span>
                      <span className="font-bold text-emerald-400 flex-shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary In-App Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Table (Instant Confirmation)</span>
                </button>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs uppercase tracking-wider text-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Explore Menu &amp; Reserve ({restaurant.menu.length} items)</span>
                </button>
              </div>
            </div>

            {/* Collapsible 5-Min Stay-In Hack */}
            <div className="mt-3 rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
              <button
                onClick={() => setShowStayInHack((prev) => !prev)}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">
                    Staying in instead? Quick 5-Min Comfort Hack
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-zinc-500 transition-transform ${
                    showStayInHack ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showStayInHack && (
                <div className="p-4 pt-1 border-t border-white/5 text-xs text-zinc-300 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                    <span>{restaurant.quickBiteAlternative.title}</span>
                    <span>Ready in {restaurant.quickBiteAlternative.prepTime}</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    {restaurant.quickBiteAlternative.hack}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {restaurant.quickBiteAlternative.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-400"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 3. WHAT TO WATCH (Bunch of Movies / Series) ─────── */}
        <section className="glass-panel-glow rounded-3xl p-6 sm:p-8 animate-swish-up card-swish-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  DECISION 03 • WHAT TO WATCH
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentWatch.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => handleSpin('watch')}
              disabled={spinning === 'watch'}
              title="Spin for another movie"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${spinning === 'watch' ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Featured Movie / Series Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 p-4 rounded-2xl bg-black/40 border border-white/10">
            {currentWatch.poster_url && (
              <div className="h-44 md:h-full rounded-xl overflow-hidden relative group">
                <img
                  src={currentWatch.poster_url}
                  alt={currentWatch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {currentWatch.type}
                </div>
              </div>
            )}

            <div className={`${currentWatch.poster_url ? 'md:col-span-2' : 'md:col-span-3'} flex flex-col justify-between`}>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⭐️ {currentWatch.rating}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/10 text-white">
                    {currentWatch.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-800">
                    {currentWatch.genre}
                  </span>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed mb-3">
                  &ldquo;{currentWatch.why_it_vibes}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                <a
                  href={currentWatch.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-bold text-xs text-black flex items-center gap-2 shadow-md transition-all"
                >
                  <Film className="w-4 h-4" />
                  <span>Stream on {currentWatch.platform}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-xs text-zinc-400">
                  Platform: <strong className="text-white">{currentWatch.platform}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Bunch of other movies / series in this vibe */}
          {watchList.length > 1 && (
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                More Binge Options For Today:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {watchList.map((item, idx) => (
                  <button
                    key={item.title}
                    onClick={() => setActiveWatchIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activeWatchIndex === idx
                        ? 'border-amber-500/80 bg-amber-500/10'
                        : 'border-white/5 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate max-w-[140px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {item.rating}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {item.platform} • {item.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Community & Share Bottom Bar ─────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleShareToCommunity}
            disabled={shared}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 active:scale-95 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>{shared ? '✅ Shared to Community!' : 'Drop in Community Feed'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-zinc-300 flex items-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden xs:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <Link href="/community" className="hover:text-violet-400 font-semibold transition-colors flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>See who has your vibe →</span>
          </Link>
          <span>•</span>
          <Link href="/check-in" className="hover:text-white transition-colors">
            Tomorrow&apos;s check-in
          </Link>
        </div>
      </div>

      {/* In-App Multi-Brand Fashion Store Modal */}
      <StoreModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        initialBrand={storeModalBrand}
        initialCategory={storeModalCategory}
        aesthetic={outfit.aesthetic}
        topPiece={outfit.top}
        bottomPiece={outfit.bottom}
      />

      {/* In-App Restaurant Booking & Menu Modal */}
      <RestaurantBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        restaurant={restaurant}
      />
    </main>
  )
}

export default function VibePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-5xl animate-spin">⚡</div>
        </div>
      }
    >
      <VibePageContent />
    </Suspense>
  )
}
