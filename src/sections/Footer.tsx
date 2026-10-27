import { ArrowUp, Github, Linkedin, Mail, Heart } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

interface FooterProps {
  onOpenResume: () => void
}

export default function Footer({ onOpenResume }: FooterProps) {
  const { personalInfo } = usePortfolio()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#06070a] border-t border-white/[0.06] pt-16 pb-12" aria-label="Site Footer">
      <div className="section-wrapper">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-display font-bold text-white text-sm">
                H
              </div>
              <span className="font-display font-bold text-lg text-white">
                {personalInfo.name}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Computer Science &amp; Engineering undergraduate focused on building dependable systems, embedded software, and modern web applications.
            </p>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#skills" className="hover:text-white transition-colors">
                Skills
              </a>
              <a href="#projects" className="hover:text-white transition-colors">
                Projects
              </a>
              <a href="#journey" className="hover:text-white transition-colors">
                Journey
              </a>
              <a href="#guestbook" className="hover:text-white transition-colors">
                Guestbook
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Connect & Resume Actions (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Resources &amp; Social
            </span>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <button
                onClick={onOpenResume}
                className="text-left hover:text-indigo-400 transition-colors"
              >
                View Curriculum Vitae (PDF)
              </button>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub Profile
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn Network
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:text-white transition-colors"
              >
                Email Inquiry
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {currentYear} {personalInfo.fullName}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              Engineered with precision &amp; TypeScript
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
