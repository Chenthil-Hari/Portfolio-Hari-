import { useState } from 'react'
import { Terminal, Cpu, Layers, Database, Code2 } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

const categoryIcons: Record<string, any> = {
  'Core Languages': Code2,
  'Embedded & Hardware Systems': Cpu,
  'Full-Stack Web Engineering': Layers,
  'Databases & Infrastructure': Database,
}

export default function Skills() {
  const { skillsData } = usePortfolio()
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', ...(skillsData || []).map(c => c.category)]

  const filteredCategories =
    activeCategory === 'All'
      ? skillsData
      : skillsData.filter(c => c.category === activeCategory)

  return (
    <section id="skills" className="section-spacing relative bg-[#090a0f] hairline-bottom" aria-label="Technical Disciplines">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
              <span className="text-blue-500 font-bold">02</span>
              <span className="text-white/20">/</span>
              <span>Technical Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Languages, hardware tools &amp; web infrastructure.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Directly applied in undergraduate coursework, hardware laboratory projects, and full-stack software.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded bg-[#10121a] border border-white/10 self-start md:self-auto font-mono text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat === 'All' ? 'All Disciplines' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Disciplines Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCategories.map(cat => {
            const Icon = categoryIcons[cat.category] || Terminal

            return (
              <div
                key={cat.category}
                className="editorial-card p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#151824] border border-white/10 flex items-center justify-center text-blue-400">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base font-sans">
                          {cat.category}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {cat.code || '01'} · Technical Domain
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 font-sans leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Skills List with Technical Context (No cartoon emojis) */}
                  <div className="space-y-2.5 font-mono text-xs">
                    {cat.skills.map(skill => (
                      <div
                        key={skill.name}
                        className="p-3 rounded bg-[#090a0f] border border-white/[0.06] hover:border-white/15 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                          <span className="font-semibold text-white">{skill.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-sans">
                          {skill.context}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
