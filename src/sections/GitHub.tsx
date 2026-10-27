import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, ExternalLink, AlertCircle } from 'lucide-react'
import { fetchGitHubRepos, fetchGitHubUser, type GitHubRepo } from '@/lib/github'
import { usePortfolio } from '@/context/PortfolioContext'

function LanguageColor(lang: string | null) {
  const map: Record<string, string> = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-400',
    Python: 'bg-blue-500',
    Java: 'bg-orange-500',
    C: 'bg-slate-400',
    'C++': 'bg-pink-400',
    HTML: 'bg-orange-400',
    CSS: 'bg-purple-400',
  }
  return map[lang ?? ''] ?? 'bg-slate-600'
}

export default function GitHubSection() {
  const { personalInfo } = usePortfolio()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [user, setUser] = useState<{ public_repos: number; followers: number; following: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    Promise.all([
      fetchGitHubRepos(personalInfo.githubUsername),
      fetchGitHubUser(personalInfo.githubUsername),
    ])
      .then(([repos, user]) => {
        setRepos(repos)
        setUser(user)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="github" className="section-padding relative" ref={ref} aria-label="GitHub projects">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">07 — GitHub</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Code, Projects &amp; Experiments
          </h2>
          <p className="text-slate-400 mt-4">
            My public repositories on GitHub. Real data pulled from the GitHub API.
          </p>
        </motion.div>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10"
        >
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 glass-card glass-card-hover rounded-2xl px-5 py-3 border border-white/[0.08] group"
          >
            <Github size={20} className="text-slate-300" />
            <span className="text-slate-200 font-medium text-sm">@{personalInfo.githubUsername}</span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
          </a>

          {user && (
            <div className="flex gap-4">
              {[
                { label: 'Repos', value: user.public_repos },
                { label: 'Followers', value: user.followers },
                { label: 'Following', value: user.following },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-display font-bold text-xl text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/[0.06] h-36 animate-pulse">
                <div className="h-3 bg-white/[0.05] rounded mb-3 w-3/4" />
                <div className="h-2 bg-white/[0.03] rounded mb-2 w-full" />
                <div className="h-2 bg-white/[0.03] rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm glass-card rounded-2xl p-5 border border-white/[0.06]">
            <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
            Could not load GitHub repositories. Visit{' '}
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              github.com/{personalInfo.githubUsername}
            </a>{' '}
            directly.
          </div>
        )}

        {/* Repos grid */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.08] hover:border-blue-500/25 block group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Github size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-white font-medium text-sm truncate group-hover:text-blue-300 transition-colors">
                      {repo.name}
                    </span>
                  </div>
                  <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                </div>

                {repo.description && (
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-auto">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${LanguageColor(repo.language)}`} />
                      <span className="text-xs text-slate-400">{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Star size={11} />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <GitFork size={11} />
                    {repo.forks_count}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No public repositories found.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card glass-card-hover border border-white/[0.08] text-slate-300 hover:text-white text-sm font-medium transition-all"
          >
            <Github size={16} />
            View all on GitHub
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
