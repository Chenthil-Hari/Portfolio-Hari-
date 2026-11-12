import { connectToDatabase } from './_db.js'
import { sendEmail, renderEmailWrapper, RESEND_CONFIG } from './_email.js'

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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { password } = req.body || {}
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' })
  }

  try {
    const { db } = await connectToDatabase()

    const [contentDocs, guestbookDocs, messagesDocs, resumeDocs] = await Promise.all([
      db.collection('content').find({}).toArray(),
      db.collection('guestbook').find({}).toArray(),
      db.collection('messages').find({}).toArray(),
      db.collection('resume_requests').find({}).toArray(),
    ])

    const backupData = {
      backupDate: new Date().toISOString(),
      source: 'haritech.me MongoDB Atlas',
      counts: {
        content: contentDocs.length,
        guestbook: guestbookDocs.length,
        messages: messagesDocs.length,
        resumeRequests: resumeDocs.length,
      },
      content: contentDocs,
      guestbook: guestbookDocs,
      messages: messagesDocs,
      resumeRequests: resumeDocs,
    }

    const jsonString = JSON.stringify(backupData, null, 2)
    const base64Data = Buffer.from(jsonString).toString('base64')
    const dateStamp = new Date().toISOString().split('T')[0]
    const filename = `haritech-backup-${dateStamp}.json`

    const emailContent = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hello <strong>Hari</strong>,
      </p>
      <p style="margin: 0 0 16px 0;">
        Your complete database backup archive has been generated and is attached to this email as <strong>${filename}</strong>.
      </p>
      
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin: 20px 0;">
        <tr>
          <td style="padding: 18px;">
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #818cf8; margin-bottom: 8px;">
              Backup Archive Metrics
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
              <li><strong>Content Configuration:</strong> ${contentDocs.length} document(s)</li>
              <li><strong>Guestbook Signatures:</strong> ${guestbookDocs.length} entry(ies)</li>
              <li><strong>Direct Messages / Inquiries:</strong> ${messagesDocs.length} inquiry(ies)</li>
              <li><strong>Resume Request Logs:</strong> ${resumeDocs.length} record(s)</li>
              <li><strong>Archive Size:</strong> ~${Math.round(jsonString.length / 1024)} KB</li>
            </ul>
          </td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #94a3b8;">
        Store this JSON file safely for offline disaster recovery. You can restore your database anytime by importing this file through MongoDB Compass or your Admin Dashboard.
      </p>
    `

    const wrapped = renderEmailWrapper({
      title: 'Database Backup Archive',
      badgeText: 'DISASTER RECOVERY',
      contentHtml: emailContent,
    })

    await sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: `💾 [Database Backup] haritech.me archive (${dateStamp})`,
      html: wrapped,
      attachments: [
        {
          filename,
          content: base64Data,
          content_type: 'application/json',
        },
      ],
    })

    return res.status(200).json({
      success: true,
      message: `Complete database backup successfully dispatched to ${RESEND_CONFIG.ownerEmail}!`,
    })
  } catch (error: any) {
    console.error('Backup email error:', error)
    return res.status(500).json({ error: error.message || 'Failed to dispatch database backup.' })
  }
}
