import { Link } from 'react-router-dom'

const projects = [
  {
    name: 'Portfolio',
    description: 'Professional landing page with smooth animations',
    path: '/portfolio',
    icon: '◆',
    color: 'from-slate-800 to-slate-900',
    textColor: 'text-amber-400',
    hoverColor: 'hover:border-amber-400/50',
  },
  {
    name: 'Quiz',
    description: '10-question trivia with locked progression',
    path: '/quiz',
    icon: '◈',
    color: 'from-emerald-800 to-emerald-900',
    textColor: 'text-emerald-300',
    hoverColor: 'hover:border-emerald-400/50',
  },
  {
    name: 'Snake',
    description: 'Classic snake game with increasing difficulty',
    path: '/snake',
    icon: '⬡',
    color: 'from-orange-800 to-orange-900',
    textColor: 'text-orange-300',
    hoverColor: 'hover:border-orange-400/50',
  },
  {
    name: 'Weather',
    description: 'Live weather data with dynamic visuals',
    path: '/weather',
    icon: '◐',
    color: 'from-sky-800 to-slate-900',
    textColor: 'text-sky-300',
    hoverColor: 'hover:border-sky-400/50',
  },
  {
    name: 'Art Gallery',
    description: 'Generative art with multiple algorithms',
    path: '/art',
    icon: '✦',
    color: 'from-violet-900 to-fuchsia-900',
    textColor: 'text-fuchsia-300',
    hoverColor: 'hover:border-fuchsia-400/50',
  },
  {
    name: 'Clock',
    description: 'Analogue clock with smooth animation',
    path: '/clock',
    icon: '◉',
    color: 'from-amber-900 to-yellow-900',
    textColor: 'text-amber-300',
    hoverColor: 'hover:border-amber-400/50',
  },
]

function Launcher() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-5xl font-light tracking-tight mb-4">
            Local AI Tests
          </h1>
          <p className="text-neutral-500 text-lg max-w-xl">
            A collection of projects built to evaluate AI coding capabilities. 
            Select a project below to explore.
          </p>
          <div className="w-16 h-px bg-neutral-700 mt-8"></div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.name}
              to={project.path}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block p-6 bg-neutral-900/50 border border-neutral-800 ${project.hoverColor} rounded-lg transition-all duration-300 hover:bg-neutral-900/80 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`text-3xl ${project.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  {project.icon}
                </span>
                <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors text-xl">
                  →
                </span>
              </div>
              <h2 className={`text-xl font-medium ${project.textColor} mb-2`}>
                {project.name}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {project.description}
              </p>
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-sm">
            Built with Vite + React + Tailwind CSS
          </p>
          <p className="text-neutral-600 text-sm">
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Launcher
