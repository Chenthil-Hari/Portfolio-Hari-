import { useState } from 'react'
import { ArrowUpRight, Github, Play, ExternalLink } from 'lucide-react'
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
    <section id="projects" className="section-spacing relative bg-[#090a0f] hairline-bottom" aria-label="Selected Projects">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
              <span className="text-blue-500 font-bold">03</span>
              <span className="text-white/20">/</span>
              <span>Selected Engineering Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Case studies &amp; technical projects.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Each project is structured as: the problem, the technical approach, the friction encountered, and the engineering lesson learned.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded bg-[#10121a] border border-white/10 self-start md:self-auto font-mono text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                  filter === cat
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Case Studies List */}
        <div className="space-y-10">
          {filteredProjects.map((project, idx) => (
            <article
              key={project.id}
              className="editorial-card p-6 sm:p-8 relative group transition-all"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-semibold uppercase tracking-wider">
                    {`[0${idx + 1}]`} {project.category}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{project.tagline}</span>
                </div>

                <div className="flex items-center gap-3">
                  {project.hasDemo && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Play size={10} className="fill-current" />
                      <span>Live Simulation Demo</span>
                    </button>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      aria-label={`${project.title} on GitHub`}
                    >
                      <Github size={13} />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Title & One-Line Summary */}
              <div className="mb-6">
                <h3
                  onClick={() => setSelectedProject(project)}
                  className="text-2xl sm:text-3xl font-bold text-white hover:text-blue-400 cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <span>{project.title}</span>
                  <ArrowUpRight size={20} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl font-sans">
                  {project.description}
                </p>
              </div>

              {/* 4-Part Engineering Breakdown: Problem / Approach / Friction / Learned */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded bg-[#090a0f] border border-white/[0.06] mb-6 font-sans text-xs">
                {/* The Problem */}
                <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-white/[0.06] pb-3 md:pb-0 md:pr-4">
                  <span className="font-mono uppercase tracking-wider text-[11px] text-red-400 font-semibold block">
                    The Problem
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* My Approach */}
                <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-white/[0.06] pb-3 md:pb-0 md:pr-4">
                  <span className="font-mono uppercase tracking-wider text-[11px] text-blue-400 font-semibold block">
                    My Approach
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {project.approach || project.solution}
                  </p>
                </div>

                {/* What Went Wrong / Friction */}
                <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-white/[0.06] pb-3 md:pb-0 md:pr-4">
                  <span className="font-mono uppercase tracking-wider text-[11px] text-amber-400 font-semibold block">
                    What Went Wrong
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {project.friction || project.challenges}
                  </p>
                </div>

                {/* What I Learned */}
                <div className="space-y-1.5">
                  <span className="font-mono uppercase tracking-wider text-[11px] text-emerald-400 font-semibold block">
                    What I Learned
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {project.learned || 'Engineering trade-offs and hardware/software boundaries.'}
                  </p>
                </div>
              </div>

              {/* Technologies & Trigger Details Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="spec-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  <span>Detailed Case Study</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal for In-depth Case Study & Simulation */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  )
}
