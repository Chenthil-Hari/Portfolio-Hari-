import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'

export const config = {
  runtime: 'nodejs',
}

interface ContactRequestBody {
  name?: string
  email?: string
  subject?: string
  message?: string
  inquiryType?: 'general' | 'opportunity' | 'meeting' | 'collaboration'
  preferredTime?: string
  honeypot?: string
}

function generateIcsCalendar({
  summary,
  description,
  organizerEmail,
  organizerName,
  attendeeEmail,
  attendeeName,
  startDate,
  durationMinutes = 20,
}: {
  summary: string
  description: string
  organizerEmail: string
  organizerName: string
  attendeeEmail: string
  attendeeName: string
  startDate: Date
  durationMinutes?: number
}): string {
  const formatUtc = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const dtStart = formatUtc(startDate)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000)
  const dtEnd = formatUtc(endDate)
  const dtStamp = formatUtc(new Date())
  const uid = `meeting-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@haritech.me`

  const cleanDesc = description.replace(/\n/g, '\\n').replace(/,/g, '\\,')
  const cleanSummary = summary.replace(/,/g, '\\,')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Haritech//Chenthil Hari Portfolio//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDesc}`,
    'LOCATION:Google Meet / Remote Call',
    `ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${attendeeName}:mailto:${attendeeEmail}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: 15-minute chat with Chenthil Hari',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
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

  try {
    const { name, email, subject, message, inquiryType = 'general', preferredTime, honeypot } =
      (req.body || {}) as ContactRequestBody

    // Anti-spam honeypot
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message received.' })
    }

    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanSubject = (subject || '').trim() || 'General Inquiry / Portfolio Contact'
    const cleanMessage = (message || '').trim()
    const cleanTime = (preferredTime || '').trim()

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Please provide your name (at least 2 characters).' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      return res.status(400).json({ error: 'Please provide a message (at least 5 characters).' })
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const safeName = escapeHtml(cleanName)
    const safeSubject = escapeHtml(cleanSubject)
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br/>')

    // Inquiry label mapping
    const inquiryLabels: Record<string, string> = {
      general: '💬 General Inquiry',
      opportunity: '💼 Job / Internship Opportunity',
      meeting: '☕ 15-Minute Coffee Chat / Interview',
      collaboration: '🤝 Project Collaboration',
    }
    const inquiryBadge = inquiryLabels[inquiryType] || '💬 Inquiry'

    // Calendar Attachment logic if requested meeting or opportunity
    const isMeetingRequest = inquiryType === 'meeting' || inquiryType === 'opportunity'
    let visitorAttachments: any[] = []

    if (isMeetingRequest) {
      // Schedule placeholder for next business day 4:00 PM IST
      const meetDate = new Date()
      meetDate.setDate(meetDate.getDate() + 2)
      meetDate.setHours(16, 0, 0, 0)

      const icsString = generateIcsCalendar({
        summary: `Introductory Chat: ${cleanName} & Chenthil Hari`,
        description: `Topics:\n${cleanMessage}\n\nCandidate: Chenthil Hari (chenthilhari@gmail.com)\nVisitor: ${cleanName} (${cleanEmail})\nRequested Time Slot: ${cleanTime || 'To be confirmed'}`,
        organizerEmail: RESEND_CONFIG.ownerEmail,
        organizerName: 'Chenthil Hari',
        attendeeEmail: cleanEmail,
        attendeeName: cleanName,
        startDate: meetDate,
        durationMinutes: 20,
      })

      visitorAttachments.push({
        filename: 'intro-meeting-invitation.ics',
        content: Buffer.from(icsString).toString('base64'),
        content_type: 'text/calendar; method=REQUEST',
      })
    }

    // Auto-Reply HTML to Visitor
    const visitorHtmlContent = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hi <strong>${safeName}</strong>,
      </p>
      <p style="margin: 0 0 16px 0;">
        Thank you for reaching out through my website (<a href="https://haritech.me" style="color: #818cf8; text-decoration: none;">haritech.me</a>). Your message has been received!
      </p>
      
      <p style="margin: 0 0 20px 0;">
        I personally review all incoming inquiries and will respond within <strong>24 hours</strong>.
      </p>

      ${
        isMeetingRequest
          ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; margin: 20px 0;">
          <tr>
            <td style="padding: 18px;">
              <div style="font-size: 12px; font-weight: 600; color: #a5b4fc; margin-bottom: 6px;">
                📅 Calendar Invite Included (.ics)
              </div>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #e0e7ff;">
                I've attached a provisional <strong>.ics calendar invite</strong> to this email. You can add it directly to your Google Calendar, Apple Calendar, or Outlook.
              </p>
              ${cleanTime ? `<p style="margin: 0; font-size: 12px; color: #cbd5e1;"><strong>Your Preferred Timing:</strong> ${escapeHtml(cleanTime)}</p>` : ''}
            </td>
          </tr>
        </table>
      `
          : ''
      }

      <!-- Message Details Card -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px;">
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #818cf8; letter-spacing: 0.08em; margin-bottom: 10px;">
              Submission Summary
            </div>
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 5px;">
              <strong style="color: #cbd5e1;">Category:</strong> ${escapeHtml(inquiryBadge)}
            </div>
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 5px;">
              <strong style="color: #cbd5e1;">Subject:</strong> ${safeSubject}
            </div>
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 12px;">
              <strong style="color: #cbd5e1;">Timestamp:</strong> ${timestamp} (IST)
            </div>
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 12px; font-size: 13px; line-height: 1.6; color: #e2e8f0;">
              <strong style="color: #cbd5e1; display: block; margin-bottom: 4px;">Message:</strong>
              ${safeMessage}
            </div>
          </td>
        </tr>
      </table>

      <!-- Quick Exploration Links -->
      <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #64748b; letter-spacing: 0.08em; margin-bottom: 12px;">
        Explore My Work
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom: 8px;">
            <a href="https://haritech.me#projects" style="display: block; padding: 12px 16px; background-color: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; color: #c7d2fe; text-decoration: none; font-size: 13px; font-weight: 500;">
              ⚡ View Interactive Projects &amp; Live Demos &rarr;
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 8px;">
            <a href="https://github.com/Chenthil-Hari" style="display: block; padding: 12px 16px; background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; color: #e2e8f0; text-decoration: none; font-size: 13px;">
              🐙 GitHub Repositories &rarr;
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <a href="https://linkedin.com/in/chenthil-hari" style="display: block; padding: 12px 16px; background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; color: #e2e8f0; text-decoration: none; font-size: 13px;">
              💼 LinkedIn Profile &rarr;
            </a>
          </td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; color: #94a3b8;">
        Warm regards,<br/>
        <strong style="color: #ffffff; font-size: 14px;">Chenthil Hari</strong><br/>
        <span style="font-size: 12px; color: #64748b;">Software Developer &bull; Haritech</span>
      </div>
    `

    const wrappedVisitorHtml = renderEmailWrapper({
      title: 'Message Received — Thank You for Reaching Out!',
      preheader: `Thank you ${cleanName}, your message has been received by Chenthil Hari.`,
      badgeText: inquiryBadge.split(' ')[1] || 'HARITECH',
      contentHtml: visitorHtmlContent,
    })

    // Send Auto-Reply to Visitor
    const visitorPromise = sendEmail({
      to: cleanEmail,
      subject: `Thank you for reaching out, ${cleanName}! | Haritech`,
      html: wrappedVisitorHtml,
      text: `Hi ${cleanName},\n\nThank you for reaching out to Haritech!\n\nYour message regarding "${cleanSubject}" has been received. I review all inquiries and will reply within 24 hours.\n\nWarm regards,\nChenthil Hari`,
      reply_to: RESEND_CONFIG.ownerEmail,
      attachments: visitorAttachments,
    })

    // Notification Email to Hari
    const ownerHtmlContent = `
      <div style="font-family: sans-serif; color: #ffffff;">
        <span style="display: inline-block; padding: 4px 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px; font-weight: 600; color: #34d399; text-transform: uppercase;">
          ${escapeHtml(inquiryBadge)}
        </span>
        <h2 style="margin: 12px 0 16px 0; color: #ffffff; font-size: 20px;">
          New Message from ${safeName}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; width: 110px;">Sender:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${safeName} &lt;<a href="mailto:${escapeHtml(cleanEmail)}" style="color: #818cf8;">${escapeHtml(cleanEmail)}</a>&gt;</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Subject:</td>
            <td style="padding: 6px 0; color: #ffffff;">${safeSubject}</td>
          </tr>
          ${cleanTime ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Preferred Time:</td><td style="padding: 6px 0; color: #38bdf8;">${escapeHtml(cleanTime)}</td></tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Received:</td>
            <td style="padding: 6px 0; color: #94a3b8;">${timestamp} (IST)</td>
          </tr>
        </table>
        <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">
${safeMessage}
        </div>
        <a href="mailto:${escapeHtml(cleanEmail)}?subject=Re:%20${encodeURIComponent(cleanSubject)}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
          Hit Reply to respond directly to ${safeName}
        </a>
      </div>
    `

    const ownerPromise = sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: `📬 [${inquiryBadge}] from ${cleanName}: ${cleanSubject}`,
      html: ownerHtmlContent,
      reply_to: cleanEmail,
      attachments: visitorAttachments,
    })

    const [visitorResult, ownerResult] = await Promise.all([visitorPromise, ownerPromise])

    // Save to MongoDB
    if (process.env.MONGODB_URI) {
      try {
        const { connectToDatabase } = await import('./_db.js')
        const { db } = await connectToDatabase()
        await db.collection('messages').insertOne({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          inquiryType,
          preferredTime: cleanTime || null,
          hasCalendarInvite: isMeetingRequest,
          autoReplyEmailId: visitorResult?.id || null,
          notificationEmailId: ownerResult?.id || null,
          isRead: false,
          replied: false,
          createdAt: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
        })
      } catch (dbErr) {
        console.warn('Failed to store message in MongoDB:', dbErr)
      }
    }

    return res.status(200).json({
      success: true,
      message: isMeetingRequest
        ? 'Message sent! A calendar invitation and confirmation have been dispatched to your email.'
        : 'Message sent! A confirmation email has been dispatched to your inbox.',
      messageId: visitorResult?.id,
      hasCalendarInvite: isMeetingRequest,
    })
  } catch (error: any) {
    console.error('Contact handler error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to send message. Please try again.',
    })
  }
}
