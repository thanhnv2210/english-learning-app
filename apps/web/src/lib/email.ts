import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.EMAIL_FROM ?? 'IELTS Accelerator <noreply@yourdomain.com>'
const NOTIFY_TO = process.env.EMAIL_NOTIFY_TO ?? ''
const APP_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? 'http://localhost:3000'

// ── Feedback notification ────────────────────────────────────────────────────

const FEEDBACK_TYPE_LABELS: Record<string, string> = {
  bug:        'Bug',
  suggestion: 'Góp ý',
  question:   'Câu hỏi',
  praise:     'Khen ngợi',
}

export async function sendFeedbackNotificationEmail(opts: {
  type: string
  message: string
  userName: string | null
  userEmail: string | null
}): Promise<void> {
  if (!resend || !NOTIFY_TO) return // silently skip if not configured

  const typeLabel = FEEDBACK_TYPE_LABELS[opts.type] ?? opts.type
  const preview = opts.message.slice(0, 80).replace(/\n/g, ' ')
  const subject = `[IELTS][${typeLabel}] ${preview}${opts.message.length > 80 ? '…' : ''}`

  const from = opts.userName ?? opts.userEmail ?? 'Anonymous'
  const adminUrl = `${APP_URL}/admin/feedback`

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
        <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em">
          ${typeLabel} · từ ${from}${opts.userEmail ? ` &lt;${opts.userEmail}&gt;` : ''}
        </p>
        <div style="margin:16px 0;padding:16px;background:#f5f5f5;border-radius:8px;font-size:14px;color:#333;white-space:pre-wrap">${opts.message}</div>
        <a href="${adminUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none">
          View in admin →
        </a>
        <p style="margin:24px 0 0;font-size:11px;color:#bbb">IELTS Accelerator · ${adminUrl}</p>
      </div>
    `,
  })
}

// ── Partner inquiry ──────────────────────────────────────────────────────────

const PARTNER_TAG_LABELS: Record<string, string> = {
  distribution: 'Distribution Partner',
  investor:     'Strategic Investor',
  integration:  'Integration Partner',
  other:        'Other',
}

export async function sendPartnerInquiryNotification(opts: {
  email: string
  phone: string
  tag: string
  message: string
}): Promise<void> {
  if (!resend || !NOTIFY_TO) return

  const tagLabel = PARTNER_TAG_LABELS[opts.tag] ?? opts.tag
  const preview = opts.message.slice(0, 60).replace(/\n/g, ' ')
  const subject = `[IELTS Partner][${tagLabel}] ${preview}${opts.message.length > 60 ? '…' : ''}`

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    replyTo: opts.email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;color:#111">
        <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em">
          Partner Inquiry · ${tagLabel}
        </p>
        <h2 style="margin:8px 0 20px;font-size:18px">${opts.email}</h2>

        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px">
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:120px;border-radius:4px 0 0 4px">Email</td>
            <td style="padding:8px 12px;background:#fafafa">${opts.email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Phone</td>
            <td style="padding:8px 12px;background:#fafafa">${opts.phone}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Type</td>
            <td style="padding:8px 12px;background:#fafafa">${tagLabel}</td>
          </tr>
        </table>

        <div style="padding:16px;background:#f5f5f5;border-radius:8px;font-size:14px;color:#333;white-space:pre-wrap;line-height:1.6">${opts.message}</div>

        <p style="margin:20px 0 0;font-size:13px;color:#555">
          Reply to this email to respond directly to <strong>${opts.email}</strong>.
        </p>
        <p style="margin:24px 0 0;font-size:11px;color:#bbb">IELTS Accelerator Partner Inquiry</p>
      </div>
    `,
  })
}

export async function sendPartnerConfirmationEmail(opts: {
  email: string
  lang: 'en' | 'vi'
}): Promise<void> {
  if (!resend) return

  const isVi = opts.lang === 'vi'

  const subject = isVi
    ? '[IELTS Accelerator] Chúng tôi đã nhận được yêu cầu của bạn'
    : '[IELTS Accelerator] We received your inquiry'

  const body = isVi
    ? `Cảm ơn bạn đã liên hệ với chúng tôi.\n\nChúng tôi đã nhận được yêu cầu hợp tác của bạn và sẽ phản hồi trong vòng 24 giờ.\n\nNếu bạn có thêm thông tin muốn chia sẻ, chỉ cần trả lời email này.\n\nTrân trọng,\nĐội ngũ IELTS Accelerator`
    : `Thank you for reaching out.\n\nWe have received your partnership inquiry and will get back to you within 24 hours.\n\nIf you have any additional information to share, simply reply to this email.\n\nBest regards,\nThe IELTS Accelerator Team`

  const htmlBody = body
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 16px;color:#555;font-size:14px;line-height:1.6">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')

  await resend.emails.send({
    from: FROM,
    to: opts.email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
        <p style="margin:0 0 20px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2563eb">
          IELTS Accelerator
        </p>
        ${htmlBody}
        <p style="margin:32px 0 0;font-size:11px;color:#bbb">
          ${isVi ? 'Đây là email tự động xác nhận yêu cầu của bạn.' : 'This is an automated confirmation of your inquiry.'}
        </p>
      </div>
    `,
  })
}

// ── Account activation ───────────────────────────────────────────────────────

export const DEFAULT_ACTIVATION_SUBJECT = 'Your IELTS Accelerator account is ready'

export function buildActivationContent(name: string | null): string {
  const firstName = name?.split(' ')[0] ?? 'there'
  return `Hi ${firstName}, your account has been approved. You can now sign in and start practising.\n\n${APP_URL}/login`
}

export async function sendAccountActivatedEmail(
  to: string,
  name: string | null,
  subject = DEFAULT_ACTIVATION_SUBJECT,
  content = buildActivationContent(name),
): Promise<void> {
  if (!resend) return // silently skip if not configured

  // Convert plain newlines to HTML paragraphs
  const htmlBody = content
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 16px;color:#555">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
        ${htmlBody}
        <p style="margin:32px 0 0;font-size:12px;color:#999">
          If you didn't sign up for IELTS Accelerator, you can ignore this email.
        </p>
      </div>
    `,
  })
}
