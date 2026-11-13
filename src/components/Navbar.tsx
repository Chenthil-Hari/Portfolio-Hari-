import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FileText, ArrowUpRight } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

interface NavbarProps {
  onOpenResume: () => void
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Disciplines', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#journey' },
  { label: 'Guestbook', href: '#guestbook' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onOpenResume }: NavbarProps) {
  const { personalInfo } = usePortfolio()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#090a0f]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="section-wrapper flex items-center justify-between">
          {/* Brand Mark: Swiss Architectural Monogram */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
            aria-label="Chenthil Hari — Home"
          >
            <div className="w-8 h-8 rounded bg-[#10121a] border border-white/15 flex items-center justify-center font-mono font-bold text-white text-xs tracking-wider transition-colors group-hover:border-blue-500/50">
              <span className="text-white">CH</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-white group-hover:text-blue-400 transition-colors">
                {personalInfo.fullName}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Available for software & embedded roles
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#10121a]/80 border border-white/[0.08]"
            aria-label="Primary Navigation"
          >
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-3.5 py-1 rounded text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <FileText size={13} className="text-blue-400" />
              <span>Resume</span>
            </button>
            <a
              href="#contact"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono uppercase tracking-wider transition-all"
            >
              <span>Contact</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-white/10 bg-[#10121a] text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#090a0f] border-b border-white/10 p-6 md:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-3 font-mono text-sm">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left py-2 text-slate-300 hover:text-white border-b border-white/[0.04]"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenResume()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded border border-white/15 bg-white/[0.03] text-xs text-white"
                >
                  <FileText size={14} className="text-blue-400" />
                  View Resume
                </button>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded bg-blue-600 text-white text-xs"
                >
                  Contact
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
