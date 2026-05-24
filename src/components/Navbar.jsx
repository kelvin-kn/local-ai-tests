import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isRoot = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#hero', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ]

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#faf9f6]/95 dark:bg-[#1a1a18]/95 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {!isRoot && (
            <Link
              to="/"
              className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              ← Launcher
            </Link>
          )}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#hero')
            }}
            className="text-sm tracking-widest uppercase font-mono-editorial text-neutral-800 dark:text-neutral-200"
          >
            JD
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors font-mono-editorial"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-full hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="text-xs">{darkMode ? '☀' : '☾'}</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-full"
              aria-label="Toggle dark mode"
            >
              <span className="text-xs">{darkMode ? '☀' : '☾'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-full"
              aria-label="Toggle menu"
            >
              <span className="text-xs">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#faf9f6] dark:bg-[#1a1a18] border-t border-neutral-200 dark:border-neutral-800">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="block text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors font-mono-editorial"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
