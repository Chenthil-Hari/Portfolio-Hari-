// ============================================================
//  HARITECH AI EMAIL AGENT — ADMIN DASHBOARD BACKEND API
// ============================================================

import { connectToDatabase } from './_db.js'
import { ObjectId } from 'mongodb'
import { OPENAI_CONFIG, analyzeAndDraftReply } from './_openai.js'
import { GMAIL_CONFIG, getGmailConfigStatus, sendGmailReply, fetchRecentGmailInquiries } from './_gmail.js'
import {
  TELEGRAM_CONFIG,
  getTelegramConfigStatus,
  sendApprovalNotification,
  editTelegramMessage,
} from './_telegram.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Admin authentication check
  const adminPass = req.headers['x-admin-password'] || req.body?.password || req.query?.password
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPass !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' })
  }

  try {
    const { db } = await connectToDatabase()
    const threadsCol = db.collection('email_agent_threads')

    // ─────────────────────────────────────────────
    //  GET: Fetch threads, metrics, and health status
    // ─────────────────────────────────────────────
    if (req.method === 'GET') {
      const { status, category, search, limit = '50', page = '1' } = req.query || {}

      const filter: any = {}
      if (status && status !== 'all') {
        filter.status = status
      }
      if (category && category !== 'all') {
        filter.category = category
      }
      if (search) {
        const regex = new RegExp(String(search), 'i')
        filter.$or = [
          { fromName: regex },
          { fromEmail: regex },
          { subject: regex },
          { draftReply: regex },
          { originalBody: regex },
        ]
      }

      const limitNum = Math.min(Math.max(parseInt(String(limit), 10) || 50, 1), 100)
      const pageNum = Math.max(parseInt(String(page), 10) || 1, 1)
      const skipNum = (pageNum - 1) * limitNum

      const [threads, totalCount, metricsArr] = await Promise.all([
        threadsCol
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skipNum)
          .limit(limitNum)
          .toArray(),
        threadsCol.countDocuments(filter),
        threadsCol
          .aggregate([
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ])
          .toArray(),
      ])

      // Category breakdown
      const categoryAgg = await threadsCol
        .aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray()

      const statusMap: Record<string, number> = {}
      metricsArr.forEach((m: any) => {
        statusMap[m._id] = m.count
      })

      const categoryMap: Record<string, number> = {}
      categoryAgg.forEach((c: any) => {
        categoryMap[c._id || 'Unclassified'] = c.count
      })

      const totalReceived = await threadsCol.countDocuments({})

      const metrics = {
        totalReceived,
        pendingApprovals: statusMap['pending_approval'] || 0,
        sentEmails: statusMap['sent'] || 0,
        rejectedEmails: statusMap['rejected'] || 0,
        failedEmails: statusMap['failed'] || 0,
        spamDetected: statusMap['ignored_spam'] || 0,
        expiredApprovals: statusMap['expired'] || 0,
        categoryBreakdown: categoryMap,
      }

      const monitoringStatus = {
        openai: {
          isConfigured: Boolean(OPENAI_CONFIG.apiKey),
          model: OPENAI_CONFIG.model,
          fallbackActive: !OPENAI_CONFIG.apiKey,
        },
        telegram: getTelegramConfigStatus(),
        gmail: getGmailConfigStatus(),
        database: { isConnected: true },
      }

      return res.status(200).json({
        threads,
        totalCount,
        metrics,
        monitoringStatus,
      })
    }

    // ─────────────────────────────────────────────
    //  POST: Actions (Approve, Reject, Edit, Test, Sync)
    // ─────────────────────────────────────────────
    if (req.method === 'POST') {
      const { action, threadId, draftReply } = req.body || {}
      const nowIso = new Date().toISOString()

      // Action: Approve & Send from Dashboard
      if (action === 'approve') {
        if (!threadId) return res.status(400).json({ error: 'threadId is required.' })

        const thread = await threadsCol.findOne({ threadId })
        if (!thread) return res.status(404).json({ error: 'Thread not found.' })

        if (thread.status === 'sent') {
          return res.status(400).json({ error: 'Email has already been sent.' })
        }

        const replyToSend = draftReply || thread.draftReply

        const sendResult = await sendGmailReply({
          to: thread.fromEmail,
          subject: thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`,
          bodyText: replyToSend,
          inReplyTo: thread.messageId || undefined,
          references: thread.messageId || undefined,
          threadId: thread.gmailThreadId || undefined,
          senderName: 'Chenthil Hari',
        })

        await threadsCol.updateOne(
          { threadId },
          {
            $set: {
              status: sendResult.success ? 'sent' : 'failed',
              draftReply: replyToSend,
              approvedAt: nowIso,
              sentAt: sendResult.success ? nowIso : null,
              sendMethod: sendResult.method,
              sendResult,
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: 'approved_via_admin_dashboard',
                timestamp: nowIso,
                method: sendResult.method,
                error: sendResult.error || null,
              },
            } as any,
          }
        )

        // If Telegram notification was posted, update it
        if (thread.telegramChatId && thread.telegramMessageId) {
          try {
            await editTelegramMessage(
              thread.telegramChatId,
              thread.telegramMessageId,
              `<b>🤖 Haritech AI Email Agent</b>\n\n✅ <b>DISPATCHED FROM ADMIN PORTAL</b>\n👤 <b>To:</b> ${thread.fromName} &lt;<code>${thread.fromEmail}</code>&gt;\n📌 <b>Subject:</b> ${thread.subject}\n🚀 <b>Method:</b> ${sendResult.method.toUpperCase()}\n\n✍️ <b>Reply:</b>\n<blockquote>${replyToSend}</blockquote>`,
              { reply_markup: { inline_keyboard: [] } }
            )
          } catch {}
        }

        return res.status(200).json({
          success: true,
          message: sendResult.success
            ? `Email successfully sent via ${sendResult.method}.`
            : `Failed to send email: ${sendResult.error}`,
          sendResult,
        })
      }

      // Action: Reject from Dashboard
      if (action === 'reject') {
        if (!threadId) return res.status(400).json({ error: 'threadId is required.' })

        await threadsCol.updateOne(
          { threadId },
          {
            $set: {
              status: 'rejected',
              rejectedAt: nowIso,
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: 'rejected_via_admin_dashboard',
                timestamp: nowIso,
              },
            } as any,
          }
        )

        return res.status(200).json({ success: true, message: 'Thread marked as rejected.' })
      }

      // Action: Edit draft from Dashboard
      if (action === 'edit') {
        if (!threadId || typeof draftReply !== 'string') {
          return res.status(400).json({ error: 'threadId and draftReply are required.' })
        }

        await threadsCol.updateOne(
          { threadId },
          {
            $set: {
              draftReply: draftReply.trim(),
              updatedAt: nowIso,
            },
            $push: {
              history: {
                event: 'draft_edited_via_admin_dashboard',
                timestamp: nowIso,
              },
            } as any,
          }
        )

        return res.status(200).json({ success: true, message: 'Draft updated successfully.' })
      }

      // Action: Test Pipeline Simulator
      if (action === 'test-agent') {
        const sampleInquiry = {
          senderName: req.body?.sampleName || 'Alex Vance (Tech Recruiter)',
          senderEmail: req.body?.sampleEmail || 'alex.vance@techventures.io',
          subject: req.body?.sampleSubject || 'Summer 2026 Software Engineering Opportunity at TechVentures',
          message:
            req.body?.sampleMessage ||
            'Hi Hari, I came across your impressive portfolio and your projects in embedded systems and web architecture. We are currently scouting for proactive software engineering interns. Could you let us know if you are open to discussing roles?',
          inquiryType: 'Internship and job opportunities',
        }

        // Run AI analysis
        const aiAnalysis = await analyzeAndDraftReply(sampleInquiry)

        const testThreadId = `test-${Date.now()}`
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

        const threadDoc = {
          threadId: testThreadId,
          fromName: sampleInquiry.senderName,
          fromEmail: sampleInquiry.senderEmail,
          subject: sampleInquiry.subject,
          originalBody: sampleInquiry.message,
          category: aiAnalysis.category,
          confidence: aiAnalysis.confidence,
          aiReasoning: aiAnalysis.aiReasoning,
          draftReply: aiAnalysis.draftReply,
          status: 'pending_approval',
          source: 'simulation_test',
          approvalExpiresAt: expiresAt,
          history: [
            {
              event: 'simulated_inquiry_created',
              timestamp: nowIso,
              model: aiAnalysis.modelUsed,
            },
          ],
          createdAt: nowIso,
          updatedAt: nowIso,
        }

        await threadsCol.insertOne(threadDoc)

        // Dispatch Telegram approval notification
        let tgResult = { success: false }
        try {
          tgResult = await sendApprovalNotification(threadDoc as any)
          if (tgResult.success && tgResult.messageId) {
            await threadsCol.updateOne(
              { threadId: testThreadId },
              {
                $set: {
                  telegramMessageId: tgResult.messageId,
                  telegramChatId: tgResult.chatId,
                },
              }
            )
          }
        } catch (tgErr) {
          console.warn('Telegram test notification error:', tgErr)
        }

        return res.status(200).json({
          success: true,
          message: 'Simulation test ran successfully!',
          threadId: testThreadId,
          analysis: aiAnalysis,
          telegramNotificationDispatched: tgResult.success,
        })
      }

      // Action: Synchronize Gmail Inbox
      if (action === 'sync-gmail') {
        const recentMessages = await fetchRecentGmailInquiries(5)
        let syncedCount = 0

        for (const msg of recentMessages) {
          // Check if already processed
          const exists = await threadsCol.findOne({
            $or: [{ messageId: msg.id }, { gmailThreadId: msg.threadId }],
          })

          if (!exists) {
            const analysis = await analyzeAndDraftReply({
              senderName: msg.fromName,
              senderEmail: msg.fromEmail,
              subject: msg.subject,
              message: msg.body,
            })

            const newThreadId = `gmail-${msg.id}`
            const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

            const doc = {
              threadId: newThreadId,
              messageId: msg.id,
              gmailThreadId: msg.threadId,
              fromName: msg.fromName,
              fromEmail: msg.fromEmail,
              subject: msg.subject,
              originalBody: msg.body,
              category: analysis.category,
              confidence: analysis.confidence,
              aiReasoning: analysis.aiReasoning,
              draftReply: analysis.draftReply,
              status: analysis.isSpam ? 'ignored_spam' : 'pending_approval',
              source: 'gmail_sync',
              approvalExpiresAt: expiresAt,
              history: [{ event: 'synced_from_gmail', timestamp: nowIso }],
              createdAt: nowIso,
              updatedAt: nowIso,
            }

            await threadsCol.insertOne(doc)
            syncedCount++

            if (!analysis.isSpam) {
              try {
                const tgRes = await sendApprovalNotification(doc as any)
                if (tgRes.success && tgRes.messageId) {
                  await threadsCol.updateOne(
                    { threadId: newThreadId },
                    { $set: { telegramMessageId: tgRes.messageId, telegramChatId: tgRes.chatId } }
                  )
                }
              } catch {}
            }
          }
        }

        return res.status(200).json({
          success: true,
          scanned: recentMessages.length,
          newSynced: syncedCount,
        })
      }

      return res.status(400).json({ error: `Unrecognized action: ${action}` })
    }

    // ─────────────────────────────────────────────
    //  DELETE: Delete a thread record
    // ─────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { threadId } = req.body || req.query || {}
      if (!threadId) return res.status(400).json({ error: 'threadId is required.' })

      await threadsCol.deleteOne({ threadId })
      return res.status(200).json({ success: true, message: 'Thread removed.' })
    }

    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error: any) {
    console.error('Mail agent API error:', error)
    return res.status(500).json({ error: error.message || 'Database error' })
  }
}
