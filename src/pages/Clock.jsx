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

// --- Color palettes ---
const palettes = {
  'Amber Glow': {
    bg: [15, 14, 12],
    hands: [212, 165, 116],
    accent: [232, 196, 154],
    tick: [139, 105, 20],
    ring: [40, 35, 30],
    second: [200, 100, 20],
  },
  'Ocean Depths': {
    bg: [10, 22, 40],
    hands: [74, 144, 184],
    accent: [123, 192, 224],
    tick: [30, 58, 95],
    ring: [20, 35, 55],
    second: [100, 180, 230],
  },
  'Forest Mist': {
    bg: [15, 26, 15],
    hands: [107, 158, 107],
    accent: [143, 188, 143],
    tick: [45, 124, 74],
    ring: [25, 40, 25],
    second: [80, 160, 80],
  },
  'Ember Night': {
    bg: [26, 10, 10],
    hands: [205, 55, 0],
    accent: [255, 158, 0],
    tick: [139, 37, 0],
    ring: [40, 20, 15],
    second: [255, 100, 20],
  },
  'Lavender Dusk': {
    bg: [26, 16, 40],
    hands: [139, 112, 176],
    accent: [168, 144, 208],
    tick: [74, 48, 96],
    ring: [35, 25, 50],
    second: [180, 120, 220],
  },
  'Monochrome': {
    bg: [15, 15, 15],
    hands: [170, 170, 170],
    accent: [200, 200, 200],
    tick: [60, 60, 60],
    ring: [30, 30, 30],
    second: [220, 220, 220],
  },
}

