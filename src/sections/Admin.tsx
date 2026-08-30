import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, Save, LogOut, User, FolderGit, Briefcase, GraduationCap, 
  Award, Trash2, Plus, ArrowLeft, Loader2, CheckCircle, AlertCircle
} from 'lucide-react'

interface AdminProps {
  initialData: any
  onClose: () => void
}

export default function Admin({ initialData, onClose }: AdminProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'education' | 'achievements'>('profile')
  const [data, setData] = useState(initialData)
  
  // Status states
  const [saving, setSaving] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    
    // Authenticate by running a test call or just verify payload locally first
    setIsAuthenticated(true)
    setLoginError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setStatusMsg({ type: '', text: '' })

    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data }),
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update portfolio')
      }

      setStatusMsg({ type: 'success', text: 'Portfolio updated successfully! Refresh your site to view changes.' })
    } catch (err: any) {
      console.error(err)
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred while saving.' })
    } finally {
      setSaving(false)
    }
  }

  // ─────────────────────────────────────────────
  //  State Helper Functions
  // ─────────────────────────────────────────────

  // Update single nested personalInfo field
  const updatePersonalInfo = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  // Update single nested education field
  const updateEducation = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }))
  }

  // Update project field inside array
  const updateProject = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const updatedProjects = [...prev.projects]
      updatedProjects[index] = { ...updatedProjects[index], [field]: value }
      return { ...prev, projects: updatedProjects }
    })
  }

  // Add project to array
  const addProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: 'New Project Title',
      shortDescription: 'Brief summary of the project',
      description: 'Full detailed description of the project',
      problem: 'What problem were you solving?',
      solution: 'How did you solve it?',
      myContribution: 'What was your specific role/contribution?',
      technologies: ['React', 'Node.js'],
      keyFeatures: ['Feature 1', 'Feature 2'],
      challenges: 'Describe the main challenges faced',
      githubUrl: '#',
      liveUrl: '',
      featured: false,
      gradient: 'from-blue-600/20 to-cyan-600/20',
      role: 'Developer'
    }
    setData((prev: any) => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  // Delete project from array
  const deleteProject = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      projects: prev.projects.filter((_: any, idx: number) => idx !== index)
    }))
  }

  // Update experience field inside array
  const updateExperience = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const updatedExp = [...prev.experiences]
      updatedExp[index] = { ...updatedExp[index], [field]: value }
      return { ...prev, experiences: updatedExp }
    })
  }

  // Add experience to array
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Job or Contribution Role',
      organization: 'Company/Organization Name',
      period: 'Year — Present',
      description: 'Describe your duties and achievements here.',
      tags: ['React', 'JavaScript'],
      type: 'project'
    }
    setData((prev: any) => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }))
  }

  // Delete experience
  const deleteExperience = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      experiences: prev.experiences.filter((_: any, idx: number) => idx !== index)
    }))
  }

  // Update achievement field inside array
  const updateAchievement = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const updatedAch = [...prev.achievements]
      updatedAch[index] = { ...updatedAch[index], [field]: value }
      return { ...prev, achievements: updatedAch }
    })
  }

  // Add achievement
  const addAchievement = () => {
    const newAch = {
      id: `ach-${Date.now()}`,
      title: 'New Certificate or Hackathon',
      issuer: 'Issuing Organization',
      date: 'Month YYYY',
      description: 'Brief description of what you achieved.',
      type: 'certification',
      link: '#'
    }
    setData((prev: any) => ({
      ...prev,
      achievements: [...prev.achievements, newAch]
    }))
  }

  // Delete achievement
  const deleteAchievement = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      achievements: prev.achievements.filter((_: any, idx: number) => idx !== index)
    }))
  }

  // ─────────────────────────────────────────────
  //  Login Page View
  // ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
        
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/[0.08] relative z-10">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft size={12} /> Back to site
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock size={20} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white text-center">Portfolio Admin</h1>
            <p className="text-xs text-slate-500 text-center mt-1">Authenticate to update database information</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-sm text-slate-400 mb-2">Admin Password</label>
              <input
                id="admin-pass"
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input text-center tracking-widest font-mono"
              />
            </div>
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm transition-all hover:shadow-glow-blue"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  //  Dashboard Layout View
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-primary text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-white">Hari <span className="text-slate-500 text-sm font-light">Admin</span></span>
            <span className="h-4 w-px bg-slate-700" />
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to MongoDB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-all hover:shadow-glow-blue"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-lg glass-card border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid container */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Sidebar tabs */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'projects', icon: FolderGit, label: 'Projects' },
            { id: 'experience', icon: Briefcase, label: 'Experience' },
            { id: 'education', icon: GraduationCap, label: 'Education' },
            { id: 'achievements', icon: Award, label: 'Achievements' },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/[0.06] border-blue-500/30 text-white shadow-glow-blue/5'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </aside>

        {/* Form Panel */}
        <main className="lg:col-span-9 space-y-6">
          {/* Status Message alert */}
          {statusMsg.text && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{statusMsg.text}</p>
            </div>
          )}

          <div className="glass-card rounded-2xl border border-white/[0.08] p-6 md:p-8">
            
            {/* ────────── PROFILE TAB ────────── */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-400" />
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={e => updatePersonalInfo('name', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={data.personalInfo.fullName}
                      onChange={e => updatePersonalInfo('fullName', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Title (Primary)</label>
                    <input
                      type="text"
                      value={data.personalInfo.title}
                      onChange={e => updatePersonalInfo('title', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Subtitle (Secondary)</label>
                    <input
                      type="text"
                      value={data.personalInfo.subtitle}
                      onChange={e => updatePersonalInfo('subtitle', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Hero Tagline</label>
                    <input
                      type="text"
                      value={data.personalInfo.tagline}
                      onChange={e => updatePersonalInfo('tagline', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">About Me Description</label>
                    <textarea
                      rows={5}
                      value={data.personalInfo.about}
                      onChange={e => updatePersonalInfo('about', e.target.value)}
                      className="form-input resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={e => updatePersonalInfo('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">GitHub Username</label>
                    <input
                      type="text"
                      value={data.personalInfo.githubUsername}
                      onChange={e => updatePersonalInfo('githubUsername', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={data.personalInfo.github}
                      onChange={e => updatePersonalInfo('github', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={data.personalInfo.linkedin}
                      onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Profile Photo Path (Vercel public/ folder)</label>
                    <input
                      type="text"
                      value={data.personalInfo.avatar}
                      onChange={e => updatePersonalInfo('avatar', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={data.personalInfo.location}
                      onChange={e => updatePersonalInfo('location', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ────────── PROJECTS TAB ────────── */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-semibold text-xl text-white flex items-center gap-2">
                    <FolderGit size={18} className="text-blue-400" />
                    Manage Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {data.projects.map((project: any, index: number) => (
                    <div key={project.id || index} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-blue-400">Project #{index + 1}</span>
                        <button
                          onClick={() => deleteProject(index)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={e => updateProject(index, 'title', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Project Role / Subtitle</label>
                          <input
                            type="text"
                            value={project.role}
                            onChange={e => updateProject(index, 'role', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Card Summary (Short Description)</label>
                          <input
                            type="text"
                            value={project.shortDescription}
                            onChange={e => updateProject(index, 'shortDescription', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Modal Detail (Full Description)</label>
                          <textarea
                            rows={3}
                            value={project.description}
                            onChange={e => updateProject(index, 'description', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Problem Statement</label>
                          <textarea
                            rows={3}
                            value={project.problem}
                            onChange={e => updateProject(index, 'problem', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Implemented Solution</label>
                          <textarea
                            rows={3}
                            value={project.solution}
                            onChange={e => updateProject(index, 'solution', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">My Contribution / Specific Accomplishments</label>
                          <textarea
                            rows={3}
                            value={project.myContribution}
                            onChange={e => updateProject(index, 'myContribution', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Core Challenges Faced</label>
                          <textarea
                            rows={3}
                            value={project.challenges}
                            onChange={e => updateProject(index, 'challenges', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">GitHub Repo Link</label>
                          <input
                            type="text"
                            value={project.githubUrl}
                            onChange={e => updateProject(index, 'githubUrl', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Live Demo Link</label>
                          <input
                            type="text"
                            value={project.liveUrl}
                            onChange={e => updateProject(index, 'liveUrl', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Technologies Used (comma separated)</label>
                          <input
                            type="text"
                            value={project.technologies.join(', ')}
                            onChange={e => updateProject(index, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Key Features List (comma separated)</label>
                          <input
                            type="text"
                            value={project.keyFeatures.join(', ')}
                            onChange={e => updateProject(index, 'keyFeatures', e.target.value.split(',').map((t: string) => t.trim()))}
                            className="form-input"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <input
                            id={`project-feat-${index}`}
                            type="checkbox"
                            checked={project.featured}
                            onChange={e => updateProject(index, 'featured', e.target.checked)}
                            className="rounded border-slate-700 bg-bg-secondary text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`project-feat-${index}`} className="text-sm font-semibold text-slate-300">Featured (displays double-wide on desktop)</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ────────── EXPERIENCE TAB ────────── */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-semibold text-xl text-white flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-400" />
                    Manage Timeline Experiences
                  </h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
                  >
                    <Plus size={14} /> Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {data.experiences.map((exp: any, index: number) => (
                    <div key={exp.id || index} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-blue-400">Experience #{index + 1}</span>
                        <button
                          onClick={() => deleteExperience(index)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Role/Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={e => updateExperience(index, 'role', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Organization</label>
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={e => updateExperience(index, 'organization', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Period (e.g. 2023 — Present)</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={e => updateExperience(index, 'period', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Type</label>
                          <select
                            value={exp.type}
                            onChange={e => updateExperience(index, 'type', e.target.value)}
                            className="form-input"
                          >
                            <option value="internship">Internship</option>
                            <option value="project">Project / Contribution</option>
                            <option value="activity">Technical Activity / Workshop</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={e => updateExperience(index, 'description', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={exp.tags.join(', ')}
                            onChange={e => updateExperience(index, 'tags', e.target.value.split(',').map((t: string) => t.trim()))}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ────────── EDUCATION TAB ────────── */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <h3 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-400" />
                  Education Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">Degree Title</label>
                    <input
                      type="text"
                      value={data.education.degree}
                      onChange={e => updateEducation('degree', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={data.education.institution}
                      onChange={e => updateEducation('institution', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">Period (e.g. 2022 — 2026)</label>
                    <input
                      type="text"
                      value={data.education.period}
                      onChange={e => updateEducation('period', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">Current Academic Year (Status)</label>
                    <input
                      type="text"
                      value={data.education.year}
                      onChange={e => updateEducation('year', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-slate-500 mb-1">Brief Academic Description</label>
                    <textarea
                      rows={4}
                      value={data.education.description}
                      onChange={e => updateEducation('description', e.target.value)}
                      className="form-input resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ────────── ACHIEVEMENTS TAB ────────── */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-semibold text-xl text-white flex items-center gap-2">
                    <Award size={18} className="text-blue-400" />
                    Manage Achievements & Certifications
                  </h3>
                  <button
                    onClick={addAchievement}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
                  >
                    <Plus size={14} /> Add Achievement
                  </button>
                </div>

                <div className="space-y-6">
                  {data.achievements.map((ach: any, index: number) => (
                    <div key={ach.id || index} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-blue-400">Achievement #{index + 1}</span>
                        <button
                          onClick={() => deleteAchievement(index)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={e => updateAchievement(index, 'title', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Issuer / Host</label>
                          <input
                            type="text"
                            value={ach.issuer}
                            onChange={e => updateAchievement(index, 'issuer', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Date Achieved (e.g. Oct 2024)</label>
                          <input
                            type="text"
                            value={ach.date}
                            onChange={e => updateAchievement(index, 'date', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Type</label>
                          <select
                            value={ach.type}
                            onChange={e => updateAchievement(index, 'type', e.target.value)}
                            className="form-input"
                          >
                            <option value="certification">Certification</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="workshop">Workshop</option>
                            <option value="achievement">Other Achievement</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Reference URL Link (Optional)</label>
                          <input
                            type="text"
                            value={ach.link}
                            onChange={e => updateAchievement(index, 'link', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-slate-500 mb-1">Description Summary</label>
                          <textarea
                            rows={3}
                            value={ach.description}
                            onChange={e => updateAchievement(index, 'description', e.target.value)}
                            className="form-input resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
