'use client'

import { useState } from 'react'
import {
  BRAND_CONFIG,
  CATEGORY_INFO,
  ProductCategory,
  StoreBrand,
  StoreProduct,
  getFilteredStoreProducts,
} from '@/lib/storeCatalog'
import {
  X,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Globe,
  Tag,
  Search,
  Filter,
  Check,
  Copy,
  Layers,
} from 'lucide-react'

interface StoreModalProps {
  isOpen: boolean
  onClose: () => void
  initialBrand?: StoreBrand
  initialCategory?: ProductCategory
  aesthetic?: string
  topPiece?: string
  bottomPiece?: string
  directSearchUrl?: string
}

export function StoreModal({
  isOpen,
  onClose,
  initialBrand = 'Zara',
  initialCategory = 'All',
  aesthetic = 'Curated Streetwear',
  topPiece = '',
  bottomPiece = '',
  directSearchUrl,
}: StoreModalProps) {
  const [selectedBrand, setSelectedBrand] = useState<StoreBrand>(initialBrand)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  if (!isOpen) return null

  const brandData = BRAND_CONFIG[selectedBrand]
  const brandList: StoreBrand[] = ['Zara', 'H&M', 'Myntra', 'ASOS', 'Uniqlo', 'Snitch']
  const categoryList: ProductCategory[] = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessories']

  // Products filtered by selected brand and category
  const products = getFilteredStoreProducts({
    brand: selectedBrand,
    category: selectedCategory,
    search: searchQuery,
  })

  // Category counts for current brand
  const countsByCategory: Record<ProductCategory, number> = {
    All: getFilteredStoreProducts({ brand: selectedBrand, category: 'All' }).length,
    Top: getFilteredStoreProducts({ brand: selectedBrand, category: 'Top' }).length,
    Bottom: getFilteredStoreProducts({ brand: selectedBrand, category: 'Bottom' }).length,
    Outerwear: getFilteredStoreProducts({ brand: selectedBrand, category: 'Outerwear' }).length,
    Shoes: getFilteredStoreProducts({ brand: selectedBrand, category: 'Shoes' }).length,
    Accessories: getFilteredStoreProducts({ brand: selectedBrand, category: 'Accessories' }).length,
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  // Active category direct link on official brand store
  const officialCategoryUrl =
    selectedCategory !== 'All'
      ? brandData.categoryUrls[selectedCategory]
      : brandData.homeUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0f0f14] border border-white/10 shadow-2xl shadow-purple-950/40 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-zinc-950 via-zinc-900 to-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              {brandData.logoEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {brandData.name} Fashion Store
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
                  {brandData.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {brandData.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Selector Tabs */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto bg-black/40 no-scrollbar">
          {brandList.map((brand) => {
            const isCurrent = selectedBrand === brand
            const config = BRAND_CONFIG[brand]

            return (
              <button
                key={brand}
                onClick={() => {
                  setSelectedBrand(brand)
                  setSearchQuery('')
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-pink-500/25 scale-[1.02]'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{config.logoEmoji}</span>
                <span>{config.name}</span>
              </button>
            )
          })}
        </div>

        {/* Category Pill Navigation Bar */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between gap-3 bg-zinc-950/60 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {categoryList.map((cat) => {
              const info = CATEGORY_INFO[cat]
              const isSelected = selectedCategory === cat
              const count = countsByCategory[cat]

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{info.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-black/10 text-black font-black'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick in-modal search */}
          <div className="relative min-w-[160px] sm:min-w-[200px] hidden sm:block">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${brandData.name}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Products Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Official Direct Launch Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/50 via-pink-950/30 to-black border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-black text-pink-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5" />
                Live Official Store Access: {brandData.name}
              </div>
              <p className="text-xs text-zinc-300">
                Browsing: <strong className="text-white">{CATEGORY_INFO[selectedCategory].label}</strong>
                {topPiece && bottomPiece && (
                  <span className="text-zinc-400"> (matched to {topPiece} &amp; {bottomPiece})</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={officialCategoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all group"
              >
                <span>Visit {brandData.name} Online</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Showing {products.length} {brandData.name} {CATEGORY_INFO[selectedCategory].label}
              </span>
              <span className="text-[11px] text-zinc-500">
                In-Stock &amp; Ready to Order
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-3xl block mb-2">🛍️</span>
                <p className="text-sm font-bold text-white mb-1">
                  No items found matching your filter
                </p>
                <p className="text-xs text-zinc-400 mb-4">
                  Try switching categories or clear your search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-pink-500/40 overflow-hidden flex flex-col justify-between group transition-all duration-200 card-swish-hover"
                  >
                    {/* Image with Badges */}
                    <div className="h-52 w-full relative overflow-hidden bg-zinc-950">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider">
                          {product.category}
                        </span>
                        {product.discount && (
                          <span className="px-2 py-0.5 rounded-md bg-pink-600 text-[10px] font-black text-white uppercase">
                            {product.discount}
                          </span>
                        )}
                      </div>

                      {/* Rating pill */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <span>⭐</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Brand & Tags */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-pink-400 uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {product.inStock ? '🟢 In Stock' : '🔴 Low Stock'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-pink-300 transition-colors">
                          {product.title}
                        </h4>

                        {/* Specs (Material & Fit) */}
                        {(product.material || product.fit) && (
                          <div className="mb-3 space-y-0.5 text-[11px] text-zinc-400">
                            {product.material && (
                              <p className="truncate">🧶 {product.material}</p>
                            )}
                            {product.fit && (
                              <p className="truncate">📐 {product.fit}</p>
                            )}
                          </div>
                        )}

                        {/* Price Row */}
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

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                        <a
                          href={product.storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                        >
                          <span>Open on {product.brand}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleCopyLink(product.storeUrl)}
                          title="Copy direct product link"
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        >
                          {copiedUrl === product.storeUrl ? (
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
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span>⚡</span> Connected to Zara, H&amp;M, Myntra, ASOS, Uniqlo &amp; Snitch
            </span>
          </div>

          <a
            href="/stores"
            className="text-pink-400 hover:text-pink-300 font-bold transition-colors flex items-center gap-1"
          >
            <span>Open Dedicated Store Hub →</span>
          </a>
        </div>
      </div>
    </div>
  )
}
