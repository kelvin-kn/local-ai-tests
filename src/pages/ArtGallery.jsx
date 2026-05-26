import { useState, useEffect, useRef, useCallback } from 'react'

// --- Utility functions ---
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function noise2D(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x, y, seed) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const a = noise2D(ix, iy, seed)
  const b = noise2D(ix + 1, iy, seed)
  const c = noise2D(ix, iy + 1, seed)
  const d = noise2D(ix + 1, iy + 1, seed)
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

function fbm(x, y, seed, octaves = 4) {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency, seed + i * 100)
    amplitude *= 0.5
    frequency *= 2
  }
  return value
}

// --- Color palettes ---
const palettes = {
  'Amber Glow': ['#1a1410', '#d4a574', '#e8c49a', '#f5e6d3', '#8b6914', '#c49a6c'],
  'Ocean Depths': ['#0a1628', '#1e3a5f', '#2d5a87', '#4a90b8', '#7bc0e0', '#a8d8ea'],
  'Forest Mist': ['#0f1a0f', '#2d4a2d', '#4a7c4a', '#6b9e6b', '#8fbc8f', '#b0d4b0'],
  'Ember Night': ['#1a0a0a', '#8b2500', '#cd3700', '#e85d04', '#ff9e00', '#ffc300'],
  'Lavender Dusk': ['#1a1028', '#4a3060', '#6b5090', '#8b70b0', '#a890d0', '#c8b0e8'],
  'Monochrome': ['#0a0a0a', '#2a2a2a', '#4a4a4a', '#6a6a6a', '#8a8a8a', '#aaaaaa'],
}

// Dense ASCII character set: dark (dense) to light (sparse)
const asciiCharSets = {
  dense: '@%#*+=-:. ',
  medium: 'WMAO#*+csil;:.',
  light: '.:-=+*#%@',
  minimal: ' .:;+=*#%@',
}

// --- Image to color extraction ---
function extractColorsFromImage(img, numColors = 6) {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 100
  tempCanvas.height = 100
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(img, 0, 0, 100, 100)
  const imageData = tempCtx.getImageData(0, 0, 100, 100)
  const data = imageData.data

  // Sample pixels and quantize colors
  const colorMap = {}
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.floor(data[i] / 32) * 32
    const g = Math.floor(data[i + 1] / 32) * 32
    const b = Math.floor(data[i + 2] / 32) * 32
    const key = `${r},${g},${b}`
    colorMap[key] = (colorMap[key] || 0) + 1
  }

  const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1])
  const colors = []
  for (const [key] of sorted) {
    if (colors.length >= numColors) break
    const [r, g, b] = key.split(',').map(Number)
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    colors.push(hex)
  }

  // Ensure background color (darkest)
  if (colors.length < numColors) {
    colors.push('#0a0a0a')
  }
  return colors
}

// --- Art generation algorithms ---
function generateFlowField(canvas, seed, palette, imageData = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const rng = seededRandom(seed)

  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  const numParticles = 3000
  const stepSize = 2

  for (let p = 0; p < numParticles; p++) {
    let x = rng() * w
    let y = rng() * h
    const colorIdx = Math.floor(rng() * (palette.length - 1)) + 1

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = palette[colorIdx]
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3 + rng() * 0.4

    for (let i = 0; i < 200; i++) {
      const angle = fbm(x * 0.005, y * 0.005, seed) * Math.PI * 4
      x += Math.cos(angle) * stepSize
      y += Math.sin(angle) * stepSize

      if (x < 0 || x > w || y < 0 || y > h) break

      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }
  ctx.globalAlpha = 1
}

function generateVoronoi(canvas, seed, palette, imageData = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const rng = seededRandom(seed)

  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  const numPoints = 30
  const points = []

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: rng() * w,
      y: rng() * h,
      color: palette[Math.floor(rng() * (palette.length - 1)) + 1],
    })
  }

  const imageData2 = ctx.getImageData(0, 0, w, h)
  const data = imageData2.data

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      let minDist = Infinity
      let secondMin = Infinity
      let closestColor = palette[1]

      for (const point of points) {
        const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
        if (dist < minDist) {
          secondMin = minDist
          minDist = dist
          closestColor = point.color
        } else if (dist < secondMin) {
          secondMin = dist
        }
      }

      const edge = Math.abs(minDist - secondMin) < 2 ? 0.15 : 1
      const r = parseInt(closestColor.slice(1, 3), 16)
      const g = parseInt(closestColor.slice(3, 5), 16)
      const b = parseInt(closestColor.slice(5, 7), 16)

      for (let dy = 0; dy < 2 && y + dy < h; dy++) {
        for (let dx = 0; dx < 2 && x + dx < w; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4
          data[idx] = r * edge
          data[idx + 1] = g * edge
          data[idx + 2] = b * edge
          data[idx + 3] = 255
        }
      }
    }
  }

  ctx.putImageData(imageData2, 0, 0)
}

