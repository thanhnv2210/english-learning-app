import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.EMAIL_FROM ?? 'IELTS Accelerator <noreply@yourdomain.com>'
const APP_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? 'http://localhost:3000'

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
