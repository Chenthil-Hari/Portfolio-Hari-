import { useState, useEffect, type FormEvent } from 'react'
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

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

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEntries(data)
        }
      })
      .catch(() => {})
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
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit entry.')
      }

      const newEntry: GuestbookEntry = {
        name: name.trim(),
        role: role.trim() || 'Visitor',
        message: message.trim(),
        createdAt: new Date().toISOString(),
      }
      setEntries(prev => [newEntry, ...prev])
      setName('')
      setRole('')
      setEmail('')
      setMessage('')
      setStatusMsg({ type: 'success', text: 'Message posted to the public ledger.' })
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error submitting message.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="guestbook" className="section-spacing relative bg-[#090a0f] hairline-bottom" aria-label="Visitor Guestbook">
      <div className="section-wrapper">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            <span className="text-blue-500 font-bold">05</span>
            <span className="text-white/20">/</span>
            <span>Public Ledger</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Visitor remarks &amp; notes.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Leave an entry in the persistent visitor log. All entries are preserved in MongoDB.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Submission Form (5 cols) */}
          <div className="lg:col-span-5 editorial-card p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-mono text-xs">
              <MessageSquare size={14} className="text-blue-400" />
              <span className="uppercase tracking-wider text-white">Post to Ledger</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name / Handle"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                  Role / Affiliation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer / Student"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                  Email (Optional · Kept Private)
                </label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1.5 text-[11px]">
                  Message *
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={250}
                  placeholder="Write a brief note or feedback..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="input-field text-xs resize-none"
                />
                <span className="text-[10px] text-slate-500 block text-right mt-1">
                  {message.length} / 250 characters
                </span>
              </div>

              {statusMsg && (
                <div
                  className={`flex items-center gap-2 p-2.5 rounded text-xs ${
                    statusMsg.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {statusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Commit Entry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ledger Records (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
              <span className="uppercase tracking-wider text-slate-400">Ledger History</span>
              <span className="text-slate-500">{entries.length} entries</span>
            </div>

            {loading ? (
              <div className="editorial-card p-8 text-center text-slate-500 font-mono text-xs">
                Loading ledger entries...
              </div>
            ) : entries.length === 0 ? (
              <div className="editorial-card p-8 text-center text-slate-500 font-mono text-xs">
                No entries recorded yet. Be the first to leave a message.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {entries.map((entry, idx) => (
                  <div
                    key={entry._id || idx}
                    className="editorial-card p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#151824] border border-white/10 flex items-center justify-center text-[10px] font-bold text-blue-400">
                          {entry.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white">{entry.name}</span>
                        {entry.role && (
                          <span className="text-slate-500 text-[11px]">· {entry.role}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{timeAgo(entry.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pl-8">
                      {entry.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
