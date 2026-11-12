import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Save, LogOut, ArrowLeft, Loader2, CheckCircle2, AlertCircle,
  LayoutDashboard, User, Code2, FolderGit, GraduationCap, MessageSquare,
  Search, Palette, Shield, FileText, Plus, Trash2, Edit3, Eye,
  ExternalLink, Download, Upload, Copy, Check, Sparkles, RefreshCw,
  HelpCircle, Menu, X, ArrowUpRight, Cpu, Layers,
  Mail, Send, Clock, Inbox, Reply, Database, BarChart3,
  Bot, CheckCircle, XCircle, AlertTriangle, Filter, ChevronDown, ChevronUp, History, Radio
} from 'lucide-react'
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkills,
  projectsData as defaultProjects,
  journeyData as defaultJourney
} from '@/data/portfolio'

interface AdminProps {
  initialData: any
  initialTab?: TabType
  onClose: () => void
  onUpdateData?: (data: any) => void
}

type TabType =
  | 'overview'
  | 'mail-agent'
  | 'inbox'
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

export default function Admin({ initialData, initialTab = 'overview', onClose, onUpdateData }: AdminProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
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

  // Sync content with initialData as soon as database fetch resolves
  useEffect(() => {
    if (initialData && !hasUnsavedChanges) {
      setContent({
        personalInfo: initialData.personalInfo || defaultPersonalInfo,
        skillsData: initialData.skillsData || initialData.skills || defaultSkills,
        projectsData: initialData.projectsData || initialData.projects || defaultProjects,
        journeyData: initialData.journeyData || defaultJourney,
        seo: initialData.seo || {
          metaTitle: 'Hari | Software Developer & CSE Student',
          metaDescription: 'Building practical systems, embedded software, and modern full-stack web applications.',
          keywords: 'Hari, Software Developer, Embedded Systems, ESP32, React, MongoDB, Python',
          ogImage: '/avatar.png',
          allowIndexing: true,
        },
        theme: initialData.theme || {
          accentColor: 'indigo',
          showGuestbook: true,
          showTrafficDemo: true,
        },
      })
    }
  }, [initialData])

  // Guestbook live list
  const [guestbookEntries, setGuestbookEntries] = useState<any[]>([])
  const [loadingGuestbook, setLoadingGuestbook] = useState(false)

  // Inbox / Messages state
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [backupEmailing, setBackupEmailing] = useState(false)
  const [sendingDigest, setSendingDigest] = useState(false)

  // Haritech AI Email Agent state
  const [mailThreads, setMailThreads] = useState<any[]>([])
  const [mailMetrics, setMailMetrics] = useState<any>({
    totalReceived: 0,
    pendingApprovals: 0,
    sentEmails: 0,
    rejectedEmails: 0,
    failedEmails: 0,
    spamDetected: 0,
    categoryBreakdown: {},
  })
  const [mailMonitoring, setMailMonitoring] = useState<any>(null)
  const [loadingMailAgent, setLoadingMailAgent] = useState(false)
  const [mailStatusFilter, setMailStatusFilter] = useState('all')
  const [mailCategoryFilter, setMailCategoryFilter] = useState('all')
  const [mailSearchQuery, setMailSearchQuery] = useState('')
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null)
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null)
  const [draftEditText, setDraftEditText] = useState('')
  const [performingMailAction, setPerformingMailAction] = useState<string | null>(null)
  const [simulatingAgent, setSimulatingAgent] = useState(false)
  const [syncingGmail, setSyncingGmail] = useState(false)

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

  // Load messages when entering inbox tab
  useEffect(() => {
    if (activeTab === 'inbox' && isAuthenticated) {
      setLoadingMessages(true)
      fetch('/api/messages', {
        headers: { 'x-admin-password': password },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data)
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingMessages(false))
    }
  }, [activeTab, isAuthenticated])

  // Load Haritech AI Email Agent threads & metrics
  const fetchMailAgentData = async () => {
    if (!isAuthenticated) return
    setLoadingMailAgent(true)
    try {
      const queryParams = new URLSearchParams()
      if (mailStatusFilter !== 'all') queryParams.set('status', mailStatusFilter)
      if (mailCategoryFilter !== 'all') queryParams.set('category', mailCategoryFilter)
      if (mailSearchQuery) queryParams.set('search', mailSearchQuery)

      const res = await fetch(`/api/mail-agent?${queryParams.toString()}`, {
        headers: { 'x-admin-password': password },
      })
      if (res.ok) {
        const data = await res.json()
        setMailThreads(data.threads || [])
        if (data.metrics) setMailMetrics(data.metrics)
        if (data.monitoringStatus) setMailMonitoring(data.monitoringStatus)
      }
    } catch (err) {
      console.error('Failed to fetch mail agent data:', err)
    } finally {
      setLoadingMailAgent(false)
    }
  }

  useEffect(() => {
    if ((activeTab === 'mail-agent' || activeTab === 'overview') && isAuthenticated) {
      fetchMailAgentData()
    }
  }, [activeTab, isAuthenticated, mailStatusFilter, mailCategoryFilter])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setLoginError('Password is required')
      // Fire-and-forget security alert for empty password attempt
      fetch('/api/admin-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'login', success: false, reason: 'Empty password' }),
      }).catch(() => {})
      return
    }
    // Verify locally and unlock
    setIsAuthenticated(true)
    setLoginError('')
    // Fire-and-forget security alert for successful login
    fetch('/api/admin-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'login', success: true }),
    }).catch(() => {})
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payloadData = {
        personalInfo: content.personalInfo,
        skillsData: content.skillsData,
        projectsData: content.projectsData,
        journeyData: content.journeyData,
        skills: content.skillsData,
        projects: content.projectsData,
        seo: content.seo,
        theme: content.theme,
      }

      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          data: payloadData,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update portfolio')
      }

      setHasUnsavedChanges(false)
      onUpdateData?.(payloadData)
      showToast('success', 'Changes published live to MongoDB Atlas and applied to your portfolio!')
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

  // Email database backup to owner
  const handleEmailBackup = async () => {
    setBackupEmailing(true)
    try {
      const res = await fetch('/api/backup-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to email backup')
      showToast('success', 'Full database backup emailed to your inbox!')
    } catch (err: any) {
      showToast('error', err.message || 'Backup email failed.')
    } finally {
      setBackupEmailing(false)
    }
  }

  // Manually trigger weekly digest
  const handleTriggerDigest = async () => {
    setSendingDigest(true)
    try {
      const res = await fetch('/api/weekly-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send digest')
      showToast('success', 'Weekly activity digest sent to your email!')
    } catch (err: any) {
      showToast('error', err.message || 'Digest email failed.')
    } finally {
      setSendingDigest(false)
    }
  }

  // Inbox: mark message as read
  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id, read: true }),
      })
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m))
    } catch {}
  }

  // Inbox: delete message
  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id }),
      })
      setMessages(prev => prev.filter(m => m._id !== id))
      setExpandedMessage(null)
      showToast('info', 'Message deleted.')
    } catch {
      showToast('error', 'Failed to delete message.')
    }
  }

  // Inbox: send reply
  const handleSendReply = async (msg: any) => {
    if (!replyText.trim()) return
    setSendingReply(true)
    try {
      const res = await fetch('/api/admin-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, messageId: msg._id, to: msg.email, replyText: replyText.trim(), originalSubject: msg.subject || 'Your message to Hari' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reply failed')
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, replied: true, read: true } : m))
      setReplyText('')
      showToast('success', `Reply sent to ${msg.email}`)
    } catch (err: any) {
      showToast('error', err.message || 'Failed to send reply.')
    } finally {
      setSendingReply(false)
    }
  }

  // ─────────────────────────────────────────────
  //  Haritech AI Email Agent Actions
  // ─────────────────────────────────────────────
  const handleApproveMail = async (threadId: string, customDraft?: string) => {
    setPerformingMailAction(threadId)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          action: 'approve',
          threadId,
          draftReply: customDraft,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Approval failed')
      showToast('success', data.message || 'Approved & sent via Gmail API!')
      setEditingThreadId(null)
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Error approving email.')
    } finally {
      setPerformingMailAction(null)
    }
  }

  const handleRejectMail = async (threadId: string) => {
    setPerformingMailAction(threadId)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'reject', threadId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Rejection failed')
      showToast('info', 'Inquiry marked as rejected. No email will be sent.')
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Error rejecting inquiry.')
    } finally {
      setPerformingMailAction(null)
    }
  }

  const handleSaveDraft = async (threadId: string) => {
    if (!draftEditText.trim()) return
    setPerformingMailAction(threadId)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'edit', threadId, draftReply: draftEditText.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Edit failed')
      showToast('success', 'Draft saved! You can now approve or edit again.')
      setEditingThreadId(null)
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Error saving draft.')
    } finally {
      setPerformingMailAction(null)
    }
  }

  const handleDeleteMailThread = async (threadId: string) => {
    setPerformingMailAction(threadId)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ threadId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      showToast('info', 'Email thread deleted.')
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting thread.')
    } finally {
      setPerformingMailAction(null)
    }
  }

  const handleRunSimulation = async () => {
    setSimulatingAgent(true)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'test-agent' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Simulation failed')
      showToast(
        'success',
        data.telegramNotificationDispatched
          ? 'Simulation complete! Check your Telegram for the approval card.'
          : 'Simulation complete! Created pending draft in your dashboard.'
      )
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Simulation test failed.')
    } finally {
      setSimulatingAgent(false)
    }
  }

  const handleSyncGmail = async () => {
    setSyncingGmail(true)
    try {
      const res = await fetch('/api/mail-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'sync-gmail' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sync failed')
      showToast('info', `Gmail sync complete: ${data.scanned} scanned, ${data.newSynced} new inquiries detected.`)
      fetchMailAgentData()
    } catch (err: any) {
      showToast('error', err.message || 'Gmail sync failed.')
    } finally {
      setSyncingGmail(false)
    }
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
      githubUrl: 'https://github.com/Chenthil-Hari',
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

              <button
                onClick={() => { setActiveTab('mail-agent'); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  activeTab === 'mail-agent'
                    ? 'bg-indigo-600 text-white border-indigo-500/50 shadow-md shadow-indigo-600/20'
                    : 'border-purple-500/20 bg-purple-500/[0.05] text-purple-200 hover:text-white hover:bg-purple-500/[0.12]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bot size={15} className={activeTab === 'mail-agent' ? 'text-white' : 'text-purple-400'} />
                  <span className="font-semibold">AI Email Agent</span>
                </div>
                {mailMetrics.pendingApprovals > 0 ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold animate-pulse">
                    {mailMetrics.pendingApprovals}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">
                    ACTIVE
                  </span>
                )}
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

              <button
                onClick={() => { setActiveTab('inbox'); setMobileNavOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'inbox'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox size={15} />
                  <span>Inbox &amp; Replies</span>
                </div>
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('mail-agent')}
                    className="p-4 rounded-xl bg-purple-500/[0.04] hover:bg-purple-500/[0.08] border border-purple-500/20 text-left transition-colors relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Bot size={18} className="text-purple-400" />
                      {mailMetrics.pendingApprovals > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                          {mailMetrics.pendingApprovals} Pending
                        </span>
                      )}
                    </div>
                    <span className="block text-sm font-semibold text-white group-hover:text-purple-200">AI Email Agent</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Triage, Telegram &amp; Gmail</span>
                  </button>

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
              TAB: HARITECH AI EMAIL AGENT
          ══════════════════════════════════════════ */}
          {activeTab === 'mail-agent' && (
            <div className="space-y-6">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Bot size={18} />
                    </span>
                    <h2 className="font-display font-bold text-2xl text-white">Haritech AI Email Agent</h2>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Monitors inquiries, analyzes with OpenAI, generates replies, and dispatches via Gmail on your Telegram approval.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={handleSyncGmail}
                    disabled={syncingGmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors disabled:opacity-50"
                    title="Poll Gmail inbox for new unread inquiries"
                  >
                    {syncingGmail ? <Loader2 size={13} className="animate-spin text-indigo-400" /> : <RefreshCw size={13} />}
                    <span>{syncingGmail ? 'Syncing Gmail...' : 'Sync Gmail'}</span>
                  </button>

                  <button
                    onClick={handleRunSimulation}
                    disabled={simulatingAgent}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 text-xs font-semibold border border-purple-500/30 transition-all disabled:opacity-50 shadow-sm"
                    title="Simulate an incoming inquiry to test OpenAI analysis & Telegram card"
                  >
                    {simulatingAgent ? <Loader2 size={13} className="animate-spin text-purple-300" /> : <Sparkles size={13} />}
                    <span>{simulatingAgent ? 'Simulating...' : 'Test Simulation'}</span>
                  </button>

                  <button
                    onClick={fetchMailAgentData}
                    disabled={loadingMailAgent}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
                    title="Refresh data"
                  >
                    <RefreshCw size={14} className={loadingMailAgent ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* KPI Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Total Received</span>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    {mailMetrics.totalReceived || 0}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500">Contact &amp; Gmail</span>
                </div>

                <div className={`surface-card p-4 border ${mailMetrics.pendingApprovals > 0 ? 'border-amber-500/40 bg-amber-500/[0.03]' : 'border-white/[0.06]'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold">Pending Approval</span>
                    {mailMetrics.pendingApprovals > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <p className="text-2xl font-display font-bold text-amber-300 mt-1">
                    {mailMetrics.pendingApprovals || 0}
                  </p>
                  <span className="text-[10px] font-mono text-amber-400/80">Awaiting Telegram / Admin</span>
                </div>

                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase">Sent Replies</span>
                  <p className="text-2xl font-display font-bold text-emerald-400 mt-1">
                    {mailMetrics.sentEmails || 0}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-500/80">Dispatched live</span>
                </div>

                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-[11px] font-mono text-rose-400 uppercase">Rejected</span>
                  <p className="text-2xl font-display font-bold text-rose-400 mt-1">
                    {mailMetrics.rejectedEmails || 0}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500">No email sent</span>
                </div>

                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Spam Filtered</span>
                  <p className="text-2xl font-display font-bold text-slate-300 mt-1">
                    {mailMetrics.spamDetected || 0}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500">AI auto-isolated</span>
                </div>
              </div>

              {/* Integration Status Bar */}
              <div className="surface-card p-4 border border-white/[0.08] bg-white/[0.01]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Radio size={13} className="text-emerald-400 animate-pulse" />
                    Agent Subsystem Health
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Never sends without explicit approval</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[11px] text-slate-400">OpenAI Engine</div>
                    <div className="text-xs font-semibold text-white mt-1 flex items-center gap-1.5">
                      {mailMonitoring?.openai?.isConfigured ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span>{mailMonitoring.openai.model} (Active)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={13} className="text-amber-400" />
                          <span>Heuristic Fallback Engine</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[11px] text-slate-400">Telegram Bot Approval</div>
                    <div className="text-xs font-semibold text-white mt-1 flex items-center gap-1.5">
                      {mailMonitoring?.telegram?.isConfigured ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span>Authorized (ID: {mailMonitoring.telegram.allowedUserIdMasked})</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={13} className="text-amber-400" />
                          <span>Needs Bot Token / User ID</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[11px] text-slate-400">Gmail API OAuth 2.0</div>
                    <div className="text-xs font-semibold text-white mt-1 flex items-center gap-1.5">
                      {mailMonitoring?.gmail?.isConfigured ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span>OAuth Linked ({mailMonitoring.gmail.userEmail})</span>
                        </>
                      ) : (
                        <>
                          <Radio size={13} className="text-cyan-400" />
                          <span>Resend Fallback / Safe Mode</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[11px] text-slate-400">Database Storage</div>
                    <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      <span>MongoDB Atlas Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="surface-card p-4 border border-white/[0.08] space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search sender, email, subject, or reply content..."
                      value={mailSearchQuery}
                      onChange={e => setMailSearchQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') fetchMailAgentData() }}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={mailCategoryFilter}
                      onChange={e => setMailCategoryFilter(e.target.value)}
                      className="bg-[#0f1118] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                    >
                      <option value="all">All Categories</option>
                      <option value="Project collaboration">Project collaboration</option>
                      <option value="Business enquiries">Business enquiries</option>
                      <option value="Internship and job opportunities">Internship &amp; job opportunities</option>
                      <option value="Freelance opportunities">Freelance opportunities</option>
                      <option value="Technical support">Technical support</option>
                      <option value="General enquiries">General enquiries</option>
                      <option value="Spam">Spam</option>
                    </select>

                    <button
                      onClick={fetchMailAgentData}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
                  {[
                    { id: 'all', label: 'All Inquiries' },
                    { id: 'pending_approval', label: 'Pending Approval' },
                    { id: 'sent', label: 'Sent via Gmail' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'ignored_spam', label: 'Spam' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMailStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        mailStatusFilter === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thread List */}
              {loadingMailAgent ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-purple-400" size={28} />
                </div>
              ) : mailThreads.length === 0 ? (
                <div className="surface-card p-12 border border-white/[0.06] text-center space-y-4">
                  <Bot size={44} className="mx-auto text-purple-400/50" />
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">No email threads found</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Inquiries submitted through your contact form or received in your Gmail inbox will appear here with AI-generated drafts ready for your approval.
                    </p>
                  </div>
                  <button
                    onClick={handleRunSimulation}
                    disabled={simulatingAgent}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
                  >
                    <Sparkles size={14} />
                    <span>Run Simulated Test Inquiry</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mailThreads.map((thread: any) => {
                    const isPending = thread.status === 'pending_approval'
                    const isSent = thread.status === 'sent'
                    const isRejected = thread.status === 'rejected'
                    const isSpam = thread.status === 'ignored_spam'
                    const isEditing = editingThreadId === thread.threadId
                    const isExpanded = expandedThreadId === thread.threadId
                    const isBusy = performingMailAction === thread.threadId

                    const categoryBadgeColors: Record<string, string> = {
                      'Project collaboration': 'border-purple-500/30 bg-purple-500/10 text-purple-300',
                      'Business enquiries': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                      'Internship and job opportunities': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
                      'Freelance opportunities': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
                      'Technical support': 'border-rose-500/30 bg-rose-500/10 text-rose-300',
                      'General enquiries': 'border-slate-500/30 bg-slate-500/10 text-slate-300',
                      'Spam': 'border-red-500/40 bg-red-500/10 text-red-400',
                    }

                    const categoryClass = categoryBadgeColors[thread.category] || 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'

                    return (
                      <div
                        key={thread._id || thread.threadId}
                        className={`surface-card border rounded-2xl p-5 space-y-4 transition-all ${
                          isPending
                            ? 'border-amber-500/30 bg-amber-500/[0.02]'
                            : isSent
                            ? 'border-emerald-500/20 bg-emerald-500/[0.01]'
                            : isRejected
                            ? 'border-rose-500/20 opacity-75'
                            : 'border-white/[0.06]'
                        }`}
                      >
                        {/* Thread Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center flex-wrap gap-2">
                            {isPending && (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                <Clock size={11} />
                                PENDING APPROVAL
                              </span>
                            )}
                            {isSent && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle size={11} />
                                SENT VIA GMAIL
                              </span>
                            )}
                            {isRejected && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                <XCircle size={11} />
                                REJECTED
                              </span>
                            )}
                            {isSpam && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                SPAM FILTERED
                              </span>
                            )}

                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${categoryClass}`}>
                              {thread.category || 'General'}
                            </span>

                            {thread.confidence && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {Math.round(thread.confidence * 100)}% match
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                            <span>
                              {thread.createdAt
                                ? new Date(thread.createdAt).toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : ''}
                            </span>
                            {thread.telegramMessageId && (
                              <span className="text-purple-400 flex items-center gap-1" title="Notification sent to your Telegram">
                                📱 Telegram Alerted
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sender Info & Subject */}
                        <div className="pt-2 border-t border-white/[0.04]">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-white">{thread.fromName || 'Visitor'}</span>
                            <span className="text-xs text-slate-400 font-mono">&lt;{thread.fromEmail}&gt;</span>
                          </div>
                          <h4 className="text-sm font-medium text-slate-200 mt-1 font-display">
                            {thread.subject || '(No Subject)'}
                          </h4>
                        </div>

                        {/* Original Message Box */}
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase mb-1.5">
                            <span>Original Inquiry Content</span>
                            <button
                              onClick={() => setExpandedThreadId(isExpanded ? null : thread.threadId)}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 normal-case font-sans"
                            >
                              {isExpanded ? 'Collapse' : 'Show full'}
                            </button>
                          </div>
                          <p className={`text-xs text-slate-300 leading-relaxed whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>
                            {thread.originalBody}
                          </p>
                        </div>

                        {/* AI Draft Section */}
                        <div className="bg-purple-950/[0.15] border border-purple-500/20 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="text-purple-400" />
                              <span className="text-xs font-semibold text-purple-200">
                                AI-Generated Reply Draft (Represents Hari)
                              </span>
                            </div>
                            {thread.aiReasoning && (
                              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline truncate max-w-xs">
                                {thread.aiReasoning}
                              </span>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={draftEditText}
                                onChange={e => setDraftEditText(e.target.value)}
                                rows={5}
                                className="w-full bg-[#08090d] border border-purple-500/40 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 resize-none font-sans leading-relaxed"
                              />
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => setEditingThreadId(null)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveDraft(thread.threadId)}
                                  disabled={isBusy}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
                                >
                                  {isBusy ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                  <span>Save Draft</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap bg-black/30 p-3 rounded-lg border border-white/[0.04]">
                              {thread.draftReply}
                            </div>
                          )}

                          {/* Action Buttons Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-500/10">
                            <div className="flex items-center gap-2">
                              {isPending && !isEditing && (
                                <>
                                  <button
                                    onClick={() => handleApproveMail(thread.threadId)}
                                    disabled={isBusy}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                                  >
                                    {isBusy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                    <span>Approve &amp; Send via Gmail</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingThreadId(thread.threadId)
                                      setDraftEditText(thread.draftReply)
                                    }}
                                    disabled={isBusy}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors"
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit Reply</span>
                                  </button>

                                  <button
                                    onClick={() => handleRejectMail(thread.threadId)}
                                    disabled={isBusy}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
                                  >
                                    <XCircle size={13} />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {isSent && (
                                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle size={14} />
                                  <span>
                                    Dispatched {thread.sentAt ? new Date(thread.sentAt).toLocaleTimeString() : ''} via {thread.sendMethod || 'Gmail'}
                                  </span>
                                </span>
                              )}

                              {isRejected && (
                                <button
                                  onClick={() => handleApproveMail(thread.threadId)}
                                  disabled={isBusy}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.08]"
                                >
                                  Re-open &amp; Send
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteMailThread(thread.threadId)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto"
                              title="Delete thread log"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
              TAB: INBOX & REPLIES
          ══════════════════════════════════════════ */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Inbox &amp; Quick Reply</h2>
                  <p className="text-slate-400 text-sm mt-1">Messages from your contact form. Reply directly from here.</p>
                </div>
                <button
                  onClick={() => {
                    setLoadingMessages(true)
                    fetch('/api/messages', { headers: { 'x-admin-password': password } })
                      .then(res => res.json())
                      .then(data => { if (Array.isArray(data)) setMessages(data) })
                      .catch(() => {})
                      .finally(() => setLoadingMessages(false))
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors"
                >
                  <RefreshCw size={13} className={loadingMessages ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Total</span>
                  <p className="text-xl font-display font-bold text-white mt-1">{messages.length}</p>
                </div>
                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Unread</span>
                  <p className="text-xl font-display font-bold text-rose-400 mt-1">{messages.filter(m => !m.read).length}</p>
                </div>
                <div className="surface-card p-4 border border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase">Replied</span>
                  <p className="text-xl font-display font-bold text-emerald-400 mt-1">{messages.filter(m => m.replied).length}</p>
                </div>
              </div>

              {loadingMessages ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-indigo-400" size={24} />
                </div>
              ) : messages.length === 0 ? (
                <div className="surface-card p-12 border border-white/[0.06] text-center">
                  <Inbox size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">No messages yet. Messages from your contact form will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={`surface-card border transition-all ${
                        !msg.read ? 'border-indigo-500/30 bg-indigo-500/[0.03]' : 'border-white/[0.06]'
                      }`}
                    >
                      {/* Message header row */}
                      <button
                        onClick={() => {
                          setExpandedMessage(expandedMessage === msg._id ? null : msg._id)
                          if (!msg.read) handleMarkRead(msg._id)
                        }}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-indigo-400' : msg.replied ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white truncate">{msg.name || 'Anonymous'}</span>
                              {msg.replied && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex-shrink-0">Replied</span>
                              )}
                              {!msg.read && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 flex-shrink-0">New</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{msg.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {msg.inquiryType && (
                            <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">{msg.inquiryType}</span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>
                      </button>

                      {/* Expanded message detail */}
                      <AnimatePresence>
                        {expandedMessage === msg._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-white/[0.06] pt-4">
                              {msg.subject && (
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subject</span>
                                  <p className="text-sm text-white mt-0.5">{msg.subject}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase">Message</span>
                                <p className="text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-500">
                                <span>From: {msg.email}</span>
                                {msg.createdAt && <span>Date: {new Date(msg.createdAt).toLocaleString()}</span>}
                                {msg.inquiryType && <span>Type: {msg.inquiryType}</span>}
                              </div>

                              {/* Quick Reply */}
                              {msg.email && (
                                <div className="pt-3 border-t border-white/[0.06]">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase mb-2 block">Quick Reply</span>
                                  <textarea
                                    value={expandedMessage === msg._id ? replyText : ''}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${msg.name || msg.email}...`}
                                    rows={3}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 resize-none"
                                  />
                                  <div className="flex items-center justify-between mt-2">
                                    <button
                                      onClick={() => handleDeleteMessage(msg._id)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    >
                                      <Trash2 size={12} />
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => handleSendReply(msg)}
                                      disabled={sendingReply || !replyText.trim()}
                                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                                    >
                                      {sendingReply ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                      {sendingReply ? 'Sending...' : 'Send Reply'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB: SECURITY & DATABASE
          ══════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Database &amp; Backup Operations</h2>
                <p className="text-slate-400 text-sm mt-1">Snapshot database records, email backups, or trigger activity digest.</p>
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
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleExportBackup}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                    >
                      <Download size={14} className="text-indigo-400" />
                      Download JSON Backup
                    </button>
                    <button
                      onClick={handleEmailBackup}
                      disabled={backupEmailing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors disabled:opacity-50"
                    >
                      {backupEmailing ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                      {backupEmailing ? 'Sending...' : 'Email Backup to Me'}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <h4 className="font-display font-semibold text-white text-sm mb-2">Weekly Activity Digest</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    The weekly digest email runs automatically every Sunday at 11:30 PM IST. You can also trigger it manually here.
                  </p>
                  <button
                    onClick={handleTriggerDigest}
                    disabled={sendingDigest}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {sendingDigest ? <Loader2 size={14} className="animate-spin" /> : <BarChart3 size={14} className="text-cyan-400" />}
                    {sendingDigest ? 'Generating...' : 'Send Digest Now'}
                  </button>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <h4 className="font-display font-semibold text-white text-sm mb-2">Security Alerts</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Login attempts (successful and failed) automatically send security alert emails to your inbox with IP, browser, and timestamp details.
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <Shield size={12} /> Auto-enabled on all logins
                  </span>
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
