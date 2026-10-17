'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShoppingBag, Utensils, Tv, Users, Flame, ChevronRight } from 'lucide-react'
import { GpsTrackerWidget } from '@/components/GpsTrackerWidget'
import FoodRadarModal from '@/components/FoodRadarModal'
import { StoreModal } from '@/components/StoreModal'
import { StoreBrand } from '@/lib/storeCatalog'
import { Mood } from '@/lib/types'

export default function LandingPage() {
  const [foodModalOpen, setFoodModalOpen] = useState(false)
  const [foodModalMood, setFoodModalMood] = useState<Mood>('good')
  const [userLocation, setUserLocation] = useState('Your Location')

  const [storeModalOpen, setStoreModalOpen] = useState(false)
  const [storeModalBrand, setStoreModalBrand] = useState<StoreBrand>('Zara')

  // Read synced GPS location if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('user_weather_location')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed.location) {
            setUserLocation(parsed.location)
          }
        }
      } catch {
        // Continue
      }
    }
  }, [foodModalOpen])

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-xl w-full animate-swish-up">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Connected with Zara, H&amp;M, Myntra, Zomato &amp; Netflix</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4 leading-[1.08]">
          KILLS DECISION{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500">
            FATIGUE.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 mb-6 font-medium">
          3 quick inputs. 1 confident answer each for:
        </p>

        {/* Live GPS Tracker & Radar Widget */}
        <div className="mb-6">
          <GpsTrackerWidget />
        </div>

        {/* 3 Categories Interactive Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 text-sm font-bold">
          {/* What to wear button */}
          <button
            onClick={() => {
              setStoreModalBrand('Zara')
              setStoreModalOpen(true)
            }}
            className="px-3.5 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-500/60 text-violet-300 flex items-center gap-1.5 transition-all card-swish-hover group"
          >
            <ShoppingBag className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            <span>What to wear (Zara/H&amp;M/Myntra)</span>
          </button>

          {/* What to eat button (Openable Food Tab) */}
          <button
            onClick={() => setFoodModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 flex items-center gap-2 transition-all card-swish-hover group shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
          >
            <Utensils className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>What to eat (Zomato/Swiggy/Maps)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/30 font-black uppercase text-emerald-200">
              Open
            </span>
          </button>

          {/* What to watch button */}
          <Link
            href="/check-in"
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 flex items-center gap-1.5 transition-all card-swish-hover group"
          >
            <Tv className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>What to watch (Netflix/Prime)</span>
          </Link>
        </div>

        {/* Primary CTA */}
        <div className="space-y-3 mb-10">
          <Link
            href="/check-in"
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-black text-xl tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-violet-600/30 active:scale-[0.98] group pulse-ring"
          >
            <span>START 10-SEC VIBE CHECK</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-zinc-400">
            <Link href="/community" className="hover:text-pink-400 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <span>Explore Community Feed (380+ live) →</span>
            </Link>
          </div>
        </div>

        {/* Feature Preview Swish Showcase (All 3 Openable on Click) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Card 1: Connected Closets */}
          <div
            onClick={() => {
              setStoreModalBrand('Zara')
              setStoreModalOpen(true)
            }}
            className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-violet-500/40 card-swish-hover cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">👕</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
              Connected Wardrobe Stores
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explore curated drops from Zara, H&amp;M, Myntra, ASOS, Uniqlo &amp; Snitch categorized by tops, bottoms &amp; shoes.
            </p>
          </div>

          {/* Card 2: Nearby Food Cravings (Openable Tab!) */}
          <div
            onClick={() => setFoodModalOpen(true)}
            className="p-4 rounded-2xl glass-panel-glow border border-emerald-500/40 hover:border-emerald-400 card-swish-hover cursor-pointer group shadow-lg shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">🍜</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Tap to explore
              </span>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              What To Eat &amp; Table Booking
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Decisive dish picks + visible restaurants, full menus, and instant in-app table reservations.
            </p>
          </div>

          {/* Card 3: Curated Binge List */}
          <Link
            href="/check-in"
            className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-amber-500/40 card-swish-hover block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">📺</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Curated Binge List
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Movie &amp; series bunches matched to your energy level on Netflix, Prime &amp; Hotstar.
            </p>
          </Link>
        </div>
      </div>

      {/* ── Openable Tab / Modal For What To Eat ────────────────── */}
      <FoodRadarModal
        isOpen={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
        initialMood={foodModalMood}
        userLocation={userLocation}
      />

      {/* ── Openable Store Modal For What To Wear ───────────────── */}
      <StoreModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        initialBrand={storeModalBrand}
        aesthetic="Oversized Streetwear"
        topPiece="heavyweight hoodie"
        bottomPiece="wide cargo trousers"
      />
    </main>
  )
}
