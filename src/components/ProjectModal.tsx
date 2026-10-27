import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Cpu, AlertCircle, Lightbulb, Wrench, CheckCircle2, Play } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import TrafficSimulator from '@/components/TrafficSimulator'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-4 sm:inset-6 md:inset-10 lg:inset-y-12 lg:inset-x-28 z-[1001] flex flex-col bg-[#0f1118] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {project.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                  // {project.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label="View on GitHub"
                  >
                    <Github size={17} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
              {/* Title & Tagline */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                  {project.title}
                </h2>
                <p className="text-slate-400 text-sm md:text-base mt-2">
                  {project.tagline}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map(tech => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Row (if present) */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.metrics.map(m => (
                    <div key={m.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="block text-xs font-mono text-slate-400">{m.label}</span>
                      <span className="block text-sm font-semibold text-white mt-1">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Problem & Solution Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider">
                    <AlertCircle size={14} /> The Problem
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{project.problem}</p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider">
                    <Lightbulb size={14} /> The Engineering Solution
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* My Contributions */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                  <Cpu size={14} /> Key Architecture &amp; Contributions
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{project.myContribution}</p>
              </div>

              {/* Key Features List */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-white text-base">Key Capabilities</h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {project.keyFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-300"
                    >
                      <CheckCircle2 size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges & Key Learnings */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
                  <Wrench size={14} /> Technical Challenges &amp; Solved Constraints
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{project.challenges}</p>
              </div>

              {/* Live Interactive Sandbox for Smart Traffic */}
              {project.id === 'smart-traffic' && (
                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Play size={13} /> Interactive Simulation Sandbox
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Live ESP32 Logic Demonstration</span>
                  </div>
                  <TrafficSimulator />
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
              <span className="text-xs font-mono text-slate-500">
                Created &amp; Documented by Hari
              </span>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-all border border-white/[0.08]"
                  >
                    <Github size={14} />
                    View Source Code
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
