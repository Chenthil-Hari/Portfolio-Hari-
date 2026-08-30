import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Trophy, BookOpen, Zap, ExternalLink } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

const typeConfig = {
  certification: { Icon: Award, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Certification' },
  hackathon: { Icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Hackathon' },
  achievement: { Icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', label: 'Achievement' },
  workshop: { Icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', label: 'Workshop' },
}

export default function Achievements() {
  const { achievements } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="achievements" className="section-padding relative bg-bg-secondary/30" aria-label="Achievements and certifications" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">06 — Achievements</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Certifications & More
          </h2>
          <p className="text-slate-500 mt-3 text-sm font-mono">
            // Placeholder cards — update in src/data/portfolio.ts
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {achievements.map((ach, i) => {
            const config = typeConfig[ach.type]
            const { Icon } = config

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.08] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${config.bg} border ${config.border}`}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{ach.title}</h3>
                <p className="text-slate-500 text-xs mb-1">{ach.issuer}</p>
                <p className="text-slate-600 text-xs mb-3 font-mono">{ach.date}</p>
                <p className="text-slate-400 text-xs leading-relaxed flex-1">{ach.description}</p>

                {ach.link && ach.link !== '#' && (
                  <a
                    href={ach.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View <ExternalLink size={10} />
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
