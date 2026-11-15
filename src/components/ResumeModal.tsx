import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lottie } from 'lottie-react'
import emailPhishingAnim from '@/assets/email-phishing.json'
import docDownloadAnim from '@/assets/document-download.json'
import {
  X,
  ExternalLink,
  Mail,
  Send,
  Loader2,
  Check,
  Download,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react'

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
  const [downloaded, setDownloaded] = useState(false)

  const handleDownloadClick = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3500)
  }

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
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[2000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl max-h-[92vh] z-[2001] flex flex-col bg-[#10121a] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum Vitae Download Hub"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090a0f]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-semibold text-white text-sm sm:text-base font-sans">
                  Curriculum Vitae Document Hub
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Verified PDF
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setShowEmailInput(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border uppercase tracking-wider text-[11px] ${
                    showEmailInput
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                  }`}
                  aria-label="Email Resume"
                >
                  <Mail size={13} className="text-blue-400" />
                  <span className="hidden sm:inline">Email to Inbox</span>
                </button>

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
                  className="bg-blue-950/30 border-b border-blue-500/20 px-6 py-3.5 overflow-hidden font-mono text-xs"
                >
                  {sendSuccess ? (
                    <div className="flex items-center gap-2.5 text-emerald-400 py-1">
                      <div className="w-7 h-7 flex-shrink-0">
                        <Lottie src={emailPhishingAnim} loop={true} className="w-full h-full" />
                      </div>
                      <span className="font-medium">Curriculum Vitae dispatched to your inbox.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendResume} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <span className="text-slate-300 flex-shrink-0">Dispatch Copy:</span>
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 sm:w-44 text-xs"
                        disabled={isSending}
                      />
                      <input
                        type="email"
                        required
                        placeholder="recruiter@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 text-xs"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors"
                      >
                        {isSending ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={13} />
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

            {/* Modal Body: Large Document Download Centerpiece */}
            <div className="p-6 sm:p-10 text-center overflow-y-auto space-y-6">
              {/* BIG Animated Document Download Icon */}
              <div className="relative inline-block mx-auto">
                <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center p-4 rounded-2xl bg-[#090a0f] border border-white/15 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                  <Lottie
                    src={docDownloadAnim}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-[11px]">
                  <FileText size={12} className="text-blue-400" />
                  <span>Chenthil_Hari_Resume.pdf</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-semibold">120.5 KB</span>
                </div>
              </div>

              {/* Candidate Bio & Degree */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                  B S Chenthil Hari
                </h2>
                <p className="text-xs sm:text-sm font-mono text-slate-400">
                  B.Tech Computer Science and Engineering · Amrita Vishwa Vidyapeetham
                </p>
                <p className="text-xs font-mono text-emerald-400">
                  Class of 2024–2028 · Tamil Nadu, India
                </p>
              </div>

              {/* Primary Download & View Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <a
                  href={resumeUrl}
                  download="Chenthil_Hari_Resume.pdf"
                  onClick={handleDownloadClick}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                  aria-label="Download Resume PDF"
                >
                  {downloaded ? (
                    <>
                      <Check size={16} className="text-emerald-300" />
                      <span>Downloaded Successfully</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download Resume (PDF)</span>
                    </>
                  )}
                </a>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all"
                  aria-label="Open PDF in new tab"
                >
                  <ExternalLink size={15} className="text-slate-300" />
                  <span>Open in Tab</span>
                </a>
              </div>

              {/* Verified Academic Profile Details */}
              <div className="pt-6 border-t border-white/10 text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-blue-400" />
                  <span>Verified Credentials Highlight</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded bg-black/40 border border-white/[0.08]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Degree</span>
                    <span className="text-white font-semibold text-xs mt-0.5 block">B.Tech CSE</span>
                  </div>
                  <div className="p-3 rounded bg-black/40 border border-white/[0.08]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">University</span>
                    <span className="text-emerald-400 font-semibold text-xs mt-0.5 block">Amrita</span>
                  </div>
                  <div className="p-3 rounded bg-black/40 border border-white/[0.08]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Academic Score</span>
                    <span className="text-white font-semibold text-xs mt-0.5 block">CGPA 6.58 / 10</span>
                  </div>
                  <div className="p-3 rounded bg-black/40 border border-white/[0.08]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Schooling</span>
                    <span className="text-blue-400 font-semibold text-xs mt-0.5 block">CBSE XII (77%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
