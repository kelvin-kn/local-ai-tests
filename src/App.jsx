import { Routes, Route } from 'react-router-dom'
import Launcher from './pages/Launcher'
import Portfolio from './pages/Portfolio'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Launcher />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  )
}

export default App
