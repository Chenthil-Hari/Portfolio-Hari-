import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Cursor from '@/components/Cursor'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Experience from '@/sections/Experience'
import Education from '@/sections/Education'
import Achievements from '@/sections/Achievements'
import GitHubSection from '@/sections/GitHub'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'
import Admin from '@/sections/Admin'

import { PortfolioProvider } from '@/context/PortfolioContext'

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Detect route on load and on popstate
  useEffect(() => {
    const checkRoute = () => {
      setIsAdminRoute(window.location.pathname === '/admin')
    }
    checkRoute()
    window.addEventListener('popstate', checkRoute)
    return () => window.removeEventListener('popstate', checkRoute)
  }, [])

  // Fetch portfolio data from database (with fallback to local static data in context helper)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/get')
        if (res.ok) {
          const data = await res.json()
          setPortfolioData(data)
        }
      } catch (err) {
        console.error('Failed to load portfolio data from DB, using fallback local data:', err)
      } finally {
        setLoading(false)
      }
    };
    fetchData()
  }, [])

  // Update mouse glow CSS var
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-slate-400">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mb-4" />
          <p className="text-sm font-mono tracking-widest text-slate-500 uppercase">Loading Environment...</p>
        </div>
      </div>
    )
  }

  // Render Admin page view
  if (isAdminRoute) {
    return (
      <PortfolioProvider value={portfolioData}>
        <Admin 
          initialData={portfolioData} 
          onClose={() => {
            window.history.pushState({}, '', '/')
            setIsAdminRoute(false)
          }} 
        />
      </PortfolioProvider>
    )
  }

  // Render Public portfolio site view
  return (
    <PortfolioProvider value={portfolioData}>
      <div className="noise-overlay min-h-screen bg-bg-primary text-slate-100">
        {/* Custom cursor (disabled or default null in Cursor.tsx) */}
        <Cursor />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Achievements />
          <GitHubSection />
          <Contact />
        </main>

        <Footer />
      </div>
    </PortfolioProvider>
  )
}
