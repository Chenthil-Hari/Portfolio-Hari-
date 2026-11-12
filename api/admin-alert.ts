import { sendEmail, renderEmailWrapper, escapeHtml, RESEND_CONFIG } from './_email.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // Login alert emails are disabled per user preference
  return res.status(200).json({ success: true, message: 'Admin login alert emails are disabled.' })
}
