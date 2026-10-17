'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-2xl font-black mb-2">Check your inbox</h2>
          <p className="text-zinc-400">We sent a magic link to <span className="text-violet-400">{email}</span>. Click it to get in.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-black">Vibe Check</h1>
          <p className="text-zinc-400 mt-1">Sign in to start your daily ritual</p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors font-semibold mb-4 flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Magic Link */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition-colors text-white placeholder-zinc-600"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            {loading ? 'Sending...' : 'Send Magic Link ✨'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-6">
          No password needed. One click and you&apos;re in.
        </p>
      </div>
    </div>
  )
}
