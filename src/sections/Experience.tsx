import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, Code2, Trophy } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

const typeIcons = {
  internship: Briefcase,
  project: Code2,
  activity: Trophy,
}

const typeColors = {
  internship: 'text-blue-400 bg-blue-500/10',
  project: 'text-violet-400 bg-violet-500/10',
  activity: 'text-amber-400 bg-amber-500/10',
}

export default function Experience() {
  const { experiences } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="section-padding relative bg-bg-secondary/30" ref={ref} aria-label="Experience">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">04 — Experience</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            What I’ve Done
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px timeline-line" aria-hidden="true" />

          <div className="space-y-8">
            {experiences.map((exp, i) => {
              const Icon = typeIcons[exp.type]
              const colors = typeColors[exp.type]

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 w-12 h-12 rounded-full glass-card border border-white/[0.1] flex items-center justify-center">
                    <motion.div
                      animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0)', '0 0 0 8px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0)'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="w-3 h-3 rounded-full bg-blue-500"
                    />
                  </div>

                  {/* Card */}
                  <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/[0.08]">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">{exp.role}</h3>
                        <p className="text-slate-400 text-sm">{exp.organization}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">{exp.period}</span>
                        <span className={`p-1.5 rounded-lg ${colors}`}>
                          <Icon size={14} />
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map(tag => (
                        <span key={tag} className="tech-badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
