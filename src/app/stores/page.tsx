'use client'

import { useState } from 'react'
import {
  BRAND_CONFIG,
  CATEGORY_INFO,
  ProductCategory,
  StoreBrand,
  StoreProduct,
  getAllStoreProducts,
  getFilteredStoreProducts,
} from '@/lib/storeCatalog'
import {
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Globe,
  Tag,
  Search,
  Filter,
  Check,
  Copy,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import Link from 'next/link'

export default function StoresPage() {
  const [selectedBrand, setSelectedBrand] = useState<StoreBrand | 'All'>('All')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const brandKeys: StoreBrand[] = ['Zara', 'H&M', 'Myntra', 'ASOS', 'Uniqlo', 'Snitch']
  const categoryKeys: ProductCategory[] = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessories']

  let products = getFilteredStoreProducts({
    brand: selectedBrand,
    category: selectedCategory,
    search: searchQuery,
  })

  // Apply sorting
  if (sortBy === 'price-asc') {
    products = [...products].sort((a, b) => {
      const pa = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
      const pb = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
      return pa - pb
    })
  } else if (sortBy === 'price-desc') {
    products = [...products].sort((a, b) => {
      const pa = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
      const pb = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
      return pb - pa
    })
  } else if (sortBy === 'rating') {
    products = [...products].sort((a, b) => {
      const ra = parseFloat(a.rating) || 0
      const rb = parseFloat(b.rating) || 0
      return rb - ra
    })
  }

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="text-center mb-8 animate-swish-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
          <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
          Multi-Brand Wardrobe Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Integrated Fashion Stores
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Explore curated drops from <strong className="text-zinc-200">Zara, H&amp;M, Myntra, ASOS, Uniqlo, and Snitch</strong> with category-wise browsing and direct official checkout links.
        </p>
      </div>

      {/* ── Brand Selection Quick Row ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 animate-swish-up">
        {brandKeys.map((brandKey) => {
          const config = BRAND_CONFIG[brandKey]
          const isSelected = selectedBrand === brandKey

          return (
            <div
              key={brandKey}
              onClick={() => setSelectedBrand(selectedBrand === brandKey ? 'All' : brandKey)}
              className={`p-3.5 rounded-2xl cursor-pointer border transition-all card-swish-hover flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-violet-900/60 to-pink-900/40 border-pink-500 shadow-lg shadow-pink-500/20'
                  : 'bg-zinc-900/70 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{config.logoEmoji}</span>
                <a
                  href={config.homeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Open official ${config.name} website`}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm leading-tight flex items-center justify-between">
                  <span>{config.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-pink-400" />}
                </h3>
                <span className="text-[10px] text-pink-300 block mt-0.5 truncate font-medium">
                  {config.badge}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Category Pill Filter Navigation ─────────────────────── */}
      <div className="glass-panel rounded-2xl p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-swish-up">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categoryKeys.map((cat) => {
            const info = CATEGORY_INFO[cat]
            const isSelected = selectedCategory === cat

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            )
          })}
        </div>

        {/* Brand Clear / All Pill */}
        {selectedBrand !== 'All' && (
          <button
            onClick={() => setSelectedBrand('All')}
            className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 flex-shrink-0"
          >
            <span>Show all brands ({selectedBrand} filtered)</span>
            <span>✕</span>
          </button>
        )}
      </div>

      {/* ── Search & Sorting Bar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Zara shirts, H&M hoodies, ASOS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-zinc-400">
          <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
          >
            <option value="recommended">Featured / Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated ⭐</option>
          </select>
          <span className="text-zinc-500 text-[11px] ml-2">
            {products.length} Items Found
          </span>
        </div>
      </div>

      {/* ── Products Stream Grid ─────────────────────────────────── */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-white/5 animate-fade-in">
          <span className="text-4xl block mb-2">🛍️</span>
          <h3 className="text-lg font-bold text-white mb-1">
            No matching pieces found
          </h3>
          <p className="text-xs text-zinc-400 mb-4 max-w-sm mx-auto">
            Try resetting your search query or selecting a different brand or category.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('All')
              setSelectedCategory('All')
              setSearchQuery('')
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-swish-up">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-zinc-900/80 border border-white/10 hover:border-pink-500/40 overflow-hidden flex flex-col justify-between group card-swish-hover transition-all duration-200"
            >
              {/* Product Photo */}
              <div className="h-56 w-full relative overflow-hidden bg-zinc-950">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Brand Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  <span className="px-2.5 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[9px] font-bold text-white uppercase">
                    {product.category}
                  </span>
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-pink-600 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
                    {product.discount}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                    <span className="font-semibold text-pink-400">
                      {product.tags[0] || 'Curated Style'}
                    </span>
                    <span className="text-amber-300 font-bold flex items-center gap-0.5">
                      ⭐ {product.rating}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-pink-300 transition-colors leading-snug">
                    {product.title}
                  </h4>

                  {(product.material || product.fit) && (
                    <div className="mb-3 text-[10px] text-zinc-400 space-y-0.5">
                      {product.material && <p className="truncate">🧶 {product.material}</p>}
                      {product.fit && <p className="truncate">📐 {product.fit}</p>}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-black text-white">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Store Purchase / Launch Button */}
                <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                  <a
                    href={product.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Shop on {product.brand}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyLink(product.storeUrl, product.id)}
                    title="Copy direct link"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedId === product.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
