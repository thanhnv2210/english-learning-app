import { FeedbackForm } from './feedback-form'

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Gửi phản hồi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Báo lỗi, góp ý tính năng, hoặc đặt câu hỏi. Mọi phản hồi đều được đọc và cân nhắc.
        </p>
      </div>
      <FeedbackForm />
    </div>
  )
}
