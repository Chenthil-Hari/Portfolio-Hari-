import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FileText, ArrowUpRight } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'

interface NavbarProps {
  onOpenResume: () => void
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="section-wrapper flex items-center justify-between">
          {/* Brand Logo & Status */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            aria-label="Hari - Back to top"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-display font-bold text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                {personalInfo.name}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for work
              </span>
            </div>
          </a>

          {/* Desktop Nav Pill */}
          <nav
            className="hidden md:flex items-center gap-1 glass-nav px-3 py-1.5 rounded-full shadow-sm"
            aria-label="Main Navigation"
          >
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              <FileText size={13} className="text-indigo-400" />
              Resume
            </button>
            <a
              href="#contact"
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all hover:shadow-indigo-500/25"
            >
              Contact
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenResume}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/[0.06] border border-white/[0.08]"
              aria-label="View Resume"
            >
              Resume
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white"
              aria-expanded={mobileMenuOpen}
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 inset-x-4 bg-[#0f1118] border border-white/[0.1] rounded-2xl p-5 z-40 md:hidden shadow-xl"
            >
              <div className="flex flex-col gap-2">
                {navItems.map(item => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-3 mt-2 border-t border-white/[0.08] flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenResume()
                    }}
                    className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold text-slate-200 bg-white/[0.06] border border-white/[0.08]"
                  >
                    View Resume
                  </button>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
