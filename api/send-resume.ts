import fs from 'fs'
import path from 'path'
import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'
import { checkRateLimit } from './_rateLimit.js'

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

  try {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim()
    const rateCheck = checkRateLimit(`resume:${clientIp}`, 5, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Rate limit exceeded. Please wait ${rateCheck.retryAfterSec || 60} seconds before requesting another copy.`,
      })
    }

    const { email, name, role } = req.body || {}
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (name || '').trim() || 'Hiring Team / Recruiter'
    const cleanRole = (role || '').trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    // Try reading local resume file as base64, otherwise provide direct URL path
    let attachments: any[] = []
    try {
      const resumePath = path.join(process.cwd(), 'public', 'resume.pdf')
      if (fs.existsSync(resumePath)) {
        const fileBuffer = fs.readFileSync(resumePath)
        attachments = [
          {
            filename: 'Chenthil_Hari_Resume.pdf',
            content: fileBuffer.toString('base64'),
            content_type: 'application/pdf',
          },
        ]
      } else {
        attachments = [
          {
            filename: 'Chenthil_Hari_Resume.pdf',
            path: 'https://haritech.me/resume.pdf',
          },
        ]
      }
    } catch (e) {
      console.warn('Could not read local resume, fallback to URL attachment:', e)
      attachments = [
        {
          filename: 'Chenthil_Hari_Resume.pdf',
          path: 'https://haritech.me/resume.pdf',
        },
      ]
    }

    const recipientHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hello <strong>${escapeHtml(cleanName)}</strong>,
      </p>
      <p style="margin: 0 0 16px 0;">
        Thank you for your interest in my background! As requested from my portfolio, my complete <strong>Curriculum Vitae (PDF)</strong> is attached to this email.
      </p>
      
      <!-- Quick Candidate Profile Card -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin: 20px 0;">
        <tr>
          <td style="padding: 18px;">
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #818cf8; letter-spacing: 0.08em; margin-bottom: 8px;">
              Quick Candidate Profile
            </div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 4px;">
              <strong style="color: #ffffff;">Candidate:</strong> Chenthil Hari
            </div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 4px;">
              <strong style="color: #ffffff;">Education:</strong> 3rd Year B.Tech Computer Science &amp; Engineering (2022&ndash;2026)
            </div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 4px;">
              <strong style="color: #ffffff;">Core Competencies:</strong> Java, Python, C/C++, Embedded C, TypeScript/React, MongoDB
            </div>
            <div style="font-size: 13px; color: #cbd5e1;">
              <strong style="color: #ffffff;">Key Highlights:</strong> Real-time ESP32 Traffic Simulation, Python Quantum Gates Simulator, Proteus Virtual Circuit Lab
            </div>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 16px 0;">
        You can also download or view the latest version of my resume anytime directly in your browser:
      </p>
      <p style="margin: 0 0 24px 0;">
        <a href="https://haritech.me/resume.pdf" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; border-radius: 8px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600;">
          Download Resume (PDF) &rarr;
        </a>
      </p>

      <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
        I am actively seeking software engineering internships and junior developer opportunities. If you would like to discuss potential roles or technical projects, feel free to reply directly to this email or reach me at <a href="mailto:${RESEND_CONFIG.ownerEmail}" style="color: #818cf8;">${RESEND_CONFIG.ownerEmail}</a>.
      </p>
    `

    const wrappedHtml = renderEmailWrapper({
      title: 'Chenthil Hari — Resume & Profile Summary',
      preheader: 'Here is the requested resume for Chenthil Hari (Software Developer / CSE Student).',
      badgeText: 'RESUME DISPATCH',
      contentHtml: recipientHtml,
    })

    // Send Resume to Recipient
    await sendEmail({
      to: cleanEmail,
      subject: `Curriculum Vitae: Chenthil Hari (Software Developer / CSE)`,
      html: wrappedHtml,
      text: `Hello ${cleanName},\n\nThank you for requesting my resume from haritech.me. Please find my CV attached to this email or download it at https://haritech.me/resume.pdf.\n\nWarm regards,\nChenthil Hari\nchenthilhari@gmail.com`,
      reply_to: RESEND_CONFIG.ownerEmail,
      attachments,
    })

    // Send Notification to Hari
    const notifyHtml = `
      <div style="font-family: sans-serif; color: #ffffff; padding: 16px;">
        <h3 style="color: #34d399; margin: 0 0 8px 0;">📄 Resume Requested</h3>
        <p>A visitor requested your resume through haritech.me:</p>
        <ul>
          <li><strong>Recipient Name:</strong> ${escapeHtml(cleanName)}</li>
          <li><strong>Recipient Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #818cf8;">${escapeHtml(cleanEmail)}</a></li>
          ${cleanRole ? `<li><strong>Role / Organization:</strong> ${escapeHtml(cleanRole)}</li>` : ''}
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</li>
        </ul>
        <p><a href="mailto:${escapeHtml(cleanEmail)}?subject=Following%20up%20on%20Resume%20Request%20-%20Chenthil%20Hari" style="display:inline-block; padding: 8px 16px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px;">Follow up via Email</a></p>
      </div>
    `

    await sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: `📄 [Resume Requested] by ${cleanName} (${cleanEmail})`,
      html: notifyHtml,
      reply_to: cleanEmail,
    }).catch(err => console.warn('Could not notify owner of resume dispatch:', err))

    // Optional MongoDB record
    if (process.env.MONGODB_URI) {
      try {
        const { connectToDatabase } = await import('./_db.js')
        const { db } = await connectToDatabase()
        await db.collection('resume_requests').insertOne({
          email: cleanEmail,
          name: cleanName,
          role: cleanRole || null,
          requestedAt: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
        })
      } catch (dbErr) {
        console.warn('Could not log resume request in DB:', dbErr)
      }
    }

    return res.status(200).json({
      success: true,
      message: `Resume successfully sent to ${cleanEmail}! Please check your inbox.`,
    })
  } catch (error: any) {
    console.error('Error dispatching resume:', error)
    return res.status(500).json({
      error: error.message || 'Failed to email resume. Please try downloading directly.',
    })
  }
}