function generateGeometric(canvas, seed, palette, imageData = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const rng = seededRandom(seed)

  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  const numShapes = 50
  const cx = w / 2
  const cy = h / 2

  for (let i = 0; i < numShapes; i++) {
    const angle = (i / numShapes) * Math.PI * 2 + rng() * 0.5
    const radius = 50 + rng() * Math.min(w, h) * 0.4
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    const size = 20 + rng() * 80

    ctx.beginPath()
    const sides = Math.floor(3 + rng() * 4)
    for (let s = 0; s <= sides; s++) {
      const sa = (s / sides) * Math.PI * 2 + rng() * 0.3
      const sx = x + Math.cos(sa) * size
      const sy = y + Math.sin(sa) * size
      if (s === 0) ctx.moveTo(sx, sy)
      else ctx.lineTo(sx, sy)
    }
    ctx.closePath()

    const colorIdx = Math.floor(rng() * (palette.length - 1)) + 1
    ctx.fillStyle = palette[colorIdx] + '60'
    ctx.strokeStyle = palette[colorIdx]
    ctx.lineWidth = 1
    ctx.fill()
    ctx.stroke()
  }
}

function generateCellular(canvas, seed, palette, imageData = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const cellSize = 8
  const cols = Math.floor(w / cellSize)
  const rows = Math.floor(h / cellSize)
  const rng = seededRandom(seed)

  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  let grid = Array(rows).fill(null).map(() => Array(cols).fill(0))

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = rng() > 0.5 ? 1 : 0
    }
  }

  for (let step = 0; step < 50; step++) {
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0))

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let neighbors = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const ny = (y + dy + rows) % rows
            const nx = (x + dx + cols) % cols
            neighbors += grid[ny][nx]
          }
        }

        if (grid[y][x] === 1) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          newGrid[y][x] = neighbors === 3 ? 1 : 0
        }
      }
    }

    grid = newGrid
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        const colorIdx = Math.floor(rng() * (palette.length - 1)) + 1
        ctx.fillStyle = palette[colorIdx]
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
      }
    }
  }
}

function generateWaveInterference(canvas, seed, palette, imageData = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const rng = seededRandom(seed)

  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  const numSources = 8
  const sources = []

  for (let i = 0; i < numSources; i++) {
    sources.push({
      x: rng() * w,
      y: rng() * h,
      frequency: 0.01 + rng() * 0.03,
      phase: rng() * Math.PI * 2,
      color: palette[Math.floor(rng() * (palette.length - 1)) + 1],
    })
  }

  const imageData3 = ctx.getImageData(0, 0, w, h)
  const data = imageData3.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let value = 0

      for (const source of sources) {
        const dist = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2)
        value += Math.sin(dist * source.frequency - source.phase)
      }

      const normalized = (value / numSources + 1) / 2
      const colorIdx = Math.floor(normalized * (palette.length - 1)) + 1
      const color = palette[Math.min(colorIdx, palette.length - 1)]

      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)

      const idx = (y * w + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData3, 0, 0)
}

