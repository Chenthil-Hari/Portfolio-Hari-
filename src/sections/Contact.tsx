import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  Send,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Calendar,
  Briefcase,
  MessageSquare,
  Users,
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

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [hasCalendarInvite, setHasCalendarInvite] = useState(false)
  const [submittedDetails, setSubmittedDetails] = useState<{ name: string; email: string } | null>(null)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !name.trim() || !email.trim()) return

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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message. Please try again.')
      }

      setSubmittedDetails({ name: name.trim(), email: email.trim() })
      setHasCalendarInvite(Boolean(data.hasCalendarInvite))
      setSubmitStatus('success')
      setStatusMessage(data.message || 'Message sent! A confirmation email has been dispatched to your inbox.')

      // Reset form fields
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setPreferredTime('')
    } catch (err: any) {
      console.error('Contact form submission error:', err)
      setSubmitStatus('error')
      setStatusMessage(err.message || 'An error occurred while sending your message. Please try again or reach out directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setSubmitStatus('idle')
    setStatusMessage('')
    setSubmittedDetails(null)
    setHasCalendarInvite(false)
  }

  const handleMailtoFallback = () => {
    const mailtoSubject = encodeURIComponent(subject || `Inquiry from ${name || 'Portfolio Visitor'}`)
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}\n\n---\nSent from ${personalInfo.name}'s Portfolio`
    )
    window.location.href = `mailto:${personalInfo.email}?subject=${mailtoSubject}&body=${mailtoBody}`
  }

  const inquiryOptions: { type: InquiryType; label: string; icon: any }[] = [
    { type: 'general', label: 'General', icon: MessageSquare },
    { type: 'opportunity', label: 'Job / Internship', icon: Briefcase },
    { type: 'meeting', label: '15-min Chat (.ics)', icon: Calendar },
    { type: 'collaboration', label: 'Project Collab', icon: Users },
  ]

  return (
    <section id="contact" className="section-spacing relative bg-[#08090d] border-t border-white/[0.04]" aria-label="Contact Hari">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            06 / Get In Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2">
            Let's build something remarkable together.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Open for software developer internships, full-time opportunities, open-source collaboration, and technical discussions.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Direct Communication Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick 1-Click Copy Email Card */}
            <div className="surface-card p-6 border border-white/[0.08] relative overflow-hidden">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Direct Email
              </span>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2.5 truncate">
                  <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                  <span className="text-sm font-mono text-white truncate">
                    {personalInfo.email}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-mono flex items-center gap-1.5 transition-colors flex-shrink-0 border border-indigo-500/20"
                  aria-label="Copy Email Address"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-400">
                <Clock size={13} className="text-indigo-400" />
                <span>Typical response time: within 24 hours</span>
              </div>
            </div>

            {/* Social Accounts Card */}
            <div className="surface-card p-6 border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Social &amp; Developer Profiles
              </span>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-white">
                    <Github size={16} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white">GitHub</span>
                    <span className="block text-xs font-mono text-slate-400">@{personalInfo.githubUsername}</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Linkedin size={16} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white">LinkedIn</span>
                    <span className="block text-xs font-mono text-slate-400">
                      {personalInfo.linkedin?.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '').replace(/\/$/, '') || 'Connect'}
                    </span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>
            </div>

            {/* Google Form Alternate Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Sparkles size={14} className="text-indigo-400" />
                <span>Prefer a structured form?</span>
              </div>
              <a
                href="https://forms.gle/7cZ117eGJ6HcUY8m6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
              >
                Google Form <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Interactive Direct Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="surface-card p-6 sm:p-8 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Send a Direct Message</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Delivered directly to Hari with an instant receipt &amp; optional calendar invite
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">Active</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-6 text-center space-y-4"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={32} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-xl text-white">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-sm text-slate-300 max-w-md mx-auto">
                        Thank you, <span className="text-white font-medium">{submittedDetails?.name}</span>. Hari has been notified and will review your note.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 max-w-md mx-auto space-y-1.5">
                      <p className="flex items-center justify-center gap-1.5 text-indigo-300 font-mono">
                        <Mail size={13} />
                        Receipt dispatched to: <span className="text-white">{submittedDetails?.email}</span>
                      </p>
                      {hasCalendarInvite && (
                        <p className="flex items-center justify-center gap-1.5 text-emerald-300 font-mono text-[11px]">
                          <Calendar size={13} />
                          Provisional .ics Calendar Invite attached to email!
                        </p>
                      )}
                      <p className="text-slate-400 pt-1">
                        Check your inbox for a summary of your message and helpful links.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleResetForm}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-mono transition-colors border border-white/[0.08]"
                      >
                        <RotateCcw size={13} />
                        Send Another Message
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Bot Honeypot (Hidden) */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website_honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={e => setHoneypot(e.target.value)}
                      />
                    </div>

                    {/* Inquiry Type Pills */}
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Inquiry Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {inquiryOptions.map(opt => {
                          const Icon = opt.icon
                          const isSelected = inquiryType === opt.type
                          return (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => setInquiryType(opt.type)}
                              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                                isSelected
                                  ? 'bg-indigo-600/25 border-indigo-500/50 text-white shadow-sm shadow-indigo-600/30'
                                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                              }`}
                            >
                              <Icon size={13} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                              <span className="truncate">{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Error Banner */}
                    {submitStatus === 'error' && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-rose-400" />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-white">{statusMessage}</p>
                          <p className="text-[11px] text-rose-300/80">
                            You can also{' '}
                            <button
                              type="button"
                              onClick={handleMailtoFallback}
                              className="underline text-white font-medium hover:text-indigo-300"
                            >
                              open in your email app
                            </button>{' '}
                            or email directly at{' '}
                            <span className="font-mono text-white">{personalInfo.email}</span>.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5">
                          Your Name <span className="text-indigo-400">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="e.g. Maya Patel"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="input-field"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5">
                          Your Email Address <span className="text-indigo-400">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="e.g. maya@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="input-field"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5">
                          Subject
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          placeholder="e.g. Software Developer Opportunity"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="input-field"
                          disabled={isSubmitting}
                        />
                      </div>

                      {inquiryType === 'meeting' ? (
                        <div>
                          <label htmlFor="contact-time" className="block text-xs font-mono text-indigo-300 mb-1.5">
                            Preferred Timing (Optional)
                          </label>
                          <input
                            id="contact-time"
                            type="text"
                            placeholder="e.g. Weekday evenings / Tomorrow 4 PM"
                            value={preferredTime}
                            onChange={e => setPreferredTime(e.target.value)}
                            className="input-field border-indigo-500/30"
                            disabled={isSubmitting}
                          />
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="contact-notes" className="block text-xs font-mono text-slate-400 mb-1.5">
                            Role / Organization (Optional)
                          </label>
                          <input
                            id="contact-notes"
                            type="text"
                            placeholder="e.g. Acme Tech / Freelance"
                            value={preferredTime}
                            onChange={e => setPreferredTime(e.target.value)}
                            className="input-field"
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400">
                          Message <span className="text-indigo-400">*</span>
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">
                          {message.length} chars
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder={
                          inquiryType === 'meeting'
                            ? 'Hi Hari, I would love to connect for 15 minutes to discuss...'
                            : inquiryType === 'opportunity'
                            ? 'Hi Hari, we have an open role for a Software Developer and would like to talk...'
                            : 'Hello Hari, I came across your portfolio and wanted to discuss...'
                        }
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="input-field resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending &amp; Dispatching Calendar Invite...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>
                            {inquiryType === 'meeting' ? 'Send & Request Calendar Invite' : 'Send Message'}
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400 font-mono mt-2">
                      🔒 Powered by Resend &bull; Delivered to <span className="text-slate-300">noreply@haritech.me</span> &bull; {inquiryType === 'meeting' ? 'Includes .ics calendar invitation' : 'Instant email confirmation'}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
