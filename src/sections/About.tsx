import { motion } from 'framer-motion'
import { Cpu, Layers, Code, Compass, CheckCircle2 } from 'lucide-react'
import { personalInfo } from '@/data/portfolio'

const pillars = [
  {
    icon: Cpu,
    title: 'Embedded & Hardware Thinking',
    description:
      'Comfortable working close to the hardware — configuring ESP32 microcontrollers, writing cycle-conscious Embedded C code, and simulating schematics in Proteus.',
    tag: 'Systems Level',
  },
  {
    icon: Layers,
    title: 'Full-Stack Web Engineering',
    description:
      'Building performant, accessible digital products with modern React, TypeScript, Node.js, and MongoDB. Focused on clean state management and intuitive UX.',
    tag: 'Web & APIs',
  },
  {
    icon: Code,
    title: 'Algorithmic Problem Solving',
    description:
      'Grounded in computer science fundamentals: data structures, algorithm design, computational modeling, and mathematical simulation in Python and NumPy.',
    tag: 'Core CS',
  },
]

export default function About() {
  return (
    <section id="about" className="section-spacing relative bg-[#090a0f] border-t border-white/[0.04]" aria-label="About Hari">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            01 / Background &amp; Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
            Engineering solutions from silicon to screen.
          </h2>
        </div>

        {/* Story Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 text-base leading-relaxed">
            {personalInfo.bio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Clean Code Advocate
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Collaborative Contributor
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Continuous Learner
              </span>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="lg:col-span-5">
            <div className="surface-card p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Compass size={16} className="text-indigo-400" />
                <h3 className="font-display font-semibold text-white text-sm">Quick Overview</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/[0.03]">
                  <span className="text-slate-400">Education</span>
                  <span className="font-medium text-white text-right">B.Tech CSE (3rd Year)</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/[0.03]">
                  <span className="text-slate-400">Graduation Year</span>
                  <span className="font-medium text-white">2026</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/[0.03]">
                  <span className="text-slate-400">Core Expertise</span>
                  <span className="font-medium text-white">Full-Stack &amp; Embedded</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/[0.03]">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-white">India</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5">
                  <span className="text-slate-400">Target Opportunities</span>
                  <span className="font-mono text-emerald-400 text-xs">Internships / SDE Roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Engineering Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="surface-card surface-card-hover p-6 border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
