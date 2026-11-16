import { useState, useEffect, type FormEvent } from 'react'
import { Lottie } from 'lottie-react'
import emailPhishingAnim from '@/assets/email-phishing.json'
import clockAnim from '@/assets/clock.json'
import collabAnim from '@/assets/collab.json'
import handshakeAnim from '@/assets/handshake.json'
import messageAnim from '@/assets/message.json'
import {
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ShieldCheck,
  RotateCw,
} from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

type InquiryType = 'general' | 'opportunity' | 'meeting' | 'collaboration'

export default function Contact() {
  const { personalInfo } = usePortfolio()
  const [copied, setCopied] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [inquiryType, setInquiryType] = useState<InquiryType>('general')
  const [preferredTime, setPreferredTime] = useState('')
  const [honeypot, setHoneypot] = useState('')

  // Built-in Math Challenge CAPTCHA (Option 1)
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [loadingCaptcha, setLoadingCaptcha] = useState(false)

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const fetchCaptcha = async () => {
    setLoadingCaptcha(true)
    try {
      const res = await fetch(`/api/captcha?t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setCaptcha(data)
        setCaptchaAnswer('')
      }
    } catch {
      // Keep existing challenge if refresh fails
    } finally {
      setLoadingCaptcha(false)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !name.trim() || !email.trim()) return

    if (!captchaAnswer.trim()) {
      setSubmitStatus('error')
      setStatusMessage('Please solve the security challenge before submitting.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          inquiryType,
          preferredTime: preferredTime.trim(),
          honeypot,
          captchaAnswer: captchaAnswer.trim(),
          captchaToken: captcha?.token || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Refresh challenge on error
        fetchCaptcha()
        throw new Error(data.error || 'Failed to dispatch message.')
      }

      setSubmitStatus('success')
      setStatusMessage(data.message || 'Transmission received. A confirmation has been dispatched to your email.')

      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setPreferredTime('')
      setCaptchaAnswer('')
      fetchCaptcha()
    } catch (err: any) {
      setSubmitStatus('error')
      setStatusMessage(err.message || 'Transmission failed. Please reach out directly via email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-spacing relative bg-[#090a0f]" aria-label="Direct Contact">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            <span className="text-blue-500 font-bold">06</span>
            <span className="text-white/20">/</span>
            <span>Direct Transmission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Initiate communication.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Open for software engineering opportunities, embedded systems projects, and academic dialogue.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Directives & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-card p-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block pb-3 border-b border-white/10">
                Direct Channels
              </span>

              {/* Email Copy Card */}
              <div className="p-4 rounded bg-[#090a0f] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#151824] border border-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                      Primary Inquiries
                    </span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-xs font-mono text-white hover:text-blue-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all text-xs font-mono"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Profiles */}
              <div className="space-y-2.5 font-mono text-xs">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-[#090a0f] border border-white/[0.06] hover:border-white/20 flex items-center justify-between transition-colors text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Github size={14} />
                    <span>github.com/{personalInfo.githubUsername}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">External &rarr;</span>
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-[#090a0f] border border-white/[0.06] hover:border-white/20 flex items-center justify-between transition-colors text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin size={14} />
                    <span>linkedin.com/in/{personalInfo.githubUsername.toLowerCase()}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">External &rarr;</span>
                </a>
              </div>

              {/* Response SLA Note */}
              <div className="pt-4 border-t border-white/[0.06] font-mono text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Response Horizon:</span>
                  <span className="text-white">&le; 24 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Geographic Base:</span>
                  <span className="text-white">Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transmission Form (7 cols) */}
          <div className="lg:col-span-7 editorial-card p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
              <span className="uppercase tracking-wider text-slate-300">Transmission Payload</span>
              <span className="text-slate-500">Resend &amp; MongoDB Atlas Encrypted</span>
            </div>

            {submitStatus === 'success' ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-28 h-28 mx-auto flex items-center justify-center">
                  <Lottie
                    src={emailPhishingAnim}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-white font-sans">
                  Transmission Dispatched
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-md mx-auto leading-relaxed">
                  {statusMessage}
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-4 px-5 py-2.5 rounded bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/10 transition-colors"
                >
                  Transmit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                {/* Anti-spam honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Inquiry Type Radio / Pill Selection */}
                <div>
                  <label className="block text-slate-400 uppercase tracking-wider mb-2 text-[11px]">
                    Transmission Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'general', label: 'General', anim: messageAnim },
                      { id: 'opportunity', label: 'Opportunity', anim: handshakeAnim },
                      { id: 'meeting', label: '15m Chat', anim: clockAnim },
                      { id: 'collaboration', label: 'Collab', anim: collabAnim },
                    ].map(type => {
                      const isSelected = inquiryType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setInquiryType(type.id as InquiryType)}
                          className={`py-2.5 px-2 rounded-lg border text-center uppercase tracking-wider text-[11px] font-mono transition-all flex items-center justify-center gap-2 group ${
                            isSelected
                              ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md shadow-blue-600/25 scale-[1.02]'
                              : 'bg-[#10121a] border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <Lottie
                              src={type.anim}
                              loop={true}
                              autoplay={true}
                              className="w-full h-full"
                            />
                          </div>
                          <span>{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ada Lovelace"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ada@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Opportunity"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                {inquiryType === 'meeting' && (
                  <div>
                    <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px] flex items-center gap-1.5">
                      <Calendar size={13} className="text-blue-400" />
                      <span>Preferred Meeting Window (Calendar Invite will be attached)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next Tuesday at 4:00 PM IST"
                      value={preferredTime}
                      onChange={e => setPreferredTime(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                    Message Payload *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details regarding the project, timeline, or engineering role..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="input-field text-xs resize-none"
                  />
                </div>

                {/* Mathematical Verification Challenge (Option 1) */}
                <div className="p-3.5 rounded bg-[#10121a] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Security Verification *</span>
                    </label>
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      disabled={loadingCaptcha}
                      title="Generate new arithmetic challenge"
                      className="text-slate-400 hover:text-white flex items-center gap-1.5 text-[10px] uppercase font-mono transition-colors disabled:opacity-50 group"
                    >
                      <RotateCw size={11} className={`transition-transform duration-500 ${loadingCaptcha ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Straight-line unified challenge & input bar */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded bg-black/50 border border-white/15 shadow-inner flex-shrink-0">
                      <span className="font-mono text-xs uppercase tracking-wider text-slate-400 select-none">
                        Challenge:
                      </span>
                      <span className="font-mono text-sm font-bold text-white tracking-widest whitespace-nowrap select-none">
                        {captcha ? `${captcha.question} =` : '... ='}
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        placeholder="?"
                        value={captchaAnswer}
                        onChange={e => setCaptchaAnswer(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-16 px-2 py-1 rounded bg-white/[0.08] border border-white/20 focus:border-blue-500 focus:bg-white/[0.14] text-center font-mono text-sm font-bold text-white placeholder-slate-500 outline-none transition-all"
                        autoComplete="off"
                        maxLength={4}
                      />
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono leading-tight">
                      Compute sum to verify transmission
                    </span>
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">
                    <AlertCircle size={15} />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Direct Transmission</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
