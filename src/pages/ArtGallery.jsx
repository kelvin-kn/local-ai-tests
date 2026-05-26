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

// --- Art generation algorithms ---
function generateFlowField(canvas, seed, palette) {
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

function generateVoronoi(canvas, seed, palette) {
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
  
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  
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
  
  ctx.putImageData(imageData, 0, 0)
}

function generateGeometric(canvas, seed, palette) {
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

function generateCellular(canvas, seed, palette) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const cellSize = 8
  const cols = Math.floor(w / cellSize)
  const rows = Math.floor(h / cellSize)
  const rng = seededRandom(seed)
  
  // Initialize grid
  let grid = Array(rows).fill(null).map(() => Array(cols).fill(0))
  
  // Random initial state
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = rng() > 0.5 ? 1 : 0
    }
  }
  
  // Evolve
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
    
    // Draw
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
}

function generateGradientMesh(canvas, seed, palette) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const rng = seededRandom(seed)
  
  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, w, h)
  
  const numCircles = 20
  const circles = []
  
  for (let i = 0; i < numCircles; i++) {
    circles.push({
      x: rng() * w,
      y: rng() * h,
      radius: 50 + rng() * 200,
      color: palette[Math.floor(rng() * (palette.length - 1)) + 1],
    })
  }
  
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0
      let totalWeight = 0
      
      for (const circle of circles) {
        const dist = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2)
        const weight = Math.max(0, 1 - dist / circle.radius)
        const w2 = weight * weight
        
        const cr = parseInt(circle.color.slice(1, 3), 16)
        const cg = parseInt(circle.color.slice(3, 5), 16)
        const cb = parseInt(circle.color.slice(5, 7), 16)
        
        r += cr * w2
        g += cg * w2
        b += cb * w2
        totalWeight += w2
      }
      
      if (totalWeight > 0) {
        r = Math.min(255, Math.round(r / totalWeight))
        g = Math.min(255, Math.round(g / totalWeight))
        b = Math.min(255, Math.round(b / totalWeight))
      }
      
      const idx = (y * w + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
}

// --- Main Component ---
function ArtGallery() {
  const [mode, setMode] = useState('gallery') // 'gallery' or 'studio'
  const [selectedArt, setSelectedArt] = useState(null)
  const [collection, setCollection] = useState([])
  const [currentSeed, setCurrentSeed] = useState(Math.floor(Math.random() * 10000))
  const [selectedPalette, setSelectedPalette] = useState('Amber Glow')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('flow')
  const [isGenerating, setIsGenerating] = useState(false)
  const [artworks, setArtworks] = useState([])
  const canvasRef = useRef(null)
  
  const algorithms = [
    { id: 'flow', name: 'Flow Fields' },
    { id: 'voronoi', name: 'Voronoi' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'cellular', name: 'Cellular' },
    { id: 'gradient', name: 'Gradient Mesh' },
  ]
  
  const generateArt = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    setIsGenerating(true)
    
    setTimeout(() => {
      const palette = palettes[selectedPalette]
      
      switch (selectedAlgorithm) {
        case 'flow':
          generateFlowField(canvas, currentSeed, palette)
          break
        case 'voronoi':
          generateVoronoi(canvas, currentSeed, palette)
          break
        case 'geometric':
          generateGeometric(canvas, currentSeed, palette)
          break
        case 'cellular':
          generateCellular(canvas, currentSeed, palette)
          break
        case 'gradient':
          generateGradientMesh(canvas, currentSeed, palette)
          break
      }
      
      setIsGenerating(false)
    }, 50)
  }, [currentSeed, selectedPalette, selectedAlgorithm])
  
  useEffect(() => {
    generateArt()
  }, [generateArt])
  
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
              Gallery
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
                    onClick={() => setSelectedPalette(name)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      selectedPalette === name
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
            
            {/* Generate Button */}
            <button
              onClick={generateArt}
              disabled={isGenerating}
              className="w-full py-3 bg-amber-800 hover:bg-amber-700 disabled:bg-amber-900/40 text-amber-100 rounded-lg text-sm tracking-wider uppercase transition-colors mb-4"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            
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
