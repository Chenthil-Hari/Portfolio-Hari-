import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink } from 'lucide-react'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
  resumeUrl: string
}

export default function ResumeModal({ isOpen, onClose, resumeUrl }: ResumeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[2000]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-4 md:inset-10 lg:inset-y-12 lg:inset-x-32 z-[2001] flex flex-col glass-card rounded-2xl border border-white/[0.08] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Resume Viewer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Curriculum Vitae</h3>
                <p className="text-xs text-slate-500 font-mono">// resume.pdf</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Download Button */}
                <a
                  href={resumeUrl}
                  download
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all hover:shadow-glow-blue"
                >
                  <Download size={14} />
                  Download PDF
                </a>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close resume"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PDF Viewer Content Area */}
            <div className="flex-1 bg-bg-tertiary relative">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title="Resume PDF Viewer"
              />
              
              {/* Fallback overlay in case of iframe blocking or mobile browser limitations */}
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-bg-secondary/90 pointer-events-none opacity-0 hover:opacity-100 transition-opacity flex-col text-center">
                <p className="text-sm text-slate-300 mb-4">Having trouble viewing the PDF?</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-xl glass-card border border-white/[0.1] text-white text-xs font-semibold hover:bg-white/[0.05]"
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
