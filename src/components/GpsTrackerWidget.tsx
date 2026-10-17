'use client'

import { useState, useEffect } from 'react'
import { WeatherData } from '@/lib/types'
import { getWeather, getWeatherForCity } from '@/lib/weather'
import {
  MapPin,
  Compass,
  RefreshCw,
  Search,
  Sparkles,
  ChevronDown,
  Navigation,
  Check,
} from 'lucide-react'

const QUICK_CITIES = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Goa',
  'New York',
  'London',
]

interface GpsTrackerWidgetProps {
  compact?: boolean
  className?: string
}

export function GpsTrackerWidget({ compact = false, className = '' }: GpsTrackerWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [trackingGps, setTrackingGps] = useState(false)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [searching, setSearching] = useState(false)

  // Initial load
  useEffect(() => {
    getWeather()
      .then((data) => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setWeather({
          temp: 24,
          condition: 'Clear Sky',
          icon: '☀️',
          location: 'Your Location',
          source: 'ip',
        })
        setLoading(false)
      })
  }, [])

  // Force re-scan live device GPS
  const handleScanGps = async () => {
    setTrackingGps(true)
    try {
      const fresh = await getWeather(true)
      setWeather(fresh)
    } finally {
      setTrackingGps(false)
    }
  }

  // Manually pick or search a city
  const handleSelectCity = async (cityName: string) => {
    setSearching(true)
    try {
      const cityWeather = await getWeatherForCity(cityName)
      setWeather(cityWeather)
      setShowCityPicker(false)
      setSearchCity('')
    } finally {
      setSearching(false)
    }
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 backdrop-blur-md ${className}`}>
        <span className="text-base">{loading ? '⏳' : weather?.icon}</span>
        <span className="font-bold text-white">
          {loading ? 'Detecting GPS...' : `${weather?.temp}°C`}
        </span>
        <span>•</span>
        <span className="truncate max-w-[140px] text-zinc-300">
          {weather?.location || 'Detecting...'}
        </span>
        <button
          onClick={handleScanGps}
          disabled={trackingGps}
          title="Refresh GPS Location"
          className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Navigation className={`w-3 h-3 ${trackingGps ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    )
  }

  return (
    <div className={`glass-panel-glow rounded-3xl p-5 border border-white/10 relative overflow-hidden text-left ${className}`}>
      {/* Background glow pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              LIVE GPS RADAR
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Synced with device sensors
            </span>
          </div>
        </div>

        {/* GPS Active Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{weather?.source === 'gps' ? 'GPS Locked' : 'Location Synced'}</span>
        </div>
      </div>

      {/* Main Location & Weather Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/5 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl drop-shadow-md">
            {loading ? '⏳' : weather?.icon}
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-black text-white">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-[260px]">
                {loading ? 'Detecting your city...' : weather?.location}
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              {loading ? 'Connecting satellite...' : `${weather?.condition} • ${weather?.temp}°C`}
              {weather?.accuracy && ` (±${weather.accuracy}m)`}
            </div>
          </div>
        </div>

        {/* Actions: Re-scan GPS or Change City */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScanGps}
            disabled={trackingGps}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${trackingGps ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{trackingGps ? 'Scanning...' : 'Ping GPS'}</span>
          </button>

          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 flex items-center gap-1 transition-all"
          >
            <span>Change</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable City Picker */}
      {showCityPicker && (
        <div className="pt-3 border-t border-white/10 animate-swish-up space-y-3">
          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchCity.trim()) handleSelectCity(searchCity.trim())
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search any town, neighborhood, or city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={searching || !searchCity.trim()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all disabled:opacity-40"
            >
              {searching ? 'Locating...' : 'Set'}
            </button>
          </form>

          {/* Quick city chips */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => handleSelectCity(c)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
