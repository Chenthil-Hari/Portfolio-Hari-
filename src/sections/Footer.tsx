import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function Footer() {
  const { personalInfo } = usePortfolio()
  const year = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-6" aria-label="Footer">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* Social links */}
        <div className="flex items-center gap-4">
          {[
            { href: personalInfo.github, icon: Github, label: 'GitHub' },
            { href: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
            { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
          ].map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              className="p-3 rounded-xl glass-card border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
              aria-label={label}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Brand */}
        <div className="text-center">
          <p className="text-slate-500 text-sm flex items-center gap-1.5 justify-center">
            Designed &amp; Built by
            <span className="gradient-text font-semibold">{personalInfo.name}</span>
            with <Heart size={12} className="text-rose-400 fill-current" />
          </p>
          <p className="text-slate-600 text-xs mt-1">
            &copy; {year} {personalInfo.fullName || personalInfo.name}. All rights reserved.
          </p>
        </div>

        {/* Back to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -2 }}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors font-mono"
        >
          Back to top ↑
        </motion.button>
      </div>
    </footer>
  )
}
