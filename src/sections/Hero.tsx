import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles, MapPin, Cpu, Globe, Terminal } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

interface HeroProps {
  onOpenResume: () => void
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { personalInfo } = usePortfolio()
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-grid-subtle"
      aria-label="Hero Introduction"
    >
      {/* Subtle radial ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>B.Tech CSE Undergraduate · 3rd Year</span>
            </motion.div>

            {/* Main Title & Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Hi, I'm <span className="gradient-text-accent">{personalInfo.name}</span>.
                <span className="block text-slate-300 text-2xl sm:text-3xl lg:text-4xl font-normal mt-2">
                  Software Developer & Engineer.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle / Value Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              Building practical systems, embedded software, and modern web applications.
              Passionate about turning algorithmic concepts and hardware logic into clean, functional digital products.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
              >
                Explore Projects
              </a>

              <button
                onClick={onOpenResume}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 font-medium text-sm transition-all hover:-translate-y-0.5"
              >
                <FileText size={16} className="text-indigo-400" />
                View Resume
              </button>

              <a
                href="#contact"
                className="px-5 py-3 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                Get in Touch →
              </a>
            </motion.div>

            {/* Quick Social Proof Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 pt-4 text-slate-400 text-xs"
            >
              <span>Connect directly:</span>
              <div className="flex items-center gap-3">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/[0.06] transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github size={15} />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/[0.06] transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/[0.06] transition-all"
                  aria-label="Send Email"
                >
                  <Mail size={15} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Density Developer Snapshot Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <div className="surface-card p-6 sm:p-7 relative overflow-hidden shadow-2xl">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">developer_snapshot.json</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  verified
                </span>
              </div>

              {/* Developer Details Matrix */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Focus Areas</h2>
                    <p className="text-sm font-medium text-white mt-0.5">
                      Embedded Systems &amp; Full-Stack Web
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ESP32, Embedded C, React, Node.js, MongoDB
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Featured Inventions</h2>
                    <p className="text-sm font-medium text-white mt-0.5">
                      Smart Traffic Signal &amp; Quantum Simulator
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dynamic density algorithm + quantum decoherence model
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Status &amp; Location</h2>
                    <p className="text-sm font-medium text-white mt-0.5">
                      B.Tech CSE (3rd Year) · India
                    </p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open for software engineering opportunities
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Statistics */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="block text-base font-display font-bold text-white">3rd Year</span>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Undergrad</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="block text-base font-display font-bold text-indigo-400">6+</span>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Projects</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="block text-base font-display font-bold text-cyan-400">4+</span>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Languages</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <div className="mt-14 flex items-center justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-mono transition-colors"
          >
            <span>DISCOVER MORE</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
