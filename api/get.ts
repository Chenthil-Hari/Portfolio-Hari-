import { connectToDatabase } from './_db.js'
import { personalInfo, skills, projects, experiences, education, achievements } from '../src/data/portfolio.js'

// Default fallback data matching the schema
const defaultData = {
  personalInfo,
  skills,
  projects,
  experiences,
  education,
  achievements
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
    return res.status(200).json(cleanData)
  } catch (error: any) {
    console.error('Error fetching portfolio data from DB:', error)
    // Fail gracefully: return default data so the website is never broken
    return res.status(200).json(defaultData)
  }
}
