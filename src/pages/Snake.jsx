import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 60

const DIRECTIONS = {
  ARROW_UP: { x: 0, y: -1 },
  ARROW_DOWN: { x: 0, y: 1 },
  ARROW_LEFT: { x: -1, y: 0 },
  ARROW_RIGHT: { x: 1, y: 0 },
}

const KEY_MAP = {
  ArrowUp: DIRECTIONS.ARROW_UP,
  ArrowDown: DIRECTIONS.ARROW_DOWN,
  ArrowLeft: DIRECTIONS.ARROW_LEFT,
  ArrowRight: DIRECTIONS.ARROW_RIGHT,
  w: DIRECTIONS.ARROW_UP,
  W: DIRECTIONS.ARROW_UP,
  s: DIRECTIONS.ARROW_DOWN,
  S: DIRECTIONS.ARROW_DOWN,
  a: DIRECTIONS.ARROW_LEFT,
  A: DIRECTIONS.ARROW_LEFT,
  d: DIRECTIONS.ARROW_RIGHT,
  D: DIRECTIONS.ARROW_RIGHT,
}

function Snake() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState(DIRECTIONS.ARROW_RIGHT)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const directionRef = useRef(direction)
  const gameLoopRef = useRef(null)
  const containerRef = useRef(null)

  const generateFood = useCallback((currentSnake) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y))
    return newFood
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood([{ x: 10, y: 10 }]))
    setDirection(DIRECTIONS.ARROW_RIGHT)
    directionRef.current = DIRECTIONS.ARROW_RIGHT
    setGameOver(false)
    setScore(0)
    setStarted(false)
    setSpeed(INITIAL_SPEED)
  }

  const togglePause = () => {
    if (gameOver) return
    setStarted(prev => !prev)
  }

  const moveSnake = useCallback(() => {
    setSnake(prev => {
      const newHead = {
        x: prev[0].x + directionRef.current.x,
        y: prev[0].y + directionRef.current.y,
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true)
        return prev
      }

      if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true)
        return prev
      }

      const newSnake = [newHead, ...prev]

      setFood(currentFood => {
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(s => s + 10)
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT))
          const generated = generateFood(newSnake)
          return generated
        }
        newSnake.pop()
        return currentFood
      })

      return newSnake
    })
  }, [generateFood])

  useEffect(() => {
    if (started && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed)
      return () => clearInterval(gameLoopRef.current)
    }
  }, [started, gameOver, speed, moveSnake])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (gameOver) {
          resetGame()
        } else {
          togglePause()
        }
        return
      }

      if (gameOver) return

      const newDir = KEY_MAP[e.key]
      if (newDir) {
        e.preventDefault()
        const currentDir = directionRef.current
        const opposites = {
          ARROW_UP: 'ARROW_DOWN',
          ARROW_DOWN: 'ARROW_UP',
          ARROW_LEFT: 'ARROW_RIGHT',
          ARROW_RIGHT: 'ARROW_LEFT',
        }
        if (opposites[newDir] !== Object.keys(DIRECTIONS).find(k => DIRECTIONS[k] === currentDir)) {
          directionRef.current = newDir
          setDirection(newDir)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a12] text-cyan-50 flex items-center justify-center px-6 py-12">
      <div ref={containerRef} className="max-w-2xl w-full text-center">
        <header className="mb-8">
          <a
            href="/"
            className="text-cyan-800 hover:text-cyan-500 transition-colors text-xs tracking-widest uppercase font-mono-editorial"
          >
            ← Back to Launcher
          </a>
          <h1 className="text-4xl font-light tracking-tight text-cyan-100 mt-4 mb-2" style={{ fontFamily: 'monospace' }}>
            SNAKE
          </h1>
          <div className="flex items-center justify-center gap-8 mt-6">
            <p className="text-cyan-700 text-sm font-mono">
              SCORE: <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-cyan-700 text-sm font-mono">
              SPEED: <span className="text-cyan-300">{Math.round((INITIAL_SPEED - speed) / SPEED_INCREMENT + 1)}</span>
            </p>
            <button
              onClick={toggleFullscreen}
              className="text-cyan-700 hover:text-cyan-400 text-sm font-mono transition-colors"
            >
              {isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}
            </button>
          </div>
        </header>

        <div className="relative inline-block border border-cyan-900/40 rounded-lg overflow-hidden" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: GRID_SIZE }).map((_, row) => (
              <div key={row} className="flex">
                {Array.from({ length: GRID_SIZE }).map((_, col) => (
                  <div
                    key={col}
                    className="border border-cyan-500/20"
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food.x * CELL_SIZE + 1,
              top: food.y * CELL_SIZE + 1,
              backgroundColor: '#ff6b6b',
              boxShadow: '0 0 8px #ff6b6b',
            }}
          />

          {snake.map((seg, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                left: seg.x * CELL_SIZE,
                top: seg.y * CELL_SIZE,
                backgroundColor: i === 0 ? '#22d3ee' : '#06b6d4',
                boxShadow: i === 0 ? '0 0 6px #22d3ee' : 'none',
                borderRadius: i === 0 ? '4px' : '2px',
              }}
            />
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
              <p className="text-red-400 text-2xl font-mono">GAME OVER</p>
              <p className="text-cyan-300 text-sm font-mono">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-cyan-900 hover:bg-cyan-800 text-cyan-100 rounded text-sm font-mono tracking-wide transition-colors"
              >
                Play Again
              </button>
            </div>
          )}

          {!started && !gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
              <p className="text-cyan-300 text-lg font-mono">PRESS SPACE</p>
              <p className="text-cyan-600 text-xs font-mono">or click START</p>
              <button
                onClick={togglePause}
                className="px-6 py-2 bg-cyan-900 hover:bg-cyan-800 text-cyan-100 rounded text-sm font-mono tracking-wide transition-colors"
              >
                START
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <p className="text-cyan-800 text-xs font-mono mb-2">CONTROLS</p>
          <p className="text-cyan-700 text-xs font-mono">
            Arrow keys or WASD to move · Space to pause/resume
          </p>
        </div>
      </div>
    </div>
  )
}

export default Snake
