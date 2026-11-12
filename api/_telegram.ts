// ============================================================
//  HARITECH AI EMAIL AGENT — TELEGRAM BOT APPROVAL INTEGRATION
// ============================================================

export interface EmailThreadDoc {
  _id?: any
  threadId: string
  fromName: string
  fromEmail: string
  subject: string
  originalBody: string
  category: string
  confidence?: number
  draftReply: string
  status: 'pending_approval' | 'approved' | 'sent' | 'rejected' | 'failed' | 'expired' | 'ignored_spam'
  telegramMessageId?: number
  telegramChatId?: string
  approvalExpiresAt?: string
  createdAt?: string
}

export const TELEGRAM_CONFIG = {
  get botToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || ''
  },
  get allowedUserId(): string {
    return (process.env.TELEGRAM_ALLOWED_USER_ID || process.env.TELEGRAM_CHAT_ID || '').trim()
  },
  get isConfigured(): boolean {
    return Boolean(this.botToken && this.allowedUserId)
  },
}

/**
 * Returns configuration status for Telegram bot.
 */
export function getTelegramConfigStatus(): {
  isConfigured: boolean
  hasBotToken: boolean
  hasAllowedUserId: boolean
  allowedUserIdMasked: string
} {
  const uid = TELEGRAM_CONFIG.allowedUserId
  const masked = uid ? `${uid.slice(0, 3)}***${uid.slice(-2)}` : 'Not set'
  return {
    isConfigured: TELEGRAM_CONFIG.isConfigured,
    hasBotToken: Boolean(TELEGRAM_CONFIG.botToken),
    hasAllowedUserId: Boolean(uid),
    allowedUserIdMasked: masked,
  }
}

/**
 * Validates that an incoming Telegram interaction is strictly from Hari's authorized account.
 */
export function isAuthorizedTelegramUser(userId: string | number): boolean {
  if (!TELEGRAM_CONFIG.allowedUserId) return false
  return String(userId).trim() === TELEGRAM_CONFIG.allowedUserId
}

/**
 * Executes an arbitrary Telegram Bot API call.
 */
async function callTelegramApi(method: string, payload: any): Promise<any> {
  const token = TELEGRAM_CONFIG.botToken
  if (!token) {
    console.warn(`Telegram call skipped: TELEGRAM_BOT_TOKEN is not configured (method: ${method}).`)
    return { ok: false, description: 'TELEGRAM_BOT_TOKEN is missing.' }
  }

  const url = `https://api.telegram.org/bot${token}/${method}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.ok) {
    console.error(`Telegram API error (${method}):`, data)
  }
  return data
}

/**
 * Sends a regular text message to a chat.
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: {
    parse_mode?: 'Markdown' | 'HTML'
    reply_markup?: any
  } = {}
): Promise<any> {
  return callTelegramApi('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode || 'HTML',
    reply_markup: options.reply_markup,
    disable_web_page_preview: true,
  })
}

/**
 * Edits an existing message's text and/or inline buttons.
 */
export async function editTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  options: {
    parse_mode?: 'Markdown' | 'HTML'
    reply_markup?: any
  } = {}
): Promise<any> {
  return callTelegramApi('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: options.parse_mode || 'HTML',
    reply_markup: options.reply_markup,
    disable_web_page_preview: true,
  })
}

/**
 * Answers an inline button callback query to dismiss loading indicators.
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert = false
): Promise<any> {
  return callTelegramApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text || '',
    show_alert: showAlert,
  })
}

/**
 * Escapes characters for Telegram HTML formatting.
 */
function escapeTgHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Sends an interactive approval notification to Hari with inline buttons.
 */
export async function sendApprovalNotification(thread: EmailThreadDoc): Promise<{
  success: boolean
  messageId?: number
  chatId?: string
}> {
  if (!TELEGRAM_CONFIG.isConfigured) {
    console.warn('Skipping Telegram notification: Telegram Bot not configured.')
    return { success: false }
  }

  const threadId = thread.threadId
  const safeName = escapeTgHtml(thread.fromName || 'Visitor')
  const safeEmail = escapeTgHtml(thread.fromEmail)
  const safeSubject = escapeTgHtml(thread.subject || '(No Subject)')
  const safeCategory = escapeTgHtml(thread.category || 'General enquiries')
  const confidencePercent = Math.round((thread.confidence || 0.9) * 100)

  // Truncate original message snippet if very long
  const rawSnippet = thread.originalBody || ''
  const truncatedSnippet = rawSnippet.length > 280
    ? `${rawSnippet.slice(0, 277)}...`
    : rawSnippet
  const safeSnippet = escapeTgHtml(truncatedSnippet)

  const safeDraft = escapeTgHtml(thread.draftReply)

  const messageHtml = `<b>🤖 Haritech AI Email Agent — Approval Required</b>

🏷️ <b>Category:</b> <code>${safeCategory}</code> (${confidencePercent}%)
👤 <b>From:</b> ${safeName} &lt;<code>${safeEmail}</code>&gt;
📌 <b>Subject:</b> <b>${safeSubject}</b>
⏰ <i>Auto-expires in 48 hours</i>

━━━━━━━━━━━━━━━━━━━━
💬 <b>Original Inquiry:</b>
<blockquote>${safeSnippet}</blockquote>

✍️ <b>AI-Generated Reply Draft:</b>
<blockquote>${safeDraft}</blockquote>
━━━━━━━━━━━━━━━━━━━━
<i>Would you like to approve and dispatch this reply?</i>`

  // Inline keyboard callback data (keep <= 64 bytes)
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: '✅ Approve & Send', callback_data: `mail_app_${threadId}` },
        { text: '❌ Reject', callback_data: `mail_rej_${threadId}` },
      ],
      [
        { text: '✏️ Edit Reply', callback_data: `mail_edt_${threadId}` },
        { text: '📩 View Original', callback_data: `mail_viw_${threadId}` },
      ],
    ],
  }

  const result = await sendTelegramMessage(TELEGRAM_CONFIG.allowedUserId, messageHtml, {
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
  })

  if (result.ok && result.result?.message_id) {
    return {
      success: true,
      messageId: result.result.message_id,
      chatId: String(TELEGRAM_CONFIG.allowedUserId),
    }
  }

  return { success: false }
}
