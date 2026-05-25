import { useState, useEffect, useRef } from 'react'

// Skill data with proficiency level (1-5 stars)
const skills = [
  { name: 'React', level: 5 },
  { name: 'Next.js', level: 4 },
  { name: 'TypeScript', level: 4 },
  { name: 'Tailwind CSS', level: 5 },
  { name: 'JavaScript', level: 5 },
  { name: 'Node.js', level: 4 },
  { name: 'Python', level: 4 },
  { name: 'PostgreSQL', level: 4 },
  { name: 'MongoDB', level: 3 },
  { name: 'UI/UX Design', level: 4 },
  { name: 'Git', level: 5 },
  { name: 'Docker', level: 3 },
]

function SkillItem({ skill, isVisible, index }) {
  // Generate star dots based on proficiency level
  const stars = Array.from({ length: 5 }, (_, i) => i < skill.level)

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-700 dark:text-neutral-300 font-mono-editorial">
          {skill.name}
        </span>
        <div className="flex gap-1">
          {stars.map((filled, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                filled ? 'bg-[#c4724e]' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Skills() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Use IntersectionObserver to trigger animation when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-16 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase text-neutral-400 font-mono-editorial mb-4">
          02 — Skills
        </p>

        {/* Section title */}
        <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 mb-16">
          Tools & Technologies
        </h2>

        {/* Two-column grid of skills */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-3xl">
          {skills.map((skill, index) => (
            <SkillItem
              key={skill.name}
              skill={skill}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
