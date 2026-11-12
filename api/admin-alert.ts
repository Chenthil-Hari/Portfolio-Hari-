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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const { event, success, attemptedAt } = req.body || {}
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP'
    const userAgent = req.headers['user-agent'] || 'Unknown Browser'
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const isSuccess = Boolean(success)
    const alertTitle = isSuccess
      ? '🛡️ Admin Dashboard Login Alert'
      : '⚠️ Failed Admin Login Attempt'

    const alertHtml = `
      <div style="font-family: sans-serif; color: #ffffff;">
        <span style="display: inline-block; padding: 4px 8px; background: ${
          isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
        }; border: 1px solid ${
      isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
    }; border-radius: 6px; font-size: 11px; font-weight: 600; color: ${
      isSuccess ? '#34d399' : '#f87171'
    }; text-transform: uppercase;">
          ${isSuccess ? 'Authentication Succeeded' : 'Security Warning'}
        </span>
        <h2 style="margin: 12px 0 16px 0; color: #ffffff; font-size: 18px;">
          ${alertTitle}
        </h2>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 16px;">
          An authentication activity was detected on your portfolio administration panel (<strong>https://haritech.me/admin</strong>).
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; width: 120px;">Status:</td>
            <td style="padding: 6px 0; color: ${isSuccess ? '#34d399' : '#f87171'}; font-weight: 600;">
              ${isSuccess ? 'Authorized (Access Granted)' : 'Failed (Wrong Password)'}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Timestamp:</td>
            <td style="padding: 6px 0; color: #ffffff;">${timestamp} (IST)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">IP Address:</td>
            <td style="padding: 6px 0; color: #a5b4fc; font-family: monospace;">${escapeHtml(String(ip))}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Device / Agent:</td>
            <td style="padding: 6px 0; color: #94a3b8; font-size: 11px; font-family: monospace;">${escapeHtml(
              String(userAgent)
            )}</td>
          </tr>
        </table>
        ${
          !isSuccess
            ? '<p style="color: #f87171; font-size: 12px;">If this was not you, someone may be attempting to guess your admin dashboard password.</p>'
            : ''
        }
      </div>
    `

    await sendEmail({
      to: RESEND_CONFIG.ownerEmail,
      subject: isSuccess
        ? `🛡️ [Security] Admin Login on haritech.me`
        : `⚠️ [Alert] Failed Admin Login Attempt on haritech.me`,
      html: alertHtml,
    })

    return res.status(200).json({ success: true, message: 'Alert recorded.' })
  } catch (error: any) {
    console.error('Admin alert error:', error)
    return res.status(500).json({ error: error.message || 'Error processing alert' })
  }
}
