import { connectToDatabase } from './_db.js'
import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'
import { checkRateLimit } from './_rateLimit.js'

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
      return res.status(200).json(defaultGuestbookEntries)
    }
  }

  // POST: Add new guestbook message
  if (req.method === 'POST') {
    try {
      const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim()
      const rateCheck = checkRateLimit(`guestbook:${clientIp}`, 5, 15 * 60 * 1000)
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: `Rate limit exceeded. Please wait ${rateCheck.retryAfterSec || 60} seconds before posting again.`,
        })
      }

      const { name, message, role, email } = req.body || {}

      if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Name and message are required.' })
      }

      const cleanName = name.trim().slice(0, 50)
      const cleanMessage = message.trim().slice(0, 250)
      const cleanRole = (role || 'Visitor').trim().slice(0, 50)
      const cleanEmail = email && typeof email === 'string' ? email.trim().toLowerCase() : ''

      if (!cleanName || !cleanMessage) {
        return res.status(400).json({ error: 'Name or message cannot be empty.' })
      }

      const newEntry = {
        name: cleanName,
        message: cleanMessage,
        role: cleanRole,
        email: cleanEmail || null,
        createdAt: new Date().toISOString(),
      }

      let insertedId = 'local-' + Date.now()

      try {
        const { db } = await connectToDatabase()
        const collection = db.collection('guestbook')
        const result = await collection.insertOne(newEntry)
        insertedId = result.insertedId.toString()
      } catch (dbErr: any) {
        console.error('Database write error for guestbook:', dbErr)
      }

      // ─────────────────────────────────────────────────────────
      // Send Email Notifications
      // ─────────────────────────────────────────────────────────
      // 1. If visitor provided email, send Thank You note
      if (cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        const thankYouHtml = `
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
            Hi <strong>${escapeHtml(cleanName)}</strong>,
          </p>
          <p style="margin: 0 0 16px 0;">
            Thank you for leaving your mark on my public visitor guestbook at <a href="https://haritech.me#guestbook" style="color: #818cf8; text-decoration: none;">haritech.me</a>!
          </p>
          <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; font-style: italic; color: #e2e8f0;">
            &ldquo;${escapeHtml(cleanMessage)}&rdquo;
            <div style="font-style: normal; font-size: 11px; font-family: monospace; color: #818cf8; margin-top: 8px;">
              &mdash; ${escapeHtml(cleanName)} (${escapeHtml(cleanRole)})
            </div>
          </div>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8;">
            I really appreciate your kind words and feedback. If you'd ever like to connect or collaborate on projects, feel free to reply directly to this email.
          </p>
        `

        const wrapped = renderEmailWrapper({
          title: 'Thanks for Signing the Guestbook!',
          preheader: 'Your note is now live on Haritech.',
          badgeText: 'GUESTBOOK SIGNATURE',
          contentHtml: thankYouHtml,
        })

        sendEmail({
          to: cleanEmail,
          subject: `Thanks for signing my guestbook, ${cleanName}! | Haritech`,
          html: wrapped,
          reply_to: RESEND_CONFIG.ownerEmail,
        }).catch(err => console.warn('Could not send guestbook thank you email:', err))
      }

      // 2. Alert Hari that a guestbook signature was posted
      const ownerAlert = `
        <div style="font-family: sans-serif; color: white;">
          <h3 style="color: #38bdf8; margin: 0 0 8px 0;">🎉 New Guestbook Signature</h3>
          <p><strong>${escapeHtml(cleanName)}</strong> (${escapeHtml(cleanRole)}) just left a note:</p>
          <blockquote style="background: rgba(255,255,255,0.05); padding: 12px; border-left: 3px solid #38bdf8; margin: 12px 0;">
            ${escapeHtml(cleanMessage)}
          </blockquote>
          ${cleanEmail ? `<p>Email: <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #818cf8;">${escapeHtml(cleanEmail)}</a></p>` : '<p style="color: #94a3b8;">(No email provided)</p>'}
          <p><a href="https://haritech.me/admin" style="display:inline-block; padding: 8px 16px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px;">Manage in Admin Dashboard</a></p>
        </div>
      `

      sendEmail({
        to: RESEND_CONFIG.ownerEmail,
        subject: `🎉 [Guestbook] New signature from ${cleanName} (${cleanRole})`,
        html: ownerAlert,
        reply_to: cleanEmail || undefined,
      }).catch(err => console.warn('Could not alert owner of guestbook entry:', err))

      return res.status(201).json({
        success: true,
        entry: { ...newEntry, _id: insertedId },
      })
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}
