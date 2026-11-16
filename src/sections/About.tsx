import { useState } from 'react'
import { Compass, BookOpen, ShieldCheck, BrainCircuit } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function About() {
  const { personalInfo } = usePortfolio()
  const [imgFailed, setImgFailed] = useState(false)
  const [imgSrc, setImgSrc] = useState(personalInfo.avatar || '/avatar.jpg')

  return (
    <section id="about" className="section-spacing relative bg-[var(--canvas)] hairline-bottom" aria-label="About Chenthil Hari">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            <span className="text-blue-500 font-bold">01</span>
            <span className="text-white/20">/</span>
            <span>Background &amp; Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Building software at the intersection of web, AI &amp; security.
          </h2>
        </div>

        {/* Asymmetric Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base leading-relaxed font-sans">
            <p>
              I am a Computer Science and Engineering undergraduate at Amrita Vishwa Vidyapeetham (Class of 2024–2028).
              My engineering focus centers on building deployed, tangible applications across full-stack web engineering,
              applied AI/ML, and cybersecurity awareness.
            </p>

            <p>
              Rather than staying purely theoretical, I enjoy developing tools that solve practical problems:
              engineering machine-learning models to predict fraud and scam risks in Python and Streamlit,
              building interactive cybersecurity simulation environments with React (SecuritySim),
              and designing multi-role project marketplaces with Next.js and relational databases (IdeaMatch).
            </p>

            <p>
              In my academic coursework, I am continuously strengthening my core computer science foundations —
              from Data Structures, Algorithms, and Database Management Systems to Operating Systems,
              Computer Networks, and Theory of Computation.
            </p>

            {/* Three Real Engineering Principles */}
            <div className="pt-6 grid sm:grid-cols-3 gap-4 border-t border-[var(--border)]">
              <div className="p-3.5 rounded bg-[var(--surface)] border border-[var(--border)] space-y-1.5 shadow-sm">
                <div className="text-blue-500 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit size={14} />
                  <span>Applied AI/ML</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Building classification pipelines in Python, Scikit-learn, and interactive Streamlit UIs.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[var(--surface)] border border-[var(--border)] space-y-1.5 shadow-sm">
                <div className="text-blue-500 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Security Literacy</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Creating interactive simulations to teach users how modern cyber threats operate.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[var(--surface)] border border-[var(--border)] space-y-1.5 shadow-sm">
                <div className="text-blue-500 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} />
                  <span>Full-Stack Web</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Architecting multi-role web platforms using React, Next.js, and structured relational schemas.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Profile Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 min-w-0 max-w-full">
            <div className="editorial-card p-4 sm:p-6 relative min-w-0 max-w-full">
              {/* Profile Image with Swiss Hairline Border */}
              <div className="flex items-center gap-3 sm:gap-4 pb-5 border-b border-[var(--border)] min-w-0">
                {!imgFailed ? (
                  <img
                    src={imgSrc}
                    alt="Chenthil Hari"
                    onError={() => {
                      if (!imgSrc.endsWith('/avatar.jpg')) {
                        setImgSrc('/avatar.jpg')
                      } else if (!imgSrc.endsWith('/avatar.png')) {
                        setImgSrc('/avatar.png')
                      } else {
                        setImgFailed(true)
                      }
                    }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover border border-[var(--border)] bg-[var(--surface-raised)] flex-shrink-0"
                    loading="lazy"
                    width="64"
                    height="64"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded border border-[var(--border)] bg-gradient-to-br from-blue-500/20 via-[var(--surface-raised)] to-[var(--canvas)] flex items-center justify-center font-mono font-bold text-base sm:text-lg text-blue-500 dark:text-blue-400 select-none shadow-inner flex-shrink-0">
                    CH
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-base truncate">{personalInfo.fullName}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 truncate">B.Tech Computer Science</p>
                  <p className="text-xs font-mono text-emerald-400 mt-0.5 truncate">Amrita Vishwa Vidyapeetham</p>
                </div>
              </div>

              {/* Coursework & Verified Academic Record */}
              <div className="pt-4 space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-blue-400 flex-shrink-0" />
                    <span>Core Coursework &amp; Fundamentals</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs break-words">
                    Data Structures &amp; Algorithms, Operating Systems, Database Management Systems, Computer Networks, Theory of Computation, Computer Organization, Digital Logic.
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-2.5">
                  <span className="text-slate-400 uppercase tracking-wider block text-[11px]">
                    Academic Standing &amp; Schooling
                  </span>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 text-slate-300">
                    <span>B.Tech CSE (Amrita):</span>
                    <span className="text-white font-medium">CGPA: 6.58 / 10 · Class of 2028</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 text-slate-300">
                    <span>Class XII (CBSE):</span>
                    <span className="text-white font-medium">77% (2024)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 text-slate-300">
                    <span>Class X (CBSE):</span>
                    <span className="text-white font-medium">87.4% (2022)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 text-slate-400">
                  <span>Location</span>
                  <span className="text-white font-medium">Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
