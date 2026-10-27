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

const avatarGradients = [
  'from-indigo-500 to-cyan-500',
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
        setEntries(prev => [result.entry, ...prev])
        setName('')
        setRole('')
        setMessage('')
        setStatusMsg({ type: 'success', text: 'Thank you! Your note has been saved live.' })
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
    <section id="guestbook" className="section-spacing relative bg-[#090a0f] border-t border-white/[0.04]" ref={ref} aria-label="Visitor Guestbook">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                05 / Community Feedback
              </span>
              <span className="h-px w-6 bg-white/[0.1]" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                <Database size={10} /> Live MongoDB Atlas
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Visitor Guestbook
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Leave a note, feedback, or a quick greeting. Submissions persist live in MongoDB Atlas.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="surface-card p-6 sm:p-7 border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/[0.06]">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Leave a Signature</h3>
                  <p className="text-xs text-slate-500 font-mono">// public_log.post()</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="gb-name" className="block text-xs font-mono text-slate-400 mb-1.5">
                    Your Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="gb-name"
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="gb-role" className="block text-xs font-mono text-slate-400 mb-1.5">
                    Role / Company / Location <span className="text-slate-600">(Optional)</span>
                  </label>
                  <input
                    id="gb-role"
                    type="text"
                    maxLength={50}
                    placeholder="e.g. Recruiter @ TechCorp or Bangalore"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="gb-message" className="block text-xs font-mono text-slate-400 mb-1.5">
                    Message <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    id="gb-message"
                    required
                    maxLength={250}
                    rows={3}
                    placeholder="Loved the traffic simulator! Great engineering portfolio..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="input-field resize-none"
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving to MongoDB...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Post Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Entries Feed Column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1 mb-2 text-xs font-mono text-slate-400">
              <span>Recent Signatures ({entries.length})</span>
              <span className="text-slate-500">Live Feed</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="surface-card p-4 border border-white/[0.04] animate-pulse flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-white/[0.05] rounded" />
                      <div className="h-2.5 w-full bg-white/[0.03] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="surface-card p-8 border border-white/[0.06] text-center text-slate-400">
                <MessageSquare size={24} className="mx-auto mb-2 text-slate-500" />
                <p className="text-sm">Be the first to leave a message in the guestbook!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={entry._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="surface-card surface-card-hover p-4 border border-white/[0.06] flex items-start gap-3.5"
                  >
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
                            <span className="text-[10px] font-mono text-indigo-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] truncate max-w-[180px]">
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
