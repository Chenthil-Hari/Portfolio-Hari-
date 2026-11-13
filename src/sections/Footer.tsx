import { ArrowUp, Github, Linkedin, Mail, Terminal } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

interface FooterProps {
  onOpenResume: () => void
  onOpenEasterEgg?: () => void
}

export default function Footer({ onOpenResume, onOpenEasterEgg }: FooterProps) {
  const { personalInfo } = usePortfolio()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#06070a] hairline-top pt-16 pb-12 font-mono text-xs" aria-label="Site Colophon">
      <div className="section-wrapper">
        <div className="grid md:grid-cols-12 gap-10 pb-12 hairline-bottom">
          {/* Identity & Scope (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#10121a] border border-white/15 flex items-center justify-center font-bold text-white text-xs">
                CH
              </div>
              <span className="font-semibold text-white tracking-wider uppercase text-sm">
                {personalInfo.fullName}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-sm">
              Undergraduate Computer Science engineer at Anna University, Tamil Nadu.
              Designing microcontroller firmware, quantum physics simulations, and resilient web software.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenEasterEgg}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10121a] hover:bg-[#151824] border border-white/10 text-slate-400 hover:text-white transition-colors text-[11px]"
                title="System diagnostics & telemetry"
              >
                <Terminal size={12} className="text-blue-400" />
                <span>Diagnostics / Telemetry [?]</span>
              </button>
            </div>
          </div>

          {/* Directory Navigation (3 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="uppercase tracking-widest text-slate-400 block text-[11px]">
              Directory Index
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-400 font-sans text-xs">
              <a href="#about" className="hover:text-white transition-colors">
                01 / Background
              </a>
              <a href="#skills" className="hover:text-white transition-colors">
                02 / Disciplines
              </a>
              <a href="#projects" className="hover:text-white transition-colors">
                03 / Projects
              </a>
              <a href="#journey" className="hover:text-white transition-colors">
                04 / Chronology
              </a>
              <a href="#guestbook" className="hover:text-white transition-colors">
                05 / Guestbook
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                06 / Contact
              </a>
            </div>
          </div>

          {/* Verification & Social (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="uppercase tracking-widest text-slate-400 block text-[11px]">
              Verifiable Records
            </span>
            <div className="flex flex-col gap-2 text-slate-400 font-sans text-xs">
              <button
                onClick={onOpenResume}
                className="text-left hover:text-blue-400 transition-colors"
              >
                Curriculum Vitae (PDF)
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
                Direct Email
              </a>
            </div>
          </div>
        </div>

        {/* Colophon Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            <span>&copy; {currentYear} Chenthil Hari. Built with React, TypeScript &amp; Swiss layout discipline.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Server Location: Tamil Nadu, IN (UTC+05:30)</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors uppercase tracking-wider"
              aria-label="Scroll to top of page"
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
