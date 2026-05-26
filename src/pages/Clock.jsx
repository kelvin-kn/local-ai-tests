import { useState, useEffect, useRef, useCallback } from 'react'

// --- Utility ---
function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ]
}

function rgbStr(c) {
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

// --- Color palettes (deep space / cosmic theme) ---
const palettes = {
  'Deep Space': {
    bg: [8, 12, 24],
    surface: [14, 20, 40],
    hands: [100, 180, 255],
    accent: [140, 220, 255],
    tick: [50, 90, 140],
    ring: [25, 40, 70],
    second: [80, 200, 220],
    glow: [100, 180, 255],
    text: [180, 210, 240],
  },
  'Aurora': {
    bg: [6, 18, 14],
    surface: [10, 30, 25],
    hands: [80, 220, 160],
    accent: [120, 255, 180],
    tick: [40, 100, 80],
    ring: [20, 50, 40],
    second: [60, 210, 140],
    glow: [80, 220, 160],
    text: [160, 230, 200],
  },
  'Nebula': {
    bg: [14, 8, 24],
    surface: [20, 12, 38],
    hands: [160, 120, 255],
    accent: [200, 160, 255],
    tick: [70, 40, 120],
    ring: [35, 20, 60],
    second: [180, 100, 240],
    glow: [160, 120, 255],
    text: [200, 180, 240],
  },
  'Polar Night': {
    bg: [10, 10, 14],
    surface: [18, 18, 24],
    hands: [180, 190, 210],
    accent: [210, 220, 240],
    tick: [60, 65, 80],
    ring: [30, 32, 45],
    second: [160, 170, 200],
    glow: [180, 190, 210],
    text: [200, 210, 230],
  },
  'Crimson Void': {
    bg: [18, 6, 8],
    surface: [28, 10, 14],
    hands: [255, 100, 80],
    accent: [255, 140, 110],
    tick: [120, 30, 25],
    ring: [50, 15, 20],
    second: [255, 80, 60],
    glow: [255, 100, 80],
    text: [240, 180, 170],
  },
  'Glacier': {
    bg: [8, 14, 20],
    surface: [12, 22, 32],
    hands: [140, 200, 230],
    accent: [180, 230, 255],
    tick: [50, 90, 120],
    ring: [25, 45, 65],
    second: [100, 180, 220],
    glow: [140, 200, 230],
    text: [190, 220, 240],
  },
}

// --- Analog Clock Component ---
function AnalogClock({ paletteName, size = 400, showSeconds = true, showNumbers = true }) {
  const canvasRef = useRef(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50)
    return () => clearInterval(interval)
  }, [])

  const pal = palettes[paletteName] || palettes['Deep Space']

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const canvasH = canvas.height
    const cx = w / 2
    const cy = canvasH / 2
    const radius = Math.min(w, canvasH) / 2 - 20

    // Background with subtle glow
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius + 20)
    bgGrad.addColorStop(0, rgbStr(lerpColor(pal.surface, pal.glow, 0.05)))
    bgGrad.addColorStop(1, rgbStr(pal.bg))
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, canvasH)

    // Outer ring with glow
    ctx.shadowColor = rgbStr(pal.glow)
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2)
    ctx.strokeStyle = rgbStr(pal.ring)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Clock face
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    const faceGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius)
    faceGrad.addColorStop(0, rgbStr(lerpColor(pal.surface, pal.glow, 0.08)))
    faceGrad.addColorStop(1, rgbStr(pal.surface))
    ctx.fillStyle = faceGrad
    ctx.fill()
    ctx.strokeStyle = rgbStr(pal.ring)
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Hour markers and numbers
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
      const isMain = i % 3 === 0

      // Tick marks
      const innerR = radius * (isMain ? 0.82 : 0.88)
      const outerR = radius * 0.95
      const x1 = cx + Math.cos(angle) * innerR
      const y1 = cy + Math.sin(angle) * innerR
      const x2 = cx + Math.cos(angle) * outerR
      const y2 = cy + Math.sin(angle) * outerR

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = rgbStr(isMain ? pal.accent : pal.tick)
      ctx.lineWidth = isMain ? 3 : 1.5
      ctx.lineCap = 'round'
      ctx.stroke()

      // Numbers
      if (showNumbers) {
        const numR = radius * 0.72
        const nx = cx + Math.cos(angle) * numR
        const ny = cy + Math.sin(angle) * numR
        ctx.shadowColor = rgbStr(pal.glow)
        ctx.shadowBlur = isMain ? 8 : 0
        ctx.fillStyle = rgbStr(isMain ? pal.accent : pal.tick)
        ctx.font = `bold ${isMain ? 32 : 22}px system-ui, -apple-system, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(i === 0 ? '12' : i.toString(), nx, ny)
        ctx.shadowBlur = 0
      }
    }

    // Minute ticks
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2
      const innerR = radius * 0.92
      const outerR = radius * 0.95
      const x1 = cx + Math.cos(angle) * innerR
      const y1 = cy + Math.sin(angle) * innerR
      const x2 = cx + Math.cos(angle) * outerR
      const y2 = cy + Math.sin(angle) * outerR

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = rgbStr(lerpColor(pal.tick, pal.surface, 0.5))
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Get time values
    const hours = time.getHours() % 12
    const m = time.getMinutes()
    const s = time.getSeconds()
    const ms = time.getMilliseconds()

    const smoothS = s + ms / 1000
    const smoothM = m + smoothS / 60
    const smoothH = hours + smoothM / 60

    // Hour hand
    const hAngle = (smoothH / 12) * Math.PI * 2 - Math.PI / 2
    const hLen = radius * 0.5
    const hWidth = 6
    drawHand(ctx, cx, cy, hAngle, hLen, hWidth, rgbStr(pal.hands), 12)

    // Minute hand
    const mAngle = (smoothM / 60) * Math.PI * 2 - Math.PI / 2
    const mLen = radius * 0.72
    const mWidth = 4
    drawHand(ctx, cx, cy, mAngle, mLen, mWidth, rgbStr(pal.hands), 8)

    // Second hand
    if (showSeconds) {
      const sAngle = (smoothS / 60) * Math.PI * 2 - Math.PI / 2
      const sLen = radius * 0.85
      const sTail = radius * 0.15

      ctx.shadowColor = rgbStr(pal.second)
      ctx.shadowBlur = 10

      // Tail
      ctx.beginPath()
      ctx.moveTo(
        cx - Math.cos(sAngle) * sTail,
        cy - Math.sin(sAngle) * sTail
      )
      ctx.lineTo(
        cx + Math.cos(sAngle) * sLen * 0.3,
        cy + Math.sin(sAngle) * sLen * 0.3
      )
      ctx.strokeStyle = rgbStr(pal.second)
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.stroke()

      // Main
      ctx.beginPath()
      ctx.moveTo(
        cx + Math.cos(sAngle) * sLen * 0.15,
        cy + Math.sin(sAngle) * sLen * 0.15
      )
      ctx.lineTo(
        cx + Math.cos(sAngle) * sLen,
        cy + Math.sin(sAngle) * sLen
      )
      ctx.strokeStyle = rgbStr(pal.second)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()

      ctx.shadowBlur = 0

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = rgbStr(pal.second)
      ctx.fill()
    }

    // Center cap
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fillStyle = rgbStr(pal.accent)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fillStyle = rgbStr(pal.surface)
    ctx.fill()
  }, [time, paletteName, showSeconds, showNumbers])

  useEffect(() => {
    let frameId
    const animate = () => {
      draw()
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-full"
      style={{ filter: `drop-shadow(0 0 30px ${rgbStr(pal.glow)}33)` }}
    />
  )
}

function drawHand(ctx, cx, cy, angle, length, width, color, glowBlur) {
  const x = cx + Math.cos(angle) * length
  const y = cy + Math.sin(angle) * length
  const perpAngle = angle + Math.PI / 2

  ctx.shadowColor = color
  ctx.shadowBlur = glowBlur || 8

  ctx.beginPath()
  ctx.moveTo(
    cx + Math.cos(perpAngle) * width / 2,
    cy + Math.sin(perpAngle) * width / 2
  )
  ctx.lineTo(x, y)
  ctx.lineTo(
    cx - Math.cos(perpAngle) * width / 2,
    cy - Math.sin(perpAngle) * width / 2
  )
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  ctx.shadowBlur = 0
}

// --- Digital Clock Component ---
function DigitalClock({ paletteName, use24Hour }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 100)
    return () => clearInterval(interval)
  }, [])

  const pal = palettes[paletteName] || palettes['Deep Space']

  let displayH, displayM, displayS, ampmStr
  if (use24Hour) {
    displayH = time.getHours().toString().padStart(2, '0')
    displayM = time.getMinutes().toString().padStart(2, '0')
    displayS = time.getSeconds().toString().padStart(2, '0')
    ampmStr = ''
  } else {
    const h = time.getHours()
    displayH = (h % 12 || 12).toString().padStart(2, '0')
    displayM = time.getMinutes().toString().padStart(2, '0')
    displayS = time.getSeconds().toString().padStart(2, '0')
    ampmStr = h >= 12 ? 'PM' : 'AM'
  }

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Date */}
      <p
        className="mb-6 text-center"
        style={{
          color: rgbStr(pal.tick),
          fontSize: '1.1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        {dateStr}
      </p>

      {/* Time display */}
      <div
        className="flex items-center"
        style={{
          fontFamily: "'DS-DIGII', monospace",
        }}
      >
        {/* Hours */}
        <span
          className="inline-block"
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            color: rgbStr(pal.accent),
            textShadow: `0 0 20px ${rgbStr(pal.glow)}, 0 0 40px ${rgbStr(pal.glow)}66`,
            letterSpacing: '0.05em',
          }}
        >
          {displayH}
        </span>

        {/* Colon */}
        <span
          className="inline-block mx-1"
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            color: rgbStr(pal.accent),
            textShadow: `0 0 20px ${rgbStr(pal.glow)}`,
            animation: 'blink 1s step-end infinite',
          }}
        >
          :
        </span>

        {/* Minutes */}
        <span
          className="inline-block"
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            color: rgbStr(pal.accent),
            textShadow: `0 0 20px ${rgbStr(pal.glow)}, 0 0 40px ${rgbStr(pal.glow)}66`,
            letterSpacing: '0.05em',
          }}
        >
          {displayM}
        </span>

        {/* Colon */}
        <span
          className="inline-block mx-1"
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            color: rgbStr(pal.accent),
            textShadow: `0 0 20px ${rgbStr(pal.glow)}`,
            animation: 'blink 1s step-end infinite',
          }}
        >
          :
        </span>

        {/* Seconds */}
        <span
          className="inline-block"
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            color: rgbStr(pal.second),
            textShadow: `0 0 20px ${rgbStr(pal.second)}, 0 0 40px ${rgbStr(pal.second)}66`,
            letterSpacing: '0.05em',
          }}
        >
          {displayS}
        </span>

        {/* AM/PM */}
        {ampmStr && (
          <span
            className="inline-block ml-4 self-end mb-2"
            style={{
              fontSize: '2rem',
              color: rgbStr(pal.accent),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '600',
              textShadow: `0 0 10px ${rgbStr(pal.glow)}`,
            }}
          >
            {ampmStr}
          </span>
        )}
      </div>
    </div>
  )
}

// --- World Clock Component ---
function WorldClock({ paletteName, use24Hour }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const cities = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Nairobi', tz: 'Africa/Nairobi' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
  ]

  const pal = palettes[paletteName] || palettes['Deep Space']

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full max-w-5xl px-8">
        {cities.map(city => {
          const cityTime = new Date(time.toLocaleString('en-US', { timeZone: city.tz }))
          const h = cityTime.getHours()
          const m = cityTime.getMinutes()
          const s = cityTime.getSeconds()
          const ampm = h >= 12 ? 'PM' : 'AM'
          const displayH = h % 12 || 12
          const isNight = h < 6 || h >= 20

          return (
            <div key={city.name} className="flex flex-col items-center">
              {/* Mini analog clock */}
              <MiniAnalogClock
                hour={displayH}
                minute={m}
                second={s}
                isNight={isNight}
                pal={pal}
                radius={80}
              />
              <p
                className="mt-3"
                style={{
                  color: isNight ? rgbStr(lerpColor(pal.tick, [10, 10, 30], 0.5)) : rgbStr(pal.accent),
                  fontSize: '1.1rem',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.1em',
                }}
              >
                {city.name}
              </p>
              <p
                className="font-mono"
                style={{
                  color: isNight ? rgbStr(lerpColor(pal.hands, [10, 10, 30], 0.3)) : rgbStr(pal.hands),
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  textShadow: `0 0 8px ${rgbStr(pal.glow)}44`,
                }}
              >
                {use24Hour
                  ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                  : `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiniAnalogClock({ hour, minute, second, isNight, pal, radius }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2

    ctx.clearRect(0, 0, w, h)

    // Face
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = isNight ? 'rgba(10,10,30,0.5)' : rgbStr(lerpColor(pal.surface, [40, 35, 30], 0.3))
    ctx.fill()
    ctx.strokeStyle = rgbStr(pal.ring)
    ctx.lineWidth = 1
    ctx.stroke()

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
      const inner = radius * 0.85
      const outer = radius * 0.95
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner)
      ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer)
      ctx.strokeStyle = rgbStr(i % 3 === 0 ? pal.tick : lerpColor(pal.tick, pal.surface, 0.5))
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.5
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    // Hands
    const hAngle = ((hour % 12) + minute / 60) / 12 * Math.PI * 2 - Math.PI / 2
    const mAngle = (minute + second / 60) / 60 * Math.PI * 2 - Math.PI / 2

    const drawHand = (angle, len, width, color) => {
      const x = cx + Math.cos(angle) * len
      const y = cy + Math.sin(angle) * len
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x, y)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    drawHand(hAngle, radius * 0.5, 3, rgbStr(pal.hands))
    drawHand(mAngle, radius * 0.7, 2, rgbStr(pal.accent))
    drawHand(second / 60 * Math.PI * 2 - Math.PI / 2, radius * 0.8, 1, rgbStr(pal.second))

    // Center
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fillStyle = rgbStr(pal.accent)
    ctx.fill()
  }, [hour, minute, second, isNight, pal, radius])

  return (
    <canvas
      ref={canvasRef}
      width={radius * 2 + 4}
      height={radius * 2 + 4}
      className="rounded-full"
    />
  )
}

