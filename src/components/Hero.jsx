import { useState, useEffect } from 'react'

function Hero() {
  const [text, setText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const roles = [
    'Full Stack Developer',
    'UI/UX Designer',
    'Creative Coder',
    'Problem Solver',
  ]

  useEffect(() => {
    const currentRole = roles[currentIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentRole.substring(0, text.length + 1))
          if (text === currentRole) {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          setText(currentRole.substring(0, text.length - 1))
          if (text === '') {
            setIsDeleting(false)
            setCurrentIndex((prev) => (prev + 1) % roles.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [text, currentIndex, isDeleting, roles])

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 pt-16"
    >
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl">
            JD
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          Hi, I'm <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">John Doe</span>
        </h1>
        <div className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-8 h-10">
          {text}
          <span className="animate-pulse">|</span>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          I create beautiful, functional web experiences that users love. 
          Passionate about clean code, intuitive design, and pushing boundaries.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
