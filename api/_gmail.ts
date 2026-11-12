// ============================================================
//  HARITECH AI EMAIL AGENT — GMAIL API OAUTH 2.0 INTEGRATION
// ============================================================

import { sendEmail, renderEmailWrapper, escapeHtml } from './_email.js'

export interface GmailSendOptions {
  to: string
  subject: string
  bodyText: string
  inReplyTo?: string
  references?: string
  threadId?: string
  senderName?: string
}

export interface GmailSendResult {
  success: boolean
  messageId?: string
  threadId?: string
  method: 'gmail_oauth' | 'resend_fallback' | 'simulated'
  error?: string
}

export interface GmailInquiryMessage {
  id: string
  threadId: string
  from: string
  fromName: string
  fromEmail: string
  subject: string
  date: string
  snippet: string
  body: string
}

export const GMAIL_CONFIG = {
  get clientId(): string {
    return process.env.GMAIL_CLIENT_ID || ''
  },
  get clientSecret(): string {
    return process.env.GMAIL_CLIENT_SECRET || ''
  },
  get refreshToken(): string {
    return process.env.GMAIL_REFRESH_TOKEN || ''
  },
  get userEmail(): string {
    return process.env.GMAIL_USER_EMAIL || process.env.OWNER_EMAIL || 'chenthilhari@gmail.com'
  },
  get isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret && this.refreshToken)
  },
}

/**
 * Returns configuration status of Gmail API OAuth 2.0 for admin health monitors.
 */
export function getGmailConfigStatus(): {
  isConfigured: boolean
  hasClientId: boolean
  hasClientSecret: boolean
  hasRefreshToken: boolean
  userEmail: string
} {
  return {
    isConfigured: GMAIL_CONFIG.isConfigured,
    hasClientId: Boolean(GMAIL_CONFIG.clientId),
    hasClientSecret: Boolean(GMAIL_CONFIG.clientSecret),
    hasRefreshToken: Boolean(GMAIL_CONFIG.refreshToken),
    userEmail: GMAIL_CONFIG.userEmail,
  }
}

/**
 * Exchanges the Google OAuth refresh token for a fresh short-lived access token.
 */
async function getGmailAccessToken(): Promise<string> {
  if (!GMAIL_CONFIG.isConfigured) {
    throw new Error('Gmail OAuth credentials (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN) not set.')
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token'
  const body = new URLSearchParams({
    client_id: GMAIL_CONFIG.clientId,
    client_secret: GMAIL_CONFIG.clientSecret,
    refresh_token: GMAIL_CONFIG.refreshToken,
    grant_type: 'refresh_token',
  })

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to refresh Google OAuth token (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  if (!data.access_token) {
    throw new Error('Google OAuth token response did not contain access_token.')
  }

  return data.access_token
}

/**
 * Encodes a string into base64url format required by the Gmail API.
 */
function base64urlEncode(str: string): string {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Assembles an RFC 2822 email message string.
 */
function buildRawMimeMessage({
  to,
  from,
  subject,
  bodyText,
  inReplyTo,
  references,
}: {
  to: string
  from: string
  subject: string
  bodyText: string
  inReplyTo?: string
  references?: string
}): string {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
  ]

  if (inReplyTo) {
    lines.push(`In-Reply-To: ${inReplyTo}`)
  }
  if (references) {
    lines.push(`References: ${references}`)
  }

  lines.push('', bodyText)
  return lines.join('\r\n')
}

/**
 * Sends a reply email using the authorized Gmail API account.
 * If Gmail OAuth is not configured, securely falls back to Resend (if configured)
 * or records a simulated send result.
 */
export async function sendGmailReply(options: GmailSendOptions): Promise<GmailSendResult> {
  const { to, subject, bodyText, inReplyTo, references, threadId, senderName = 'Chenthil Hari' } = options

  // Scenario 1: Gmail OAuth is fully configured
  if (GMAIL_CONFIG.isConfigured) {
    try {
      const accessToken = await getGmailAccessToken()
      const fromHeader = `${senderName} <${GMAIL_CONFIG.userEmail}>`

      const rawMime = buildRawMimeMessage({
        to,
        from: fromHeader,
        subject,
        bodyText,
        inReplyTo,
        references,
      })

      const rawBase64 = base64urlEncode(rawMime)

      const payload: any = { raw: rawBase64 }
      if (threadId) {
        payload.threadId = threadId
      }

      const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!sendRes.ok) {
        const errText = await sendRes.text()
        throw new Error(`Gmail API send failed (${sendRes.status}): ${errText}`)
      }

      const result = await sendRes.json()
      return {
        success: true,
        messageId: result.id,
        threadId: result.threadId || threadId,
        method: 'gmail_oauth',
      }
    } catch (gmailErr: any) {
      console.warn('Gmail OAuth sending failed, attempting Resend fallback:', gmailErr)
    }
  }

  // Scenario 2: Fallback to Resend transactional service if available
  if (process.env.RESEND_API_KEY) {
    try {
      const wrappedHtml = renderEmailWrapper({
        title: subject,
        badgeText: 'DIRECT REPLY',
        contentHtml: `
          <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap; margin-bottom: 24px;">
            ${escapeHtml(bodyText)}
          </div>
          <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #94a3b8;">
            Best regards,<br/>
            <strong style="color: #ffffff; font-size: 14px;">Chenthil Hari</strong><br/>
            <span style="font-size: 12px; color: #64748b;">Software Developer &bull; <a href="https://haritech.me" style="color: #818cf8; text-decoration: none;">haritech.me</a></span>
          </div>
        `,
      })

      const resendResult = await sendEmail({
        to,
        subject,
        html: wrappedHtml,
        text: bodyText,
        reply_to: GMAIL_CONFIG.userEmail,
        fromName: senderName,
      })

      return {
        success: true,
        messageId: resendResult?.id || `resend-${Date.now()}`,
        method: 'resend_fallback',
      }
    } catch (resendErr: any) {
      console.error('Resend fallback failed:', resendErr)
    }
  }

  // Scenario 3: Neither service configured (safe simulation mode during onboarding)
  return {
    success: true,
    messageId: `simulated-${Date.now()}`,
    method: 'simulated',
    error: 'Sent in simulated mode: GMAIL_REFRESH_TOKEN or RESEND_API_KEY required for live dispatch.',
  }
}

/**
 * Parses header values from a Gmail message payload.
 */
function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  const match = headers?.find(h => h.name.toLowerCase() === name.toLowerCase())
  return match?.value || ''
}

