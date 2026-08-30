import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { skills } from '@/data/portfolio'

const categoryColors: Record<string, { border: string; glow: string; label: string }> = {
  Programming: { border: 'hover:border-blue-500/40', glow: 'hover:shadow-glow-blue', label: 'text-blue-400' },
  Frontend: { border: 'hover:border-cyan-500/40', glow: 'hover:shadow-glow-cyan', label: 'text-cyan-400' },
  Backend: { border: 'hover:border-violet-500/40', glow: 'hover:shadow-glow-violet', label: 'text-violet-400' },
  Database: { border: 'hover:border-emerald-500/40', glow: '', label: 'text-emerald-400' },
  Tools: { border: 'hover:border-amber-500/40', glow: '', label: 'text-amber-400' },
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="section-padding relative bg-bg-secondary/30" ref={ref} aria-label="Skills">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">02 — Skills</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Technologies I Work With
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl">
            Tools and technologies I've used across projects and coursework.
          </p>
        </motion.div>

        <div className="space-y-12">
          {skills.map((category, ci) => {
            const colors = categoryColors[category.category] || { border: 'hover:border-blue-500/40', glow: 'hover:shadow-glow-blue', label: 'text-blue-400' }

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: ci * 0.1 }}
              >
                <h3 className={`text-xs font-mono uppercase tracking-widest mb-5 ${colors.label}`}>
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: ci * 0.1 + si * 0.06 }}
                      whileHover={{ y: -4, scale: 1.04 }}
                      className={`skill-card group glass-card glass-card-hover rounded-2xl px-5 py-4 border border-white/[0.08] ${colors.border} ${colors.glow} cursor-default transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="skill-icon text-2xl" aria-hidden="true">
                          {skill.icon}
                        </span>
                        <span className="text-slate-200 font-medium text-sm">{skill.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}