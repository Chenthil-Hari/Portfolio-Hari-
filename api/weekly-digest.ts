import { connectToDatabase } from './_db.js'
import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Allow trigger either with admin password or Vercel Cron header
  const authHeader = req.headers['authorization'] || ''
  const password = req.body?.password || req.query?.password
  const cronSecret = process.env.CRON_SECRET || ''

  const isVercelCron =
    req.headers['x-vercel-cron'] === '1' || (cronSecret && authHeader === `Bearer ${cronSecret}`)
  const isAuthorizedAdmin = password === (process.env.ADMIN_PASSWORD || 'admin123')

  if (!isVercelCron && !isAuthorizedAdmin && req.method === 'POST') {
    // If neither, verify basic key or password
    return res.status(401).json({ error: 'Unauthorized request.' })
  }

  try {
    const { db } = await connectToDatabase()

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [recentMessages, recentGuestbook, recentResumes] = await Promise.all([
      db
        .collection('messages')
        .find({ createdAt: { $gte: oneWeekAgo } })
        .sort({ createdAt: -1 })
        .toArray(),
      db
        .collection('guestbook')
        .find({ createdAt: { $gte: oneWeekAgo } })
        .sort({ createdAt: -1 })
        .toArray(),
      db
        .collection('resume_requests')
        .find({ requestedAt: { $gte: oneWeekAgo } })
        .sort({ requestedAt: -1 })
        .toArray(),
    ])

    const totalInquiries = recentMessages.length
    const pendingReplies = recentMessages.filter(m => !m.replied).length
    const guestbookCount = recentGuestbook.length
    const resumeCount = recentResumes.length

    const inquiriesHtml =
      recentMessages.length > 0
        ? recentMessages
            .slice(0, 5)
            .map(
              m => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 10px 6px; font-weight: 600; color: #ffffff;">${escapeHtml(m.name)}</td>
            <td style="padding: 10px 6px; color: #94a3b8;">${escapeHtml(m.subject)}</td>
            <td style="padding: 10px 6px; text-align: right;">
              <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: monospace; ${
                m.replied
                  ? 'background: rgba(16,185,129,0.15); color: #34d399;'
                  : 'background: rgba(245,158,11,0.15); color: #fbbf24;'
              }">
                ${m.replied ? 'REPLIED' : 'PENDING'}
              </span>
            </td>
          </tr>
        `
            )
            .join('')
        : '<tr><td colspan="3" style="padding: 12px; text-align:center; color: #64748b;">No direct messages this week</td></tr>'

    const digestHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hello <strong>Hari</strong>,
      </p>
      <p style="margin: 0 0 20px 0;">
        Here is your <strong>Haritech Weekly Activity Digest</strong> summarizing portfolio interactions over the past 7 days.
      </p>

      <!-- Stat Cards -->
      <table role="presentation" width="100%" cellspacing="8" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td width="33%" style="padding: 16px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #818cf8;">${totalInquiries}</div>
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #a5b4fc; margin-top: 4px;">Inquiries (${pendingReplies} pending)</div>
          </td>
          <td width="33%" style="padding: 16px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #34d399;">${guestbookCount}</div>
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #6ee7b7; margin-top: 4px;">Guestbook Notes</div>
          </td>
          <td width="33%" style="padding: 16px; background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.25); border-radius: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #22d3ee;">${resumeCount}</div>
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #67e8f9; margin-top: 4px;">Resume Dispatches</div>
          </td>
        </tr>
      </table>

      <!-- Recent Inquiries Table -->
      <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #818cf8; letter-spacing: 0.08em; margin-bottom: 10px;">
        Recent Inquiries Received
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; font-size: 13px; margin-bottom: 24px;">
        ${inquiriesHtml}
      </table>

      <div style="text-align: center; margin: 24px 0 10px 0;">
        <a href="https://haritech.me/admin" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; border-radius: 8px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600;">
          Open Admin Inbox &rarr;
        </a>
      </div>
    `

    const wrapped = renderEmailWrapper({
      title: 'Weekly Portfolio Activity Digest',
      badgeText: 'WEEKLY METRICS',
      contentHtml: digestHtml,
    })

    await sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: `📊 [Haritech Digest] ${totalInquiries} inquiries & ${guestbookCount} guestbook signatures this week`,
      html: wrapped,
    })

    return res.status(200).json({
      success: true,
      message: `Weekly activity digest sent to ${RESEND_CONFIG.ownerEmail}!`,
      metrics: {
        totalInquiries,
        pendingReplies,
        guestbookCount,
        resumeCount,
      },
    })
  } catch (error: any) {
    console.error('Weekly digest error:', error)
    return res.status(500).json({ error: error.message || 'Failed to compile weekly digest.' })
  }
}
