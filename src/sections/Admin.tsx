import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Save, LogOut, ArrowLeft, Loader2, CheckCircle2, AlertCircle,
  LayoutDashboard, User, Code2, FolderGit, GraduationCap, MessageSquare,
  Search, Palette, Shield, FileText, Plus, Trash2, Edit3, Eye,
  ExternalLink, Download, Upload, Copy, Check, Sparkles, RefreshCw,
  HelpCircle, Menu, X, ArrowUpRight, Cpu, Layers
} from 'lucide-react'
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkills,
  projectsData as defaultProjects,
  journeyData as defaultJourney
} from '@/data/portfolio'

interface AdminProps {
  initialData: any
  onClose: () => void
}

type TabType =
  | 'overview'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'journey'
  | 'guestbook'
  | 'seo'
  | 'theme'
  | 'media'
  | 'security'

export default function Admin({ initialData, onClose }: AdminProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Consolidated Database Content State
  const [content, setContent] = useState<any>(() => {
    return {
      personalInfo: initialData?.personalInfo || defaultPersonalInfo,
      skillsData: initialData?.skillsData || defaultSkills,
      projectsData: initialData?.projectsData || defaultProjects,
      journeyData: initialData?.journeyData || defaultJourney,
      seo: initialData?.seo || {
        metaTitle: 'Hari | Software Developer & CSE Student',
        metaDescription: 'Building practical systems, embedded software, and modern full-stack web applications.',
        keywords: 'Hari, Software Developer, Embedded Systems, ESP32, React, MongoDB, Python',
        ogImage: '/avatar.png',
        allowIndexing: true,
      },
      theme: initialData?.theme || {
        accentColor: 'indigo',
        showGuestbook: true,
        showTrafficDemo: true,
      },
    }
  })

  // Action status states
  const [saving, setSaving] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Guestbook live list
  const [guestbookEntries, setGuestbookEntries] = useState<any[]>([])
  const [loadingGuestbook, setLoadingGuestbook] = useState(false)

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4500)
  }

  // Load guestbook entries when entering guestbook tab
  useEffect(() => {
    if (activeTab === 'guestbook' && isAuthenticated) {
      setLoadingGuestbook(true)
      fetch('/api/guestbook')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setGuestbookEntries(data)
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingGuestbook(false))
    }
  }, [activeTab, isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setLoginError('Password is required')
      return
    }
    // Verify locally and unlock
    setIsAuthenticated(true)
    setLoginError('')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          data: {
            personalInfo: content.personalInfo,
            skillsData: content.skillsData,
            projectsData: content.projectsData,
            journeyData: content.journeyData,
            seo: content.seo,
            theme: content.theme,
          },
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update portfolio')
      }

      setHasUnsavedChanges(false)
      showToast('success', 'Changes published live to MongoDB Atlas! Refresh your public site to view updates.')
    } catch (err: any) {
      console.error(err)
      showToast('error', err.message || 'Error saving changes to database.')
    } finally {
      setSaving(false)
    }
  }

  // Export database JSON backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('info', 'JSON backup file downloaded to your device.')
  }

  // ─────────────────────────────────────────────
  //  Content Updaters
  // ─────────────────────────────────────────────
  const updatePersonalInfo = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateSeo = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateTheme = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  // Project Actions
  const handleAddProject = () => {
    const newProj = {
      id: `project-${Date.now()}`,
      title: 'New Engineering Project',
      tagline: 'Brief description of system architecture or impact',
      shortDescription: 'Summarize what was designed and the technical result.',
      description: 'Comprehensive case study of your engineering process and outcomes.',
      problem: 'What friction, constraint, or challenge did this solve?',
      solution: 'How did you solve it through code or hardware?',
      myContribution: 'Your core architectural and code contributions.',
      technologies: ['C++', 'Python', 'React'],
      keyFeatures: ['Feature 1', 'Feature 2'],
      challenges: 'Hardware constraints, timing issues, or scaling hurdles.',
      githubUrl: 'https://github.com/Subramaniampb',
      featured: false,
      category: 'Embedded / IoT' as const,
      hasDemo: false,
    }
    setContent((prev: any) => ({
      ...prev,
      projectsData: [newProj, ...prev.projectsData],
    }))
    setHasUnsavedChanges(true)
    showToast('info', 'New project draft added. Edit its fields below.')
  }

  const handleUpdateProject = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const updated = [...prev.projectsData]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, projectsData: updated }
    })
    setHasUnsavedChanges(true)
  }

  const handleDeleteProject = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      projectsData: prev.projectsData.filter((_: any, i: number) => i !== index),
    }))
    setDeleteConfirm(null)
    setHasUnsavedChanges(true)
    showToast('info', 'Project removed from working draft.')
  }

  // Journey Actions
  const handleAddJourneyItem = () => {
    const newItem = {
      id: `journey-${Date.now()}`,
      period: '2024 — Present',
      title: 'New Position / Degree',
      subtitle: 'Role Title or Program',
      institution: 'Organization or College Name',
      description: 'Summary of activities, coursework, and technical responsibilities.',
      details: ['Key accomplishment or coursework line'],
      tags: ['Engineering', 'Algorithms'],
      badge: 'Active Milestone',
      type: 'experience' as const,
    }
    setContent((prev: any) => ({
      ...prev,
      journeyData: [newItem, ...prev.journeyData],
    }))
    setHasUnsavedChanges(true)
    showToast('info', 'New milestone added.')
  }

  const handleUpdateJourney = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const updated = [...prev.journeyData]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, journeyData: updated }
    })
    setHasUnsavedChanges(true)
  }

  const handleDeleteJourney = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      journeyData: prev.journeyData.filter((_: any, i: number) => i !== index),
    }))
    setDeleteConfirm(null)
    setHasUnsavedChanges(true)
    showToast('info', 'Milestone removed.')
  }

  // Skills Actions
  const handleAddSkillToCategory = (catIdx: number) => {
    const newSkill = { name: 'New Skill', icon: '⚡', level: 'Proficient' as const, highlight: false }
    setContent((prev: any) => {
      const updatedCats = [...prev.skillsData]
      updatedCats[catIdx].skills.push(newSkill)
      return { ...prev, skillsData: updatedCats }
    })
    setHasUnsavedChanges(true)
  }

  const handleRemoveSkill = (catIdx: number, skillIdx: number) => {
    setContent((prev: any) => {
      const updatedCats = [...prev.skillsData]
      updatedCats[catIdx].skills.splice(skillIdx, 1)
      return { ...prev, skillsData: updatedCats }
    })
    setHasUnsavedChanges(true)
  }

  // ─────────────────────────────────────────────
  //  Unauthenticated Login Gate
  // ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090d] text-slate-100 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
        <div className="w-full max-w-md surface-card p-8 border border-white/[0.08] relative z-10 shadow-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors font-mono"
          >
            <ArrowLeft size={13} /> Return to Portfolio
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
              <Lock size={20} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Portfolio Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Authenticate to manage MongoDB Atlas content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="pass" className="block text-xs font-mono text-slate-400 mb-1.5">
                Admin Passcode
              </label>
              <input
                id="pass"
                type="password"
                required
                placeholder="Enter admin password (default: admin123)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field text-center font-mono tracking-widest"
                autoFocus
              />
            </div>

            {loginError && <p className="text-rose-400 text-xs text-center font-mono">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.04] text-center">
            <span className="text-[11px] font-mono text-slate-500">
              Default password: <code className="text-slate-400">admin123</code>
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  //  Authenticated Admin Dashboard
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans">
      {/* Global Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0f1118]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 md:hidden"
            >
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-display font-bold text-white text-xs">
                H
              </div>
              <span className="font-display font-bold text-sm text-white">
                Admin <span className="text-slate-500 text-xs font-normal">Control Center</span>
              </span>
            </div>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MongoDB Atlas Active
            </span>

            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">
                ● Unsaved Draft
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors"
            >
              <Eye size={13} className="text-indigo-400" />
              Preview Live
            </button>

            <button
              onClick={handleExportBackup}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors"
              title="Download JSON Backup"
            >
              <Download size={13} />
              Backup
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>{saving ? 'Publishing...' : 'Publish Live'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
              title="Return to Public Site"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileNavOpen ? 'block fixed inset-y-14 left-0 w-64 bg-[#0f1118] z-30 shadow-2xl' : 'hidden'
          } md:block md:w-60 border-r border-white/[0.08] p-4 flex-shrink-0 space-y-6`}
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3">
              Core Overview
            </span>
            <div className="mt-1.5 space-y-1">
              <button
                onClick={() => { setActiveTab('overview'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard Overview</span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3">
              Content Sections
            </span>
            <div className="mt-1.5 space-y-1">
              <button
                onClick={() => { setActiveTab('hero'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'hero'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <User size={15} />
                <span>Hero &amp; Profile</span>
              </button>

              <button
                onClick={() => { setActiveTab('about'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'about'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Layers size={15} />
                <span>About &amp; Narrative</span>
              </button>

              <button
                onClick={() => { setActiveTab('skills'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'skills'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Code2 size={15} />
                <span>Technical Skills</span>
              </button>

              <button
                onClick={() => { setActiveTab('projects'); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'projects'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit size={15} />
                  <span>Projects Showcase</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08]">
                  {content.projectsData?.length || 0}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('journey'); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'journey'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={15} />
                  <span>Career &amp; Journey</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08]">
                  {content.journeyData?.length || 0}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('guestbook'); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'guestbook'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={15} />
                  <span>Guestbook Moderation</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Live
                </span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3">
              Settings &amp; Media
            </span>
            <div className="mt-1.5 space-y-1">
              <button
                onClick={() => { setActiveTab('seo'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'seo'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Search size={15} />
                <span>SEO &amp; Metadata</span>
              </button>

              <button
                onClick={() => { setActiveTab('theme'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'theme'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Palette size={15} />
                <span>Theme &amp; Ordering</span>
              </button>

              <button
                onClick={() => { setActiveTab('media'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'media'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <FileText size={15} />
                <span>Resume &amp; Assets</span>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setMobileNavOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'security'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Shield size={15} />
                <span>Database &amp; Backup</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
            <span>Admin</span>
            <span>/</span>
            <span className="text-indigo-400 capitalize">{activeTab}</span>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : toast.type === 'error'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="flex-shrink-0" />
                )}
                <span>{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═════════════════════════════════════════
              TAB: OVERVIEW
          ══════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">System Overview</h2>
                <p className="text-slate-400 text-sm mt-1">Live status, metrics, and content management summary.</p>
              </div>

              {/* Stats Matrix */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="surface-card p-5 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Projects</span>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    {content.projectsData?.length || 0}
                  </p>
                  <span className="text-[11px] font-mono text-indigo-400">Published to homepage</span>
                </div>

                <div className="surface-card p-5 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Skill Categories</span>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    {content.skillsData?.length || 0}
                  </p>
                  <span className="text-[11px] font-mono text-cyan-400">Technical domains</span>
                </div>

                <div className="surface-card p-5 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Milestones</span>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    {content.journeyData?.length || 0}
                  </p>
                  <span className="text-[11px] font-mono text-emerald-400">Career &amp; Academic</span>
                </div>

                <div className="surface-card p-5 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Database</span>
                  <p className="text-2xl font-display font-bold text-emerald-400 mt-1">Atlas</p>
                  <span className="text-[11px] font-mono text-slate-400">Serverless Mongo Sync</span>
                </div>
              </div>

              {/* Quick Actions Deck */}
              <div className="surface-card p-6 border border-white/[0.08]">
                <h3 className="font-display font-semibold text-white text-base mb-4">Quick Navigation</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-left transition-colors"
                  >
                    <FolderGit size={18} className="text-indigo-400 mb-2" />
                    <span className="block text-sm font-medium text-white">Add or Edit Project</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Manage case studies &amp; demos</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('hero')}
                    className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-left transition-colors"
                  >
                    <User size={18} className="text-cyan-400 mb-2" />
                    <span className="block text-sm font-medium text-white">Update Bio &amp; Status</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Change availability &amp; intro</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('media')}
                    className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-left transition-colors"
                  >
                    <FileText size={18} className="text-emerald-400 mb-2" />
                    <span className="block text-sm font-medium text-white">Replace Resume PDF</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Update Curriculum Vitae</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: HERO & PROFILE
          ══════════════════════════════════════════ */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Hero &amp; Identity</h2>
                <p className="text-slate-400 text-sm mt-1">Configure your primary intro and availability beacon.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">First / Preferred Name</label>
                    <input
                      type="text"
                      value={content.personalInfo.name}
                      onChange={e => updatePersonalInfo('name', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Full Legal Name</label>
                    <input
                      type="text"
                      value={content.personalInfo.fullName}
                      onChange={e => updatePersonalInfo('fullName', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Primary Professional Title</label>
                  <input
                    type="text"
                    value={content.personalInfo.title}
                    onChange={e => updatePersonalInfo('title', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Hero Headline / Tagline</label>
                  <textarea
                    rows={2}
                    value={content.personalInfo.tagline}
                    onChange={e => updatePersonalInfo('tagline', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Availability Status Text</label>
                    <input
                      type="text"
                      value={content.personalInfo.availability}
                      onChange={e => updatePersonalInfo('availability', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Current Location / Timezone</label>
                    <input
                      type="text"
                      value={content.personalInfo.location}
                      onChange={e => updatePersonalInfo('location', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Social Accounts</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={content.personalInfo.email}
                        onChange={e => updatePersonalInfo('email', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={content.personalInfo.github}
                        onChange={e => updatePersonalInfo('github', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={content.personalInfo.linkedin}
                        onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: ABOUT & NARRATIVE
          ══════════════════════════════════════════ */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">About &amp; Biography</h2>
                <p className="text-slate-400 text-sm mt-1">Edit paragraphs displayed in the About section.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Bio Paragraphs
                </span>
                {content.personalInfo.bio?.map((para: string, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                      <span>Paragraph {idx + 1}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={e => {
                        const newBio = [...content.personalInfo.bio]
                        newBio[idx] = e.target.value
                        updatePersonalInfo('bio', newBio)
                      }}
                      className="input-field resize-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: SKILLS MANAGER
          ══════════════════════════════════════════ */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Technical Arsenal</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage languages, frameworks, and hardware competencies.</p>
                </div>
              </div>

              <div className="space-y-6">
                {content.skillsData?.map((cat: any, catIdx: number) => (
                  <div key={cat.category} className="surface-card p-6 border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div>
                        <h3 className="font-display font-semibold text-white text-base">{cat.category}</h3>
                        <p className="text-xs text-slate-400">{cat.description}</p>
                      </div>
                      <button
                        onClick={() => handleAddSkillToCategory(catIdx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-mono border border-indigo-500/30 transition-colors"
                      >
                        <Plus size={12} /> Add Tool
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {cat.skills?.map((skill: any, skillIdx: number) => (
                        <div
                          key={skillIdx}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <input
                              type="text"
                              value={skill.icon}
                              onChange={e => {
                                const updated = [...content.skillsData]
                                updated[catIdx].skills[skillIdx].icon = e.target.value
                                setContent({ ...content, skillsData: updated })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-7 text-center bg-transparent border-b border-white/[0.1] text-xs"
                            />
                            <input
                              type="text"
                              value={skill.name}
                              onChange={e => {
                                const updated = [...content.skillsData]
                                updated[catIdx].skills[skillIdx].name = e.target.value
                                setContent({ ...content, skillsData: updated })
                                setHasUnsavedChanges(true)
                              }}
                              className="bg-transparent border-b border-white/[0.1] text-xs font-medium text-white w-24 truncate"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveSkill(catIdx, skillIdx)}
                            className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                            title="Delete tool"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: PROJECTS MANAGER
          ══════════════════════════════════════════ */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Projects Manager</h2>
                  <p className="text-slate-400 text-sm mt-1">Create, update, or reorganize your engineering case studies.</p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 self-start sm:self-auto"
                >
                  <Plus size={14} /> New Project
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {content.projectsData?.map((proj: any, idx: number) => (
                  <div key={proj.id || idx} className="surface-card p-6 border border-white/[0.08] space-y-4">
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {proj.category}
                        </span>
                        <h3 className="font-display font-bold text-lg text-white mt-1">{proj.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteConfirm({ type: 'project', id: String(idx), name: proj.title })}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={e => handleUpdateProject(idx, 'title', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={proj.tagline}
                          onChange={e => handleUpdateProject(idx, 'tagline', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={proj.shortDescription}
                        onChange={e => handleUpdateProject(idx, 'shortDescription', e.target.value)}
                        className="input-field resize-none text-xs"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">The Problem</label>
                        <textarea
                          rows={2}
                          value={proj.problem}
                          onChange={e => handleUpdateProject(idx, 'problem', e.target.value)}
                          className="input-field resize-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">The Engineering Solution</label>
                        <textarea
                          rows={2}
                          value={proj.solution}
                          onChange={e => handleUpdateProject(idx, 'solution', e.target.value)}
                          className="input-field resize-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 mb-1">Category</label>
                        <select
                          value={proj.category}
                          onChange={e => handleUpdateProject(idx, 'category', e.target.value)}
                          className="input-field text-xs bg-[#12141c]"
                        >
                          <option value="Embedded / IoT">Embedded / IoT</option>
                          <option value="Algorithms">Algorithms</option>
                          <option value="Circuit Design">Circuit Design</option>
                          <option value="Web Apps">Web Apps</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 mb-1">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl}
                          onChange={e => handleUpdateProject(idx, 'githubUrl', e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={proj.hasDemo || false}
                            onChange={e => handleUpdateProject(idx, 'hasDemo', e.target.checked)}
                            className="rounded accent-indigo-600"
                          />
                          <span>Interactive Simulator Tag</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: JOURNEY (EDUCATION & EXPERIENCE)
          ══════════════════════════════════════════ */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Journey &amp; Education</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage academic history, internships, and technical milestones.</p>
                </div>
                <button
                  onClick={handleAddJourneyItem}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  <Plus size={14} /> Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {content.journeyData?.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="surface-card p-6 border border-white/[0.08] space-y-4">
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-indigo-400">
                          {item.badge}
                        </span>
                        <h3 className="font-display font-bold text-lg text-white mt-1">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.institution}</p>
                      </div>

                      <button
                        onClick={() => setDeleteConfirm({ type: 'journey', id: String(idx), name: item.title })}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => handleUpdateJourney(idx, 'title', e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 mb-1">Institution</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={e => handleUpdateJourney(idx, 'institution', e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 mb-1">Period (e.g. 2022 — 2026)</label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={e => handleUpdateJourney(idx, 'period', e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={e => handleUpdateJourney(idx, 'description', e.target.value)}
                        className="input-field text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: GUESTBOOK MODERATION
          ══════════════════════════════════════════ */}
          {activeTab === 'guestbook' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Live Guestbook Moderation</h2>
                  <p className="text-slate-400 text-sm mt-1">Review public notes stored in MongoDB Atlas.</p>
                </div>
                <button
                  onClick={() => {
                    setLoadingGuestbook(true)
                    fetch('/api/guestbook')
                      .then(res => res.json())
                      .then(data => { if (Array.isArray(data)) setGuestbookEntries(data) })
                      .finally(() => setLoadingGuestbook(false))
                  }}
                  className="p-2 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white"
                  title="Refresh Feed"
                >
                  <RefreshCw size={14} className={loadingGuestbook ? 'animate-spin' : ''} />
                </button>
              </div>

              {loadingGuestbook ? (
                <div className="surface-card p-12 text-center text-slate-500 font-mono text-xs">
                  Fetching entries from MongoDB Atlas...
                </div>
              ) : guestbookEntries.length === 0 ? (
                <div className="surface-card p-12 text-center text-slate-500 text-sm">
                  No guestbook signatures recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {guestbookEntries.map((entry, idx) => (
                    <div
                      key={entry._id || idx}
                      className="surface-card p-4 border border-white/[0.06] flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{entry.name}</span>
                          {entry.role && (
                            <span className="text-[10px] font-mono text-indigo-400 bg-white/[0.04] px-2 py-0.5 rounded">
                              {entry.role}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1">"{entry.message}"</p>
                      </div>

                      <button
                        onClick={() => {
                          setGuestbookEntries(prev => prev.filter((_, i) => i !== idx))
                          showToast('info', 'Entry hidden from local view.')
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-slate-500 hover:text-rose-400 transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: SEO & METADATA
          ══════════════════════════════════════════ */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">SEO &amp; OpenGraph Settings</h2>
                <p className="text-slate-400 text-sm mt-1">Configure how your portfolio appears in Google searches and LinkedIn/Twitter previews.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Meta Page Title</label>
                  <input
                    type="text"
                    value={content.seo.metaTitle}
                    onChange={e => updateSeo('metaTitle', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Meta Description (150–160 chars recommended)</label>
                  <textarea
                    rows={2}
                    value={content.seo.metaDescription}
                    onChange={e => updateSeo('metaDescription', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Target Keywords</label>
                  <input
                    type="text"
                    value={content.seo.keywords}
                    onChange={e => updateSeo('keywords', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-medium text-white">Search Engine Indexing</span>
                    <span className="block text-[11px] text-slate-500 font-mono">Allow Google &amp; Bing to index haritech.me</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={content.seo.allowIndexing}
                    onChange={e => updateSeo('allowIndexing', e.target.checked)}
                    className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: THEME & ORDERING
          ══════════════════════════════════════════ */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Theme &amp; Appearance</h2>
                <p className="text-slate-400 text-sm mt-1">Customize accents and section visibility toggles.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-3">Primary Accent Tone</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'indigo', label: 'Electric Indigo', color: 'bg-indigo-500' },
                      { id: 'cyan', label: 'Cyber Cyan', color: 'bg-cyan-500' },
                      { id: 'emerald', label: 'Matrix Emerald', color: 'bg-emerald-500' },
                      { id: 'amber', label: 'Sunset Amber', color: 'bg-amber-500' },
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => updateTheme('accentColor', theme.id)}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                          content.theme.accentColor === theme.id
                            ? 'bg-white/[0.08] border-indigo-500'
                            : 'bg-white/[0.02] border-white/[0.04]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`} />
                        <span className="text-xs font-medium text-white">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <span className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                    Section Visibility Controls
                  </span>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] cursor-pointer">
                    <span className="text-xs text-white">Enable Visitor Guestbook Section</span>
                    <input
                      type="checkbox"
                      checked={content.theme.showGuestbook}
                      onChange={e => updateTheme('showGuestbook', e.target.checked)}
                      className="rounded accent-indigo-600 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] cursor-pointer">
                    <span className="text-xs text-white">Enable Interactive Traffic Simulator Sandbox</span>
                    <input
                      type="checkbox"
                      checked={content.theme.showTrafficDemo}
                      onChange={e => updateTheme('showTrafficDemo', e.target.checked)}
                      className="rounded accent-indigo-600 w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: RESUME & MEDIA
          ══════════════════════════════════════════ */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Resume &amp; Static Assets</h2>
                <p className="text-slate-400 text-sm mt-1">Manage downloadable resume files and profile picture paths.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-5">
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Curriculum Vitae (PDF)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your resume is served natively at <code className="text-indigo-400">/resume.pdf</code>.
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                    >
                      <ExternalLink size={13} />
                      Test View PDF
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    How to update your resume file
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Simply drop your updated PDF named <code className="text-indigo-400">resume.pdf</code> into the{' '}
                    <code className="text-slate-400">public/</code> directory of this repository and push to GitHub. Vercel will automatically serve the updated version!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: SECURITY & DATABASE
          ══════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Database &amp; Backup Operations</h2>
                <p className="text-slate-400 text-sm mt-1">Snapshot database records or configure access passcodes.</p>
              </div>

              <div className="surface-card p-6 border border-white/[0.08] space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">MongoDB Atlas Connection</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Cluster: cluster0.pekileo.mongodb.net</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-white text-sm mb-2">Snapshot &amp; Backup</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Export a full JSON snapshot of all your portfolio content, projects, and skills for offline backup.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                  >
                    <Download size={14} className="text-indigo-400" />
                    Download Complete JSON Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────
          DESTRUCTIVE CONFIRMATION MODAL
      ───────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="surface-card p-6 max-w-sm w-full border border-rose-500/20 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Confirm Removal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to remove <strong className="text-white">"{deleteConfirm.name}"</strong>?
                  This action cannot be undone once published.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'project') handleDeleteProject(Number(deleteConfirm.id))
                    if (deleteConfirm.type === 'journey') handleDeleteJourney(Number(deleteConfirm.id))
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          LIVE PREVIEW DRAWER / MODAL
      ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col p-4 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <span className="font-display font-bold text-white text-sm">
                Public Website Live Preview
              </span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg bg-white/[0.06] text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 bg-black rounded-xl overflow-hidden mt-4 border border-white/[0.08]">
              <iframe src="/" className="w-full h-full border-0" title="Portfolio Preview" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
