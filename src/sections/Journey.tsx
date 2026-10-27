import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Trophy, Calendar, CheckCircle, Award } from 'lucide-react'
import { journeyData, type JourneyItem } from '@/data/portfolio'

export default function Journey() {
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'experience' | 'achievement'>('all')

  const filteredItems =
    activeTab === 'all'
      ? journeyData
      : journeyData.filter(item => item.type === activeTab)

  return (
    <section id="journey" className="section-spacing relative bg-[#08090d] border-t border-white/[0.04]" aria-label="Experience and Education Journey">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              04 / Career &amp; Education
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              Journey &amp; Milestones
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Academic progression in Computer Science alongside hands-on software &amp; embedded engineering.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Milestones
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'experience'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('achievement')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'achievement'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Competitions
            </button>
          </div>
        </div>

        {/* Journey Timeline Cards */}
        <div className="space-y-6">
          {filteredItems.map((item, idx) => {
            const Icon =
              item.type === 'education'
                ? GraduationCap
                : item.type === 'experience'
                ? Briefcase
                : Trophy

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="surface-card p-6 sm:p-7 border border-white/[0.07] relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                      <Icon size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                          {item.title}
                        </h3>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/[0.04] text-indigo-300 border border-white/[0.08]">
                          {item.badge}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-300 mt-0.5">
                        {item.institution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/[0.02] px-3 py-1 rounded-lg border border-white/[0.04] self-start md:self-auto">
                    <Calendar size={13} className="text-indigo-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Bullet details if provided */}
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-1.5 mb-5 text-xs text-slate-400">
                    {item.details.map((detail, di) => (
                      <li key={di} className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                  {item.tags.map(tag => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
