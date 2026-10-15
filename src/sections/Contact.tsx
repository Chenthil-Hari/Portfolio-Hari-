import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

const GOOGLE_FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc3HKz-GCVAd8fWE30HTHAdQ7vwUw-tUVkQP3kT8a5GIqRM5A/viewform?embedded=true'

const GOOGLE_FORM_OPEN_URL =
  'https://forms.gle/7cZ117eGJ6HcUY8m6'

export default function Contact() {
  const { personalInfo } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

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
        {/* Section header */}
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
          {/* Left — Social links */}
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

            {/* Open form in new tab fallback */}
            <motion.a
              href={GOOGLE_FORM_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2 pl-1"
            >
              <ExternalLink size={11} />
              Open contact form in new tab
            </motion.a>
          </motion.div>

          {/* Right — Embedded Google Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Glassmorphic wrapper */}
            <div className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden relative">
              {/* Top bar label */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="text-xs font-mono text-slate-400">// contact_form.google</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live · Responses go to Gmail
                </span>
              </div>

              {/* Google Form iframe */}
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Contact Form"
                width="100%"
                height="560"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                className="block bg-transparent"
                style={{ colorScheme: 'normal' }}
              >
                Loading…
              </iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
