import { ArrowUpRight, Github, Linkedin, Mail, FileText, Terminal } from 'lucide-react'
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
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                {personalInfo.fullName}.
                <span className="block text-slate-400 text-2xl sm:text-3xl lg:text-4xl font-normal mt-2">
                  Computer Science Student &amp; Developer.
                </span>
              </h1>
            </div>

            {/* Clear, honest introduction */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
              Computer Science and Engineering undergraduate at Amrita Vishwa Vidyapeetham (Class of 2024–2028).
              I build and deploy practical applications spanning full-stack web engineering, AI/ML fraud detection models,
              and interactive cybersecurity platforms using Python, React, and modern cloud platforms.
            </p>

            {/* Live human status note */}
            <div className="flex items-start gap-3 p-3.5 rounded bg-[#10121a] border border-white/10 text-xs font-mono max-w-xl">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
              <div className="text-slate-300 space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider text-[11px] block">Current Focus</span>
                <p>
                  Strengthening core DSA &amp; system fundamentals while engineering Generative &amp; Agentic AI workflows.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <span>View Projects</span>
                <ArrowUpRight size={14} />
              </a>

              <button
                onClick={onOpenResume}
                className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#10121a] hover:bg-[#151824] border border-white/10 text-slate-200 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <FileText size={14} className="text-blue-400" />
                <span>Resume (PDF)</span>
              </button>

              <a
                href="#contact"
                className="px-4 py-2.5 rounded border border-transparent hover:border-white/10 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                Contact &rarr;
              </a>
            </div>

            {/* Direct Verification Links */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-6 text-xs font-mono text-slate-400">
              <span className="uppercase tracking-widest text-[11px] text-slate-400">Profiles:</span>
              <div className="flex items-center gap-4">
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
          <div className="lg:col-span-5">
            <div className="editorial-card p-6 sm:p-7 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-blue-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    System Specification
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>

              {/* Specification Table */}
              <dl className="space-y-3.5 text-xs font-mono divide-y divide-white/[0.04]">
                <div className="pt-2 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Candidate</dt>
                  <dd className="text-white text-right font-sans font-medium">{personalInfo.fullName}</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Academic Program</dt>
                  <dd className="text-slate-200 text-right">B.Tech Computer Science (2024–2028)</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Institution</dt>
                  <dd className="text-slate-200 text-right">Amrita Vishwa Vidyapeetham</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">AI / ML Tooling</dt>
                  <dd className="text-slate-200 text-right">Python, Scikit-learn, Pandas, Streamlit</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Web Architecture</dt>
                  <dd className="text-slate-200 text-right">React.js, Next.js, Vite, MySQL, REST</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Core Foundations</dt>
                  <dd className="text-slate-200 text-right">C, C++, Java, DSA, DBMS, OS, Networks</dd>
                </div>

                <div className="pt-3 flex justify-between items-start gap-4">
                  <dt className="text-slate-400 uppercase tracking-wider">Availability</dt>
                  <dd className="text-emerald-400 text-right">Software &amp; AI Engineering Roles</dd>
                </div>
              </dl>

              {/* Bottom Architectural Note */}
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
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
