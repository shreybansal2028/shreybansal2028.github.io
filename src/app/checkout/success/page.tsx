'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tier = searchParams.get('tier') || 'monthly'
  const paymentId = searchParams.get('payment_id') || searchParams.get('session_id')
  const isDemo = searchParams.get('demo') === 'true'

  const [activated, setActivated] = useState(false)

  useEffect(() => {
    // Set VIP flag in local storage for instant client unlock
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_vip', 'true')
      localStorage.setItem('vibe_vip_tier', tier)
      localStorage.setItem('vibe_vip_activated_at', new Date().toISOString())
      setActivated(true)
    }
  }, [tier])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background celebration glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-amber-500/25 via-pink-500/20 to-violet-600/25 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/90 border-2 border-amber-500/40 backdrop-blur-2xl shadow-2xl shadow-amber-500/10 text-center relative z-10">
        {/* Crown Icon with animation */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 animate-bounce">
          <Crown className="w-8 h-8 text-white fill-white" />
        </div>

        {/* Demo notice pill if running in demo mode */}
        {isDemo && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Checkout Simulated</span>
          </div>
        )}

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400">VIBE VIP</span>!
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          Your payment has been confirmed via Razorpay. All premium limits and exclusive styling radars are now unlocked for your account.
        </p>

        {/* Perks Unlocked Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2.5 mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VIP Perks Activated</span>
          </div>
          <div className="text-xs text-zinc-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400 shrink-0" />
            <span>Unlimited AI Re-Spins on Outfit, Food & Watch</span>
          </div>
          <div className="text-xs text-zinc-300 flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span>Golden VIP Member status in Community</span>
          </div>
          <div className="text-xs text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>Full Zara, H&M, Snitch, Myntra & ASOS Catalog sync</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/check-in"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white font-black text-base tracking-wide shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Start VIP Vibe Check</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        {paymentId && (
          <p className="text-[10px] text-zinc-600 mt-4 truncate">
            Payment ID: {paymentId}
          </p>
        )}
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-zinc-500">
          Activating VIP...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
