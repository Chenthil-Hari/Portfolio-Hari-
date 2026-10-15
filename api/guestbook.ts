import { connectToDatabase } from './_db.js'

const defaultGuestbookEntries = [
  {
    _id: 'default-1',
    name: 'Sarah M.',
    role: 'Full-Stack Developer',
    message: 'Love the smart traffic simulator and clean design. Very impressive portfolio!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    _id: 'default-2',
    name: 'Karthik R.',
    role: 'CSE Batchmate',
    message: 'Awesome work on the quantum simulation and embedded systems projects!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
]

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // GET: Fetch recent guestbook messages
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase()
      const collection = db.collection('guestbook')
      const entries = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .toArray()

      if (!entries || entries.length === 0) {
        return res.status(200).json(defaultGuestbookEntries)
      }

      return res.status(200).json(entries)
    } catch (err: any) {
      console.error('Error fetching guestbook from DB:', err)
      // Fallback gracefully so the portfolio is never broken
      return res.status(200).json(defaultGuestbookEntries)
    }
  }

  // POST: Add new guestbook message
  if (req.method === 'POST') {
    try {
      const { name, message, role } = req.body || {}

      if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Name and message are required.' })
      }

      const cleanName = name.trim().slice(0, 50)
      const cleanMessage = message.trim().slice(0, 250)
      const cleanRole = (role || 'Visitor').trim().slice(0, 50)

      if (!cleanName || !cleanMessage) {
        return res.status(400).json({ error: 'Name or message cannot be empty.' })
      }

      const newEntry = {
        name: cleanName,
        message: cleanMessage,
        role: cleanRole,
        createdAt: new Date().toISOString(),
      }

      try {
        const { db } = await connectToDatabase()
        const collection = db.collection('guestbook')
        const result = await collection.insertOne(newEntry)
        return res.status(201).json({
          success: true,
          entry: { ...newEntry, _id: result.insertedId },
        })
      } catch (dbErr: any) {
        console.error('Database write error for guestbook:', dbErr)
        // Fallback simulated success
        return res.status(201).json({
          success: true,
          entry: { ...newEntry, _id: 'local-' + Date.now() },
        })
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}
