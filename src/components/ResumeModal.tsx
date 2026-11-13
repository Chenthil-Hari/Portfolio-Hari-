import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react'

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
        throw new Error(data.error || 'Failed to dispatch resume.')
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-3 sm:inset-6 md:inset-8 lg:inset-y-10 lg:inset-x-24 z-[2001] flex flex-col bg-[#10121a] border border-white/15 rounded-lg overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Resume Document Viewer"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090a0f] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-base">Curriculum Vitae</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                    PDF Document
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">// Chenthil_Hari_Resume.pdf</p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5 font-mono text-xs">
                {/* Email Me Button Toggle */}
                <button
                  onClick={() => setShowEmailInput(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border uppercase tracking-wider ${
                    showEmailInput
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                  }`}
                  aria-label="Email Resume"
                >
                  <Mail size={13} className="text-blue-400" />
                  <span className="hidden sm:inline">Email to Inbox</span>
                </button>

                <a
                  href={resumeUrl}
                  download="Chenthil_Hari_Resume.pdf"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider transition-all"
                  aria-label="Download Resume PDF"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Open PDF in new tab"
                >
                  <ExternalLink size={16} />
                </a>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Email Dispatch Drawer */}
            <AnimatePresence>
              {showEmailInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-blue-950/20 border-b border-blue-500/20 px-6 py-3 overflow-hidden font-mono text-xs"
                >
                  {sendSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-400 py-1">
                      <CheckCircle2 size={15} />
                      <span>Resume dispatched to your email address.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendResume} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <span className="text-slate-300">Dispatch Copy:</span>
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-1 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 sm:w-44 text-xs"
                        disabled={isSending}
                      />
                      <input
                        type="email"
                        required
                        placeholder="recruiter@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-3 py-1 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 text-xs"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        {isSending ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            <span>Send</span>
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

            {/* Embedded PDF Viewer */}
            <div className="flex-1 bg-[#090a0f] relative overflow-hidden">
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title="Chenthil Hari Curriculum Vitae"
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
