function Footer() {
  return (
    <footer className="px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: copyright */}
          <p className="text-[11px] tracking-widest uppercase text-neutral-400 font-mono-editorial">
            © {new Date().getFullYear()} John Doe. All rights reserved.
          </p>

          {/* Right: social links */}
          <div className="flex items-center gap-6">
            {['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].map((site) => (
              <a
                key={site}
                href="#"
                className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-[#c4724e] transition-colors font-mono-editorial"
                aria-label={site}
              >
                {site}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
