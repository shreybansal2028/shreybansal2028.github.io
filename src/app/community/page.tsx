'use client'

import { useState, useEffect } from 'react'
import { MOOD_OPTIONS, Mood, CommunityPost } from '@/lib/types'
import Link from 'next/link'
import {
  Users,
  Flame,
  Heart,
  Sparkles,
  Send,
  MessageCircle,
  TrendingUp,
  Shirt,
  UtensilsCrossed,
  Tv,
} from 'lucide-react'

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState<Mood | 'all'>('all')
  const [noteInput, setNoteInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [postingMood, setPostingMood] = useState<Mood>('good')
  const [isPosting, setIsPosting] = useState(false)
  const [reactedPosts, setReactedPosts] = useState<Record<string, string>>({})

  // Fetch feed
  useEffect(() => {
    setLoading(true)
    const url = selectedMood === 'all' ? '/api/community' : `/api/community?mood=${selectedMood}`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedMood])

  // Handle reaction
  const handleReact = async (postId: string, reactionType: 'fire' | 'relatable' | 'hug' | 'skull') => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1,
            reactions: {
              ...post.reactions,
              [reactionType]: (post.reactions[reactionType] || 0) + 1,
            },
          }
        }
        return post
      })
    )
    setReactedPosts((prev) => ({ ...prev, [postId]: reactionType }))

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'react', postId, reactionType }),
      })
    } catch {
      // Non-critical
    }
  }

  // Handle direct community drop
  const handleDropVibe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteInput.trim() || isPosting) return
    setIsPosting(true)

    try {
      const moodInfo = MOOD_OPTIONS.find((m) => m.value === postingMood) || MOOD_OPTIONS[3]
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share',
          username: nameInput.trim() || 'Anonymous Vibe',
          avatar_emoji: moodInfo.emoji,
          note: noteInput.trim(),
          vibe: {
            mood: postingMood,
            weather_condition: 'Live Sync',
            weather_temp: 24,
            outfit_pick: 'Aesthetic street comfort',
            meal_pick: 'Favorite comfort craving',
            watch_pick: 'Late-night streaming picks',
          },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.post) {
          setPosts((prev) => [data.post, ...prev])
          setNoteInput('')
        }
      }
    } finally {
      setIsPosting(false)
    }
  }

  const activeMoodObj = selectedMood !== 'all' ? MOOD_OPTIONS.find((m) => m.value === selectedMood) : null

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="text-center mb-8 animate-swish-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Users className="w-3.5 h-3.5 text-pink-400" />
          The Vibe Collective
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Mood Community
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          See what people feeling your exact mood are wearing, eating, and watching today.
        </p>
      </div>

      {/* ── Mood Filter Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedMood('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedMood === 'all'
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
          }`}
        >
          ⚡ All Moods
        </button>

        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMood === mood.value
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 border border-violet-400/40'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
            }`}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      {/* ── Mood Pulse Announcement Banner ──────────────────────── */}
      {activeMoodObj && (
        <div className="p-4 rounded-2xl glass-panel-glow mb-6 flex items-center justify-between animate-swish-up">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeMoodObj.emoji}</span>
            <div>
              <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Current Frequency • {activeMoodObj.label} Mood
              </div>
              <div className="text-sm font-semibold text-zinc-200">
                &ldquo;{activeMoodObj.tagline}&rdquo;
              </div>
            </div>
          </div>
          <Link
            href="/check-in"
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all shadow-md"
          >
            Sync My Vibe →
          </Link>
        </div>
      )}

      {/* ── Quick Vibe Note Composer ────────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-8 animate-swish-up">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white">
            Drop Your Vibe In The Feed
          </h2>
        </div>

        <form onSubmit={handleDropVibe} className="space-y-3">
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <input
              type="text"
              placeholder="Your handle (e.g. @riley)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full sm:w-1/3 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {MOOD_OPTIONS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setPostingMood(m.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border transition-all ${
                    postingMood === m.value
                      ? 'border-violet-500 bg-violet-950/60 text-white'
                      : 'border-white/5 bg-black/30 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span className="hidden xs:inline">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What are you wearing, eating, or watching today?..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              maxLength={160}
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isPosting || !noteInput.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-40 font-bold text-sm text-white flex items-center gap-1.5 shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Community Feed Stream ───────────────────────────────── */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-4xl animate-bounce mb-2">⚡</div>
            <p className="text-sm font-semibold">Tuning into community frequencies...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl">
            <div className="text-4xl mb-3">🛸</div>
            <p className="text-white font-bold mb-1">No vibes posted for this mood yet</p>
            <p className="text-xs text-zinc-400 mb-4">Be the first to drop your aesthetic in this channel!</p>
            <button
              onClick={() => setSelectedMood('all')}
              className="px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white"
            >
              View all moods
            </button>
          </div>
        ) : (
          posts.map((post) => {
            const moodMeta = MOOD_OPTIONS.find((m) => m.value === post.mood) || MOOD_OPTIONS[3]
            const reacted = reactedPosts[post.id]

            return (
              <article
                key={post.id}
                className="glass-panel rounded-3xl p-5 sm:p-6 card-swish-hover border border-white/5 transition-all"
              >
                {/* User Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-sm">
                      {post.avatar_emoji || moodMeta.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          @{post.username}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1">
                          <span>{moodMeta.emoji}</span>
                          <span>{moodMeta.label}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500">{post.date}</span>
                    </div>
                  </div>

                  <span className="text-xs text-zinc-500 hidden sm:inline">
                    {post.weather}
                  </span>
                </div>

                {/* Vibe Decisions Details */}
                <div className="space-y-2 mb-3 text-xs sm:text-sm text-zinc-300 bg-black/25 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-start gap-2">
                    <Shirt className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Wearing:</strong> {post.outfit}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Eating:</strong> {post.meal}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tv className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Watching:</strong> {post.watch}</span>
                  </div>
                </div>

                {/* User Note */}
                {post.note && (
                  <p className="text-xs sm:text-sm text-zinc-200 italic mb-4 pl-2 border-l-2 border-violet-500/50">
                    &ldquo;{post.note}&rdquo;
                  </p>
                )}

                {/* Reaction Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleReact(post.id, 'fire')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        reacted === 'fire'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>🔥</span>
                      <span>{post.reactions.fire}</span>
                    </button>

                    <button
                      onClick={() => handleReact(post.id, 'relatable')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        reacted === 'relatable'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>⚡️</span>
                      <span>{post.reactions.relatable}</span>
                    </button>

                    <button
                      onClick={() => handleReact(post.id, 'hug')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        reacted === 'hug'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>🫂</span>
                      <span>{post.reactions.hug}</span>
                    </button>

                    <button
                      onClick={() => handleReact(post.id, 'skull')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        reacted === 'skull'
                          ? 'bg-zinc-500/20 text-zinc-200 border border-zinc-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>💀</span>
                      <span>{post.reactions.skull}</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-zinc-500 font-semibold">
                    {post.likes} reactions
                  </span>
                </div>
              </article>
            )
          })
        )}
      </div>
    </main>
  )
}
