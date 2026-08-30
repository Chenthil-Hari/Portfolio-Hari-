import { createContext, useContext, ReactNode } from 'react'
import * as staticData from '@/data/portfolio'

interface PortfolioData {
  personalInfo: typeof staticData.personalInfo
  skills: typeof staticData.skills
  projects: typeof staticData.projects
  experiences: typeof staticData.experiences
  education: typeof staticData.education
  achievements: typeof staticData.achievements
}

const PortfolioContext = createContext<PortfolioData | null>(null)

export function PortfolioProvider({ children, value }: { children: ReactNode; value: PortfolioData | null }) {
  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioData {
  const context = useContext(PortfolioContext)
  
  // If context is not wrapped or empty, fall back gracefully to the local static portfolio data
  if (!context) {
    return {
      personalInfo: staticData.personalInfo,
      skills: staticData.skills,
      projects: staticData.projects,
      experiences: staticData.experiences,
      education: staticData.education,
      achievements: staticData.achievements,
    }
  }

  return context
}
