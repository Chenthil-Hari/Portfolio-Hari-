import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import { usePortfolio } from '@/context/PortfolioContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const codeLines = [
  { indent: 0, content: 'const developer = {', color: 'text-slate-300' },
  { indent: 1, content: 'name: "Hari",', color: 'text-blue-300' },
  { indent: 1, content: 'role: "Software Developer",', color: 'text-violet-300' },
  { indent: 1, content: 'stack: ["React", "Node.js", "Python"],', color: 'text-cyan-300' },
  { indent: 1, content: 'passion: "Building great things",', color: 'text-emerald-300' },
  { indent: 1, content: 'available: true,', color: 'text-amber-300' },
  { indent: 0, content: '}', color: 'text-slate-300' },
]

export default function Hero({ onOpenResume }: { onOpenResume: () => void }) {
  const { personalInfo } = usePortfolio()
  const glowRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const handleMouse = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [prefersReduced])

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-grid"
      aria-label="Hero section"
    >
      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="mouse-glow"
        aria-hidden="true"
      />

      {/* Particle canvas */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Status badge */}
            <motion.div variants={item} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to opportunities
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={item}>
              <h1 className="font-display font-bold leading-[1.1] mb-4">
                <span className="block text-slate-400 text-2xl md:text-3xl font-medium mb-2 tracking-wide">
                  Hi, I'm
                </span>
                <span className="block text-5xl md:text-7xl text-white">
                  {personalInfo.name}
                </span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.div variants={item} className="mb-6">
              <p className="text-xl md:text-2xl font-medium">
                <span className="gradient-text">{personalInfo.title}</span>
                <span className="text-slate-500 mx-3">|</span>
                <span className="text-slate-300">{personalInfo.subtitle}</span>
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-slate-400 text-lg leading-relaxed max-w-xl mb-10"
            >
              {personalInfo.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-8">
              <motion.button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-glow-blue hover:scale-105"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                onClick={onOpenResume}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-white/[0.12] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                View Resume
              </motion.button>
            </motion.div>

            {/* Secondary link */}
            <motion.div variants={item} className="flex items-center gap-6">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-1.5 transition-colors group"
              >
                Let's Connect
                <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <div className="flex items-center gap-3">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-white transition-colors" aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side — Code visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Code editor card */}
              <div className="glass-card rounded-2xl border border-white/[0.1] overflow-hidden shadow-glass">
                {/* Editor title bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-3 text-slate-500 text-xs font-mono">developer.ts</span>
                </div>

                {/* Code lines */}
                <div className="p-6 font-mono text-sm leading-relaxed">
                  {codeLines.map((line, i) => (
                    <div
                      key={i}
                      className={`${line.color} flex`}
                    >
                      <span className="text-slate-600 select-none w-6 mr-4 text-right flex-shrink-0">
                        {i + 1}
                      </span>
                      <span style={{ paddingLeft: `${line.indent * 16}px` }}>
                        {line.content.includes('"Hari"') ? `name: "${personalInfo.name}",` : line.content}
                      </span>
                    </div>
                  ))}

                  {/* Cursor */}
                  <div className="flex mt-1">
                    <span className="text-slate-600 select-none w-6 mr-4 text-right">8</span>
                    <span className="inline-block w-2 h-5 bg-blue-400" />
                  </div>
                </div>
              </div>

              {/* Badges - static position */}
              <div className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2.5 border border-blue-500/20 shadow-glow-blue/10">
                <span className="text-xs font-mono text-blue-300">⚛️ React</span>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2.5 border border-violet-500/20 shadow-glow-violet/10">
                <span className="text-xs font-mono text-violet-300">🐍 Python</span>
              </div>

              <div className="absolute top-1/2 -right-8 glass-card rounded-xl px-4 py-2.5 border border-cyan-500/20 shadow-glow-cyan/10">
                <span className="text-xs font-mono text-cyan-300">🟢 Node.js</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-slate-500 text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={16} className="text-slate-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
