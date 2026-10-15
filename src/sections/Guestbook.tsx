import { useState, useEffect, useRef, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, Database, Sparkles } from 'lucide-react'

export interface GuestbookEntry {
  _id?: string
  name: string
  role?: string
  message: string
  createdAt: string
}

function timeAgo(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  } catch {
    return 'Recently'
  }
}

// Generate deterministic avatar gradient from name
const avatarGradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
]

function getAvatarGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return avatarGradients[Math.abs(hash) % avatarGradients.length]
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Fetch guestbook messages on mount
  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEntries(data)
        }
      })
      .catch(err => {
        console.error('Failed to load guestbook entries:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setSubmitting(true)
    setStatusMsg(null)

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'Visitor',
          message: message.trim(),
        }),
      })

      const result = await res.json()

      if (res.ok && result.entry) {
        // Prepend newly added entry directly to feed
        setEntries(prev => [result.entry, ...prev])
        setName('')
        setRole('')
        setMessage('')
        setStatusMsg({ type: 'success', text: 'Thank you! Your note has been added.' })
        setTimeout(() => setStatusMsg(null), 5000)
      } else {
        throw new Error(result.error || 'Failed to submit message.')
      }
    } catch (err: any) {
      console.error(err)
      setStatusMsg({ type: 'error', text: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="guestbook" className="section-padding relative" ref={ref} aria-label="Visitor Guestbook">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">08 — Guestbook</span>
            <span className="h-px w-8 bg-emerald-500/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
              <Database size={10} /> Live MongoDB Atlas
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Visitor Guestbook
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl">
            Drop a quick note, feedback, or a hello! Messages are stored and loaded in real time from MongoDB Atlas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Sign the Guestbook</h3>
                  <p className="text-xs text-slate-500 font-mono">// public_log.write()</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="gb-name" className="block text-xs font-medium text-slate-400 mb-1.5">
                    Your Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="gb-name"
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g. Alex Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="gb-role" className="block text-xs font-medium text-slate-400 mb-1.5">
                    Role / Company / Location <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    id="gb-role"
                    type="text"
                    maxLength={50}
                    placeholder="e.g. Recruiter @ TechCorp or Bangalore"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="gb-message" className="block text-xs font-medium text-slate-400 mb-1.5">
                    Message <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    id="gb-message"
                    required
                    maxLength={250}
                    rows={3}
                    placeholder="Loved the traffic simulator! Keep up the great work..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="form-input text-sm resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500 mt-1 font-mono">
                    {message.length}/250
                  </div>
                </div>

                {statusMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {statusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {statusMsg.text}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm transition-all hover:shadow-glow-emerald disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Posting to MongoDB...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Post Note
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Entries Feed Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-7 space-y-3"
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-mono text-slate-400">
                Recent Signatures ({entries.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Sorted by latest</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card rounded-2xl p-4 border border-white/[0.06] animate-pulse flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-white/[0.05] rounded" />
                      <div className="h-2.5 w-full bg-white/[0.03] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-white/[0.06] text-center text-slate-400">
                <MessageSquare size={28} className="mx-auto mb-2 text-slate-500" />
                <p className="text-sm">Be the first to sign the guestbook!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={entry._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="glass-card glass-card-hover rounded-2xl p-4 border border-white/[0.06] hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar initials badge */}
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                          entry.name
                        )} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}
                      >
                        {entry.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm truncate">
                              {entry.name}
                            </span>
                            {entry.role && (
                              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 truncate max-w-[180px]">
                                {entry.role}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                            {timeAgo(entry.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed break-words">
                          "{entry.message}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
