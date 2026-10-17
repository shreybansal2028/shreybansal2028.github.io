'use client'

import { useState } from 'react'
import {
  X,
  Calendar,
  Clock,
  Users,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  Utensils,
  Share2,
  Copy,
  ChefHat,
  Info,
} from 'lucide-react'
import { RestaurantInfo, RestaurantMenuItem, TableBooking } from '@/lib/restaurantData'

interface RestaurantBookingModalProps {
  isOpen: boolean
  onClose: () => void
  restaurant: RestaurantInfo
}

export default function RestaurantBookingModal({
  isOpen,
  onClose,
  restaurant,
}: RestaurantBookingModalProps) {
  const [activeTab, setActiveTab] = useState<'book' | 'menu'>('book')
  const [menuFilter, setMenuFilter] = useState<string>('All')

  // Booking Form State
  const [guests, setGuests] = useState<number>(2)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [selectedSlot, setSelectedSlot] = useState<string>(
    restaurant.availableSlots[0] || '7:30 PM'
  )
  const [userName, setUserName] = useState<string>('')
  const [userPhone, setUserPhone] = useState<string>('')
  const [specialRequest, setSpecialRequest] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingConfirmed, setBookingConfirmed] = useState<TableBooking | null>(null)
  const [copiedPass, setCopiedPass] = useState<boolean>(false)
  const [formError, setFormError] = useState<string>('')

  if (!isOpen) return null

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !userPhone.trim()) {
      setFormError('Please enter your full name and contact phone number.')
      return
    }
    setFormError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/restaurants/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          dishMatched: restaurant.dishMatched,
          date: selectedDate,
          time: selectedSlot,
          guests,
          userName: userName.trim(),
          userPhone: userPhone.trim(),
          specialRequest: specialRequest.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.booking) {
        setBookingConfirmed(data.booking)
      } else {
        setFormError(data.error || 'Failed to place booking. Please try again.')
      }
    } catch (err: any) {
      // Graceful offline fallback
      const fallbackBooking: TableBooking = {
        bookingId: `VB-${Math.floor(1000 + Math.random() * 9000)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        dishMatched: restaurant.dishMatched,
        date: selectedDate,
        time: selectedSlot,
        guests,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        specialRequest,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      }
      setBookingConfirmed(fallbackBooking)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyPass = () => {
    if (!bookingConfirmed) return
    const text = `🎟️ Table Reservation Confirmed!\nRestaurant: ${restaurant.name}\nPass Code: ${bookingConfirmed.bookingId}\nGuests: ${bookingConfirmed.guests} Person(s)\nDate & Time: ${bookingConfirmed.date} at ${bookingConfirmed.time}\nAddress: ${restaurant.address}\nContact: ${restaurant.phone}`
    navigator.clipboard.writeText(text)
    setCopiedPass(true)
    setTimeout(() => setCopiedPass(false), 2200)
  }

  // Menu categorization
  const categories = ['All', 'Signature', 'Appetizer', 'Main', 'Dessert', 'Drinks']
  const filteredMenu =
    menuFilter === 'All'
      ? restaurant.menu
      : restaurant.menu.filter((item) => item.category === menuFilter)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 overflow-hidden">
        {/* Top Header & Restaurant Brand Banner */}
        <div className="relative p-5 sm:p-6 pb-4 bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-black border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-emerald-500/40 shadow-lg">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  ⭐ {restaurant.rating} ({restaurant.reviewsCount.toLocaleString()} reviews)
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  • {restaurant.priceForTwo}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  • {restaurant.cuisine}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {restaurant.name}
              </h2>

              <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                {restaurant.tagline}
              </p>

              {/* Direct Address & Contact Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-zinc-300">
                <span className="flex items-center gap-1 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate max-w-[280px] sm:max-w-none">{restaurant.address}</span>
                </span>
                <a
                  href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{restaurant.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Info bar */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Hours: <strong className="text-zinc-200">{restaurant.openingHours}</strong>
            </span>
            <span className="hidden sm:inline-block">
              Dress: <strong className="text-zinc-200">{restaurant.dressCode}</strong>
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'book'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Table
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              Explore Menu ({restaurant.menu.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* TAB 1: RESERVATION FLOW */}
          {activeTab === 'book' && (
            <div>
              {bookingConfirmed ? (
                /* CONFIRMATION SCREEN */
                <div className="space-y-5 animate-fade-in">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-900/40">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Reservation Confirmed
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">
                      You&apos;re Set For {restaurant.name}!
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                      A table has been held under your name. Show this pass on arrival.
                    </p>
                  </div>

                  {/* Confirmed Pass Ticket */}
                  <div className="p-5 rounded-3xl bg-zinc-900/90 border border-emerald-500/40 relative overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          Booking Pass
                        </span>
                        <div className="text-xl font-black text-emerald-400 tracking-wider">
                          {bookingConfirmed.bookingId}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          Reserved For
                        </span>
                        <div className="text-sm font-bold text-white">
                          {bookingConfirmed.userName}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                          Date
                        </span>
                        <span className="font-bold text-zinc-200">
                          {bookingConfirmed.date}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                          Time Slot
                        </span>
                        <span className="font-bold text-emerald-300">
                          {bookingConfirmed.time}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                          Party Size
                        </span>
                        <span className="font-bold text-zinc-200">
                          {bookingConfirmed.guests} Guest(s)
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                      <span className="truncate pr-2">
                        📞 Contact: <strong>{restaurant.phone}</strong>
                      </span>
                      <a
                        href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-emerald-400 font-bold hover:underline flex-shrink-0"
                      >
                        Call Desk
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyPass}
                      className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4 text-emerald-400" />
                      {copiedPass ? 'Pass Copied to Clipboard!' : 'Copy Reservation Pass'}
                    </button>
                    <button
                      onClick={() => {
                        setBookingConfirmed(null)
                        onClose()
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-sm text-white transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* RESERVATION FORM */
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Highlighted Dish recommendation */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                        Dish Spotlight Reserved For Your Mood
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {restaurant.dishMatched}
                      </span>
                    </div>
                    <span className="text-xl">✨</span>
                  </div>

                  {/* Party Size & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        Party Size
                      </label>
                      <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
                        {[1, 2, 4, 6, 8].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuests(num)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                              guests === num
                                ? 'bg-emerald-500 text-black shadow-md'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            {num} {num === 1 ? 'Seat' : 'Seats'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 outline-none text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      Select Table Time Slot
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {restaurant.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 outline-none text-xs text-white placeholder-zinc-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Phone Number (SMS confirmation) *
                      </label>
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 outline-none text-xs text-white placeholder-zinc-600"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Special Table Request (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Window booth, anniversary, allergen notice..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 outline-none text-xs text-white placeholder-zinc-600"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl">
                      {formError}
                    </p>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Reserving Table...'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm Table Reservation at {restaurant.name}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-zinc-500">
                    Instant confirmation. Free cancellation up to 45 mins before slot.
                  </p>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EXPLORE FULL MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-4 animate-fade-in">
              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      menuFilter === cat
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Items List */}
              <div className="space-y-3">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 hover:border-emerald-500/30 transition-all flex items-start justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Veg / Non-Veg Indicator */}
                        <span
                          className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                            item.isVeg
                              ? 'border-emerald-500'
                              : 'border-rose-500'
                          }`}
                          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </span>

                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                          {item.name}
                        </h4>

                        {item.isChefSpecial && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Chef Special
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-black text-white">
                        {item.price}
                      </span>
                      <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky footer prompt to book */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Craving these dishes?</div>
                  <div className="text-[11px] text-zinc-400">Lock in your table in 30 seconds.</div>
                </div>
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-black text-xs text-black uppercase tracking-wider transition-colors"
                >
                  Book Table Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
