import { Compass, BookOpen, Cpu, ShieldCheck } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function About() {
  const { personalInfo } = usePortfolio()

  return (
    <section id="about" className="section-spacing relative bg-[#090a0f] hairline-bottom" aria-label="About Chenthil Hari">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            <span className="text-blue-500 font-bold">01</span>
            <span className="text-white/20">/</span>
            <span>Background &amp; Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineering from hardware logic to the browser viewport.
          </h2>
        </div>

        {/* Asymmetric Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base leading-relaxed font-sans">
            <p>
              I am an undergraduate Computer Science and Engineering student at Anna University / Engineering Institute in Tamil Nadu.
              I prefer understanding systems from the hardware level up — whether that means configuring timer interrupts on an ESP32,
              analyzing signal delays on a virtual oscilloscope in Proteus, or structuring reliable serverless endpoints for modern web apps.
            </p>

            <p>
              In university coursework and independent lab work, I frequently bridge the gap between low-level embedded software and web architectures.
              I write cycle-conscious C/C++ for sensor-driven embedded devices, model quantum gate operations and state damping in Python using NumPy,
              and build responsive full-stack applications with React, TypeScript, and MongoDB.
            </p>

            <p>
              My goal is to build dependable systems that solve real, tangible bottlenecks — like eliminating urban intersection wait times with
              proportional density algorithms, or ensuring transactional email delivery remains resilient against third-party network jitter.
            </p>

            {/* Three Real Engineering Principles (Replacing generic badges) */}
            <div className="pt-6 grid sm:grid-cols-3 gap-4 border-t border-white/[0.08]">
              <div className="p-3.5 rounded bg-[#10121a] border border-white/10 space-y-1.5">
                <div className="text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} />
                  <span>Deterministic</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Understanding clock cycles, memory limits, and hardware registers before abstracting.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#10121a] border border-white/10 space-y-1.5">
                <div className="text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Resilient APIs</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Strict input sanitization, error boundaries, and defensive serverless handlers.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#10121a] border border-white/10 space-y-1.5">
                <div className="text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} />
                  <span>Simulation First</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Validating circuits in Proteus and algorithms in Python before committing hardware.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Profile & Image Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-card p-6 relative">
              {/* Profile Image with Swiss Hairline Border */}
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <img
                  src={personalInfo.avatar || '/avatar.jpg'}
                  alt="Chenthil Hari"
                  className="w-16 h-16 rounded object-cover border border-white/20 bg-[#151824]"
                  loading="lazy"
                  width="64"
                  height="64"
                />
                <div>
                  <h3 className="font-semibold text-white text-base">{personalInfo.fullName}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Undergraduate Engineer</p>
                  <p className="text-xs font-mono text-emerald-400 mt-0.5">Anna University · 2022–2026</p>
                </div>
              </div>

              {/* Coursework & Lab Focus */}
              <div className="pt-4 space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-blue-400" />
                    Core Coursework
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    Data Structures &amp; Algorithms, Computer Architecture, Operating Systems, Database Management Systems, Computer Networks.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.04]">
                  <span className="text-slate-400 uppercase tracking-wider block mb-1.5">
                    Laboratory Experience
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    Embedded C/C++ firmware development, ESP32 microcontroller GPIO control, Proteus schematic simulation, and full-stack MERN engineering.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.04] flex justify-between items-center text-slate-400">
                  <span>Current Academic Year</span>
                  <span className="text-white font-medium">3rd Year (Semester 5/6)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
