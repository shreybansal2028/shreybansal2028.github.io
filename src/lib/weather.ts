import { WeatherData } from './types'

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear Sky', icon: '☀️' },
  1: { condition: 'Mainly Clear', icon: '🌤️' },
  2: { condition: 'Partly Cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Icy Fog', icon: '🌫️' },
  51: { condition: 'Light Drizzle', icon: '🌦️' },
  53: { condition: 'Drizzle', icon: '🌦️' },
  55: { condition: 'Heavy Drizzle', icon: '🌧️' },
  61: { condition: 'Light Rain', icon: '🌧️' },
  63: { condition: 'Rain', icon: '🌧️' },
  65: { condition: 'Heavy Rain', icon: '🌧️' },
  71: { condition: 'Light Snow', icon: '🌨️' },
  73: { condition: 'Snow', icon: '❄️' },
  75: { condition: 'Heavy Snow', icon: '❄️' },
  80: { condition: 'Rain Showers', icon: '🌦️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
}

async function reverseGeocode(lat: number, lon: number): Promise<{ locationName: string; city: string; locality: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
    if (res.ok) {
      const data = await res.json()
      const locality = data.locality || data.city || ''
      const city = data.city || data.principalSubdivision || ''
      const stateOrCountry = data.principalSubdivision || data.countryName || ''

      const nameParts = [locality, city, stateOrCountry].filter(Boolean)
      const uniqueParts = Array.from(new Set(nameParts))

      const locationName = uniqueParts.slice(0, 2).join(', ') || `${lat.toFixed(2)}, ${lon.toFixed(2)}`
      return { locationName, city: data.city || locality, locality }
    }
  } catch {
    // Silently continue
  }
  return {
    locationName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    city: 'Local Area',
    locality: 'Nearby',
  }
}

export async function getWeatherByCoords(lat: number, lon: number, accuracy?: number, source: 'gps' | 'ip' | 'manual' = 'gps'): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&temperature_unit=celsius`
  const res = await fetch(url)
  const data = await res.json()
  const code = (data?.current?.weathercode as number) ?? 0
  const meta = WMO_CODES[code] ?? { condition: 'Clear Sky', icon: '🌤️' }

  const geo = await reverseGeocode(lat, lon)

  const weatherResult: WeatherData = {
    temp: Math.round(data?.current?.temperature_2m ?? 24),
    condition: meta.condition,
    icon: meta.icon,
    location: geo.locationName,
    city: geo.city,
    locality: geo.locality,
    latitude: lat,
    longitude: lon,
    accuracy: accuracy ? Math.round(accuracy) : undefined,
    source,
  }

  // Persist to localStorage for instant cross-page sync
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('user_weather_location', JSON.stringify(weatherResult))
    } catch {
      // Ignore
    }
  }

  return weatherResult
}

export async function getWeatherByIP(): Promise<WeatherData> {
  try {
    const geoRes = await fetch('https://ipapi.co/json/')
    if (geoRes.ok) {
      const geo = await geoRes.json()
      if (geo.latitude && geo.longitude) {
        return await getWeatherByCoords(geo.latitude, geo.longitude, undefined, 'ip')
      }
    }
  } catch {
    // Continue to fallback
  }

  return {
    temp: 24,
    condition: 'Partly Cloudy',
    icon: '⛅',
    location: 'Local Area',
    city: 'Local Area',
    source: 'ip',
  }
}

export async function getWeatherForCity(cityName: string): Promise<WeatherData> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    )
    if (res.ok) {
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        const place = data.results[0]
        const weather = await getWeatherByCoords(place.latitude, place.longitude, undefined, 'manual')
        const locationName = [place.name, place.admin1 || place.country].filter(Boolean).join(', ')
        return {
          ...weather,
          location: locationName,
          city: place.name,
          source: 'manual',
        }
      }
    }
  } catch {
    // Continue
  }
  return getWeather()
}

export async function getWeather(forceFreshGPS = false): Promise<WeatherData> {
  // Check cached location if not forced
  if (!forceFreshGPS && typeof window !== 'undefined') {
    const cached = localStorage.getItem('user_weather_location')
    if (cached) {
      try {
        const parsed: WeatherData = JSON.parse(cached)
        if (parsed.location && parsed.temp) {
          return parsed
        }
      } catch {
        // Continue
      }
    }
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      getWeatherByIP().then(resolve)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const w = await getWeatherByCoords(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy,
            'gps'
          )
          resolve(w)
        } catch {
          const fallback = await getWeatherByIP()
          resolve(fallback)
        }
      },
      async () => {
        // User denied or timeout — fallback to IP quietly
        try {
          const fallback = await getWeatherByIP()
          resolve(fallback)
        } catch {
          resolve({
            temp: 24,
            condition: 'Clear Sky',
            icon: '☀️',
            location: 'Your Location',
            source: 'ip',
          })
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: forceFreshGPS ? 0 : 300000,
      }
    )
  })
}
