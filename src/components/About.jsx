function About() {
  return (
    <section id="about" className="py-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase text-neutral-400 font-mono-editorial mb-4">
          01 — About
        </p>

        {/* Asymmetric two-column layout */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left column - larger text */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 dark:text-neutral-100 leading-tight mb-8">
              A developer who cares about the craft, not just the code.
            </h2>
          </div>

          {/* Right column - bio text */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-neutral-500 dark:text-neutral-500 leading-relaxed text-[15px]">
              With over 5 years of experience in web development, I specialize in 
              creating modern, responsive applications that combine thoughtful design 
              with robust engineering.
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 leading-relaxed text-[15px]">
              I believe in writing clean, maintainable code and staying up-to-date 
              with the latest technologies. When I'm not coding, you'll find me 
              exploring new design trends, contributing to open source, or 
              experimenting with creative coding.
            </p>

            {/* Stats row */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-6">
              <div>
                <div className="font-serif text-3xl text-neutral-900 dark:text-neutral-100">5+</div>
                <div className="text-[11px] tracking-widest uppercase text-neutral-400 font-mono-editorial mt-1">Experience</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-neutral-900 dark:text-neutral-100">50+</div>
                <div className="text-[11px] tracking-widest uppercase text-neutral-400 font-mono-editorial mt-1">Projects</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-neutral-900 dark:text-neutral-100">30+</div>
                <div className="text-[11px] tracking-widest uppercase text-neutral-400 font-mono-editorial mt-1">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
