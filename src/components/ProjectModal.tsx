import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Github,
  AlertCircle,
  Lightbulb,
  Wrench,
  CheckCircle2,
  Play,
  Mail,
  Send,
  Loader2,
  BookOpen,
} from 'lucide-react'
import type { Project } from '@/data/portfolio'
import TrafficSimulator from '@/components/TrafficSimulator'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [showEmailDrawer, setShowEmailDrawer] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState('')

  if (!project) return null

  const handleSendCaseStudy = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      const res = await fetch('/api/send-case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          project,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to email case study.')
      }

      setSendSuccess(true)
      setEmail('')
      setName('')
      setTimeout(() => {
        setSendSuccess(false)
        setShowEmailDrawer(false)
      }, 4000)
    } catch (err: any) {
      console.error(err)
      setSendError(err.message || 'Error emailing case study.')
    } finally {
      setIsSending(false)
    }
  }

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-3 sm:inset-6 md:inset-10 lg:inset-y-12 lg:inset-x-28 z-[1001] flex flex-col bg-[#10121a] border border-white/15 rounded-lg overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090a0f]">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  case_study_{project.id}.spec
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmailDrawer(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all border ${
                    showEmailDrawer
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/10'
                  }`}
                  aria-label="Email Specs"
                >
                  <Mail size={13} className="text-blue-400" />
                  <span className="hidden sm:inline">Email Specs</span>
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label="View on GitHub"
                  >
                    <Github size={16} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Email Case Study Drawer */}
            <AnimatePresence>
              {showEmailDrawer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-blue-950/20 border-b border-blue-500/20 px-6 py-3 overflow-hidden font-mono text-xs"
                >
                  {sendSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-400 py-1">
                      <CheckCircle2 size={15} />
                      <span>Specification dispatched. Please check your inbox.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendCaseStudy} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <span className="text-slate-300">Email Architecture Spec:</span>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-1 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 sm:w-36 text-xs"
                        disabled={isSending}
                      />
                      <input
                        type="email"
                        required
                        placeholder="recipient@domain.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-3 py-1 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 text-xs"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        {isSending ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            <span>Dispatch</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                  {sendError && (
                    <p className="text-[11px] text-rose-400 mt-1">{sendError}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 font-sans">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {project.title}
                </h2>
                <p className="text-slate-400 text-sm md:text-base mt-2 font-mono">
                  {project.tagline}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map(tech => (
                    <span key={tech} className="spec-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Part Structured Breakdown */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-4 rounded bg-[#090a0f] border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <AlertCircle size={15} />
                    <span>The Engineering Problem</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.problem}</p>
                </div>

                <div className="p-4 rounded bg-[#090a0f] border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <Lightbulb size={15} />
                    <span>The Technical Approach</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.approach || project.solution}</p>
                </div>

                <div className="p-4 rounded bg-[#090a0f] border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <Wrench size={15} />
                    <span>What Went Wrong / Friction</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.friction || project.challenges}</p>
                </div>

                <div className="p-4 rounded bg-[#090a0f] border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <BookOpen size={15} />
                    <span>Engineering Lesson Learned</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.learned || 'Importance of deterministic firmware state and decoupling.'}</p>
                </div>
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono mb-3">
                    System Architecture &amp; Key Features
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2.5 font-mono text-xs">
                    {project.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded bg-[#090a0f] border border-white/[0.06] text-slate-300"
                      >
                        <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="font-sans">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Sandbox for Smart Traffic */}
              {project.id === 'smart-traffic' && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Play size={13} /> Simulation Sandbox
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Live ESP32 Logic Demonstration</span>
                  </div>
                  <TrafficSimulator />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-[#090a0f] font-mono text-xs">
              <span className="text-slate-500">
                Specification Author: Chenthil Hari
              </span>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 uppercase tracking-wider"
                  >
                    <Github size={13} />
                    <span>View Repository</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
