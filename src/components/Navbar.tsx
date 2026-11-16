import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lottie } from 'lottie-react'
import docDownloadAnim from '@/assets/document-download.json'
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import { useTheme } from '@/context/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()
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
            ? 'bg-[var(--canvas)]/90 backdrop-blur-md border-b border-[var(--border)] py-3.5 shadow-sm'
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
            <div className="w-8 h-8 rounded bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center font-mono font-bold text-xs tracking-wider transition-colors group-hover:border-blue-500/50">
              <span className="text-white dark:text-white group-hover:text-blue-500 transition-colors">CH</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-white group-hover:text-blue-500 transition-colors truncate">
                {personalInfo.fullName}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="hidden xl:inline truncate">Available for software & embedded roles</span>
                <span className="hidden sm:inline xl:hidden text-[10px] truncate">Available for roles</span>
                <span className="sm:hidden text-[10px] truncate">Open to roles</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Items (visible on lg+) */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-1.5 rounded-full bg-[var(--surface)]/90 border border-[var(--border)] shadow-sm flex-shrink-0"
            aria-label="Primary Navigation"
          >
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-2.5 xl:px-3.5 py-1 rounded text-[11px] xl:text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions (visible on lg+) */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 xl:p-2 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center group shadow-sm flex-shrink-0"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun size={15} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon size={15} className="text-blue-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[11px] xl:text-xs font-mono text-slate-300 hover:text-white transition-all group shadow-sm flex-shrink-0"
            >
              <div className="w-3.5 h-3.5 flex-shrink-0">
                <Lottie src={docDownloadAnim} loop={true} className="w-full h-full" />
              </div>
              <span>Resume</span>
            </button>

            <a
              href="#contact"
              className="flex items-center gap-1 px-3 xl:px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] xl:text-xs font-mono uppercase tracking-wider transition-all shadow-sm flex-shrink-0"
            >
              <span>Contact</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile & Tablet Actions: Theme Toggle + Menu Button (visible below lg) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded border border-[var(--border)] bg-[var(--surface)] text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center shadow-sm"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-blue-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-[var(--border)] bg-[var(--surface)] text-slate-300 hover:text-white shadow-sm"
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
            className="fixed inset-x-0 top-[60px] z-40 bg-[var(--canvas)] border-b border-[var(--border)] p-6 lg:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-3 font-mono text-sm">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left py-2 text-slate-300 hover:text-white border-b border-[var(--border)]"
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Drawer Theme Switcher Row */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-2 text-slate-700 dark:text-slate-300 border-b border-[var(--border)] text-xs font-mono uppercase tracking-wider"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-blue-600" />}
                  <span>Visual Theme</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-slate-800 dark:text-slate-300">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenResume()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded border border-[var(--border)] bg-[var(--surface)] text-xs text-white"
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    <Lottie src={docDownloadAnim} loop={true} className="w-full h-full" />
                  </div>
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