// --- Stopwatch Component ---
function Stopwatch({ paletteName }) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startTimeRef = useRef(0)
  const intervalRef = useRef(null)

  const pal = palettes[paletteName] || palettes['Deep Space']

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current)
      }, 10)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`
  }

  const formatTimeLong = (ms) => {
    const hours = Math.floor(ms / 3600000)
    const mins = Math.floor((ms % 3600000) / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)
    return `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}.${centis}s`
  }

  return (
    <div className="flex flex-col items-center">
      {/* Display */}
      <div
        className="mb-8 font-mono text-center"
        style={{
          fontSize: '4rem',
          color: rgbStr(pal.hands),
          letterSpacing: '0.05em',
          textShadow: `0 0 20px ${rgbStr(pal.glow)}66`,
        }}
      >
        {formatTime(elapsed)}
      </div>

      {/* Progress ring */}
      <div className="relative mb-8" style={{ width: 280, height: 280 }}>
        <svg width={280} height={280} className="transform -rotate-90">
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={rgbStr(lerpColor(pal.ring, pal.surface, 0.5))}
            strokeWidth={4}
          />
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={rgbStr(pal.second)}
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - (elapsed % 60000) / 60000)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 6px ${rgbStr(pal.glow)})` }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: '2.5rem',
            color: rgbStr(pal.accent),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600',
            textShadow: `0 0 10px ${rgbStr(pal.glow)}44`,
          }}
        >
          {formatTimeLong(elapsed)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRunning(!running)}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [20, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [10, 10, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [40, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [30, 30, 50], 0.3))}`,
          }}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            if (running || elapsed > 0) {
              setLaps([elapsed, ...laps])
            }
          }}
          disabled={!running && elapsed === 0}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors disabled:opacity-30"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.tick, [10, 10, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.tick, [30, 30, 50], 0.3))}`,
          }}
        >
          Lap
        </button>
        <button
          onClick={() => { setRunning(false); setElapsed(0); setLaps([]) }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.ring, [10, 10, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [30, 30, 50], 0.3))}`,
          }}
        >
          Reset
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div
          className="w-full max-w-md overflow-y-auto"
          style={{ maxHeight: 200 }}
        >
          {laps.map((lap, i) => (
            <div
              key={i}
              className="flex justify-between py-2 px-4 border-b"
              style={{
                borderColor: rgbStr(lerpColor(pal.ring, [20, 20, 40], 0.3)),
                color: rgbStr(lerpColor(pal.tick, [30, 30, 50], 0.5)),
                fontFamily: 'monospace',
              }}
            >
              <span>Lap {laps.length - i}</span>
              <span>{formatTimeLong(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Timer Component ---
function Timer({ paletteName }) {
  const [duration, setDuration] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  const pal = palettes[paletteName] || palettes['Deep Space']

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false)
            setFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? remaining / duration : 0

  return (
    <div className="flex flex-col items-center">
      {/* Progress ring */}
      <div className="relative mb-8" style={{ width: 280, height: 280 }}>
        <svg width={280} height={280} className="transform -rotate-90">
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={rgbStr(lerpColor(pal.ring, pal.surface, 0.5))}
            strokeWidth={4}
          />
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={finished ? rgbStr(pal.second) : rgbStr(pal.hands)}
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear', filter: finished ? `drop-shadow(0 0 10px ${rgbStr(pal.glow)})` : 'none' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div
            className={finished ? 'animate-pulse' : ''}
            style={{
              fontSize: '3.5rem',
              color: finished ? rgbStr(pal.second) : rgbStr(pal.hands),
              fontFamily: 'monospace',
              textShadow: `0 0 15px ${rgbStr(pal.glow)}66`,
            }}
          >
            {formatTime(remaining)}
          </div>
          {finished && (
            <p
              className="mt-2 animate-pulse"
              style={{ color: rgbStr(pal.second), fontSize: '1.2rem' }}
            >
              Time's up!
            </p>
          )}
        </div>
      </div>

      {/* Duration selector */}
      {!running && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[60, 180, 300, 600, 900, 1800].map(dur => (
            <button
              key={dur}
              onClick={() => {
                setDuration(dur)
                setRemaining(dur)
                setFinished(false)
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                duration === dur ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: duration === dur ? rgbStr(lerpColor(pal.hands, [10, 10, 20], 0.4)) : rgbStr(lerpColor(pal.ring, [10, 10, 20], 0.3)),
                color: duration === dur ? rgbStr(pal.accent) : rgbStr(pal.tick),
                border: `1px solid ${rgbStr(lerpColor(pal.ring, [30, 30, 50], 0.3))}`,
              }}
            >
              {dur >= 60 ? `${dur / 60}m` : `${dur}s`}
            </button>
          ))}
        </div>
      )}

      {/* Custom duration */}
      {!running && (
        <div className="flex gap-2 mb-6">
          <input
            type="number"
            min="1"
            max="9999"
            placeholder="Seconds"
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (val > 0) {
                setDuration(val)
                setRemaining(val)
                setFinished(false)
              }
            }}
            className="w-32 bg-[#0a0a1a] border border-cyan-900/40 rounded px-3 py-2 text-cyan-300 text-sm font-mono focus:outline-none focus:border-cyan-700 text-center"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            if (finished) {
              setRemaining(duration)
              setFinished(false)
            }
            setRunning(!running)
          }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [20, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [10, 10, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [40, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [30, 30, 50], 0.3))}`,
          }}
        >
          {running ? 'Pause' : finished ? 'Restart' : 'Start'}
        </button>
        <button
          onClick={() => { setRunning(false); setRemaining(duration); setFinished(false) }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.ring, [10, 10, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [30, 30, 50], 0.3))}`,
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// --- Pomodoro Timer ---
function Pomodoro({ paletteName }) {
  const [phase, setPhase] = useState('work')
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const pal = palettes[paletteName] || palettes['Deep Space']

  const phaseDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  }

  const phaseLabels = {
    work: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  }

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => prev - 1)
      }, 1000)
    } else if (remaining === 0 && running) {
      setRunning(false)
      if (phase === 'work') {
        setSessions(s => s + 1)
        setPhase('shortBreak')
        setRemaining(5 * 60)
      } else {
        setPhase('work')
        setRemaining(25 * 60)
      }
    }
    return () => clearInterval(intervalRef.current)
  }, [running, remaining, phase])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = phaseDurations[phase] > 0 ? remaining / phaseDurations[phase] : 0

  const switchPhase = (newPhase) => {
    setPhase(newPhase)
    setRemaining(phaseDurations[newPhase])
    setRunning(false)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Phase indicator */}
      <div className="flex gap-2 mb-8">
        {Object.entries(phaseLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => switchPhase(key)}
            className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
              phase === key ? 'font-semibold' : ''
            }`}
            style={{
              backgroundColor: phase === key ? rgbStr(lerpColor(pal.hands, [10, 10, 20], 0.4)) : rgbStr(lerpColor(pal.ring, [10, 10, 20], 0.3)),
              color: phase === key ? rgbStr(pal.accent) : rgbStr(pal.tick),
              border: `1px solid ${rgbStr(lerpColor(pal.ring, [30, 30, 50], 0.3))}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative mb-8" style={{ width: 280, height: 280 }}>
        <svg width={280} height={280} className="transform -rotate-90">
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={rgbStr(lerpColor(pal.ring, pal.surface, 0.5))}
            strokeWidth={4}
          />
          <circle
            cx={140}
            cy={140}
            r={130}
            fill="none"
            stroke={phase === 'work' ? rgbStr(pal.second) : rgbStr(pal.accent)}
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${rgbStr(pal.glow)})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className="mb-2"
            style={{
              color: phase === 'work' ? rgbStr(pal.second) : rgbStr(pal.accent),
              fontSize: '0.9rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {phaseLabels[phase]}
          </p>
          <div
            className="font-mono"
            style={{
              fontSize: '3.5rem',
              color: rgbStr(pal.hands),
              textShadow: `0 0 15px ${rgbStr(pal.glow)}66`,
            }}
          >
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      {/* Sessions */}
      <p
        className="mb-6 text-sm"
        style={{ color: rgbStr(pal.tick), fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        Sessions completed: {sessions}
      </p>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [20, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [10, 10, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [40, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [30, 30, 50], 0.3))}`,
          }}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setPhase('work')
            setRemaining(25 * 60)
            setRunning(false)
          }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.ring, [10, 10, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [30, 30, 50], 0.3))}`,
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// --- Main Clock Component ---
function Clock() {
  const [mode, setMode] = useState('analog')
  const [paletteName, setPaletteName] = useState('Deep Space')
  const [showSeconds, setShowSeconds] = useState(true)
  const [showNumbers, setShowNumbers] = useState(true)
  const [use24Hour, setUse24Hour] = useState(false)

  const pal = palettes[paletteName] || palettes['Deep Space']

  const modes = [
    { id: 'analog', name: 'Analog' },
    { id: 'digital', name: 'Digital' },
    { id: 'world', name: 'World' },
    { id: 'stopwatch', name: 'Stopwatch' },
    { id: 'timer', name: 'Timer' },
    { id: 'pomodoro', name: 'Pomodoro' },
  ]

  return (
    <div className="min-h-screen bg-[#080c18] text-cyan-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-cyan-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-cyan-700 hover:text-cyan-400 transition-colors text-xs tracking-widest uppercase font-mono">
              ← Back to Launcher
            </a>
            <div className="h-6 w-px bg-cyan-900/40"></div>
            <h1 className="text-2xl font-light tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Chronos
            </h1>
            <p className="text-cyan-700 text-xs">Time & Timing</p>
          </div>

          {/* Palette selector */}
          <div className="flex items-center gap-2">
            {Object.entries(palettes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => setPaletteName(name)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  paletteName === name ? 'border-cyan-400 scale-110' : 'border-transparent hover:border-cyan-700/50'
                }`}
                style={{ backgroundColor: `rgb(${colors.hands.join(',')})` }}
                title={name}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="border-b border-cyan-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-3 text-xs tracking-wider uppercase transition-colors border-b-2 ${
                  mode === m.id
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-cyan-700 hover:text-cyan-500'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          {mode === 'analog' && (
            <>
              <AnalogClock
                paletteName={paletteName}
                size={400}
                showSeconds={showSeconds}
                showNumbers={showNumbers}
              />
              {/* Toggles */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowSeconds(!showSeconds)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                    showSeconds ? 'bg-cyan-900/40 text-cyan-300' : 'text-cyan-700 hover:text-cyan-500'
                  }`}
                >
                  Seconds
                </button>
                <button
                  onClick={() => setShowNumbers(!showNumbers)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                    showNumbers ? 'bg-cyan-900/40 text-cyan-300' : 'text-cyan-700 hover:text-cyan-500'
                  }`}
                >
                  Numbers
                </button>
              </div>
            </>
          )}

          {mode === 'digital' && (
            <div className="flex flex-col items-center">
              <DigitalClock paletteName={paletteName} use24Hour={use24Hour} />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setUse24Hour(!use24Hour)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                    use24Hour ? 'bg-cyan-900/40 text-cyan-300' : 'text-cyan-700 hover:text-cyan-500'
                  }`}
                >
                  {use24Hour ? '24H' : '12H'}
                </button>
              </div>
            </div>
          )}

          {mode === 'world' && (
            <div className="flex flex-col items-center">
              <WorldClock paletteName={paletteName} use24Hour={use24Hour} />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setUse24Hour(!use24Hour)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                    use24Hour ? 'bg-cyan-900/40 text-cyan-300' : 'text-cyan-700 hover:text-cyan-500'
                  }`}
                >
                  {use24Hour ? '24H' : '12H'}
                </button>
              </div>
            </div>
          )}

          {mode === 'stopwatch' && (
            <Stopwatch paletteName={paletteName} />
          )}

          {mode === 'timer' && (
            <Timer paletteName={paletteName} />
          )}

          {mode === 'pomodoro' && (
            <Pomodoro paletteName={paletteName} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Clock
