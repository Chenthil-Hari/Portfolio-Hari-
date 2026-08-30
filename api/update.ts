import { connectToDatabase } from './_db.js'

export default async function handler(req: any, res: any) {
  // CORS Headers
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { password, data } = req.body

  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return res.status(500).json({ 
      error: 'ADMIN_PASSWORD environment variable is not configured on Vercel. Please add it to deploy updates.' 
    })
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' })
  }

  if (!data) {
    return res.status(400).json({ error: 'Bad Request: Missing update data' })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('content')

    // Upsert the portfolio document
    await collection.updateOne(
      { type: 'portfolio' },
      { 
        $set: { 
          ...data,
          updatedAt: new Date().toISOString()
        } 
      },
      { upsert: true }
    )

    return res.status(200).json({ success: true, message: 'Portfolio updated successfully!' })
  } catch (error: any) {
    console.error('Error updating portfolio in DB:', error)
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message })
  }
}
