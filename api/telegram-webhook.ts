// ============================================================
//  HARITECH AI EMAIL AGENT — TELEGRAM WEBHOOK ENDPOINT
// ============================================================

import { connectToDatabase } from './_db.js'
import {
  TELEGRAM_CONFIG,
  isAuthorizedTelegramUser,
  editTelegramMessage,
  sendTelegramMessage,
  answerCallbackQuery,
  sendApprovalNotification,
} from './_telegram.js'
import { sendGmailReply } from './_gmail.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // Telegram webhooks use POST
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Telegram webhook active. Use POST for updates.' })
  }

  // Optional Telegram secret token verification
  const secretHeader = req.headers['x-telegram-bot-api-secret-token']
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (expectedSecret && secretHeader !== expectedSecret) {
    console.warn('Telegram webhook secret mismatch.')
    return res.status(401).json({ error: 'Unauthorized webhook secret.' })
  }

  const update = req.body || {}

  try {
    const { db } = await connectToDatabase()
    const threadsCollection = db.collection('email_agent_threads')
    const sessionsCollection = db.collection('telegram_agent_sessions')

    // ─────────────────────────────────────────────
    //  CASE A: INLINE BUTTON CALLBACK QUERY
    // ─────────────────────────────────────────────
    if (update.callback_query) {
      const cq = update.callback_query
      const fromUser = cq.from
      const callbackData = cq.data || ''
      const callbackQueryId = cq.id
      const messageId = cq.message?.message_id
      const chatId = cq.message?.chat?.id

      // 1. Authorization check
      if (!isAuthorizedTelegramUser(fromUser.id)) {
        await answerCallbackQuery(callbackQueryId, '⛔ Unauthorized account. Access restricted to Hari.', true)
        return res.status(200).json({ ok: true })
      }

      // Parse callback actions: mail_app_<id>, mail_rej_<id>, mail_edt_<id>, mail_viw_<id>
      const match = callbackData.match(/^mail_(app|rej|edt|viw)_(.+)$/)
      if (!match) {
        await answerCallbackQuery(callbackQueryId, 'Unrecognized action.')
        return res.status(200).json({ ok: true })
      }

      const [, action, threadId] = match
      const thread = await threadsCollection.findOne({ threadId })

      if (!thread) {
        await answerCallbackQuery(callbackQueryId, 'Thread record not found in database.', true)
        return res.status(200).json({ ok: true })
      }

      const nowIso = new Date().toISOString()
      const formattedTimestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      })

      // Check Expiration
      if (thread.approvalExpiresAt && new Date(thread.approvalExpiresAt).getTime() < Date.now()) {
        if (thread.status === 'pending_approval') {
          await threadsCollection.updateOne(
            { threadId },
            { $set: { status: 'expired', updatedAt: nowIso } }
          )
        }
        await answerCallbackQuery(callbackQueryId, '⏳ This approval request has expired (>48 hours).', true)
        return res.status(200).json({ ok: true })
      }

      // ------------------------------------------------------------------
      // ACTION: APPROVE & SEND
      // ------------------------------------------------------------------
      if (action === 'app') {
        // Prevent duplicate sending
        if (thread.status === 'sent') {
          await answerCallbackQuery(callbackQueryId, '⚠️ Already sent previously!', true)
          return res.status(200).json({ ok: true })
        }
        if (thread.status === 'rejected') {
          await answerCallbackQuery(callbackQueryId, '⚠️ This email was already marked as rejected.', true)
          return res.status(200).json({ ok: true })
        }

        await answerCallbackQuery(callbackQueryId, '⏳ Dispatching reply via Gmail...')

        // Dispatch reply email
        const sendResult = await sendGmailReply({
          to: thread.fromEmail,
          subject: thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`,
          bodyText: thread.draftReply,
          inReplyTo: thread.messageId || undefined,
          references: thread.messageId || undefined,
          threadId: thread.gmailThreadId || undefined,
          senderName: 'Chenthil Hari',
        })

        // Update database record
        await threadsCollection.updateOne(
          { threadId },
          {
            $set: {
              status: sendResult.success ? 'sent' : 'failed',
              approvedAt: nowIso,
              sentAt: sendResult.success ? nowIso : null,
              sendMethod: sendResult.method,
              sendResult,
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: sendResult.success ? 'approved_and_sent' : 'send_failed',
                timestamp: nowIso,
                method: sendResult.method,
                error: sendResult.error || null,
              },
            } as any,
          }
        )

        // Update Telegram message, removing action buttons and replacing with success banner
        if (chatId && messageId) {
          const statusText = `<b>🤖 Haritech AI Email Agent</b>\n\n` +
            `✅ <b>DISPATCHED SUCCESSFULLY</b>\n` +
            `👤 <b>To:</b> ${thread.fromName} &lt;<code>${thread.fromEmail}</code>&gt;\n` +
            `📌 <b>Subject:</b> ${thread.subject}\n` +
            `🚀 <b>Method:</b> ${sendResult.method.toUpperCase()}\n` +
            `📅 <b>Sent:</b> ${formattedTimestamp} (IST)\n\n` +
            `✍️ <b>Delivered Reply:</b>\n<blockquote>${thread.draftReply}</blockquote>`

          await editTelegramMessage(chatId, messageId, statusText, {
            reply_markup: { inline_keyboard: [] },
          })
        }

        return res.status(200).json({ ok: true })
      }

      // ------------------------------------------------------------------
      // ACTION: REJECT
      // ------------------------------------------------------------------
      if (action === 'rej') {
        if (thread.status === 'sent') {
          await answerCallbackQuery(callbackQueryId, '⚠️ Cannot reject: Already sent!', true)
          return res.status(200).json({ ok: true })
        }

        await threadsCollection.updateOne(
          { threadId },
          {
            $set: {
              status: 'rejected',
              rejectedAt: nowIso,
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: 'rejected',
                timestamp: nowIso,
                userId: fromUser.id,
              },
            } as any,
          }
        )

        await answerCallbackQuery(callbackQueryId, '❌ Inquiry marked as rejected. No email will be sent.')

        if (chatId && messageId) {
          const rejectedText = `<b>🤖 Haritech AI Email Agent</b>\n\n` +
            `❌ <b>REJECTED — NO EMAIL SENT</b>\n` +
            `👤 <b>Sender:</b> ${thread.fromName} &lt;<code>${thread.fromEmail}</code>&gt;\n` +
            `📌 <b>Subject:</b> ${thread.subject}\n` +
            `📅 <b>Action Time:</b> ${formattedTimestamp} (IST)\n\n` +
            `<i>This draft has been discarded and no automated reply will be delivered.</i>`

          await editTelegramMessage(chatId, messageId, rejectedText, {
            reply_markup: { inline_keyboard: [] },
          })
        }

        return res.status(200).json({ ok: true })
      }

      // ------------------------------------------------------------------
      // ACTION: EDIT DRAFT
      // ------------------------------------------------------------------
      if (action === 'edt') {
        // Store editing session in DB
        await sessionsCollection.updateOne(
          { userId: String(fromUser.id) },
          {
            $set: {
              userId: String(fromUser.id),
              state: 'editing_draft',
              threadId: thread.threadId,
              originalMessageId: messageId,
              updatedAt: nowIso,
            },
          },
          { upsert: true }
        )

        await answerCallbackQuery(callbackQueryId, '✏️ Edit mode activated. Reply with your updated text.')

        if (chatId) {
          await sendTelegramMessage(
            chatId,
            `✏️ <b>Draft Revision Mode Active</b>\n\n` +
              `Editing reply for <b>${thread.fromName}</b> (<code>${thread.fromEmail}</code>).\n\n` +
              `<b>Current Draft:</b>\n<blockquote>${thread.draftReply}</blockquote>\n\n` +
              `👉 <i>Please type and send your updated reply text below. I will update the proposal and present it for your approval.</i>`
          )
        }

        return res.status(200).json({ ok: true })
      }

      // ------------------------------------------------------------------
      // ACTION: VIEW ORIGINAL FULL INQUIRY
      // ------------------------------------------------------------------
      if (action === 'viw') {
        await answerCallbackQuery(callbackQueryId)

        if (chatId) {
          const fullText = `📩 <b>Full Original Inquiry</b>\n\n` +
            `👤 <b>From:</b> ${thread.fromName} &lt;<code>${thread.fromEmail}</code>&gt;\n` +
            `📌 <b>Subject:</b> ${thread.subject}\n` +
            `🏷️ <b>Category:</b> ${thread.category}\n` +
            `📅 <b>Received:</b> ${thread.createdAt ? new Date(thread.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Recently'}\n\n` +
            `<b>Full Message Body:</b>\n<blockquote>${thread.originalBody || '(Empty body)'}</blockquote>`

          await sendTelegramMessage(chatId, fullText)
        }

        return res.status(200).json({ ok: true })
      }
    }

    // ─────────────────────────────────────────────
    //  CASE B: INCOMING TEXT MESSAGE
    // ─────────────────────────────────────────────
    if (update.message && update.message.text) {
      const msg = update.message
      const fromUser = msg.from
      const text = msg.text.trim()
      const chatId = msg.chat.id

      // 1. Authorization check
      if (!isAuthorizedTelegramUser(fromUser.id)) {
        await sendTelegramMessage(
          chatId,
          `⛔ <b>Access Restricted</b>\nThis bot is a private assistant dedicated to Hari. Unauthorized requests are logged and rejected.`
        )
        return res.status(200).json({ ok: true })
      }

      // 2. Check if user is in an active "editing_draft" session
      const activeSession = await sessionsCollection.findOne({
        userId: String(fromUser.id),
        state: 'editing_draft',
      })

      if (activeSession && activeSession.threadId) {
        const threadId = activeSession.threadId
        const newDraft = text
        const nowIso = new Date().toISOString()

        // Update the thread draft in database
        const updatedDoc = await threadsCollection.findOneAndUpdate(
          { threadId },
          {
            $set: {
              draftReply: newDraft,
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: 'draft_edited_via_telegram',
                timestamp: nowIso,
                userId: fromUser.id,
                updatedDraft: newDraft,
              },
            } as any,
          },
          { returnDocument: 'after' }
        )

        // Clear user session
        await sessionsCollection.deleteOne({ userId: String(fromUser.id) })

        await sendTelegramMessage(
          chatId,
          `✅ <b>Draft successfully updated!</b> Presenting updated approval card:`
        )

        // Send a fresh approval notification with the updated draft
        if (updatedDoc) {
          await sendApprovalNotification(updatedDoc as any)
        }

        return res.status(200).json({ ok: true })
      }

      // 3. Handle Bot Commands
      if (text === '/start' || text === '/help') {
        const helpText = `🤖 <b>Haritech AI Email Agent</b>\n\n` +
          `Welcome, Hari! I am your personal AI email assistant. I monitor incoming inquiries, classify them using OpenAI, draft authentic responses, and request your approval before dispatching.\n\n` +
          `<b>Available Commands:</b>\n` +
          `• <code>/status</code> — System health, pending counts, and metrics\n` +
          `• <code>/pending</code> — List pending emails awaiting your approval\n` +
          `• <code>/help</code> — Show this usage guide`

        await sendTelegramMessage(chatId, helpText)
        return res.status(200).json({ ok: true })
      }

      if (text === '/status') {
        const total = await threadsCollection.countDocuments({})
        const pending = await threadsCollection.countDocuments({ status: 'pending_approval' })
        const sent = await threadsCollection.countDocuments({ status: 'sent' })
        const rejected = await threadsCollection.countDocuments({ status: 'rejected' })

        const statusMsg = `📊 <b>Haritech AI Email Agent — Status Report</b>\n\n` +
          `• <b>Total Processed:</b> ${total}\n` +
          `• <b>⏳ Pending Approvals:</b> ${pending}\n` +
          `• <b>✅ Successfully Sent:</b> ${sent}\n` +
          `• <b>❌ Rejected:</b> ${rejected}\n\n` +
          `<b>Services:</b>\n` +
          `• OpenAI Model: <code>${process.env.OPENAI_MODEL || 'gpt-4o-mini'}</code>\n` +
          `• Telegram Webhook: <code>Active</code>\n` +
          `• Admin Portal: <code>https://haritech.me/admin</code>`

        await sendTelegramMessage(chatId, statusMsg)
        return res.status(200).json({ ok: true })
      }

      if (text === '/pending') {
        const pendingList = await threadsCollection
          .find({ status: 'pending_approval' })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray()

        if (pendingList.length === 0) {
          await sendTelegramMessage(chatId, `✨ <b>All caught up!</b> No pending emails awaiting approval.`)
        } else {
          for (const item of pendingList) {
            await sendApprovalNotification(item as any)
          }
        }
        return res.status(200).json({ ok: true })
      }

      // Default catch-all message
      await sendTelegramMessage(
        chatId,
        `🤖 Command not recognized. Send <code>/pending</code> to review pending emails or <code>/status</code> to check system health.`
      )
      return res.status(200).json({ ok: true })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('Telegram webhook handler exception:', err)
    return res.status(500).json({ error: err.message || 'Webhook internal error' })
  }
}
