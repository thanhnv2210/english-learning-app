import Link from 'next/link'

type FAQItem = {
  q: string
  a: string | React.ReactNode
}

const FAQS: { section: string; items: FAQItem[] }[] = [
  {
    section: 'Chung',
    items: [
      {
        q: 'Ứng dụng này dành cho ai?',
        a: 'Dành cho kỹ sư phần mềm đang cần đạt IELTS Band 6.5+ — thường để xin visa định cư Úc, Canada, hoặc đi làm ở nước ngoài. Toàn bộ nội dung luyện tập dùng chủ đề tech (microservices, Agile, remote work...) để bạn tận dụng kiến thức sẵn có.',
      },
      {
        q: 'Sự khác nhau giữa tài khoản Free và VIP?',
        a: 'Free: dùng được tất cả công cụ, nhưng giới hạn 10 lần chấm điểm Writing bằng AI mỗi tháng. VIP: không giới hạn, được dùng model Claude Sonnet chất lượng cao hơn cho chấm điểm và phân tích.',
      },
      {
        q: 'Làm sao để nâng lên VIP?',
        a: 'Nhắn Zalo cho admin sau khi đăng ký để xác nhận thanh toán (chuyển khoản ngân hàng / VietQR). Tài khoản được nâng cấp thủ công trong vòng vài giờ.',
      },
    ],
  },
  {
    section: 'AI Scoring',
    items: [
      {
        q: 'AI chấm điểm có chính xác không?',
        a: 'AI được cấu hình để chấm nghiêm theo 4 tiêu chí IELTS chính thức (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy). Trong thử nghiệm nội bộ, điểm AI chênh lệch ±0.5 band so với examiner thật. Dùng để đo tiến trình và nhận feedback định hướng — không thay thế mock test với examiner thật.',
      },
      {
        q: 'Tại sao điểm AI đôi khi cao/thấp hơn tôi mong đợi?',
        a: 'AI áp dụng tiêu chí IELTS nghiêm ngặt. Các lỗi phổ biến bị trừ điểm nhiều: dùng từ informal/slang, thiếu cohesive devices, lặp từ, câu quá ngắn hoặc quá đơn giản. Xem phần "Criteria breakdown" trong feedback để biết cụ thể.',
      },
      {
        q: 'Mỗi tháng tôi được chấm bao nhiêu bài Writing?',
        a: 'Free: 10 lần/tháng. VIP: không giới hạn. Counter reset vào đầu tháng.',
      },
    ],
  },
  {
    section: 'Speaking',
    items: [
      {
        q: 'Speaking cần browser gì?',
        a: 'Chrome hoặc Edge trên desktop. Chrome Web Speech API không hỗ trợ Firefox, Safari, hoặc trình duyệt trên iOS. Nên dùng trên laptop/PC cho trải nghiệm tốt nhất.',
      },
      {
        q: 'AI examiner có nghe thấy giọng tôi không?',
        a: 'Không. Speech-to-Text chạy hoàn toàn trên trình duyệt (Chrome Web Speech API). Âm thanh không được gửi đến server — chỉ có văn bản được chuyển đổi là được xử lý bởi AI.',
      },
      {
        q: '"Filler words" là gì và tại sao cần tránh?',
        a: 'Filler words là những từ lấp chỗ trống như "um", "uh", "like", "you know". IELTS examiners trừ điểm Fluency khi bạn dùng quá nhiều. Ứng dụng tự phát hiện và đếm sau mỗi phiên speaking.',
      },
    ],
  },
  {
    section: 'Vocabulary & SRS',
    items: [
      {
        q: 'SRS (Spaced Repetition) hoạt động như thế nào?',
        a: 'Khi bạn thêm một từ vào review ("Add to Review"), hệ thống dùng thuật toán SM-2 để lên lịch ôn tập. Từ nào bạn trả lời đúng sẽ được hẹn ôn lại sau vài ngày; sai sẽ được ôn sớm hơn. Mục tiêu là ghi nhớ lâu dài với thời gian ôn tập tối thiểu.',
      },
      {
        q: 'Vocabulary trong app có khác gì từ điển thông thường không?',
        a: 'Từ vựng trong app tập trung vào Academic Word List (AWL) và từ phù hợp Band 6.5+. Mỗi từ có ví dụ cụ thể cho Speaking và Writing, collocations tự nhiên, và gợi ý thay thế cho "dev slang" (e.g. thay "fix" bằng "rectify" hay "address").',
      },
    ],
  },
  {
    section: 'Dữ liệu & Bảo mật',
    items: [
      {
        q: 'Dữ liệu của tôi có được bảo mật không?',
        a: 'Có. Bài viết, transcript speaking, và dữ liệu học tập được lưu trong database riêng biệt theo từng tài khoản. Chúng tôi không chia sẻ dữ liệu cá nhân với bên thứ ba. Đọc thêm ở Chính sách bảo mật.',
      },
      {
        q: 'Nếu tôi xóa tài khoản, dữ liệu có bị xóa không?',
        a: 'Có. Tất cả dữ liệu gắn với tài khoản (bài viết, lịch sử speaking, từ vựng, v.v.) sẽ bị xóa vĩnh viễn khi xóa tài khoản. Liên hệ admin qua Zalo để yêu cầu xóa.',
      },
    ],
  },
  {
    section: 'Hỗ trợ',
    items: [
      {
        q: 'Gặp lỗi hoặc có câu hỏi thì liên hệ ở đâu?',
        a: (
          <>
            Dùng trang{' '}
            <Link href="/feedback" className="text-blue-500 hover:underline">
              Gửi phản hồi
            </Link>{' '}
            ngay trong app để báo lỗi hoặc đặt câu hỏi. Admin sẽ phản hồi qua Zalo trong vòng 24h trong ngày làm việc.
          </>
        ),
      },
      {
        q: 'Tôi có thể đề xuất tính năng mới không?',
        a: (
          <>
            Hoàn toàn được và rất khuyến khích! Vào{' '}
            <Link href="/feedback" className="text-blue-500 hover:underline">
              Gửi phản hồi
            </Link>{' '}
            và chọn loại "Góp ý". Các tính năng được nhiều người yêu cầu sẽ được ưu tiên xây dựng trước.
          </>
        ),
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Câu hỏi thường gặp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Không tìm thấy câu trả lời?{' '}
          <Link href="/feedback" className="text-blue-500 hover:underline">
            Gửi câu hỏi cho chúng tôi →
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {FAQS.map(({ section, items }) => (
          <section key={section}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
              {section}
            </h2>
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
              {items.map(({ q, a }) => (
                <details key={q} className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground hover:bg-subtle transition-colors list-none">
                    {q}
                    <span className="shrink-0 text-faint transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center">
        <p className="text-sm font-semibold text-foreground">Vẫn còn thắc mắc?</p>
        <p className="mt-1 text-xs text-muted-foreground">Chúng tôi sẵn sàng giúp đỡ.</p>
        <Link
          href="/feedback"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
        >
          Gửi câu hỏi →
        </Link>
      </div>
    </div>
  )
}