// --- Analog Clock Component ---
function AnalogClock({ paletteName, size = 400, showSeconds = true, showNumbers = true }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const canvasH = canvas.height
    const cx = w / 2
    const cy = canvasH / 2
    const radius = Math.min(w, canvasH) / 2 - 20

    const pal = palettes[paletteName] || palettes['Amber Glow']

    // Background
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius + 20)
    bgGrad.addColorStop(0, rgbStr(lerpColor(pal.bg, [30, 28, 25], 0.3)))
    bgGrad.addColorStop(1, rgbStr(pal.bg))
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2)
    ctx.strokeStyle = rgbStr(pal.ring)
    ctx.lineWidth = 2
    ctx.stroke()

    // Clock face
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    const faceGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius)
    faceGrad.addColorStop(0, rgbStr(lerpColor(pal.bg, [50, 45, 40], 0.4)))
    faceGrad.addColorStop(1, rgbStr(pal.bg))
    ctx.fillStyle = faceGrad
    ctx.fill()

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
      ctx.stroke()

      // Numbers
      if (showNumbers) {
        const numR = radius * 0.72
        const nx = cx + Math.cos(angle) * numR
        const ny = cy + Math.sin(angle) * numR
        ctx.fillStyle = rgbStr(isMain ? pal.accent : pal.tick)
        ctx.font = `${isMain ? 28 : 20}px Georgia, serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(i === 0 ? '12' : i.toString(), nx, ny)
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
      ctx.strokeStyle = rgbStr(lerpColor(pal.tick, pal.bg, 0.5))
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Get time values
    const h = time.getHours() % 12
    const m = time.getMinutes()
    const s = time.getSeconds()
    const ms = time.getMilliseconds()

    const smoothS = s + ms / 1000
    const smoothM = m + smoothS / 60
    const smoothH = h + smoothM / 60

    // Hour hand
    const hAngle = (smoothH / 12) * Math.PI * 2 - Math.PI / 2
    const hLen = radius * 0.5
    const hWidth = 6
    drawHand(ctx, cx, cy, hAngle, hLen, hWidth, rgbStr(pal.hands))

    // Minute hand
    const mAngle = (smoothM / 60) * Math.PI * 2 - Math.PI / 2
    const mLen = radius * 0.72
    const mWidth = 4
    drawHand(ctx, cx, cy, mAngle, mLen, mWidth, rgbStr(pal.hands))

    // Second hand
    if (showSeconds) {
      const sAngle = (smoothS / 60) * Math.PI * 2 - Math.PI / 2
      const sLen = radius * 0.85
      const sTail = radius * 0.15

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
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
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
    ctx.fillStyle = rgbStr(pal.bg)
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
      className="rounded-full shadow-2xl"
    />
  )
}

function drawHand(ctx, cx, cy, angle, length, width, color) {
  const x = cx + Math.cos(angle) * length
  const y = cy + Math.sin(angle) * length
  const perpAngle = angle + Math.PI / 2

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
}

// --- Digital Clock Component ---
function DigitalClock({ paletteName, size = 400 }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const pal = palettes[paletteName] || palettes['Amber Glow']

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM'
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const digitWidth = size * 0.12
  const digitHeight = size * 0.22
  const gap = size * 0.02

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Date */}
      <p
        className="mb-8 text-center"
        style={{
          color: rgbStr(pal.tick),
          fontSize: size * 0.035,
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.15em',
        }}
      >
        {dateStr}
      </p>

      {/* Time display */}
      <div className="flex items-center">
        {/* Hours */}
        <div className="flex">
          {hours.split('').map((d, i) => (
            <div
              key={`h-${i}`}
              className="flex items-center justify-center"
              style={{ width: digitWidth, height: digitHeight }}
            >
              <SevenSegmentDigit value={d} color={pal.hands} size={digitWidth} />
            </div>
          ))}
        </div>

        {/* Colon */}
        <div
          className="flex flex-col items-center justify-center mx-1"
          style={{ height: digitHeight }}
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width: size * 0.02,
              height: size * 0.02,
              backgroundColor: rgbStr(pal.accent),
              marginBottom: size * 0.06,
            }}
          />
          <div
            className="rounded-full animate-pulse"
            style={{
              width: size * 0.02,
              height: size * 0.02,
              backgroundColor: rgbStr(pal.accent),
              marginTop: size * 0.06,
            }}
          />
        </div>

        {/* Minutes */}
        <div className="flex">
          {minutes.split('').map((d, i) => (
            <div
              key={`m-${i}`}
              className="flex items-center justify-center"
              style={{ width: digitWidth, height: digitHeight }}
            >
              <SevenSegmentDigit value={d} color={pal.hands} size={digitWidth} />
            </div>
          ))}
        </div>

        {/* Colon */}
        <div
          className="flex flex-col items-center justify-center mx-1"
          style={{ height: digitHeight }}
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width: size * 0.02,
              height: size * 0.02,
              backgroundColor: rgbStr(pal.accent),
              marginBottom: size * 0.06,
            }}
          />
          <div
            className="rounded-full animate-pulse"
            style={{
              width: size * 0.02,
              height: size * 0.02,
              backgroundColor: rgbStr(pal.accent),
              marginTop: size * 0.06,
            }}
          />
        </div>

        {/* Seconds */}
        <div className="flex">
          {seconds.split('').map((d, i) => (
            <div
              key={`s-${i}`}
              className="flex items-center justify-center"
              style={{ width: digitWidth * 0.8, height: digitHeight }}
            >
              <SevenSegmentDigit value={d} color={pal.second} size={digitWidth * 0.8} />
            </div>
          ))}
        </div>

        {/* AM/PM */}
        <div
          className="flex items-center ml-4"
          style={{ fontSize: size * 0.05 }}
        >
          <span style={{ color: rgbStr(pal.accent), fontFamily: 'Georgia, serif' }}>
            {ampm}
          </span>
        </div>
      </div>
    </div>
  )
}

// --- Seven Segment Display ---
function SevenSegmentDigit({ value, color, size }) {
  const w = size
  const h = size * 1.8
  const segW = w * 0.2
  const segH = h * 0.08
  const gap = w * 0.15

  const segments = {
    '0': [1, 1, 1, 1, 1, 1, 0],
    '1': [0, 1, 1, 0, 0, 0, 0],
    '2': [1, 1, 0, 1, 1, 0, 1],
    '3': [1, 1, 1, 1, 0, 0, 1],
    '4': [0, 1, 1, 0, 0, 1, 1],
    '5': [1, 0, 1, 1, 0, 1, 1],
    '6': [1, 0, 1, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
    '-': [0, 0, 0, 0, 0, 0, 1],
    ' ': [0, 0, 0, 0, 0, 0, 0],
  }

  const active = segments[value] || segments[' ']

  const segs = [
    // Top
    { x: gap, y: 0, w: w - gap * 2, h: segH },
    // Top-left
    { x: 0, y: segH, w: segW, h: h * 0.3 - segH },
    // Top-right
    { x: w - segW, y: segH, w: segW, h: h * 0.3 - segH },
    // Middle
    { x: gap, y: h * 0.35, w: w - gap * 2, h: segH },
    // Bottom-left
    { x: 0, y: h * 0.65, w: segW, h: h * 0.3 - segH * 2 },
    // Bottom-right
    { x: w - segW, y: h * 0.65, w: segW, h: h * 0.3 - segH * 2 },
    // Bottom
    { x: gap, y: h - segH, w: w - gap * 2, h: segH },
  ]

  return (
    <svg width={w} height={h} className="overflow-visible">
      {segs.map((seg, i) => (
        <rect
          key={i}
          x={seg.x}
          y={seg.y}
          width={seg.w}
          height={seg.h}
          rx={seg.h / 2}
          fill={active[i] ? rgbStr(color) : 'transparent'}
          opacity={active[i] ? 0.9 : 0.05}
        />
      ))}
    </svg>
  )
}

// --- World Clock Component ---
function WorldClock({ paletteName, size = 400 }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const cities = [
    { name: 'New York', tz: 'America/New_York', offset: -5 },
    { name: 'London', tz: 'Europe/London', offset: 0 },
    { name: 'Tokyo', tz: 'Asia/Tokyo', offset: 9 },
    { name: 'Sydney', tz: 'Australia/Sydney', offset: 11 },
  ]

  const pal = palettes[paletteName] || palettes['Amber Glow']

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="grid grid-cols-2 gap-8 w-full px-8">
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
                radius={size * 0.12}
              />
              <p
                className="mt-3"
                style={{
                  color: isNight ? rgbStr(lerpColor(pal.tick, [10, 10, 30], 0.5)) : rgbStr(pal.accent),
                  fontSize: size * 0.035,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {city.name}
              </p>
              <p
                className="font-mono"
                style={{
                  color: isNight ? rgbStr(lerpColor(pal.hands, [10, 10, 30], 0.3)) : rgbStr(pal.hands),
                  fontSize: size * 0.04,
                }}
              >
                {displayH.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')} {ampm}
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
    ctx.fillStyle = isNight ? 'rgba(10,10,30,0.5)' : rgbStr(lerpColor(pal.bg, [40, 35, 30], 0.3))
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
      ctx.strokeStyle = rgbStr(i % 3 === 0 ? pal.tick : lerpColor(pal.tick, pal.bg, 0.5))
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.5
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

  const pal = palettes[paletteName] || palettes['Amber Glow']

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
            stroke={rgbStr(lerpColor(pal.ring, pal.bg, 0.5))}
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
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: '2.5rem',
            color: rgbStr(pal.accent),
            fontFamily: 'Georgia, serif',
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
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [40, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [20, 20, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [60, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [60, 50, 40], 0.3))}`,
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
            backgroundColor: rgbStr(lerpColor(pal.tick, [20, 20, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.tick, [40, 40, 40], 0.3))}`,
          }}
        >
          Lap
        </button>
        <button
          onClick={() => { setRunning(false); setElapsed(0); setLaps([]) }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.ring, [20, 20, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [40, 40, 40], 0.3))}`,
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
                borderColor: rgbStr(lerpColor(pal.ring, [30, 30, 30], 0.3)),
                color: rgbStr(lerpColor(pal.tick, [40, 40, 40], 0.5)),
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

  const pal = palettes[paletteName] || palettes['Amber Glow']

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
            stroke={rgbStr(lerpColor(pal.ring, pal.bg, 0.5))}
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
            style={{ transition: 'stroke-dashoffset 1s linear' }}
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
                backgroundColor: duration === dur ? rgbStr(lerpColor(pal.hands, [20, 20, 20], 0.4)) : rgbStr(lerpColor(pal.ring, [20, 20, 20], 0.3)),
                color: duration === dur ? rgbStr(pal.accent) : rgbStr(pal.tick),
                border: `1px solid ${rgbStr(lerpColor(pal.ring, [40, 40, 40], 0.3))}`,
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
            className="w-32 bg-[#1a1917] border border-amber-900/40 rounded px-3 py-2 text-amber-300 text-sm font-mono focus:outline-none focus:border-amber-700 text-center"
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
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [40, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [20, 20, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [60, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [60, 50, 40], 0.3))}`,
          }}
        >
          {running ? 'Pause' : finished ? 'Restart' : 'Start'}
        </button>
        <button
          onClick={() => { setRunning(false); setRemaining(duration); setFinished(false) }}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: rgbStr(lerpColor(pal.ring, [20, 20, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [40, 40, 40], 0.3))}`,
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
  const [phase, setPhase] = useState('work') // work, shortBreak, longBreak
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const pal = palettes[paletteName] || palettes['Amber Glow']

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
              backgroundColor: phase === key ? rgbStr(lerpColor(pal.hands, [20, 20, 20], 0.4)) : rgbStr(lerpColor(pal.ring, [20, 20, 20], 0.3)),
              color: phase === key ? rgbStr(pal.accent) : rgbStr(pal.tick),
              border: `1px solid ${rgbStr(lerpColor(pal.ring, [40, 40, 40], 0.3))}`,
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
            stroke={rgbStr(lerpColor(pal.ring, pal.bg, 0.5))}
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
            style={{ transition: 'stroke-dashoffset 1s linear' }}
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
              fontFamily: 'Georgia, serif',
            }}
          >
            {phaseLabels[phase]}
          </p>
          <div
            className="font-mono"
            style={{
              fontSize: '3.5rem',
              color: rgbStr(pal.hands),
            }}
          >
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      {/* Sessions */}
      <p
        className="mb-6 text-sm"
        style={{ color: rgbStr(pal.tick), fontFamily: 'Georgia, serif' }}
      >
        Sessions completed: {sessions}
      </p>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
          style={{
            backgroundColor: running ? rgbStr(lerpColor(pal.second, [40, 10, 10], 0.3)) : rgbStr(lerpColor(pal.hands, [20, 20, 20], 0.4)),
            color: running ? rgbStr(pal.second) : rgbStr(pal.accent),
            border: `1px solid ${running ? rgbStr(lerpColor(pal.second, [60, 20, 10], 0.3)) : rgbStr(lerpColor(pal.accent, [60, 50, 40], 0.3))}`,
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
            backgroundColor: rgbStr(lerpColor(pal.ring, [20, 20, 20], 0.3)),
            color: rgbStr(pal.tick),
            border: `1px solid ${rgbStr(lerpColor(pal.ring, [40, 40, 40], 0.3))}`,
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
  const [paletteName, setPaletteName] = useState('Amber Glow')
  const [showSeconds, setShowSeconds] = useState(true)
  const [showNumbers, setShowNumbers] = useState(true)

  const pal = palettes[paletteName] || palettes['Amber Glow']

  const modes = [
    { id: 'analog', name: 'Analog' },
    { id: 'digital', name: 'Digital' },
    { id: 'world', name: 'World' },
    { id: 'stopwatch', name: 'Stopwatch' },
    { id: 'timer', name: 'Timer' },
    { id: 'pomodoro', name: 'Pomodoro' },
  ]

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-amber-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-amber-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-amber-800 hover:text-amber-500 transition-colors text-xs tracking-widest uppercase font-mono">
              ← Back to Launcher
            </a>
            <div className="h-6 w-px bg-amber-900/40"></div>
            <h1 className="text-2xl font-light tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Chronos
            </h1>
            <p className="text-amber-700 text-xs">Time & Timing</p>
          </div>

          {/* Palette selector */}
          <div className="flex items-center gap-2">
            {Object.entries(palettes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => setPaletteName(name)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  paletteName === name ? 'border-amber-400 scale-110' : 'border-transparent hover:border-amber-700/50'
                }`}
                style={{ backgroundColor: colors.hands.join(',') }}
                title={name}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-3 text-xs tracking-wider uppercase transition-colors border-b-2 ${
                  mode === m.id
                    ? 'border-amber-500 text-amber-300'
                    : 'border-transparent text-amber-700 hover:text-amber-500'
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
                    showSeconds ? 'bg-amber-900/40 text-amber-300' : 'text-amber-700 hover:text-amber-500'
                  }`}
                >
                  Seconds
                </button>
                <button
                  onClick={() => setShowNumbers(!showNumbers)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                    showNumbers ? 'bg-amber-900/40 text-amber-300' : 'text-amber-700 hover:text-amber-500'
                  }`}
                >
                  Numbers
                </button>
              </div>
            </>
          )}

          {mode === 'digital' && (
            <DigitalClock paletteName={paletteName} size={500} />
          )}

          {mode === 'world' && (
            <WorldClock paletteName={paletteName} size={500} />
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
