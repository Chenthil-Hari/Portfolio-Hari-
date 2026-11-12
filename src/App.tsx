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
import { PortfolioProvider } from '@/context/PortfolioContext'

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [isResumeOpen, setIsResumeOpen] = useState(false)

  // Detect route on load and on popstate
  useEffect(() => {
    const checkRoute = () => {
      setIsAdminRoute(window.location.pathname === '/admin')
    }
    checkRoute()
    window.addEventListener('popstate', checkRoute)
    return () => window.removeEventListener('popstate', checkRoute)
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/get')
      if (res.ok) {
        const data = await res.json()
        setPortfolioData(data)
      }
    } catch (err) {
      // Fallback silently to local static data
    }
  }

  // Background fetch of database data if available
  useEffect(() => {
    fetchData()
  }, [])

  // Admin route handler
  if (isAdminRoute) {
    return (
      <PortfolioProvider value={portfolioData} onUpdate={setPortfolioData} onRefresh={fetchData}>
        <Admin
          initialData={portfolioData}
          onUpdateData={(newData: any) => setPortfolioData(newData)}
          onClose={() => {
            window.history.pushState({}, '', '/')
            setIsAdminRoute(false)
          }}
        />
      </PortfolioProvider>
    )
  }

  return (
    <PortfolioProvider value={portfolioData} onUpdate={setPortfolioData} onRefresh={fetchData}>
      <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
        {/* Navigation */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero onOpenResume={() => setIsResumeOpen(true)} />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Guestbook />
          <Contact />
        </main>

        {/* Footer */}
        <Footer onOpenResume={() => setIsResumeOpen(true)} />

        {/* Fullscreen PDF Resume Modal */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resumeUrl="/resume.pdf"
        />
      </div>
    </PortfolioProvider>
  )
}
