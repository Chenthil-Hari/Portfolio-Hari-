import { ArrowUpRight, Github, Linkedin, Mail, Terminal } from 'lucide-react'
import { Lottie } from 'lottie-react'
import docDownloadAnim from '@/assets/document-download.json'
import { usePortfolio } from '@/context/PortfolioContext'

interface HeroProps {
  onOpenResume: () => void
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { personalInfo } = usePortfolio()

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center pt-32 pb-20 architectural-grid hairline-bottom"
      aria-label="Introduction and Overview"
    >
      <div className="section-wrapper relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column: Editorial Headline & Stance */}
          <div className="lg:col-span-7 space-y-7">
            {/* Section Index Marker */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
              <span className="text-blue-500 font-bold">00</span>
              <span className="text-white/20">/</span>
              <span>Engineering Overview</span>
            </div>

            {/* Headline */}
            <div className="space-y-3 min-w-0">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] break-words">
                {personalInfo.fullName}.
                <span className="block text-slate-400 text-xl sm:text-3xl lg:text-4xl font-normal mt-2">
                  Computer Science Student &amp; Developer.
                </span>
              </h1>
            </div>

            {/* Clear, honest introduction */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-sans">
              Computer Science and Engineering undergraduate at Amrita Vishwa Vidyapeetham (Class of 2024–2028).
              I build and deploy practical applications spanning full-stack web engineering, AI/ML fraud detection models,
              and interactive cybersecurity platforms using Python, React, and modern cloud platforms.
            </p>

            {/* Live human status note */}
            <div className="flex items-start gap-3 p-3.5 rounded bg-[var(--surface)] border border-[var(--border)] text-xs font-mono max-w-xl min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
              <div className="text-slate-300 space-y-0.5 min-w-0">
                <span className="text-slate-400 uppercase tracking-wider text-[11px] block">Current Focus</span>
                <p className="break-words">
                  Strengthening core DSA &amp; system fundamentals while engineering Generative &amp; Agentic AI workflows.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <a
                href="#projects"
                className="px-4 sm:px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>View Projects</span>
                <ArrowUpRight size={14} />
              </a>

              <button
                onClick={onOpenResume}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--border)] text-slate-200 font-mono text-xs uppercase tracking-wider transition-all group shadow-sm"
              >
                <div className="w-4 h-4 flex-shrink-0">
                  <Lottie src={docDownloadAnim} loop={true} className="w-full h-full" />
                </div>
                <span>Resume (PDF)</span>
              </button>

              <a
                href="#contact"
                className="px-3.5 sm:px-4 py-2.5 rounded border border-transparent hover:border-[var(--border)] text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                Contact &rarr;
              </a>
            </div>

            {/* Direct Verification Links */}
            <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono text-slate-400 min-w-0">
              <span className="uppercase tracking-widest text-[11px] text-slate-400 flex-shrink-0">Profiles:</span>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Engineering Specification */}
          <div className="lg:col-span-5 min-w-0 max-w-full">
            <div className="editorial-card p-4 sm:p-6 sm:p-7 relative min-w-0 max-w-full">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-5">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 truncate">
                    System Specification
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                  Verified
                </span>
              </div>

              {/* Specification Table */}
              <dl className="space-y-3.5 text-xs font-mono divide-y divide-white/[0.04]">
                <div className="pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Candidate</dt>
                  <dd className="text-white sm:text-right font-sans font-medium break-words min-w-0">{personalInfo.fullName}</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Academic Program</dt>
                  <dd className="text-slate-200 sm:text-right break-words min-w-0">B.Tech Computer Science (2024–2028)</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Institution</dt>
                  <dd className="text-slate-200 sm:text-right break-words min-w-0">Amrita Vishwa Vidyapeetham</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">AI / ML Tooling</dt>
                  <dd className="text-slate-200 sm:text-right break-words min-w-0">Python, Scikit-learn, Pandas, Streamlit</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Web Architecture</dt>
                  <dd className="text-slate-200 sm:text-right break-words min-w-0">React.js, Next.js, Vite, MySQL, REST</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Core Foundations</dt>
                  <dd className="text-slate-200 sm:text-right break-words min-w-0">C, C++, Java, DSA, DBMS, OS, Networks</dd>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 min-w-0">
                  <dt className="text-slate-400 uppercase tracking-wider flex-shrink-0">Availability</dt>
                  <dd className="text-emerald-400 sm:text-right break-words min-w-0">Software &amp; AI Engineering Roles</dd>
                </div>
              </dl>

              {/* Bottom Architectural Note */}
              <div className="mt-6 pt-4 border-t border-[var(--border)] text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-1">
                <span>Location: Tamil Nadu, India</span>
                <span>Graduating: 2028</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
