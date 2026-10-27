import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Code2, Cpu, Database, Wrench } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

const categoryIcons: Record<string, any> = {
  'Core Languages': Code2,
  'Full-Stack Web': Terminal,
  'Embedded & Hardware': Cpu,
  'Databases & DevOps': Database,
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
    <section id="skills" className="section-spacing relative bg-[#08090d] border-t border-white/[0.04]" aria-label="Skills & Technologies">
      <div className="section-wrapper">
        {/* Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              02 / Technical Arsenal
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              Technologies &amp; Competencies
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Languages, frameworks, and hardware environments applied across academic and production projects.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start md:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Category Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCategories.map(cat => {
            const Icon = categoryIcons[cat.category] || Wrench

            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="surface-card p-6 border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-base">
                        {cat.category}
                      </h3>
                      <p className="text-xs text-slate-400">{cat.description}</p>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
                    {cat.skills.map(skill => (
                      <div
                        key={skill.name}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          skill.highlight
                            ? 'bg-white/[0.04] border-white/[0.1] hover:border-indigo-500/40'
                            : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base" aria-hidden="true">
                            {skill.icon}
                          </span>
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {skill.name}
                          </span>
                        </div>
                        {skill.level && (
                          <span className="text-[10px] font-mono text-slate-500 pl-1">
                            {skill.level === 'Advanced' ? 'Adv' : 'Pro'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{cat.skills.length} tools verified</span>
                  <span>Active in projects</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}