'use client'

import { useState, useTransition } from 'react'
import { submitPartnerInquiryAction } from '@/app/actions/partner-inquiry'

const TAGS = {
  en: [
    { value: 'distribution', label: 'Distribution Partner', desc: 'Bootcamps, dev communities, tech companies' },
    { value: 'investor',     label: 'Strategic Investor',   desc: 'Seed round, EdTech / AI / SEA focus' },
    { value: 'integration',  label: 'Integration Partner',  desc: 'LMS, HR tools, immigration services' },
    { value: 'other',        label: 'Other',                desc: 'Something else entirely' },
  ],
  vi: [
    { value: 'distribution', label: 'Đối tác phân phối',   desc: 'Bootcamp, cộng đồng dev, công ty tech' },
    { value: 'investor',     label: 'Nhà đầu tư chiến lược', desc: 'Vòng seed, EdTech / AI / Đông Nam Á' },
    { value: 'integration',  label: 'Đối tác tích hợp',    desc: 'LMS, HR tool, tư vấn định cư' },
    { value: 'other',        label: 'Khác',                 desc: 'Hình thức khác' },
  ],
}

const COPY = {
  en: {
    emailLabel:       'Your email address',
    emailPlaceholder: 'you@company.com',
    phoneLabel:       'Phone number',
    phonePlaceholder: '+84 ...',
    tagLabel:         'Partnership type',
    messageLabel:     'Tell us about yourself and what you have in mind',
    messagePlaceholder: 'Company name, what you do, how you see us working together...',
    submit:           'Send inquiry',
    sending:          'Sending…',
    successTitle:     'Message received!',
    successBody:      'We will reply to your email within 24 hours. Check your inbox for a confirmation.',
    another:          'Send another message',
  },
  vi: {
    emailLabel:       'Địa chỉ email của bạn',
    emailPlaceholder: 'ban@congty.com',
    phoneLabel:       'Số điện thoại',
    phonePlaceholder: '09x xxx xxxx',
    tagLabel:         'Hình thức hợp tác',
    messageLabel:     'Giới thiệu về bạn và ý định hợp tác',
    messagePlaceholder: 'Tên công ty, lĩnh vực hoạt động, bạn muốn hợp tác như thế nào...',
    submit:           'Gửi yêu cầu',
    sending:          'Đang gửi…',
    successTitle:     'Đã nhận được!',
    successBody:      'Chúng tôi sẽ phản hồi qua email trong vòng 24 giờ. Kiểm tra hộp thư để xem email xác nhận.',
    another:          'Gửi yêu cầu khác',
  },
}

export function ContactForm({ lang }: { lang: 'en' | 'vi' }) {
  const c = COPY[lang]
  const tags = TAGS[lang]

  const [tag, setTag] = useState('investor')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !phone.trim() || !message.trim()) return
    startTransition(async () => {
      await submitPartnerInquiryAction({ email: email.trim(), phone: phone.trim(), tag, message: message.trim(), lang })
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="text-5xl">🙌</span>
        <div>
          <p className="text-lg font-bold text-foreground">{c.successTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">{c.successBody}</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setEmail(''); setPhone(''); setMessage('') }}
          className="mt-2 rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {c.another}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Email + Phone — side by side on sm+ */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">{c.emailLabel}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.emailPlaceholder}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">{c.phoneLabel}</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={c.phonePlaceholder}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tag selector */}
      <div>
        <p className="mb-2.5 text-sm font-medium text-foreground">{c.tagLabel}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tags.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTag(value)}
              className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors ${
                tag === value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5'
              }`}
            >
              <span className="text-xs font-semibold text-foreground leading-snug">{label}</span>
              <span className="text-[10px] leading-snug text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">{c.messageLabel}</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={c.messagePlaceholder}
          rows={5}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !email.trim() || !phone.trim() || !message.trim()}
        className="self-start rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
      >
        {isPending ? c.sending : c.submit}
      </button>
    </form>
  )
}
