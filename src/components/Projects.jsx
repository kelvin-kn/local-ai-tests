const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    gradient: 'from-purple-500 to-blue-500',
  },
  {
    title: 'AI Chat Application',
    description: 'Real-time chat application powered by AI with natural language processing and context awareness.',
    tags: ['Next.js', 'Python', 'WebSocket', 'AI/ML'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Task Management System',
    description: 'Collaborative project management tool with drag-and-drop boards, time tracking, and team analytics.',
    tags: ['React', 'TypeScript', 'PostgreSQL', 'DnD'],
    gradient: 'from-green-500 to-teal-500',
  },
  {
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with scheduling, insights, and content calendar.',
    tags: ['React', 'D3.js', 'API', 'Charts'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Fitness Tracker',
    description: 'Mobile-first fitness application with workout planning, progress tracking, and nutrition logging.',
    tags: ['React Native', 'Firebase', 'Charts', 'Maps'],
    gradient: 'from-pink-500 to-purple-500',
  },
  {
    title: 'Real Estate Platform',
    description: 'Property listing platform with advanced search, virtual tours, and mortgage calculator.',
    tags: ['Next.js', 'Mapbox', 'Stripe', 'AWS'],
    gradient: 'from-indigo-500 to-blue-500',
  },
]

function ProjectCard({ project, index }) {
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`h-48 bg-gradient-to-br ${project.gradient} p-6 flex items-center justify-center`}>
        <div className="text-white text-center">
          <div className="text-5xl mb-2">🚀</div>
          <p className="text-sm opacity-80">Project Preview</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Featured <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Projects</span>
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          A selection of my recent work showcasing web development, design, 
          and problem-solving skills.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
