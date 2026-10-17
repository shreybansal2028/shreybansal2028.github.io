import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const outfit = searchParams.get('outfit') ?? 'Your outfit'
  const meal = searchParams.get('meal') ?? 'Your meal'
  const watch = searchParams.get('watch') ?? 'Your watch'
  const mood = searchParams.get('mood') ?? '😊'
  const moodEmojis: Record<string, string> = {
    dead: '😵', meh: '😐', okay: '🙂', good: '😊', great: '😄', chaotic: '🤪',
  }
  const emoji = moodEmojis[mood] ?? mood

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 50%, #0f0f0f 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: 48, marginRight: 16 }}>⚡</div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#a855f7' }}>VIBE CHECK</div>
            <div style={{ fontSize: 20, color: '#6b7280' }}>Today&apos;s decisions {emoji}</div>
          </div>
        </div>

        {/* Cards */}
        {[
          { label: '👕 WEAR', value: outfit, color: '#7c3aed' },
          { label: '🍜 EAT', value: meal, color: '#10b981' },
          { label: '📺 WATCH', value: watch, color: '#f59e0b' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${item.color}40`,
              borderRadius: 16,
              padding: '20px 28px',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 16, color: item.color, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
              {item.value}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 'auto', fontSize: 18, color: '#4b5563' }}>
          vibecheck.app • No scrolling. Just vibes.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
