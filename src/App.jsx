import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Launcher from './pages/Launcher'
import Portfolio from './pages/Portfolio'
import Quiz from './pages/Quiz'
import Snake from './pages/Snake'
import Weather from './pages/Weather'
import ArtGallery from './pages/ArtGallery'
import Clock from './pages/Clock'

// Coming soon page for unimplemented routes
function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#1a1a18] text-neutral-800 dark:text-neutral-200 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-neutral-400 font-mono-editorial mb-4">
          Under Construction
        </p>
        <h1 className="font-serif text-4xl text-neutral-900 dark:text-neutral-100 mb-4">
          Coming Soon
        </h1>
        <p className="text-neutral-500 mb-8">
          This project is being built. Check back later.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#c4724e] hover:text-[#a85e3f] transition-colors font-mono-editorial"
        >
          ← Back to Launcher
        </Link>
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    const titles = {
      '/': 'Local AI Tests',
      '/portfolio': 'Portfolio',
      '/quiz': 'Trivia Quiz',
      '/snake': 'Snake',
      '/weather': 'Weather',
      '/art': 'Art Gallery',
      '/clock': 'Clock',
    }
    document.title = titles[location.pathname] || 'Local AI Tests'
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<Launcher />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/snake" element={<Snake />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/art" element={<ArtGallery />} />
      <Route path="/clock" element={<Clock />} />
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  )
}

export default App
