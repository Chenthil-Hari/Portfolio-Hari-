// ============================================================
//  HARITECH CENTRALIZED EMAIL UTILITY (Powered by Resend)
// ============================================================

export interface EmailAttachment {
  filename: string
  content?: string // Base64 string
  path?: string // URL
  content_type?: string
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  reply_to?: string
  attachments?: EmailAttachment[]
  fromName?: string
}

export const RESEND_CONFIG = {
  get apiKey(): string {
    return process.env.RESEND_API_KEY || ''
  },
  senderName: process.env.SENDER_NAME || 'Chenthil Hari',
  senderAddress: process.env.SENDER_EMAIL || 'noreply@haritech.me',
  ownerEmail: process.env.OWNER_EMAIL || 'chenthilhari@gmail.com',
  domain: 'haritech.me',
}

export function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sends an email via Resend REST API
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  reply_to,
  attachments,
  fromName = RESEND_CONFIG.senderName,
}: SendEmailOptions) {
  const apiKey = RESEND_CONFIG.apiKey

  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined in environment variables.')
    throw new Error('Email service configuration missing (RESEND_API_KEY).')
  }

  const recipients = Array.isArray(to) ? to : [to]
  const from = `${fromName} <${RESEND_CONFIG.senderAddress}>`

  const payload: any = {
    from,
    to: recipients,
    subject,
    html,
  }

  if (text) {
    payload.text = text
  }

  if (reply_to) {
    payload.reply_to = reply_to
  }

  if (attachments && attachments.length > 0) {
    payload.attachments = attachments
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Resend API response error:', errorText)
    throw new Error(`Resend Error (${response.status}): ${errorText}`)
  }

  return response.json()
}

/**
 * Standard Haritech Obsidian & Indigo Email Wrapper
 */
export function renderEmailWrapper({
  title,
  preheader,
  badgeText = 'HARITECH',
  contentHtml,
  callToAction,
}: {
  title: string
  preheader?: string
  badgeText?: string
  contentHtml: string
  callToAction?: { text: string; url: string }
}): string {
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  ${
    preheader
      ? `<div style="display:none; font-size:1px; color:#08090d; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">${escapeHtml(
          preheader
        )}</div>`
      : ''
  }
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #08090d; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0d0f15; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Gradient -->
          <tr>
            <td style="background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%); height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <span style="display: inline-block; padding: 4px 10px; background-color: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 6px; font-size: 11px; font-family: monospace; font-weight: 600; color: #818cf8; letter-spacing: 0.1em; text-transform: uppercase;">
                ${escapeHtml(badgeText)}
              </span>
              <h1 style="margin: 12px 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                ${escapeHtml(title)}
              </h1>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Chenthil Hari &bull; Software Developer &bull; <a href="https://haritech.me" style="color: #818cf8; text-decoration: none;">haritech.me</a>
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
              ${contentHtml}

              ${
                callToAction
                  ? `
                <div style="margin: 28px 0 10px 0;">
                  <a href="${callToAction.url}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; border-radius: 8px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                    ${escapeHtml(callToAction.text)} &rarr;
                  </a>
                </div>
              `
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #07080c; border-top: 1px solid rgba(255, 255, 255, 0.04); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">
                Haritech &bull; Chennai, Tamil Nadu, India &bull; <a href="https://haritech.me" style="color: #6366f1; text-decoration: none;">haritech.me</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                &copy; ${year} Haritech. All rights reserved.
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
}
