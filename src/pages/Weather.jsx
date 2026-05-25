import { useState, useEffect, useCallback } from 'react'

function StarField() {
  const [stars] = useState(() =>
    Array.from({ length: 100 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  )

  const [gridLines] = useState(() =>
    Array.from({ length: 20 }, (_, i) => i)
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5">
        {gridLines.map(i => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 bg-indigo-400"
            style={{ left: `${i * 5}%`, width: 1 }}
          />
        ))}
        {gridLines.map(i => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 bg-indigo-400"
            style={{ top: `${i * 5}%`, height: 1 }}
          />
        ))}
      </div>

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting star */}
      <div
        className="absolute h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"
        style={{
          width: 100,
          top: '20%',
          left: '-100px',
          animation: 'shootingStar 8s linear infinite',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"
        style={{
          width: 80,
          top: '40%',
          left: '-80px',
          animation: 'shootingStar 12s linear infinite',
          animationDelay: '6s',
        }}
      />
      <div
        className="absolute h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"
        style={{
          width: 120,
          top: '60%',
          left: '-120px',
          animation: 'shootingStar 10s linear infinite',
          animationDelay: '10s',
        }}
      />
    </div>
  )
}

function Weather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState({ lat: 51.5074, lon: -0.1278, name: 'London' })
  const [searching, setSearching] = useState(false)

  const fetchWeather = useCallback(async (lat, lon, name) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
      )
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setWeather(data)
      setLocation({ lat, lon, name })
    } catch {
      setError('Could not fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(location.lat, location.lon, location.name)
  }, [fetchWeather])

  const handleSearch = async (e) => {
    e.preventDefault()
    const query = e.target.search.value.trim()
    if (!query) return
    setSearching(true)
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en`
      )
      const geoData = await geoRes.json()
      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found')
        setSearching(false)
        return
      }
      const { latitude, longitude, name } = geoData.results[0]
      fetchWeather(latitude, longitude, name)
    } catch {
      setError('Search failed')
    }
    setSearching(false)
  }

  const getWeatherIcon = (code) => {
    if (code === 0) return '◐'
    if (code <= 3) return '◇'
    if (code <= 48) return '◎'
    if (code <= 57) return '•'
    if (code <= 67) return '·'
    if (code <= 77) return '❄'
    if (code <= 82) return '•'
    if (code <= 86) return '❄'
    if (code <= 99) return '✦'
    return '◈'
  }

  const getWeatherDesc = (code) => {
    const descs = {
      0: 'Clear sky',
      1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Rime fog',
      51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
      56: 'Freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
      66: 'Freezing rain', 67: 'Heavy freezing rain',
      71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
      83: 'Heavy showers', 84: 'Rain showers',
      85: 'Snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
    }
    return descs[code] || 'Unknown'
  }

  const isNight = false

  return (
    <div className="min-h-screen bg-[#050510] text-indigo-50 flex items-center justify-center px-6 py-12 relative">
      <StarField />

      <style>{`
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-15deg); opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 1; }
          20% { transform: translateX(calc(100vw + 200px)) translateY(100px) rotate(-15deg); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="max-w-xl w-full relative z-10">
        <header className="mb-12">
          <a
            href="/"
            className="text-indigo-800 hover:text-indigo-400 transition-colors text-xs tracking-widest uppercase font-mono-editorial"
          >
            ← Back to Launcher
          </a>
          <h1 className="text-4xl font-light tracking-tight text-indigo-100 mt-4 mb-2" style={{ fontFamily: 'system-ui' }}>
            Weather
          </h1>
          <p className="text-indigo-600 text-sm">
            Live data from Open-Meteo
          </p>
        </header>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-3">
            <input
              name="search"
              type="text"
              placeholder="Search city..."
              className="flex-1 bg-indigo-950/50 border border-indigo-900/40 rounded-lg px-4 py-3 text-indigo-200 placeholder-indigo-700 focus:outline-none focus:border-indigo-600/60 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-indigo-900 hover:bg-indigo-800 disabled:bg-indigo-950 text-indigo-200 rounded-lg text-sm tracking-wide transition-colors"
            >
              {searching ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-900/40 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-indigo-700 border-t-indigo-400 rounded-full animate-spin" />
            <p className="text-indigo-600 text-sm mt-4">Loading weather...</p>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Current weather */}
            <div className="p-6 bg-indigo-950/30 border border-indigo-900/40 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl text-indigo-100" style={{ fontFamily: 'system-ui' }}>{location.name}</h2>
                  <p className="text-indigo-600 text-xs mt-1">
                    {location.lat.toFixed(2)}°N, {Math.abs(location.lon).toFixed(2)}°{location.lon >= 0 ? 'E' : 'W'}
                  </p>
                </div>
                <span className="text-5xl text-indigo-300" style={{ filter: 'drop-shadow(0 0 8px rgba(165,180,252,0.3))' }}>
                  {getWeatherIcon(weather.current.weather_code)}
                </span>
              </div>
              <div className="h-px bg-indigo-900/40 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-indigo-600 text-xs uppercase tracking-wider mb-1">Temperature</p>
                  <p className="text-3xl text-indigo-200">{Math.round(weather.current.temperature_2m)}°C</p>
                  <p className="text-indigo-700 text-xs">Feels like {Math.round(weather.current.apparent_temperature)}°C</p>
                </div>
                <div>
                  <p className="text-indigo-600 text-xs uppercase tracking-wider mb-1">Conditions</p>
                  <p className="text-xl text-indigo-200">{getWeatherDesc(weather.current.weather_code)}</p>
                  <p className="text-indigo-700 text-xs mt-1">Humidity {weather.current.relative_humidity_2m}%</p>
                </div>
                <div>
                  <p className="text-indigo-600 text-xs uppercase tracking-wider mb-1">Wind</p>
                  <p className="text-xl text-indigo-200">{weather.current.wind_speed_10m} km/h</p>
                </div>
                <div>
                  <p className="text-indigo-600 text-xs uppercase tracking-wider mb-1">Location</p>
                  <p className="text-indigo-400 text-sm">{location.name}</p>
                </div>
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="p-6 bg-indigo-950/20 border border-indigo-900/30 rounded-lg">
              <h3 className="text-indigo-500 text-xs uppercase tracking-widest mb-4">7-Day Forecast</h3>
              <div className="space-y-3">
                {weather.daily.time.map((day, i) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-indigo-400 text-sm" style={{ fontFamily: 'monospace', minWidth: 80 }}>
                      {new Date(day).toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <span className="text-indigo-300 text-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(165,180,252,0.2))' }}>
                      {getWeatherIcon(weather.daily.weather_code[i])}
                    </span>
                    <span className="text-indigo-600 text-xs" style={{ fontFamily: 'monospace' }}>
                      {getWeatherDesc(weather.daily.weather_code[i])}
                    </span>
                    <span className="text-indigo-300 text-sm font-mono">
                      {Math.round(weather.daily.temperature_2m_max[i])}° / {Math.round(weather.daily.temperature_2m_min[i])}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Weather
