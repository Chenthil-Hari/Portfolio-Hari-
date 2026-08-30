import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, BookOpen, Calendar, MapPin } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function Education() {
  const { education } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="education" className="section-padding relative" ref={ref} aria-label="Education">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">05 — Education</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Academic Background
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-8 border border-white/[0.1] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-bl-full" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <GraduationCap size={28} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-blue-400 tracking-wider uppercase">Currently Enrolled</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 text-sm font-medium">{education.year}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2">{education.degree}</h3>
                <p className="text-blue-300 font-medium mb-6">{education.institution}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} className="text-slate-500" />
                    {education.period}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={14} className="text-slate-500" />
                    India
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">{education.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Coursework highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="glass-card rounded-2xl p-8 border border-white/[0.08] h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-violet-500/10">
                  <BookOpen size={18} className="text-violet-400" />
                </div>
                <h3 className="text-slate-200 font-semibold">Core Coursework</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  'Data Structures & Algorithms',
                  'Operating Systems',
                  'Computer Networks',
                  'Database Management',
                  'Software Engineering',
                  'Object-Oriented Programming',
                  'Computer Architecture',
                  'Web Technologies',
                ].map((course, i) => (
                  <motion.div
                    key={course}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-2 py-2 text-sm text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
                    {course}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
