import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Play, Sparkles, Layers } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import { usePortfolio } from '@/context/PortfolioContext'
import ProjectModal from '@/components/ProjectModal'

export default function Projects() {
  const { projectsData } = usePortfolio()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', 'Embedded / IoT', 'Algorithms', 'Circuit Design', 'Web Apps']

  const filteredProjects =
    filter === 'All'
      ? projectsData || []
      : (projectsData || []).filter(p => p.category === filter)

  return (
    <section id="projects" className="section-spacing relative bg-[#090a0f] border-t border-white/[0.04]" aria-label="Featured Projects">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              03 / Selected Inventions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              Featured Engineering Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              From hardware microcontrollers and physics simulations to full-stack web applications.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start md:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="surface-card surface-card-hover p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-indigo-300 border border-white/[0.08]">
                    {project.category}
                  </span>

                  {project.hasDemo && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <Play size={10} className="fill-current" />
                      Interactive Demo
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight size={18} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-2" />
                </h3>

                {/* Tagline / Subtitle */}
                <p className="text-xs font-mono text-slate-400 mt-1 mb-3">
                  {project.tagline}
                </p>

                {/* Summary */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {project.shortDescription}
                </p>

                {/* Metrics Pill Grid */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-2 py-3 mb-6 border-y border-white/[0.04]">
                    {project.metrics.map(m => (
                      <div key={m.label} className="text-center">
                        <span className="block text-xs font-semibold text-white">{m.value}</span>
                        <span className="block text-[10px] font-mono text-slate-500">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.slice(0, 4).map(t => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[11px] font-mono text-slate-500 self-center pl-1">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedProject(project)
                    }}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    View Details &amp; Architecture →
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                      aria-label={`${project.title} on GitHub`}
                    >
                      <Github size={15} />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}