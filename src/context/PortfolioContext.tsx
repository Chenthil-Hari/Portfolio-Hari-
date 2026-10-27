import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import * as staticData from '@/data/portfolio'

export interface PortfolioContextType {
  personalInfo: typeof staticData.personalInfo
  skillsData: typeof staticData.skillsData
  projectsData: typeof staticData.projectsData
  journeyData: typeof staticData.journeyData
  skills: typeof staticData.skills
  projects: typeof staticData.projects
  experiences: typeof staticData.experiences
  education: typeof staticData.education
  achievements: typeof staticData.achievements
  seo?: any
  theme?: any
  setPortfolioData?: (data: any) => void
  refreshData?: () => Promise<void>
}

const defaultPortfolioValue: PortfolioContextType = {
  personalInfo: staticData.personalInfo,
  skillsData: staticData.skillsData,
  projectsData: staticData.projectsData,
  journeyData: staticData.journeyData,
  skills: staticData.skills,
  projects: staticData.projects,
  experiences: staticData.experiences,
  education: staticData.education,
  achievements: staticData.achievements,
  seo: {
    metaTitle: 'Hari | Software Developer & CSE Student',
    metaDescription: 'Building practical systems, embedded software, and modern full-stack web applications.',
    keywords: 'Hari, Software Developer, Embedded Systems, ESP32, React, MongoDB, Python',
    ogImage: '/avatar.png',
    allowIndexing: true,
  },
  theme: {
    accentColor: 'indigo',
    showGuestbook: true,
    showTrafficDemo: true,
  },
}

const PortfolioContext = createContext<PortfolioContextType>(defaultPortfolioValue)

export function PortfolioProvider({
  children,
  value,
  onUpdate,
  onRefresh,
}: {
  children: ReactNode
  value: any
  onUpdate?: (data: any) => void
  onRefresh?: () => Promise<void>
}) {
  const mergedData: PortfolioContextType = {
    personalInfo: value?.personalInfo || staticData.personalInfo,
    skillsData: value?.skillsData || value?.skills || staticData.skillsData,
    projectsData: value?.projectsData || value?.projects || staticData.projectsData,
    journeyData: value?.journeyData || staticData.journeyData,
    skills: value?.skills || value?.skillsData || staticData.skills,
    projects: value?.projects || value?.projectsData || staticData.projects,
    experiences: value?.experiences || staticData.experiences,
    education: value?.education || staticData.education,
    achievements: value?.achievements || staticData.achievements,
    seo: value?.seo || defaultPortfolioValue.seo,
    theme: value?.theme || defaultPortfolioValue.theme,
    setPortfolioData: onUpdate,
    refreshData: onRefresh,
  }

  return (
    <PortfolioContext.Provider value={mergedData}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext)
  return context || defaultPortfolioValue
}
