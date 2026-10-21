'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Crown,
  Sparkles,
  Check,
  Zap,
  Flame,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  UtensilsCrossed,
  RotateCcw,
  Star,
} from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly')
  const [loadingTier, setLoadingTier] = useState<'monthly' | 'lifetime' | null>(null)

  const handleCheckout = async (tier: 'monthly' | 'lifetime') => {
    setLoadingTier(tier)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to initiate checkout')
        setLoadingTier(null)
      }
    } catch (e: any) {
      alert('Checkout error: ' + (e?.message || 'Please try again'))
      setLoadingTier(null)
    }
  }

  const freeFeatures = [
    '1 Daily Vibe Check ritual every day',
    'Live GPS weather & temperature sync',
    'Basic Outfit, Meal & Watch suggestions',
    '1 Re-spin per category per day',
    'Browse public Community feed',
  ]

  const vipFeatures = [
    '⚡ Unlimited AI Re-Spins on any category anytime',
    '👑 Golden VIP Badge on your profile & community posts',
    '👗 Exclusive VIP Fashion Catalog (Zara, H&M, Snitch, Myntra, ASOS)',
    '🍽️ Instant Restaurant Booking Passes & Full Menus in ₹',
    '🔮 30-Day Mood Analytics & Personalized Serotonin Tracker',
    '🎯 Unlimited Wardrobe & Fridge Inventory sync',
    '⚡ Priority GPT-4o Generation (Instant response speed)',
    '🔒 Zero Ads, Zero Sponsored Tracking',
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-amber-500/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold tracking-wider uppercase">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>VIP Membership</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3">
            Never Overthink.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">
              Vibe Like a VIP.
            </span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
            Get unlimited AI re-spins, instant fashion store checkouts, restaurant reservation passes, and an exclusive VIP identity.
          </p>

          {/* Toggle Monthly / Lifetime */}
          <div className="mt-8 inline-flex p-1 rounded-2xl bg-zinc-900 border border-white/10 relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Pass
            </button>
            <button
              onClick={() => setBillingCycle('lifetime')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                billingCycle === 'lifetime'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Lifetime Pass</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-white/20 text-white">
                Best Value
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* FREE TIER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  Free Ritual
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 border border-white/5">
                  Current
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">₹0</span>
                <span className="text-zinc-500 text-sm ml-2">forever free</span>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm mb-6">
                Essential daily ritual for deciding your day in under 10 seconds.
              </p>

              <div className="space-y-3 mb-8">
                {freeFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/check-in"
              className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-center text-sm transition-all"
            >
              Continue Free
            </Link>
          </div>

          {/* VIP PASS */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-black/90 border-2 border-violet-500/50 backdrop-blur-xl shadow-2xl shadow-violet-500/20 flex flex-col justify-between overflow-hidden">
            {/* Top highlight gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400" />
            
            {/* Popular Pill */}
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" />
                VIBE PRO
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-sm font-black uppercase tracking-wider text-amber-300">
                  Vibe Check VIP
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-2">
                {billingCycle === 'monthly' ? (
                  <>
                    <span className="text-4xl sm:text-5xl font-black text-white">₹199</span>
                    <span className="text-zinc-400 text-sm font-semibold">/ month ($4.99)</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl font-black text-white">₹999</span>
                    <span className="text-zinc-400 text-sm font-semibold">one-time ($19.99)</span>
                  </>
                )}
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm mb-6 font-medium">
                Unlock unrestricted AI re-spins, priority booking radar, and exclusive fashion checkout access.
              </p>

              {/* Perks List */}
              <div className="space-y-3 mb-8">
                {vipFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-100 font-medium">
                    <div className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-2.5 h-2.5 fill-violet-400" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dodo Payments Button */}
            <div>
              <button
                onClick={() => handleCheckout(billingCycle)}
                disabled={loadingTier !== null}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white font-black text-base tracking-wide shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loadingTier === billingCycle ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting Dodo Payments...</span>
                  </div>
                ) : (
                  <>
                    <Crown className="w-5 h-5 fill-amber-300 text-amber-300" />
                    <span>Upgrade to VIP Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secured by Dodo Payments · Instant Activation · UPI, Cards & Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Guarantee */}
        <div className="mt-14 p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-zinc-300 text-sm font-semibold">
            &ldquo;Vibe Check VIP completely removed all outfit and dinner decision fatigue for me and my friends.&rdquo;
          </p>
          <p className="text-zinc-500 text-xs mt-1">— Riya S., Mumbai</p>
        </div>
      </div>
    </div>
  )
}
