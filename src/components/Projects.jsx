import { useState } from 'react'



// Project data with details
const projects = [
  {
    number: '01',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
    tech: 'React · Node.js · MongoDB · Stripe',
    year: '2024',
  },
  {
    number: '02',
    title: 'AI Chat Application',
    description: 'Real-time chat application powered by AI with natural language processing and context awareness.',
    tech: 'Next.js · Python · WebSocket · AI/ML',
    year: '2024',
  },
  {
    number: '03',
    title: 'Task Management System',
    description: 'Collaborative project management tool with drag-and-drop boards, time tracking, and team analytics.',
    tech: 'React · TypeScript · PostgreSQL · DnD',
    year: '2023',
  },
  {
    number: '04',
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with scheduling, insights, and content calendar.',
    tech: 'React · D3.js · REST API · Charts',
    year: '2023',
  },
  {
    number: '05',
    title: 'Fitness Tracker',
    description: 'Mobile-first fitness application with workout planning, progress tracking, and nutrition logging.',
    tech: 'React Native · Firebase · Charts · Maps',
    year: '2023',
  },
  {
    number: '06',
    title: 'Real Estate Platform',
    description: 'Property listing platform with advanced search, virtual tours, and mortgage calculator.',
    tech: 'Next.js · Mapbox · Stripe · AWS',
    year: '2022',
  },
]

function ProjectRow({ project, onMouseEnter, onMouseLeave }) {
  return (
    <a
      href="#"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group block border-t border-neutral-200 dark:border-neutral-800 py-8 -mx-6 px-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors cursor-default"
    >
      <div className="flex items-start gap-6 lg:gap-12">
        {/* Project number */}
        <span className="text-xs tracking-widest text-neutral-400 font-mono-editorial pt-1 shrink-0">
          {project.number}
        </span>

        {/* Project title */}
        <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 group-hover:text-[#c4724e] transition-colors flex-1">
          {project.title}
        </h3>

        {/* Year */}
        <span className="text-xs tracking-widest text-neutral-400 font-mono-editorial shrink-0 hidden sm:block">
          {project.year}
        </span>

        {/* Arrow indicator */}
        <span className="text-neutral-300 dark:text-neutral-700 group-hover:text-[#c4724e] transition-colors text-xl shrink-0 self-center">
          →
        </span>
      </div>

      {/* Hover reveal: description + tech stack */}
      <div className="mt-6 ml-10 max-w-2xl">
        <p className="text-neutral-500 dark:text-neutral-500 text-sm leading-relaxed mb-3">
          {project.description}
        </p>
        <p className="text-[11px] tracking-widest uppercase text-neutral-400 font-mono-editorial">
          {project.tech}
        </p>
      </div>
    </a>
  )
}

function Projects() {
  // Track which project is being hovered for the reveal effect
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section id="projects" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase text-neutral-400 font-mono-editorial mb-4">
          03 — Selected Work
        </p>

        {/* Section title */}
        <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 mb-16">
          Recent Projects
        </h2>

        {/* Project list with hover reveals */}
        <div className="max-w-4xl">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.title}
              project={project}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 ml-10">
          <a
            href="#"
            className="inline-flex items-center gap-3 text-xs tracking-widest uppercase text-neutral-500 hover:text-[#c4724e] transition-colors font-mono-editorial"
          >
            View All Projects
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects
