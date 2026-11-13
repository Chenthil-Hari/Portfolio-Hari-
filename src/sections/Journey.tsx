import { useState } from 'react'
import { GraduationCap, Briefcase, Trophy, Calendar } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

export default function Journey() {
  const { journeyData } = usePortfolio()
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'experience' | 'achievement'>('all')

  const filteredItems =
    activeTab === 'all'
      ? journeyData || []
      : (journeyData || []).filter(item => item.type === activeTab)

  return (
    <section id="journey" className="section-spacing relative bg-[#090a0f] hairline-bottom" aria-label="Chronology and Timeline">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
              <span className="text-blue-500 font-bold">04</span>
              <span className="text-white/20">/</span>
              <span>Chronology &amp; Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Academic progression &amp; engineering work.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              University Computer Science fundamentals combined with independent hardware laboratory work and web software contributions.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded bg-[#10121a] border border-white/10 self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Chronology
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                activeTab === 'education'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                activeTab === 'experience'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('achievement')}
              className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                activeTab === 'achievement'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Symposiums
            </button>
          </div>
        </div>

        {/* Chronology Ledger */}
        <div className="space-y-6">
          {filteredItems.map(item => {
            const Icon =
              item.type === 'education'
                ? GraduationCap
                : item.type === 'experience'
                ? Briefcase
                : Trophy

            return (
              <div
                key={item.id}
                className="editorial-card p-6 sm:p-7 relative transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#151824] border border-white/10 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg font-sans">
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        {item.institution} · {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={13} />
                      {item.period}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10 uppercase tracking-wider text-[11px]">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans max-w-4xl">
                  {item.description}
                </p>

                {/* Details List */}
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-1.5 mb-5 font-sans text-xs text-slate-400 list-disc list-inside">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.04]">
                  {item.tags.map(tag => (
                    <span key={tag} className="spec-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
