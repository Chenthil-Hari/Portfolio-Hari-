import { connectToDatabase } from './_db.js'

export const config = {
  runtime: 'nodejs',
}

// Fallback baseline structure in case database document is freshly initialized
const baselineDefaults = {
  personalInfo: {
    name: 'Hari',
    fullName: 'Chenthil Hari',
    title: 'Software Developer & Computer Science Student',
    subtitle: 'Building practical systems, embedded software, and full-stack web applications.',
    tagline: 'Passionate about engineering reliable software, solving algorithmic problems, and bridging the gap between hardware and modern web interfaces.',
    bio: [
      "I'm a 3rd-year Computer Science and Engineering undergraduate who thrives on building practical, end-to-end technology solutions. My technical interests span embedded systems, IoT sensors, algorithm simulation, and full-stack web engineering.",
      "Whether designing dynamic traffic timing algorithms on ESP32 microcontrollers, modeling quantum gate operations in Python, or building responsive web platforms with React and MongoDB, I care deeply about writing clean, maintainable, and purposeful code.",
      "When I'm not writing code, I enjoy exploring new developer tools, participating in hackathons, and collaborating on open-source projects."
    ],
    email: 'chenthilhari@gmail.com',
    github: 'https://github.com/Chenthil-Hari',
    githubUsername: 'Chenthil-Hari',
    linkedin: 'https://linkedin.com/in/chenthil-hari',
    resumeUrl: '/resume.pdf',
    avatar: 'https://i.ibb.co/dwNCfvsX/Hari-Photo-jpg.jpg',
    location: 'Tamil Nadu, India',
    availability: 'Open to Software & Embedded Roles',
    stats: [
      { label: 'Academic Standing', value: '3rd Year', helper: 'B.Tech CSE (2022–2026)' },
      { label: 'Completed Projects', value: '6+', helper: 'Web, Embedded & Simulation' },
      { label: 'Core Languages', value: '4+', helper: 'Java, Python, C/C++, JS' },
      { label: 'Location', value: 'India', helper: 'UTC +05:30' },
    ],
  },
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

export default async function handler(req: any, res: any) {
  // Add CORS & No-Cache Headers to ensure live data is always fetched
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Surrogate-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('content')

    // Find the saved portfolio document
    const portfolioDoc = await collection.findOne({ type: 'portfolio' })

    if (!portfolioDoc) {
      return res.status(200).json(baselineDefaults)
    }

    const { _id, type, ...cleanData } = portfolioDoc as any

    const normalizedData = {
      ...baselineDefaults,
      ...cleanData,
      personalInfo: cleanData.personalInfo || baselineDefaults.personalInfo,
      skillsData: cleanData.skillsData || cleanData.skills || [],
      projectsData: cleanData.projectsData || cleanData.projects || [],
      journeyData: cleanData.journeyData || [],
      seo: cleanData.seo || baselineDefaults.seo,
      theme: cleanData.theme || baselineDefaults.theme,
    }

    return res.status(200).json(normalizedData)
  } catch (error: any) {
    console.error('Error fetching portfolio data from DB:', error)
    return res.status(200).json(baselineDefaults)
  }
}
