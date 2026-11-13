import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, Cpu, Activity, ShieldCheck } from 'lucide-react'

interface EasterEggModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const start = performance.now()
    fetch('/api/get?t=' + Date.now(), { method: 'HEAD' })
      .then(() => setLatency(Math.round(performance.now() - start)))
      .catch(() => setLatency(null))
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[3000]"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[540px] z-[3001] bg-[#10121a] border border-white/15 rounded-lg p-6 font-mono text-xs shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-label="System Diagnostics"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="uppercase tracking-wider text-white font-semibold">
                  Engineering Telemetry &amp; Diagnostics
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-white"
                aria-label="Close diagnostics"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Firmware Architecture:</span>
                <span className="text-white">ESP32 Dual-Core Xtensa LX6 (240MHz)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Simulation Kernel:</span>
                <span className="text-white">NumPy Multi-Qubit Matrix Engine</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">API Health / Latency:</span>
                <span className="text-emerald-400">{latency !== null ? `${latency}ms round-trip` : 'Active'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Security Model:</span>
                <span className="text-slate-200">Strict CSP, HSTS, Rate Limiting</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Local Timezone:</span>
                <span className="text-slate-200">Asia/Kolkata (IST · UTC+05:30)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] text-slate-400 text-[11px] leading-relaxed">
              <span className="text-blue-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Engineering Axiom
              </span>
              &ldquo;Simplicity is prerequisite for reliability.&rdquo; &mdash; Edsger W. Dijkstra
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider text-[11px]"
              >
                Dismiss [ESC]
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
