import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Code2, Brain, Layers, User } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function About() {
  const { personalInfo } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [imageError, setImageError] = useState(false)

  // Reduced animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <section id="about" className="section-padding relative" ref={ref} aria-label="About me">
      {/* Background accent - static */}
      <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-12"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">01 — About</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            Who I Am
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Image/Visual column */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative group max-w-sm w-full aspect-square">
              {/* Glowing background behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-violet-600/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Outer frame */}
              <div className="relative w-full h-full glass-card rounded-3xl p-3 border border-white/[0.08] overflow-hidden group-hover:border-blue-500/30 transition-colors duration-300">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-bg-tertiary relative flex items-center justify-center">
                  {!imageError ? (
                    <img
                      src={personalInfo.avatar}
                      alt={personalInfo.fullName}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* Elegant fallback if image is missing */
                    <div className="flex flex-col items-center justify-center text-center p-6 h-full w-full bg-gradient-to-br from-bg-secondary to-bg-tertiary">
                      <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
                        <User size={40} />
                      </div>
                      <p className="text-sm font-semibold text-slate-200">Hari</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                        Drop your profile image as avatar.png in the public folder to display here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="lg:col-span-7 space-y-6"
          >
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {personalInfo.about}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Year', value: '3rd Year' },
                { label: 'Degree', value: 'B.Tech CSE' },
                { label: 'Focus', value: 'Full Stack Dev' },
                { label: 'Status', value: 'Building things' },
              ].map(({ label, value }) => (
                <div key={label} className="glass-card rounded-xl p-4 border border-white/[0.04]">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-white font-semibold text-sm md:text-base">{value}</div>
                </div>
              ))}
            </div>

            {/* Subtle icons representing drives */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-4">
              {[
                { icon: Code2, label: 'Clean Code' },
                { icon: Brain, label: 'Problem Solving' },
                { icon: Layers, label: 'Full Stack' },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex items-center gap-2 text-slate-400">
                    <Icon size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
