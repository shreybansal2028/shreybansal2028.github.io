'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { InventoryItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Category = 'closet' | 'fridge'

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Category>('closet')
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  const loadItems = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadItems() }, [loadItems])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim() || adding) return
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('inventory_items')
      .insert({ user_id: user.id, category: activeTab, name: newItem.trim(), active: true })
      .select()
      .single()
    if (data) setItems(prev => [data, ...prev])
    setNewItem('')
    setAdding(false)
  }

  const toggleItem = async (item: InventoryItem) => {
    const { data } = await supabase
      .from('inventory_items')
      .update({ active: !item.active })
      .eq('id', item.id)
      .select()
      .single()
    if (data) setItems(prev => prev.map(i => i.id === data.id ? data : i))
  }

  const deleteItem = async (id: string) => {
    await supabase.from('inventory_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const filtered = items.filter(i => i.category === activeTab)
  const activeCount = filtered.filter(i => i.active).length

  return (
    <div className="min-h-screen px-6 py-10 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Your Inventory</h1>
          <p className="text-zinc-500 text-sm">What the AI picks from</p>
        </div>
        <Link href="/check-in" className="text-violet-400 hover:text-violet-300 font-semibold text-sm">
          → Check In
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['closet', 'fridge'] as Category[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3 rounded-xl font-bold text-sm transition-colors capitalize',
              activeTab === tab
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            )}
          >
            {tab === 'closet' ? '👕 Closet' : '🥘 Fridge'}
          </button>
        ))}
      </div>

      {/* Add item */}
      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder={activeTab === 'closet' ? 'e.g. black hoodie' : 'e.g. eggs'}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none text-sm transition-colors"
          maxLength={60}
        />
        <button
          type="submit"
          disabled={adding || !newItem.trim()}
          className="px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold disabled:opacity-40 transition-colors"
        >
          +
        </button>
      </form>

      {/* Status */}
      <p className="text-xs text-zinc-600 mb-4">
        {activeCount} active · {filtered.length - activeCount} inactive
        {filtered.length > 10 && ` · AI samples up to 10 per check-in`}
      </p>

      {/* Items list */}
      {loading ? (
        <div className="text-center text-zinc-600 py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-zinc-600 py-12">
          <div className="text-4xl mb-3">{activeTab === 'closet' ? '👕' : '🥘'}</div>
          <p>No {activeTab} items yet.</p>
          <p className="text-sm mt-1">Add some above — the AI picks from these.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(item => (
            <li
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border transition-all',
                item.active
                  ? 'bg-zinc-900 border-zinc-700'
                  : 'bg-zinc-950 border-zinc-800 opacity-50'
              )}
            >
              <button
                onClick={() => toggleItem(item)}
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors',
                  item.active ? 'bg-violet-600 border-violet-600' : 'border-zinc-600'
                )}
              />
              <span className={cn('flex-1 text-sm', !item.active && 'line-through text-zinc-600')}>
                {item.name}
              </span>
              {item.last_used_at && (
                <span className="text-xs text-zinc-700">used {new Date(item.last_used_at).toLocaleDateString()}</span>
              )}
              <button
                onClick={() => deleteItem(item.id)}
                className="text-zinc-700 hover:text-red-400 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
