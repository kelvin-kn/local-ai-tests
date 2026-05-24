import { useState, useEffect, useRef } from 'react'

const skills = [
  { name: 'React / Next.js', level: 95 },
  { name: 'JavaScript / TypeScript', level: 90 },
  { name: 'Tailwind CSS', level: 92 },
  { name: 'Node.js', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'UI/UX Design', level: 88 },
  { name: 'PostgreSQL / MongoDB', level: 82 },
  { name: 'Git / DevOps', level: 87 },
]

function SkillBar({ skill, isVisible, index }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
        <span className="text-purple-600 font-semibold">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${skill.level}%` : '0%',
            transitionDelay: `${index * 100}ms`,
          }}
        ></div>
      </div>
    </div>
  )
}

function Skills() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
          My <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Skills</span>
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          A blend of technical expertise and creative problem-solving to deliver 
          exceptional results.
        </p>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {skills.slice(0, 4).map((skill, index) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                isVisible={isVisible}
                index={index}
              />
            ))}
          </div>
          <div>
            {skills.slice(4).map((skill, index) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                isVisible={isVisible}
                index={index + 4}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
