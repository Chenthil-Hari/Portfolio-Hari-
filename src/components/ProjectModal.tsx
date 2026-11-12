import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Github,
  ExternalLink,
  Cpu,
  AlertCircle,
  Lightbulb,
  Wrench,
  CheckCircle2,
  Play,
  Mail,
  Send,
  Loader2,
  Sparkles,
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
                {/* Email Specs Toggle */}
                <button
                  onClick={() => setShowEmailDrawer(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    showEmailDrawer
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                  }`}
                  aria-label="Email Specs & Architecture"
                >
                  <Mail size={13} className="text-indigo-400" />
                  <span className="hidden sm:inline">Email Tech Specs</span>
                </button>

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

            {/* Email Case Study Drawer */}
            <AnimatePresence>
              {showEmailDrawer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-indigo-950/40 border-b border-indigo-500/25 px-6 py-3.5 overflow-hidden"
                >
                  {sendSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono py-1">
                      <CheckCircle2 size={16} />
                      <span>Technical brief sent! Check your inbox for the complete breakdown.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendCaseStudy} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 flex-shrink-0">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span>Email Architecture Brief:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 sm:w-40"
                        disabled={isSending}
                      />
                      <input
                        type="email"
                        required
                        placeholder="engineer@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 flex-1"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        {isSending ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            <span>Send Specs</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                  {sendError && (
                    <p className="text-[11px] font-mono text-rose-400 mt-1">{sendError}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
                    <AlertCircle size={15} />
                    <span>The Engineering Problem</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{project.problem}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                    <Lightbulb size={15} />
                    <span>The Implemented Solution</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* My Contribution */}
              {project.myContribution && (
                <div className="p-5 rounded-2xl bg-indigo-600/[0.04] border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider">
                    <Cpu size={15} />
                    <span>My Core Contribution</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">{project.myContribution}</p>
                </div>
              )}

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-white text-base mb-3">
                    System Architecture &amp; Key Features
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {project.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] text-slate-300 text-xs sm:text-sm"
                      >
                        <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                  <Wrench size={15} />
                  <span>Engineering Challenges &amp; Resolution</span>
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
                <button
                  onClick={() => setShowEmailDrawer(prev => !prev)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                >
                  <Mail size={13} />
                  <span>Email Specs</span>
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-all border border-white/[0.08]"
                  >
                    <Github size={14} />
                    View Code
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
