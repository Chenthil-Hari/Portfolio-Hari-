import { connectToDatabase } from './_db.js'
import { ObjectId } from 'mongodb'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const adminPass = req.headers['x-admin-password'] || req.body?.password || req.query?.password
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPass !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('messages')

    // GET: List all inquiries
    if (req.method === 'GET') {
      const messages = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray()
      return res.status(200).json(messages)
    }

    // DELETE: Remove inquiry
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query || {}
      if (!id) return res.status(400).json({ error: 'Message ID is required.' })

      await collection.deleteOne({ _id: new ObjectId(id) })
      return res.status(200).json({ success: true, message: 'Message deleted.' })
    }

    // PATCH: Mark read or toggle status
    if (req.method === 'PATCH') {
      const { id, isRead, replied } = req.body || {}
      if (!id) return res.status(400).json({ error: 'Message ID is required.' })

      const updateFields: any = {}
      if (typeof isRead === 'boolean') updateFields.isRead = isRead
      if (typeof replied === 'boolean') updateFields.replied = replied

      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields })
      return res.status(200).json({ success: true, message: 'Message updated.' })
    }

    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error: any) {
    console.error('Messages handler error:', error)
    return res.status(500).json({ error: error.message || 'Database error' })
  }
}
