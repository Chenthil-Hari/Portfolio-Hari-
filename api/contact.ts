export const config = {
  runtime: 'nodejs',
}

interface ContactRequestBody {
  name?: string
  email?: string
  subject?: string
  message?: string
  honeypot?: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default async function handler(req: any, res: any) {
  // CORS Configuration
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
    const { name, email, subject, message, honeypot } = (req.body || {}) as ContactRequestBody

    // Bot detection via honeypot
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message received.' })
    }

    // Input validation
    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanSubject = (subject || '').trim() || 'General Inquiry / Portfolio Contact'
    const cleanMessage = (message || '').trim()

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

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable')
      return res.status(500).json({
        error: 'Email service configuration missing. Please ensure RESEND_API_KEY is set in Vercel environment variables.',
      })
    }
    const OWNER_EMAIL = process.env.OWNER_EMAIL || 'chenthilhari@gmail.com'
    const FROM_EMAIL = 'Haritech <noreply@haritech.me>'

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const safeName = escapeHtml(cleanName)
    const safeSubject = escapeHtml(cleanSubject)
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br/>')

    // ─────────────────────────────────────────────────────────────
    // 1. Send Auto-Reply / Confirmation Email to the Visitor
    // ─────────────────────────────────────────────────────────────
    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Reaching Out</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #08090d; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0d0f15; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%); height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 6px; font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #818cf8; letter-spacing: 0.1em; text-transform: uppercase;">
                      HARITECH
                    </span>
                    <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                      Message Received — Thank You!
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                      Confirmation of your direct inquiry through <a href="https://haritech.me" style="color: #818cf8; text-decoration: none;">haritech.me</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                Hi <strong style="color: #ffffff;">${safeName}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for reaching out and sharing your message. This email confirms that your note has been delivered successfully to my inbox.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                I appreciate you taking the time to connect. I personally review all inquiries and will get back to you as quickly as possible, typically <strong>within 24 hours</strong>.
              </p>

              <!-- Message Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #818cf8; letter-spacing: 0.08em; margin-bottom: 12px;">
                      Summary of Your Submission
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 6px;">
                      <strong style="color: #cbd5e1;">Subject:</strong> ${safeSubject}
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 14px;">
                      <strong style="color: #cbd5e1;">Timestamp:</strong> ${timestamp} (IST)
                    </div>
                    <div style="border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 12px; font-size: 13px; line-height: 1.6; color: #e2e8f0;">
                      <strong style="color: #cbd5e1; display: block; margin-bottom: 4px;">Message:</strong>
                      ${safeMessage}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Useful Links / Extras -->
              <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #64748b; letter-spacing: 0.08em; margin-bottom: 12px;">
                Explore While You Wait
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <a href="https://haritech.me#projects" style="display: block; padding: 12px 16px; background-color: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; color: #c7d2fe; text-decoration: none; font-size: 13px; font-weight: 500;">
                      ⚡ View Featured Projects &amp; Live Demos &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px;">
                    <a href="https://github.com/Chenthil-Hari" style="display: block; padding: 12px 16px; background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; color: #e2e8f0; text-decoration: none; font-size: 13px;">
                      🐙 GitHub Profile &amp; Repositories &rarr;
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

              <!-- Sign-off -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; line-height: 1.6; color: #94a3b8;">
                Warm regards,<br/>
                <strong style="color: #ffffff; font-size: 14px;">Chenthil Hari</strong><br/>
                <span style="font-size: 12px; color: #64748b;">Software Developer &amp; CSE Undergraduate &bull; Haritech</span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #07080c; border-top: 1px solid rgba(255, 255, 255, 0.04); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">
                This is an automated confirmation sent from <a href="https://haritech.me" style="color: #6366f1; text-decoration: none;">haritech.me</a>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                &copy; ${new Date().getFullYear()} Haritech. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const autoReplyText = `Hi ${cleanName},

Thank you for reaching out through my website (https://haritech.me)!

Your message has been received successfully. I personally review all inquiries and will respond to you within 24 hours.

--- SUMMARY OF YOUR MESSAGE ---
Subject: ${cleanSubject}
Timestamp: ${timestamp} (IST)
Message:
${cleanMessage}

--- EXPLORE ---
- Portfolio & Live Demos: https://haritech.me
- GitHub: https://github.com/Chenthil-Hari
- LinkedIn: https://linkedin.com/in/chenthil-hari

Warm regards,
Chenthil Hari
Haritech • Software Developer
`

    // ─────────────────────────────────────────────────────────────
    // 2. Send Notification Email to Hari (the site owner)
    // ─────────────────────────────────────────────────────────────
    const notificationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #08090d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0d0f15; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 28px;">
    <span style="display: inline-block; padding: 4px 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px; font-weight: 600; color: #34d399; letter-spacing: 0.05em; text-transform: uppercase;">
      New Direct Message
    </span>
    <h2 style="margin: 12px 0 16px 0; color: #ffffff; font-size: 20px;">
      Inquiry from ${safeName}
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; width: 100px;">From:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${safeName} &lt;<a href="mailto:${escapeHtml(cleanEmail)}" style="color: #818cf8;">${escapeHtml(cleanEmail)}</a>&gt;</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8;">Subject:</td>
        <td style="padding: 6px 0; color: #ffffff;">${safeSubject}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8;">Received:</td>
        <td style="padding: 6px 0; color: #94a3b8;">${timestamp} (IST)</td>
      </tr>
    </table>

    <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">
