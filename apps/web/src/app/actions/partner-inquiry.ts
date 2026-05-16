'use server'

import { db } from '@/lib/db'
import { partnerInquiries } from '@/lib/db/schema'
import { sendPartnerInquiryNotification, sendPartnerConfirmationEmail } from '@/lib/email'

export type PartnerInquiryInput = {
  email: string
  phone: string
  tag: string
  message: string
  lang: 'en' | 'vi'
}

export async function submitPartnerInquiryAction(input: PartnerInquiryInput): Promise<void> {
  const { email, phone, tag, message, lang } = input

  await db.insert(partnerInquiries).values({ email, phone, tag, message })

  // Both emails fire-and-forget — user sees success regardless of email delivery
  sendPartnerInquiryNotification({ email, phone, tag, message }).catch((err) =>
    console.error('[partner-inquiry] admin notification failed:', err),
  )
  sendPartnerConfirmationEmail({ email, lang }).catch((err) =>
    console.error('[partner-inquiry] confirmation email failed:', err),
  )
}
