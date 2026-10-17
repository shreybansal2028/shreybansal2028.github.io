'use client'

import { useState } from 'react'
import { MOOD_OPTIONS, Mood } from '@/lib/types'
import {
  X,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Clock,
  Phone,
  Calendar,
  BookOpen,
  ChefHat,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { MOOD_RESTAURANTS, RestaurantInfo } from '@/lib/restaurantData'
import RestaurantBookingModal from './RestaurantBookingModal'

interface FoodRadarModalProps {
  isOpen: boolean
  onClose: () => void
  initialMood?: Mood
  userLocation?: string
}

export default function FoodRadarModal({
  isOpen,
  onClose,
  initialMood = 'good',
  userLocation = 'Current Location',
}: FoodRadarModalProps) {
  const [selectedMood, setSelectedMood] = useState<Mood>(initialMood)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [showStayInHack, setShowStayInHack] = useState(false)

  if (!isOpen) return null

  // Extract user city from location string (e.g., "South Delhi, Delhi" -> "Delhi")
  const city = userLocation.includes(',')
    ? userLocation.split(',').pop()?.trim() || 'Delhi'
    : userLocation || 'Delhi'

  const restaurant: RestaurantInfo = (MOOD_RESTAURANTS[selectedMood] || MOOD_RESTAURANTS.good)(city)
  const moodMeta = MOOD_OPTIONS.find((m) => m.value === selectedMood) || MOOD_OPTIONS[3]

  // Safe external maps & delivery fallbacks
  const mapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    restaurant.name + ' ' + city
  )}`
  const zomatoSearchUrl = `https://www.zomato.com/search?q=${encodeURIComponent(
    restaurant.name
  )}`

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">What To Eat Radar</h3>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {userLocation}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mood Filter Pill Bar */}
          <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedMood === mood.value
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* 1. DECISIVE RECOMMENDATION CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-zinc-900 to-black border border-emerald-500/30 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {moodMeta.emoji} Recommended For Your {moodMeta.label} Vibe
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  {restaurant.cuisine}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                {restaurant.dishMatched}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                {restaurant.tagline}
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Pairing: Best savored with iced craft beverages &amp; fresh sides</span>
              </div>
            </div>

            {/* 2. THE VISIBLE RESTAURANT SPOTLIGHT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Featured Visible Restaurant:
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Reservations Open Today
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-300">
                      ⭐ {restaurant.rating}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      ({restaurant.reviewsCount.toLocaleString()} reviews)
                    </span>
                    <span className="text-[11px] text-zinc-500">•</span>
                    <span className="text-[11px] text-zinc-300">
                      {restaurant.priceForTwo}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">
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

              {/* Menu Preview Snippet (Top 2 dishes) */}
              <div className="mb-4 pt-3 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Signature Menu Highlights:
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

              {/* PRIMARY ACTION: Book Table & View Full Menu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Table Now</span>
                </button>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs uppercase tracking-wider text-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Full Menu ({restaurant.menu.length} Items)</span>
                </button>
              </div>
            </div>

            {/* 3. MINIMAL STAY-IN 5-MIN HACK (Collapsible, unobtrusive) */}
            <div className="rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
              <button
                onClick={() => setShowStayInHack((prev) => !prev)}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">
                    Don&apos;t feel like stepping out? 5-Min Stay-In Hack
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

            {/* 4. DISCREET EXTERNAL RADAR LINKS */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
              <span>External Radars:</span>
              <div className="flex items-center gap-3">
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href={zomatoSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <span>Zomato</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Table Booking & Full Menu Modal */}
      <RestaurantBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        restaurant={restaurant}
      />
    </>
  )
}

export { FoodRadarModal }