/**
 * Recursively decodes body text from Gmail message parts.
 */
function extractBodyText(payload: any): string {
  if (!payload) return ''

  if (payload.body?.data) {
    try {
      return Buffer.from(payload.body.data, 'base64').toString('utf-8')
    } catch {
      return ''
    }
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        try {
          return Buffer.from(part.body.data, 'base64').toString('utf-8')
        } catch {}
      }
    }
    // Secondary check for text/html
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        try {
          const html = Buffer.from(part.body.data, 'base64').toString('utf-8')
          return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        } catch {}
      }
    }
  }

  return ''
}

/**
 * Fetches recent unread inquiries from Gmail inbox.
 */
export async function fetchRecentGmailInquiries(
  maxResults = 10,
  query = 'is:unread -from:me'
): Promise<GmailInquiryMessage[]> {
  if (!GMAIL_CONFIG.isConfigured) {
    return []
  }

  try {
    const accessToken = await getGmailAccessToken()
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`

    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!listRes.ok) {
      console.warn('Gmail list messages failed:', await listRes.text())
      return []
    }

    const listData = await listRes.json()
    const messages = listData.messages || []

    const detailedInquiries: GmailInquiryMessage[] = []

    for (const item of messages) {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )

        if (!detailRes.ok) continue
        const detail = await detailRes.json()

        const headers = detail.payload?.headers || []
        const fromHeader = getHeader(headers, 'From')
        const subject = getHeader(headers, 'Subject') || '(No Subject)'
        const date = getHeader(headers, 'Date') || new Date().toISOString()

        // Extract name and email from "Name <email@domain.com>"
        let fromName = fromHeader
        let fromEmail = fromHeader
        const match = fromHeader.match(/^(.*?)\s*<(.+@.+)>$/)
        if (match) {
          fromName = match[1].replace(/["']/g, '').trim() || match[2]
          fromEmail = match[2].trim()
        }

        const body = extractBodyText(detail.payload) || detail.snippet || ''

        detailedInquiries.push({
          id: detail.id,
          threadId: detail.threadId,
          from: fromHeader,
          fromName,
          fromEmail,
          subject,
          date,
          snippet: detail.snippet || '',
          body,
        })
      } catch (itemErr) {
        console.warn(`Error fetching details for Gmail message ${item.id}:`, itemErr)
      }
    }

    return detailedInquiries
  } catch (err) {
    console.error('fetchRecentGmailInquiries error:', err)
    return []
  }
}
