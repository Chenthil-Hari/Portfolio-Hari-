import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, ExternalLink, ArrowRight, Star } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import type { Project } from '@/data/portfolio'
import ProjectModal from '@/components/ProjectModal'

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const isFeatured = project.featured && index < 2

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      onClick={() => onOpen(project)}
      className={`project-card group relative glass-card rounded-2xl border border-white/[0.08] overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-500/30 hover:shadow-glow-blue ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
      aria-label={`${project.title} — Click for details`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8">
        {/* Project visual area */}
        <div className={`mb-6 rounded-xl overflow-hidden bg-gradient-to-br ${project.gradient} border border-white/[0.06] relative ${
          isFeatured ? 'h-48 md:h-56' : 'h-36'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2" aria-hidden="true">
                {project.id === 'smart-traffic' ? '🚦' : project.id === 'quantum-sim' ? '⚛️' : '🌐'}
              </div>
              <span className="text-xs font-mono text-slate-400">{project.role}</span>
            </div>
          </div>
          {/* Animated grid overlay */}
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-3 group-hover:gradient-text transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, isFeatured ? 5 : 3).map(tech => (
            <motion.span
              key={tech}
              className="tech-badge"
              whileHover={{ scale: 1.06 }}
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > (isFeatured ? 5 : 3) && (
            <span className="tech-badge opacity-60">+{project.technologies.length - (isFeatured ? 5 : 3)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={e => { e.stopPropagation(); onOpen(project) }}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group/btn"
          >
            View Details
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>

          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="ml-auto p-2 rounded-lg glass-card glass-card-hover text-slate-400 hover:text-white transition-colors"
              aria-label={`${project.title} GitHub repository`}
            >
              <Github size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-lg glass-card glass-card-hover text-slate-400 hover:text-white transition-colors"
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { projects } = usePortfolio()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="section-padding relative" ref={ref} aria-label="Projects">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">03 — Projects</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Things I've Built
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl">
            A selection of projects that reflect my interests and technical range. Click any card for full details.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setSelectedProject}
            />
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