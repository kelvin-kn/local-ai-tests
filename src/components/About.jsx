function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          About <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Me</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="w-full aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">👨‍💻</div>
                <p className="text-gray-500 dark:text-gray-400">Your photo here</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Crafting digital experiences that matter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              With over 5 years of experience in web development, I specialize in 
              creating modern, responsive applications that combine beautiful design 
              with robust functionality.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              I believe in writing clean, maintainable code and staying up-to-date 
              with the latest technologies. When I'm not coding, you'll find me 
              exploring new design trends, contributing to open source, or 
              experimenting with creative coding.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5+</div>
                <div className="text-sm text-gray-500">Years Exp.</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">30+</div>
                <div className="text-sm text-gray-500">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
