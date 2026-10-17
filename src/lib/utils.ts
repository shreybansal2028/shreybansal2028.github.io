import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Sample N items from array, prioritizing least-recently-used
export function sampleInventory<T extends { last_used_at: string | null }>(items: T[], n: number): T[] {
  const sorted = [...items].sort((a, b) => {
    if (!a.last_used_at) return -1
    if (!b.last_used_at) return 1
    return new Date(a.last_used_at).getTime() - new Date(b.last_used_at).getTime()
  })
  // Take top 2*n by LRU, then randomly pick n from those
  const pool = sorted.slice(0, Math.max(n * 2, sorted.length))
  return shuffleArray(pool).slice(0, n)
}
