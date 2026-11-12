import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, Mail, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
  resumeUrl: string
}

export default function ResumeModal({ isOpen, onClose, resumeUrl }: ResumeModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState('')

  const handleSendResume = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      const res = await fetch('/api/send-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send resume.')
      }

      setSendSuccess(true)
      setEmail('')
      setName('')
      setTimeout(() => {
        setSendSuccess(false)
        setShowEmailInput(false)
      }, 4000)
    } catch (err: any) {
      console.error(err)
      setSendError(err.message || 'Error emailing resume. Please download directly.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[2000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-y-10 lg:inset-x-24 z-[2001] flex flex-col surface-card rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Resume Viewer"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-white">Curriculum Vitae</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    PDF Document
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">// Chenthil_Hari_Resume.pdf</p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                {/* Email Me Button Toggle */}
                <button
                  onClick={() => setShowEmailInput(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                    showEmailInput
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                  }`}
                  aria-label="Toggle Email Resume to Inbox"
                >
                  <Mail size={13} className="text-indigo-400" />
                  <span>Email to Me</span>
                </button>

                {/* Direct Download Button */}
                <a
                  href={resumeUrl}
                  download
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors ml-1"
                  aria-label="Close resume"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Email Dispatch Drawer */}
            <AnimatePresence>
              {showEmailInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-indigo-950/40 border-b border-indigo-500/20 px-6 py-3.5 overflow-hidden"
                >
                  {sendSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono py-1">
                      <CheckCircle2 size={16} />
                      <span>Resume sent! Check your inbox for your copy and candidate profile summary.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendResume} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 flex-shrink-0">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span>Recruiter Quick-Send:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your name / company"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 sm:w-44"
                        disabled={isSending}
                      />
                      <input
                        type="email"
                        required
                        placeholder="recruiter@company.com"
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
                            <span>Send to My Inbox</span>
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

            {/* PDF Viewer Content Area */}
            <div className="flex-1 bg-[#050608] relative">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title="Resume PDF Viewer"
              />

              {/* Fallback overlay in case of iframe blocking or mobile limitations */}
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/80 pointer-events-none opacity-0 hover:opacity-100 transition-opacity flex-col text-center">
                <p className="text-sm text-slate-300 mb-4">Having trouble viewing the PDF preview?</p>
                <div className="flex items-center gap-3 pointer-events-auto">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs font-semibold"
                  >
                    Open in New Tab <ExternalLink size={12} />
                  </a>
                  <a
                    href={resumeUrl}
                    download
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                  >
                    <Download size={12} /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
