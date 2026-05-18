import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getCurrentUser } from '@/lib/db/user'

const FEATURES = [
  {
    icon: '🎙',
    title: 'AI Speaking Examiner',
    description: 'Luyện Part 1, 2 & 3 với examiner AI nghiêm khắc. Speech-to-text, phát hiện filler words, và band feedback sau mỗi buổi.',
  },
  {
    icon: '✍️',
    title: 'Writing Task 2 Coach',
    description: 'Pipeline 3 vòng: kiểm tra ngữ pháp → nâng cấp từ vựng → chấm điểm IELTS. Feedback chi tiết theo 4 tiêu chí.',
  },
  {
    icon: '📖',
    title: 'Reading & Listening',
    description: 'Bài đọc và script AI về chủ đề software engineering. True/False/NG, short-answer và note-completion như đề thi thật.',
  },
  {
    icon: '📚',
    title: 'Vocabulary Engine',
    description: 'Thay thế "dev slang" bằng Academic Word List. Spaced-repetition review và pronunciation guide để đạt Band 6.5+.',
  },
  {
    icon: '🧩',
    title: 'Collocations & Idioms',
    description: 'Tìm kiếm word combinations tự nhiên. Tag Writing Task 1/2 hoặc Speaking, xem highlight trong AI-generated essays.',
  },
  {
    icon: '❌',
    title: 'Wrong Decision Log',
    description: 'Ghi lại từng lỗi sai, phân tích tại sao bạn chọn sai, và AI đưa ra cách phòng tránh về sau.',
  },
  {
    icon: '📊',
    title: 'Analytics & Progress',
    description: 'Theo dõi band score theo từng kỹ năng, so sánh với mục tiêu, và xem xu hướng cải thiện qua từng tuần.',
  },
  {
    icon: '📋',
    title: 'Study Sprint Board',
    description: 'Kanban board với 22 template ticket IELTS sẵn có. Luôn biết hôm nay cần luyện gì tiếp theo.',
  },
]

