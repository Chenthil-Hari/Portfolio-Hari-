import { connectToDatabase } from './_db.js'
import {
  personalInfo,
  skillsData,
  projectsData,
  journeyData,
  skills,
  projects,
  experiences,
  education,
  achievements
} from '../src/data/portfolio.js'

// Default fallback data matching both modern and legacy schemas
const defaultData = {
  personalInfo,
  skillsData,
  projectsData,
  journeyData,
  skills,
  projects,
  experiences,
  education,
  achievements,
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
  }
}

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('content')
    
    // Find the single portfolio document (or create one if it doesn't exist)
    let portfolioData = await collection.findOne({ type: 'portfolio' })
    
    if (!portfolioData) {
      // First-time setup: return default local data
      return res.status(200).json(defaultData)
    }

    // Return the stored data (excluding mongodb fields)
    const { _id, type, ...cleanData } = portfolioData as any

    // Ensure compatibility aliases exist on the returned cleanData
    const normalizedData = {
      ...defaultData,
      ...cleanData,
      skillsData: cleanData.skillsData || cleanData.skills || defaultData.skillsData,
      projectsData: cleanData.projectsData || cleanData.projects || defaultData.projectsData,
      journeyData: cleanData.journeyData || defaultData.journeyData,
      personalInfo: cleanData.personalInfo || defaultData.personalInfo,
    }

    return res.status(200).json(normalizedData)
  } catch (error: any) {
    console.error('Error fetching portfolio data from DB:', error)
    // Fail gracefully: return default data so the website is never broken
    return res.status(200).json(defaultData)
  }
}
