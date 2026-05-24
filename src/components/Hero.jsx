import { useState, useEffect } from 'react'

function Hero() {
  const [text, setText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Roles to cycle through with the typing effect
  const roles = [
    'Full Stack Developer',
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
            // Pause at full text before deleting
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
      className="min-h-screen flex items-center px-6 lg:px-8 pt-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Large serif heading */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-neutral-900 dark:text-neutral-100 leading-[1.05] tracking-tight mb-8">
          Crafting digital
          <br />
          experiences that
          <br />
          <span className="text-[#c4724e] italic">matter</span>
        </h1>

        {/* Typing effect subtitle */}
        <div className="h-8 mb-10">
          <p className="text-sm tracking-widest uppercase text-neutral-400 font-mono-editorial">
            {text}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-neutral-500 dark:text-neutral-500 max-w-xl leading-relaxed mb-12 text-[15px]">
          I build thoughtful, functional web applications with attention to 
          detail and a focus on the user experience. Based in the intersection 
          of design and engineering.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#c4724e] text-white text-xs tracking-widest uppercase font-mono-editorial hover:bg-[#a85e3f] transition-colors"
          >
            View Work
            <span>→</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs tracking-widest uppercase font-mono-editorial hover:border-neutral-800 dark:hover:border-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