const PAIN_POINTS = [
  {
    problem: 'Học bằng đề thi generic về "du lịch" hay "môi trường" — không liên quan đến công việc',
    solution: 'Nội dung bám sát lĩnh vực chuyên môn bạn đã biết: kỹ sư dùng chủ đề tech, dân tài chính dùng chủ đề finance...',
  },
  {
    problem: 'Không biết mình đang ở band mấy',
    solution: 'AI chấm điểm theo 4 tiêu chí IELTS sau mỗi bài — như examiner thật.',
  },
  {
    problem: 'Từ vựng chuyên ngành nhưng không academic',
    solution: 'Vocabulary Engine đề xuất AWL alternatives phù hợp với ngữ cảnh và band 6.5+.',
  },
  {
    problem: 'Mỗi lần luyện không biết bắt đầu từ đâu',
    solution: 'Study Sprint Board với 30-day plan và template ticket sẵn có.',
  },
]

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) {
    const user = await getCurrentUser()
    redirect(user.returningUser ? '/dashboard' : '/analytics')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ───────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-bold tracking-tight text-foreground">
            IELTS Accelerator
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Tham gia beta
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
          Dành cho người đi làm có deadline IELTS
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Đạt IELTS Band 6.5<br />
          <span className="text-blue-500">bằng kiến thức bạn đã có</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          AI chấm bài theo đúng tiêu chí IELTS, nội dung bám sát lĩnh vực chuyên môn của bạn.
          Không học lại từ đầu — tận dụng thứ bạn đã biết để lên band nhanh hơn.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.532 24.552c0-1.636-.132-3.2-.38-4.704H24v8.896h13.228c-.572 3.064-2.308 5.656-4.92 7.392v6.14h7.968c4.664-4.296 7.256-10.62 7.256-17.724z" fill="#fff" fillOpacity=".9"/>
              <path d="M24 48c6.48 0 11.916-2.148 15.888-5.824l-7.968-6.14c-2.148 1.44-4.896 2.292-7.92 2.292-6.096 0-11.256-4.116-13.092-9.648H2.62v6.34C6.576 42.58 14.724 48 24 48z" fill="#fff" fillOpacity=".75"/>
              <path d="M10.908 28.68A14.46 14.46 0 0 1 9.6 24c0-1.632.28-3.216.78-4.68v-6.34H2.62A23.988 23.988 0 0 0 0 24c0 3.876.928 7.548 2.62 10.82l8.288-6.14z" fill="#fff" fillOpacity=".6"/>
              <path d="M24 9.672c3.432 0 6.516 1.18 8.94 3.492l6.708-6.708C35.9 2.58 30.472 0 24 0 14.724 0 6.576 5.42 2.62 13.32l8.288 6.34C12.744 13.788 17.904 9.672 24 9.672z" fill="#fff" fillOpacity=".5"/>
            </svg>
            Bắt đầu miễn phí với Google
          </Link>
          <Link
            href="#founding-member"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Xem gói Thành viên Sáng lập →
          </Link>
        </div>

        <p className="mt-4 text-xs text-faint">
          Đăng nhập bằng Google trong 10 giây. Không cần thẻ ngân hàng.
        </p>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {[
            { value: '4', label: 'kỹ năng IELTS' },
            { value: '20+', label: 'công cụ AI' },
            { value: 'Band 6.5', label: 'mục tiêu phổ biến nhất' },
            { value: '0', label: 'nội dung chung chung' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-6 py-8 text-center">
              <span className="text-2xl font-extrabold text-foreground sm:text-3xl">{value}</span>
              <span className="mt-1 text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain points → Solutions ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Người đi làm học IELTS khác học sinh phổ thông
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Bạn có kiến thức chuyên môn — bạn cần công cụ biết tận dụng điều đó.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PAIN_POINTS.map(({ problem, solution }) => (
            <div key={problem} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-base">❌</span>
                <p className="text-sm text-muted-foreground line-through">{problem}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-base">✓</span>
                <p className="text-sm font-medium text-foreground">{solution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Đủ mọi công cụ để đạt Band 6.5
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Được xây dựng cho người đi làm có deadline — không phải học sinh phổ thông.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-background p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
              >
                <div className="mb-3 text-2xl">{icon}</div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo chat ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              AI Speaking Examiner
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Examiner AI không bao giờ gợi ý cho bạn
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Giống hệt examiner thật: hỏi liên tục, không nhắc, không giải thích.
              Sau phiên luyện mới có band score và nhận xét chi tiết.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Chrome Speech-to-Text — không cần gõ phím',
                'Phát hiện filler words: "um", "uh", "like"...',
                'Band score theo 4 tiêu chí sau mỗi phiên',
                'Nội dung: tech topics bạn đã biết rõ',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-blue-500">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">AI Examiner — Part 1</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="self-start rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground max-w-xs">
                Do you think working from home has changed how software teams communicate?
              </div>
              <div className="self-end rounded-xl rounded-tr-none bg-blue-600 px-4 py-3 text-sm text-white max-w-xs">
                Yes, significantly. Personally, async tools like Slack have replaced a lot of real-time discussion...
              </div>
              <div className="self-start rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground max-w-xs">
                And would you say that&apos;s a positive development overall?
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Band estimate</span>
                <span className="font-semibold text-blue-400">6.5</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founding member pricing ────────────────────────────────────────────── */}
      <section id="founding-member" className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
              Chỉ 50 suất — Thành viên Sáng lập
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Tham gia sớm, khóa giá mãi mãi
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              50 thành viên đầu tiên được giá founding member, không tăng dù app nâng cấp sau này.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Free tier */}
            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="mb-1 text-sm font-semibold text-muted-foreground">Miễn phí</div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">0đ</span>
                <span className="ml-1 text-sm text-muted-foreground">/tháng</span>
              </div>
              <ul className="mb-8 flex flex-col gap-3 text-sm text-muted-foreground">
                {[
                  'Speaking & Writing (giới hạn 3 lần/tháng)',
                  'Vocabulary & Collocations',
                  'Reading & Listening',
                  'Không có analytics',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">·</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-auto rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Bắt đầu miễn phí
              </Link>
            </div>

            {/* Founding member */}
            <div className="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-background p-8">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white whitespace-nowrap">
                Thành viên Sáng lập
              </div>
              <div className="mb-1 text-sm font-semibold text-blue-400">Founding member</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-foreground">99k</span>
                <span className="ml-1 text-sm text-muted-foreground">/tháng</span>
              </div>
              <p className="mb-6 text-xs text-amber-400">Khóa giá mãi mãi · Giá thường: 299k</p>
              <ul className="mb-8 flex flex-col gap-3 text-sm text-foreground">
                {[
                  'Không giới hạn Speaking & Writing',
                  'Không giới hạn AI scoring',
                  'Analytics & Progress tracking',
                  'Essay Builder với highlight',
                  'Wrong Decision Log + AI analysis',
                  'Study Sprint Board',
                  'Ưu tiên hỗ trợ qua Zalo',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-blue-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-auto rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Tham gia ngay
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Đăng ký → nhắn Zalo xác nhận thanh toán
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-faint">
            Thanh toán qua chuyển khoản ngân hàng / VietQR. Hỗ trợ qua Zalo sau khi đăng ký.
          </p>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Sẵn sàng bắt đầu chưa?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Đăng nhập bằng Google trong 10 giây. Không cần thẻ ngân hàng, không cần cài đặt.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            Bắt đầu miễn phí
          </Link>
          <Link
            href="#founding-member"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Xem gói Founding Member
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
          <span className="text-xs text-faint text-center sm:text-left">
            IELTS Accelerator — Dành cho kỹ sư phần mềm đang luyện IELTS
          </span>
          <div className="flex items-center gap-4 text-xs text-faint">
            <Link href="/privacy" className="hover:text-muted-foreground transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/login" className="hover:text-muted-foreground transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