function generateAsciiArt(canvas, seed, palette, sourceImage = null) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Use proper ASCII art dimensions (character cell aspect ratio)
  const charWidth = 6
  const charHeight = 10
  const cols = Math.floor(w / charWidth)
  const rows = Math.floor(h / charHeight)

  let brightnessMap = []

  if (sourceImage) {
    // Sample from uploaded image
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = cols
    tempCanvas.height = rows
    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.drawImage(sourceImage, 0, 0, cols, rows)
    const imgData = tempCtx.getImageData(0, 0, cols, rows)
    const data = imgData.data

    for (let i = 0; i < rows; i++) {
      brightnessMap[i] = []
      for (let j = 0; j < cols; j++) {
        const idx = (i * cols + j) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        // Perceived brightness
        brightnessMap[i][j] = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      }
    }
  } else {
    // Generate from seed
    const rng = seededRandom(seed)
    for (let i = 0; i < rows; i++) {
      brightnessMap[i] = []
      for (let j = 0; j < cols; j++) {
        brightnessMap[i][j] = rng()
      }
    }
  }

  // Use dense character set
  const chars = asciiCharSets.dense

  // Clear canvas
  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)

  // Use monospace font sized to character cell height
  const fontSize = Math.max(8, Math.min(14, charHeight - 2))
  ctx.font = `${fontSize}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Render characters
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const brightness = brightnessMap[i][j]
      // Map brightness to character (dark = dense chars, light = sparse)
      const charIdx = Math.floor((1 - brightness) * (chars.length - 1))
      const char = chars[charIdx]

      // Color based on brightness and palette
      const colorIdx = Math.floor(brightness * (palette.length - 1)) + 1
      const clampedIdx = Math.min(Math.max(colorIdx, 1), palette.length - 1)
      ctx.fillStyle = palette[clampedIdx]

      ctx.fillText(char, j * charWidth + charWidth / 2, i * charHeight + charHeight / 2)
    }
  }
}

// --- Main Component ---
function ArtGallery() {
  const [mode, setMode] = useState('gallery')
  const [selectedArt, setSelectedArt] = useState(null)
  const [collection, setCollection] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan-collection')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load collection from localStorage:', e)
    }
    return []
  })
  const [currentSeed, setCurrentSeed] = useState(42)
  const [selectedPalette, setSelectedPalette] = useState('Amber Glow')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('flow')
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [customPalette, setCustomPalette] = useState(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const algorithms = [
    { id: 'flow', name: 'Flow Fields' },
    { id: 'voronoi', name: 'Voronoi' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'cellular', name: 'Cellular' },
    { id: 'wave', name: 'Wave Interference' },
    { id: 'ascii', name: 'ASCII Art' },
  ]

  const collectionRef = useRef(collection)

  useEffect(() => {
    collectionRef.current = collection
    try {
      localStorage.setItem('artisan-collection', JSON.stringify(collection))
    } catch (e) {
      console.error('Failed to save collection to localStorage:', e)
    }
  }, [collection])

  // Live regeneration when algorithm, palette, or seed changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const palette = customPalette || palettes[selectedPalette]

    switch (selectedAlgorithm) {
      case 'flow':
        generateFlowField(canvas, currentSeed, palette, uploadedImage)
        break
      case 'voronoi':
        generateVoronoi(canvas, currentSeed, palette, uploadedImage)
        break
      case 'geometric':
        generateGeometric(canvas, currentSeed, palette, uploadedImage)
        break
      case 'cellular':
        generateCellular(canvas, currentSeed, palette, uploadedImage)
        break
      case 'wave':
        generateWaveInterference(canvas, currentSeed, palette, uploadedImage)
        break
      case 'ascii':
        generateAsciiArt(canvas, currentSeed, palette, uploadedImage)
        break
    }
  }, [currentSeed, selectedPalette, selectedAlgorithm, uploadedImage, customPalette])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setUploadedImage(img)
        // Extract colors from image for use with all algorithms
        const colors = extractColorsFromImage(img, 6)
        setCustomPalette(colors)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const clearUpload = () => {
    setUploadedImage(null)
    setCustomPalette(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const saveToCollection = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    const newArt = {
      id: Date.now(),
      seed: currentSeed,
      palette: selectedPalette,
      algorithm: selectedAlgorithm,
      image: dataUrl,
      createdAt: new Date().toISOString(),
    }

    setCollection(prev => [newArt, ...prev])
  }

  const downloadArt = (art) => {
    const link = document.createElement('a')
    link.download = `artisan-${art.id}.png`
    link.href = art.image
    link.click()
  }

  const removeArt = (id) => {
    setCollection(prev => prev.filter(a => a.id !== id))
  }

  const loadArt = (art) => {
    setSelectedArt(art)
    setCurrentSeed(art.seed)
    setSelectedPalette(art.palette)
    setSelectedAlgorithm(art.algorithm)
    setMode('studio')
  }

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
              Artisan
            </h1>
            <p className="text-amber-700 text-xs">Generative Art Studio</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('gallery')}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors ${
                mode === 'gallery' ? 'bg-amber-900/40 text-amber-300' : 'text-amber-700 hover:text-amber-500'
              }`}
            >
              Gallery ({collection.length})
            </button>
            <button
              onClick={() => setMode('studio')}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors ${
                mode === 'studio' ? 'bg-amber-900/40 text-amber-300' : 'text-amber-700 hover:text-amber-500'
              }`}
            >
              Studio
            </button>
          </div>
        </div>
      </header>

      {/* Gallery Mode */}
      {mode === 'gallery' && (
        <div className="flex-1 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-amber-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Collection
              </h2>
              <p className="text-amber-700 text-sm">
                {collection.length} {collection.length === 1 ? 'piece' : 'pieces'} generated
              </p>
            </div>

            {collection.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-amber-800 text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  No artworks yet
                </p>
                <p className="text-amber-900 text-sm mb-8">
                  Visit the studio to create your first piece
                </p>
                <button
                  onClick={() => setMode('studio')}
                  className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/50 text-amber-300 rounded-lg text-sm tracking-wide transition-colors"
                >
                  Enter Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collection.map(art => (
                  <div
                    key={art.id}
                    className="group relative bg-[#1a1917] border border-amber-900/30 rounded-lg overflow-hidden hover:border-amber-700/50 transition-all cursor-pointer"
                    onClick={() => loadArt(art)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={art.image}
                        alt={`Art ${art.id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadArt(art) }}
                        className="px-4 py-2 bg-amber-900/80 hover:bg-amber-800 text-amber-200 rounded text-xs tracking-wider uppercase transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeArt(art.id) }}
                        className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-red-200 rounded text-xs tracking-wider uppercase transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-amber-600 text-xs font-mono">
                        #{art.seed} • {art.palette}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Studio Mode */}
      {mode === 'studio' && (
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Controls Panel */}
          <div className="lg:w-80 bg-[#1a1917] border-r border-amber-900/30 p-6 overflow-y-auto">
            <h2 className="text-xl font-light text-amber-100 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Controls
            </h2>

            {/* Algorithm Selection */}
            <div className="mb-6">
              <label className="text-amber-700 text-xs uppercase tracking-wider mb-3 block">
                Algorithm
              </label>
              <div className="space-y-2">
                {algorithms.map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgorithm(algo.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedAlgorithm === algo.id
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'text-amber-700 hover:text-amber-500 hover:bg-amber-900/20'
                    }`}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette Selection */}
            <div className="mb-6">
              <label className="text-amber-700 text-xs uppercase tracking-wider mb-3 block">
                Color Palette
              </label>
              <div className="space-y-2">
                {Object.entries(palettes).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => { setSelectedPalette(name); setCustomPalette(null) }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      selectedPalette === name && !customPalette
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'text-amber-700 hover:text-amber-500 hover:bg-amber-900/20'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      {colors.slice(1).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="flex-1">{name}</span>
                  </button>
                ))}
              </div>
              {customPalette && (
                <p className="text-amber-600 text-xs mt-2 italic">
                  Using extracted colors from uploaded image
                </p>
              )}
            </div>

            {/* Seed */}
            <div className="mb-6">
              <label className="text-amber-700 text-xs uppercase tracking-wider mb-3 block">
                Seed
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={currentSeed}
                  onChange={(e) => setCurrentSeed(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#0f0e0c] border border-amber-900/40 rounded px-3 py-2 text-amber-300 text-sm font-mono focus:outline-none focus:border-amber-700"
                />
                <button
                  onClick={() => setCurrentSeed(Math.floor(Math.random() * 10000))}
                  className="px-4 py-2 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 rounded text-sm transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Image Upload (for all algorithms) */}
            <div className="mb-6">
              <label className="text-amber-700 text-xs uppercase tracking-wider mb-3 block">
                Source Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-amber-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-900/40 file:text-amber-300 hover:file:bg-amber-800/50 file:cursor-pointer"
              />
              {uploadedImage && (
                <button
                  onClick={clearUpload}
                  className="mt-2 text-xs text-amber-700 hover:text-amber-500 transition-colors"
                >
                  Clear image
                </button>
              )}
            </div>

            {/* Generate Button - only shown when image is uploaded */}
            {uploadedImage && (
              <button
                onClick={() => {
                  setIsGenerating(true)
                  setTimeout(() => setIsGenerating(false), 100)
                }}
                disabled={isGenerating}
                className="w-full py-3 bg-amber-800 hover:bg-amber-700 disabled:bg-amber-900/40 text-amber-100 rounded-lg text-sm tracking-wider uppercase transition-colors mb-4"
              >
                {isGenerating ? 'Generating...' : 'Re-generate'}
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={saveToCollection}
              className="w-full py-3 border border-amber-700/50 hover:border-amber-600 text-amber-300 rounded-lg text-sm tracking-wider uppercase transition-colors"
            >
              Save to Collection
            </button>
          </div>

          {/* Canvas Display */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#0f0e0c]">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="bg-[#1a1917] border border-amber-900/30 rounded-lg shadow-2xl"
              />
              {selectedArt && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-900/80 text-amber-300 text-xs rounded">
                  #{selectedArt.seed}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtGallery
