'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  Users,
  Shirt,
  History,
  ShoppingBag,
  Crown,
} from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vipFlag = localStorage.getItem('vibe_vip') === 'true'
      setIsVip(vipFlag)
    }
  }, [pathname])

  const links = [
    { href: '/check-in', label: 'Vibe Me', icon: Sparkles },
    { href: '/stores', label: 'Stores', icon: ShoppingBag, badge: 'Zara/H&M' },
    { href: '/community', label: 'Community', icon: Users, badge: 'Live' },
    { href: '/inventory', label: 'Wardrobe', icon: Shirt },
    { href: '/history', label: 'History', icon: History },
    {
      href: '/pricing',
      label: isVip ? 'VIP' : 'Upgrade',
      icon: Crown,
      badge: isVip ? 'Pro' : 'VIP',
      isVipLink: true,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#09090b]/80 border-b border-white/5 transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo with Pulsing Aura */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
            <span className="text-lg">⚡</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider text-white flex items-center gap-1.5">
              VIBE CHECK
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold -mt-0.5">
              No scrolling. Just vibes.
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            if (link.isVipLink) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 ${
                    isVip
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : 'text-white bg-gradient-to-r from-violet-600/30 to-pink-600/30 border border-violet-500/30 hover:border-violet-500/60 shadow-sm'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isVip ? 'text-amber-400 fill-amber-400' : 'text-amber-300 animate-pulse'
                    }`}
                  />
                  <span className="hidden xs:inline sm:inline">{link.label}</span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full text-white ${
                        isVip
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
                <span className="hidden xs:inline sm:inline">{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