${safeMessage}
    </div>

    <a href="mailto:${escapeHtml(cleanEmail)}?subject=Re:%20${encodeURIComponent(cleanSubject)}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
      Reply to ${safeName}
    </a>
  </div>
</body>
</html>
`

    const notificationText = `New inquiry received from your portfolio:

From: ${cleanName} (${cleanEmail})
Subject: ${cleanSubject}
Timestamp: ${timestamp} (IST)

Message:
${cleanMessage}

To reply, email directly to: ${cleanEmail}
`

    // Dispatch emails via Resend REST API
    const sendResendEmail = async (payload: {
      from: string
      to: string[]
      subject: string
      html: string
      text: string
      reply_to?: string
    }) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('Resend API error:', errText)
        throw new Error(`Resend error (${response.status}): ${errText}`)
      }

      return response.json()
    }

    // 1. Send Auto-Reply to the visitor
    const autoReplyPromise = sendResendEmail({
      from: FROM_EMAIL,
      to: [cleanEmail],
      subject: `Thank you for reaching out, ${cleanName}! | Haritech`,
      html: autoReplyHtml,
      text: autoReplyText,
      reply_to: OWNER_EMAIL,
    })

    // 2. Send Notification to Hari
    const notificationPromise = sendResendEmail({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: `📬 Portfolio Inquiry: ${cleanSubject} (from ${cleanName})`,
      html: notificationHtml,
      text: notificationText,
      reply_to: cleanEmail,
    })

    const [autoReplyResult, notificationResult] = await Promise.all([
      autoReplyPromise,
      notificationPromise,
    ])

    // Optional: Log message to MongoDB for permanent storage
    if (process.env.MONGODB_URI) {
      try {
        const { connectToDatabase } = await import('./_db.js')
        const { db } = await connectToDatabase()
        await db.collection('messages').insertOne({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          autoReplyEmailId: autoReplyResult?.id || null,
          notificationEmailId: notificationResult?.id || null,
          createdAt: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
        })
      } catch (dbError) {
        console.warn('Could not persist message to MongoDB:', dbError)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! A confirmation email has been sent to your inbox.',
      messageId: autoReplyResult?.id,
    })
  } catch (error: any) {
    console.error('Contact handler error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to send message. Please try again or email directly.',
    })
  }
}
