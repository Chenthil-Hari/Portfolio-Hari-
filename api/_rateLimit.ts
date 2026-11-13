// Lightweight in-memory sliding window rate limiter for serverless API routes
const ipRequests = new Map<string, { count: number; resetTime: number }>()

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipRequests.entries()) {
    if (now > record.resetTime) {
      ipRequests.delete(ip)
    }
  }
}, 5 * 60 * 1000).unref?.()

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now()
  const record = ipRequests.get(ip)

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSec }
  }

  record.count += 1
  return { allowed: true, remaining: limit - record.count }
}
