import { connectToDatabase } from './_db.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // CORS Headers
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { password, data } = req.body || {}

  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin password' })
  }

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Bad Request: Missing or invalid update data' })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('content')

    const updatePayload = {
      ...data,
      type: 'portfolio',
      updatedAt: new Date().toISOString(),
    }

    // Upsert the portfolio document
    await collection.updateOne(
      { type: 'portfolio' },
      { $set: updatePayload },
      { upsert: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully in MongoDB Atlas!',
      updatedAt: updatePayload.updatedAt,
    })
  } catch (error: any) {
    console.error('Error updating portfolio in DB:', error)
    return res.status(500).json({ error: 'Database update failed: ' + error.message })
  }
}
