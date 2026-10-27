import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Copy, Check, Send, ExternalLink, Clock, Sparkles } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function Contact() {
  const { personalInfo } = usePortfolio()
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDirectSend = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const mailtoSubject = encodeURIComponent(subject || `Inquiry from ${name || 'Portfolio Visitor'}`)
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from ${personalInfo.name}'s Portfolio`
    )

    window.location.href = `mailto:${personalInfo.email}?subject=${mailtoSubject}&body=${mailtoBody}`
  }

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
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Launches your default email client with your message</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <form onSubmit={handleDirectSend} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Maya Patel"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. maya@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="e.g. Software Developer Opportunity / Project Collaboration"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Hello Hari, I came across your portfolio and wanted to discuss..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35"
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
