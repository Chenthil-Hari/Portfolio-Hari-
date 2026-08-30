import { useState, useRef, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function Contact() {
  const { personalInfo } = usePortfolio()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulated success — no real email sent. Integrate with Formspree/EmailJS to enable.
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 1200)
  }

  const socials = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: `github.com/${personalInfo.githubUsername}`,
      href: personalInfo.github,
      color: 'text-slate-300',
      bg: 'bg-white/[0.05]',
      border: 'border-white/[0.1]',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: personalInfo.linkedin,
      color: 'text-blue-400',
      bg: 'bg-blue-600/10',
      border: 'border-blue-600/20',
    },
  ]

  return (
    <section id="contact" className="section-padding relative" ref={ref} aria-label="Contact">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">08 — Contact</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-4">
            Let's Build Something
            <span className="gradient-text block">Together.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have an idea, opportunity, or project in mind? I'd love to hear about it.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-slate-300 font-semibold mb-6">Reach out directly</h3>
            {socials.map(({ icon: Icon, label, value, href, color, bg, border }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-4 p-4 rounded-2xl glass-card glass-card-hover border ${border} block`}
              >
                <div className={`p-3 rounded-xl ${bg} border ${border}`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-white text-sm font-medium">{value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-10 border border-emerald-500/20 text-center h-full flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4"
                >
                  <CheckCircle size={28} className="text-emerald-400" />
                </motion.div>
                <h3 className="text-white font-display font-bold text-xl mb-2">Message received!</h3>
                <p className="text-slate-400 text-sm">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <p className="text-slate-600 text-xs mt-4 font-mono">
                  // Note: Connect a real email service (Formspree / EmailJS) to enable sending.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-white/[0.08] space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-slate-400 mb-2">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-slate-400 mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="form-input resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm disabled:opacity-60 transition-all hover:shadow-glow-blue"
                >
                  {sending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-slate-600 text-xs text-center font-mono">
                  // Form shows success animation. Connect Formspree/EmailJS for real delivery.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
