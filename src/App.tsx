import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Journey from '@/sections/Journey'
import Guestbook from '@/sections/Guestbook'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'
import Admin from '@/sections/Admin'
import ResumeModal from '@/components/ResumeModal'
import EasterEggModal from '@/components/EasterEggModal'
import NotFound from '@/components/NotFound'
import { PortfolioProvider } from '@/context/PortfolioContext'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [portfolioData, setPortfolioData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('haritech_portfolio_data')
      if (cached) return JSON.parse(cached)
    } catch {}
    return null
  })
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false)

  // Listen to popstate and pathname changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Easter Egg keyboard listener ('?' key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return
      }
      if (e.key === '?') {
        setIsEasterEggOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setIsEasterEggOpen(false)
        setIsResumeOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/get?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setPortfolioData(data)
        try {
          localStorage.setItem('haritech_portfolio_data', JSON.stringify(data))
        } catch {}
      }
    } catch (err) {
      // Fallback silently to local static data
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateData = (newData: any) => {
    setPortfolioData(newData)
    try {
      localStorage.setItem('haritech_portfolio_data', JSON.stringify(newData))
    } catch {}
  }

  // Admin Route Handler
  if (currentPath === '/admin') {
    return (
      <PortfolioProvider value={portfolioData} onUpdate={handleUpdateData} onRefresh={fetchData}>
        <Admin
          initialData={portfolioData}
          onUpdateData={handleUpdateData}
          onClose={() => {
            window.history.pushState({}, '', '/')
            setCurrentPath('/')
            fetchData()
          }}
        />
      </PortfolioProvider>
    )
  }

  // 404 Route Handler for any unexpected path
  if (currentPath !== '/' && currentPath !== '') {
    return (
      <NotFound
        onGoHome={() => {
          window.history.pushState({}, '', '/')
          setCurrentPath('/')
        }}
      />
    )
  }

  // Standard Portfolio View
  return (
    <PortfolioProvider value={portfolioData} onUpdate={handleUpdateData} onRefresh={fetchData}>
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
        {/* Architectural Header */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        {/* Core Editorial Sections */}
        <main className="flex-1">
          <Hero onOpenResume={() => setIsResumeOpen(true)} />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Guestbook />
          <Contact />
        </main>

        {/* Colophon & Diagnostics Footer */}
        <Footer
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenEasterEgg={() => setIsEasterEggOpen(true)}
        />

        {/* Modals */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resumeUrl="/resume.pdf"
        />

        <EasterEggModal
          isOpen={isEasterEggOpen}
          onClose={() => setIsEasterEggOpen(false)}
        />
      </div>
    </PortfolioProvider>
  )
}
