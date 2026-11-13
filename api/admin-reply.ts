import { connectToDatabase } from './_db.js'
import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const {
    password,
    to,
    name,
    subject,
    originalSubject,
    message,
    replyText,
    messageId,
  } = req.body || {}

  const adminPass = req.headers['x-admin-password'] || password
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPass !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' })
  }

  const cleanTo = (to || '').trim().toLowerCase()
  const cleanName = (name || '').trim() || 'Colleague'
  const rawSubject = (subject || originalSubject || '').trim()
  const cleanSubject = rawSubject.startsWith('Re:') ? rawSubject : `Re: ${rawSubject || 'Your Inquiry to Chenthil Hari'}`
  const cleanMessage = (message || replyText || '').trim()

  if (!cleanTo) {
    return res.status(400).json({ error: 'Recipient email address (to) is required.' })
  }

  if (!cleanMessage) {
    return res.status(400).json({ error: 'Reply message text is required.' })
  }

  try {
    const replyHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hello <strong>${escapeHtml(cleanName)}</strong>,
      </p>
      <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap; margin-bottom: 24px;">
${escapeHtml(cleanMessage)}
      </div>
      <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #94a3b8;">
        Best regards,<br/>
        <strong style="color: #ffffff; font-size: 14px;">Chenthil Hari</strong><br/>
        <span style="font-size: 12px; color: #64748b;">Software Developer &bull; <a href="https://haritech.me" style="color: #818cf8; text-decoration: none;">haritech.me</a></span>
      </div>
    `

    const wrapped = renderEmailWrapper({
      title: cleanSubject,
      badgeText: 'DIRECT REPLY',
      contentHtml: replyHtml,
    })

    // Explicitly send from noreply email with personal reply_to
    const sendResult = await sendEmail({
      to: cleanTo,
      subject: cleanSubject,
      html: wrapped,
      text: `Hello ${cleanName},\n\n${cleanMessage}\n\nBest regards,\nChenthil Hari\nhttps://haritech.me`,
      reply_to: RESEND_CONFIG.ownerEmail,
      fromName: 'Chenthil Hari',
    })

    // Update message status in MongoDB
    if (messageId && process.env.MONGODB_URI) {
      try {
        const { db } = await connectToDatabase()
        const { ObjectId } = await import('mongodb')
        let filter: any = { _id: messageId }
        if (ObjectId.isValid(messageId)) {
          filter = { $or: [{ _id: new ObjectId(messageId) }, { _id: messageId }] }
        }
        await db.collection('messages').updateOne(
          filter,
          {
            $set: {
              replied: true,
              repliedAt: new Date().toISOString(),
              replySubject: cleanSubject,
              lastReplyText: cleanMessage,
            },
          }
        )
      } catch (dbErr) {
        console.warn('Failed to update replied flag in DB:', dbErr)
      }
    }

    return res.status(200).json({
      success: true,
      message: `Reply sent successfully to ${cleanTo} from ${RESEND_CONFIG.senderAddress}!`,
      emailId: sendResult?.id,
    })
  } catch (error: any) {
    console.error('Error sending admin reply:', error)
    return res.status(500).json({ error: error.message || 'Failed to send reply email via Resend.' })
  }
}
