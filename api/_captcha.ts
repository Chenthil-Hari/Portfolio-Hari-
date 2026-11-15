import crypto from 'crypto'

const SECRET = process.env.ADMIN_PASSWORD || process.env.RESEND_API_KEY || 'haritech-captcha-secret-salt-2026'

export function generateCaptcha(): { question: string; token: string } {
  const a = Math.floor(Math.random() * 9) + 2 // 2 to 10
  const b = Math.floor(Math.random() * 9) + 1 // 1 to 9
  const answer = a + b
  const timestamp = Date.now()

  // Format: answer:timestamp
  const payload = `${answer}:${timestamp}`
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64url')

  return {
    question: `${a} + ${b}`,
    token,
  }
}

export function verifyCaptcha(answer: string | number, token: string): { valid: boolean; error?: string } {
  if (!token || answer === undefined || answer === null || String(answer).trim() === '') {
    return { valid: false, error: 'Please solve the security verification challenge.' }
  }

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid verification token format.' }
    }

    const [expectedAnswerStr, timestampStr, hmac] = parts
    const payload = `${expectedAnswerStr}:${timestampStr}`
    const expectedHmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')

    if (hmac !== expectedHmac) {
      return { valid: false, error: 'Verification token signature mismatch.' }
    }

    const timestamp = parseInt(timestampStr, 10)
    const now = Date.now()

    // 10-minute expiration window
    if (now - timestamp > 10 * 60 * 1000) {
      return { valid: false, error: 'Verification challenge expired. Please click refresh for a new one.' }
    }

    if (now < timestamp - 30 * 1000) {
      return { valid: false, error: 'Invalid challenge timestamp.' }
    }

    const cleanAnswer = parseInt(String(answer).trim(), 10)
    const expectedAnswer = parseInt(expectedAnswerStr, 10)

    if (isNaN(cleanAnswer) || cleanAnswer !== expectedAnswer) {
      return { valid: false, error: 'Incorrect verification answer. Please check your calculation.' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Failed to verify security token.' }
  }
}
