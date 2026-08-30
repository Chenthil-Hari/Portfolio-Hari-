import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Code2, Lightbulb, Wrench, Zap, AlertCircle } from 'lucide-react'
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
            className="modal-backdrop"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[1001] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            <div className="glass-card rounded-2xl border border-white/[0.1] min-h-full p-6 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2 block">
                    {project.role}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {project.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors flex-shrink-0 ml-4"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map(tech => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Problem */}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-rose-500/10">
                        <AlertCircle size={15} className="text-rose-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Problem</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.problem}</p>
                  </div>

                  {/* Solution */}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <Lightbulb size={15} className="text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Solution</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.solution}</p>
                  </div>

                  {/* My Contribution */}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-violet-500/10">
                        <Code2 size={15} className="text-violet-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">My Contribution</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.myContribution}</p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Key Features */}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10">
                        <Zap size={15} className="text-cyan-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Features</h3>
                    </div>
                    <ul className="space-y-2">
                      {project.keyFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-blue-400 mt-0.5 flex-shrink-0">▸</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-amber-500/10">
                        <Wrench size={15} className="text-amber-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Challenges</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.challenges}</p>
                  </div>
                </div>
              </div>

              {/* ─── Live Traffic Simulator (only for smart-traffic project) ─── */}
              {project.id === 'smart-traffic' && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Live Demo</span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[10px] font-mono text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-full">Interactive Sandbox</span>
                  </div>
                  <TrafficSimulator />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/[0.08]">
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card glass-card-hover text-slate-300 hover:text-white text-sm font-medium transition-all border border-white/[0.08]"
                  >
                    <Github size={16} />
                    View on GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
