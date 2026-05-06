'use client'

import { useState, useTransition } from 'react'
import { submitFeedbackAction } from '@/app/actions/feedback'

const TYPES = [
  { value: 'bug',        icon: '🐛', label: 'Lỗi / Bug',         desc: 'Có gì đó không hoạt động đúng' },
  { value: 'suggestion', icon: '💡', label: 'Góp ý',             desc: 'Ý tưởng cải thiện hoặc tính năng mới' },
  { value: 'question',   icon: '❓', label: 'Câu hỏi',           desc: 'Tôi không hiểu cách dùng tính năng này' },
  { value: 'praise',     icon: '🙏', label: 'Khen ngợi',         desc: 'Chia sẻ điều bạn thích' },
]

export function FeedbackForm() {
  const [type, setType] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    startTransition(async () => {
      await submitFeedbackAction(type, message.trim())
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-8 py-16 text-center">
        <span className="text-5xl">🙌</span>
        <div>
          <p className="text-lg font-bold text-foreground">Cảm ơn bạn!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Phản hồi của bạn đã được gửi. Chúng tôi sẽ xem xét và phản hồi qua Zalo nếu cần.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setMessage('') }}
          className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Gửi phản hồi khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Type selector */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Loại phản hồi</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TYPES.map(({ value, icon, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                type === value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-semibold text-foreground">{label}</span>
              <span className="text-[10px] leading-snug text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Mô tả chi tiết
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            type === 'bug'
              ? 'Mô tả lỗi: bạn đang làm gì, điều gì xảy ra, điều gì bạn mong đợi...'
              : type === 'suggestion'
              ? 'Tính năng nào bạn muốn thêm, hoặc điều gì có thể làm tốt hơn...'
              : type === 'question'
              ? 'Bạn đang thắc mắc về tính năng nào, bạn gặp khó khăn ở đâu...'
              : 'Điều gì bạn thích nhất về ứng dụng này...'
          }
          rows={5}
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="mt-1.5 text-xs text-faint">{message.length} ký tự</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !message.trim()}
        className="self-start rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
      >
        {isPending ? 'Đang gửi…' : 'Gửi phản hồi'}
      </button>
    </form>
  )
}
