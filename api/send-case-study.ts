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
    const rateCheck = checkRateLimit(`casestudy:${clientIp}`, 5, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Rate limit exceeded. Please wait ${rateCheck.retryAfterSec || 60} seconds before requesting another case study.`,
      })
    }

    const { email, name, project } = req.body || {}
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (name || '').trim() || 'Engineer / Visitor'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    if (!project || !project.title) {
      return res.status(400).json({ error: 'Project details are missing.' })
    }

    const techBadges = (project.technologies || [])
      .map(
        (t: string) =>
          `<span style="display:inline-block; padding: 3px 8px; margin: 2px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 4px; font-size: 11px; font-family: monospace; color: #a5b4fc;">${escapeHtml(
            t
          )}</span>`
      )
      .join(' ')

    const featuresList = (project.keyFeatures || [])
      .map(
        (f: string) =>
          `<li style="margin-bottom: 6px; color: #cbd5e1; font-size: 13px;">${escapeHtml(f)}</li>`
      )
      .join('')

    const metricsHtml = (project.metrics || [])
      .map(
        (m: { label: string; value: string }) =>
          `<td style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8;">${escapeHtml(
              m.label
            )}</div>
            <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 4px;">${escapeHtml(
              m.value
            )}</div>
          </td>`
      )
      .join('')

    const caseStudyHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff;">
        Hello <strong>${escapeHtml(cleanName)}</strong>,
      </p>
      <p style="margin: 0 0 16px 0;">
        Here is the full technical case study and architecture brief for <strong>${escapeHtml(
          project.title
        )}</strong>, requested from my engineering portfolio.
      </p>

      <!-- Project Overview Header Card -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin: 20px 0;">
        <tr>
          <td style="padding: 20px;">
            <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #818cf8; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); padding: 3px 8px; border-radius: 4px;">
              ${escapeHtml(project.category || 'Engineering Case Study')}
            </span>
            <h2 style="margin: 10px 0 6px 0; font-size: 18px; color: #ffffff;">
              ${escapeHtml(project.title)}
            </h2>
            <p style="margin: 0 0 14px 0; font-size: 13px; color: #94a3b8;">
              ${escapeHtml(project.tagline || project.shortDescription || '')}
            </p>
            <div style="margin-top: 10px;">
              ${techBadges}
            </div>
          </td>
        </tr>
      </table>

      ${
        metricsHtml
          ? `
        <table role="presentation" width="100%" cellspacing="6" cellpadding="0" style="margin-bottom: 24px;">
          <tr>${metricsHtml}</tr>
        </table>
      `
          : ''
      }

      <!-- Problem & Architectural Solution -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #f87171; letter-spacing: 0.05em; margin: 0 0 8px 0;">
          The Problem Statement
        </h3>
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; background: rgba(239,68,68,0.04); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 0 8px 8px 0;">
          ${escapeHtml(project.problem || project.shortDescription || '')}
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #34d399; letter-spacing: 0.05em; margin: 0 0 8px 0;">
          The Engineered Solution
        </h3>
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; background: rgba(16,185,129,0.04); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 0 8px 8px 0;">
          ${escapeHtml(project.solution || project.description || '')}
        </p>
      </div>

      ${
        project.myContribution
          ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #818cf8; letter-spacing: 0.05em; margin: 0 0 8px 0;">
            My Technical Contributions
          </h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1;">
            ${escapeHtml(project.myContribution)}
          </p>
        </div>
      `
          : ''
      }

      ${
        featuresList
          ? `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #cbd5e1; letter-spacing: 0.05em; margin: 0 0 8px 0;">
            Key Architectural Features
          </h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${featuresList}
          </ul>
        </div>
      `
          : ''
      }

      ${
        project.challenges
          ? `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #fbbf24; letter-spacing: 0.05em; margin: 0 0 8px 0;">
            Engineering Challenges &amp; Overcoming Hurdles
          </h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; background: rgba(245,158,11,0.04); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 0 8px 8px 0;">
            ${escapeHtml(project.challenges)}
          </p>
        </div>
      `
          : ''
      }

      <!-- Links & CTAs -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <tr>
          <td>
            ${
              project.githubUrl
                ? `
              <a href="${project.githubUrl}" style="display: inline-block; padding: 10px 18px; background: #6366f1; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px; margin-right: 8px;">
                Explore Source Code on GitHub &rarr;
              </a>
            `
                : ''
            }
            <a href="https://haritech.me#projects" style="display: inline-block; padding: 10px 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; text-decoration: none; font-size: 13px; border-radius: 8px;">
              View All Projects on Website
            </a>
          </td>
        </tr>
      </table>

      <div style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
        Best regards,<br/>
        <strong style="color: #ffffff;">Chenthil Hari</strong><br/>
        <span style="font-size: 12px; color: #64748b;">Software Developer &bull; Haritech</span>
      </div>
    `

    const wrappedHtml = renderEmailWrapper({
      title: `Technical Brief: ${project.title}`,
      preheader: `Complete engineering case study and source summary for ${project.title}.`,
      badgeText: 'CASE STUDY',
      contentHtml: caseStudyHtml,
    })

    await sendEmail({
      to: cleanEmail,
      subject: `Technical Brief: ${project.title} | Chenthil Hari`,
      html: wrappedHtml,
      text: `Case Study for ${project.title}\n\nProblem: ${project.problem}\n\nSolution: ${project.solution}\n\nGitHub: ${project.githubUrl || 'https://github.com/Chenthil-Hari'}\n\nRegards,\nChenthil Hari`,
      reply_to: RESEND_CONFIG.ownerEmail,
    })

    // Notify Hari
    await sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: `🔬 Case Study Sent: ${project.title} to ${cleanName} (${cleanEmail})`,
      html: `<div style="font-family:sans-serif;color:white;">A visitor requested the technical brief for <strong>${escapeHtml(
        project.title
      )}</strong>.<br/>Email: ${escapeHtml(cleanEmail)}</div>`,
      reply_to: cleanEmail,
    }).catch(err => console.warn('Could not notify owner of case study request:', err))

    return res.status(200).json({
      success: true,
      message: `Technical brief for ${project.title} has been sent to ${cleanEmail}!`,
    })
  } catch (error: any) {
    console.error('Send case study error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to dispatch case study.',
    })
  }
}
