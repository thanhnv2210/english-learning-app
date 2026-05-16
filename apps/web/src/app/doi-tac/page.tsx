import Link from 'next/link'

const TOP_5_VALUE_POINTS = [
  {
    number: '01',
    icon: '🎯',
    title: 'Thị trường ngách rõ ràng — nhu cầu thật, không học cho vui',
    summary: 'Hàng trăm nghìn chuyên gia Việt Nam cần IELTS với deadline cụ thể — visa, thăng chức, du học — và không có thời gian học theo kiểu truyền thống.',
    bullets: [
      'Kỹ sư phần mềm: 530,000+ tại Việt Nam (VINASA 2025), nhiều công ty yêu cầu IELTS 6.5+ cho vai trò senior',
      'Điều dưỡng, dược sĩ, bác sĩ cần IELTS cho chứng chỉ hành nghề ở Úc, UK, Canada',
      'Nhân viên tài chính, ngân hàng cần IELTS cho vai trò quốc tế hoặc học thạc sĩ',
      'Điểm chung: có chuyên môn sâu, có deadline thật, không chịu học lại từ đầu với nội dung chung chung',
    ],
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI chấm thi như giám khảo thật — không phải gia sư AI',
    summary: 'Hầu hết app IELTS dùng AI để giải thích và gợi ý. App này dùng AI để chấm điểm nghiêm khắc — đúng như kỳ thi thật.',
    bullets: [
      'Chấm Writing và Speaking theo đúng 4 tiêu chí: Task Response, Coherence, Lexical Resource, Grammatical Range',
      'Speaking: Speech-to-text thời gian thực + phát hiện filler words + band score sau phiên luyện',
      'Writing: 3 vòng pipeline — kiểm tra ngữ pháp → nâng cấp từ vựng → chấm điểm IELTS',
      'Mô hình AI: Claude Sonnet cho chấm điểm chất lượng cao, Claude Haiku cho tạo nội dung — tối ưu chi phí theo từng tính năng',
    ],
  },
  {
    number: '03',
    icon: '🧰',
    title: '20+ công cụ AI — đủ 4 kỹ năng trong một nền tảng',
    summary: 'Người dùng không cần dùng nhiều app khác nhau. Tất cả đều trong một nơi, có liên kết với nhau.',
    bullets: [
      'Speaking: Simulator Part 1/2/3, luyện đọc to (Read-Aloud), phân tích Connected Speech',
      'Writing: Essay Builder, tạo outline, nâng cấp từ vựng, phân tích khoảng trống',
      'Reading & Listening: Bài đọc và script AI theo chủ đề chuyên ngành, đúng định dạng đề thi',
      'Từ vựng: AWL browser, Collocations, Word Pairs drill, Sentence library và 3 loại game luyện tập',
    ],
  },
  {
    number: '04',
    icon: '⚙️',
    title: 'Nội dung thích nghi theo lĩnh vực — không bao giờ generic',
    summary: 'Kỹ sư luyện bằng chủ đề tech. Y tá luyện bằng chủ đề y tế. Dân tài chính luyện bằng chủ đề tài chính. Cùng một nền tảng, nội dung khác nhau theo từng người.',
    bullets: [
      'Domain parameter điều khiển toàn bộ AI prompt — microservices, Agile, DevOps cho tech; clinical care, patient safety cho y tế...',
      'Wrong Decision Log: ghi lại từng lỗi sai, AI phân tích nguyên nhân gốc rễ, ngăn mắc lại',
      'Connected Speech analyser: phát hiện 7 hiện tượng ngữ âm trong bản ghi tiếng nói',
      'Paraphrase guide + Question Anatomy: công cụ tư duy có cấu trúc, không phải học thuộc lòng',
    ],
  },
  {
    number: '05',
    icon: '📊',
    title: 'Tỷ lệ giữ chân cao — được thiết kế vào sản phẩm, không phải thêm vào sau',
    summary: 'Người dùng quay lại vì app giúp họ thấy được tiến bộ rõ ràng và biết chính xác hôm nay cần làm gì.',
    bullets: [
      'Analytics: xu hướng band score theo từng kỹ năng, khoảng cách với mục tiêu, phân tích theo tiêu chí',
      'Study Sprint Board: Kanban với 22 template ticket IELTS sẵn có — luôn biết hôm nay cần luyện gì',
      'History & Habit Strip: hiển thị lịch hoạt động trực quan, tạo động lực duy trì thói quen',
      'Onboarding: phân loại người dùng theo mục tiêu band, kỹ năng yếu, và lý do học — cá nhân hoá ngay từ ngày đầu',
    ],
  },
]

export default function DoiTacPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tracking-tight text-foreground">IELTS Accelerator</span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Dành cho đối tác
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/partner"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              English version
            </Link>
            <a
              href="#lien-he"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Hợp tác với chúng tôi
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
          Tài liệu dành cho nhà đầu tư & đối tác phân phối
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Nền tảng luyện IELTS dùng{' '}
          <span className="text-blue-500">kiến thức bạn đã có</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Ứng dụng AI giúp chuyên gia đạt IELTS 6.5+ trong thời gian ngắn — bằng cách dùng
          đúng lĩnh vực chuyên môn của họ thay vì nội dung chung chung.
          Nhóm đầu tiên: kỹ sư phần mềm. Nền tảng thiết kế để mở rộng sang y tế, tài chính, giáo dục.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#diem-manh"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            Xem 5 lợi thế cạnh tranh
          </a>
          <a
            href="#lien-he"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Yêu cầu demo
          </a>
        </div>
      </section>

      {/* ── Market Stats ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {[
            { value: '530k+', label: 'kỹ sư phần mềm tại Việt Nam' },
            { value: '15–20%', label: 'tăng trưởng thị trường IELTS/năm' },
            { value: '5–15 triệu', label: 'VND chi phí khoá học offline' },
            { value: '20+', label: 'công cụ AI trong một nền tảng' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-6 py-8 text-center">
              <span className="text-2xl font-extrabold text-foreground sm:text-3xl">{value}</span>
              <span className="mt-1 text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 Value Points ───────────────────────────────────────────────────── */}
      <section id="diem-manh" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
            Tại sao chúng tôi thắng
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            5 lý do nền tảng này khác biệt
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Mỗi lợi thế củng cố lẫn nhau — tạo ra sản phẩm có khả năng phòng thủ cao và tỷ lệ giữ chân tốt.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {TOP_5_VALUE_POINTS.map(({ number, icon, title, summary, bullets }) => (
            <div
              key={number}
              className="rounded-2xl border border-border bg-card p-8 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-center lg:gap-2 lg:w-20">
                  <span className="text-3xl font-black text-blue-500/30">{number}</span>
                  <span className="text-3xl">{icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{summary}</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 shrink-0 text-blue-500">&#x2714;</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitive Matrix ───────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Bối cảnh cạnh tranh
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Chúng tôi chiếm vị trí khác biệt rõ ràng
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Không có nền tảng nào kết hợp nội dung theo chuyên ngành, AI chấm thi nghiêm khắc, và công cụ dành cho người đi làm.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-left font-semibold text-foreground">Tính năng</th>
                  <th className="pb-4 text-center font-bold text-blue-400">IELTS Accelerator</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">IELTS.org</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">British Council</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">IELTS Liz</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { attribute: 'Nội dung theo chuyên ngành người dùng', us: true, a: false, b: false, c: false },
                  { attribute: 'AI chấm thi nghiêm khắc (không gợi ý)', us: true, a: false, b: false, c: false },
                  { attribute: 'Phân tích Connected Speech', us: true, a: false, b: false, c: false },
                  { attribute: 'Wrong Decision Log + AI phân tích lỗi', us: true, a: false, b: false, c: false },
                  { attribute: 'Chấm điểm AI đủ 4 kỹ năng', us: true, a: true, b: false, c: false },
                  { attribute: 'Sprint board / Kanban luyện thi', us: true, a: false, b: false, c: false },
                  { attribute: 'Có gói miễn phí', us: true, a: false, b: false, c: true },
                ].map(({ attribute, us, a, b, c }) => (
                  <tr key={attribute} className="border-b border-border last:border-0">
                    <td className="py-3 pr-6 text-muted-foreground">{attribute}</td>
                    <td className="py-3 text-center">
                      {us
                        ? <span className="font-bold text-blue-400">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {a
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {b
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {c
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Demo Mockup ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Trải nghiệm thực tế
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Giám khảo AI không bao giờ nhắc hay gợi ý
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Giống hệt kỳ thi thật: hỏi liên tục, không nhắc, không giải thích trong phiên.
              Band score và nhận xét chi tiết chỉ hiện ra sau khi kết thúc.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Chrome Speech-to-Text — không cần gõ, luyện như thi thật',
                'Phát hiện filler words: "um", "uh", "like", "you know"',
                'Band score theo 4 tiêu chí IELTS sau mỗi phiên luyện',
                'Chủ đề bám sát lĩnh vực chuyên môn người dùng đã biết',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-blue-500">&#x2714;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">AI Examiner — Speaking Part 1</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="self-start max-w-xs rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground">
                Do you think working from home has changed how software teams communicate?
              </div>
              <div className="self-end max-w-xs rounded-xl rounded-tr-none bg-blue-600 px-4 py-3 text-sm text-white">
                Yes, significantly. Async tools like Slack have replaced a lot of real-time discussion in distributed teams...
              </div>
              <div className="self-start max-w-xs rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground">
                And would you say that is always a positive development?
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Band ước tính sau phiên</span>
                <span className="font-semibold text-blue-400">6.5</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-blue-500" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Task Response: 6.5</span>
                <span>Coherence: 7.0</span>
                <span>Lexical: 6.0</span>
                <span>Grammar: 6.5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Giai đoạn hiện tại ───────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Giai đoạn hiện tại
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Phần kỹ thuật đã xong — cần người dùng và phân phối
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Sản phẩm hoạt động đầy đủ. Đang ở giai đoạn beta, tìm kiếm đối tác phân phối và nhà đầu tư hạt giống.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { label: 'Sản phẩm', value: 'Hoạt động đầy đủ', detail: '20+ tính năng AI, 4 kỹ năng IELTS', status: 'done' },
              { label: 'Người dùng trả tiền', value: 'Đang beta', detail: 'Tìm 20–30 người dùng đầu tiên', status: 'active' },
              { label: 'Doanh thu', value: 'Freemium', detail: 'Pro: 149k/tháng · Team: 99k/ghế', status: 'planned' },
            ].map(({ label, value, detail, status }) => (
              <div key={label} className="rounded-xl border border-border bg-background p-6 text-center">
                <div className={`mb-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  status === 'done' ? 'bg-green-500/10 text-green-400' :
                  status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {status === 'done' ? 'Hoàn thành' : status === 'active' ? 'Đang triển khai' : 'Kế hoạch'}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
                <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hình thức hợp tác ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
            Cơ hội hợp tác
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Nhiều hình thức tham gia
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Chúng tôi đang tìm đối tác phân phối, kênh tiếp cận, và nhà đầu tư hạt giống.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              tier: 'Đối tác phân phối',
              description: 'Bootcamp lập trình, cộng đồng developer, công ty tech có kỹ sư cần IELTS, trung tâm tư vấn du học.',
              perks: [
                'Chia sẻ doanh thu trên người dùng được giới thiệu',
                'Tuỳ chọn white-label cho doanh nghiệp',
                'Nội dung theo domain riêng',
                'Dashboard theo dõi cohort của bạn',
              ],
              cta: 'Thảo luận hợp tác phân phối',
            },
            {
              tier: 'Nhà đầu tư chiến lược',
              description: 'Vòng seed đang mở. Tìm kiếm nhà đầu tư EdTech, AI, hoặc tập trung vào Đông Nam Á.',
              perks: [
                'Tham gia vốn cổ phần',
                'Board observer seat (lead investor)',
                'Cập nhật hàng tháng',
                'Quyền ưu tiên vòng tiếp theo',
              ],
              cta: 'Nhận pitch deck',
              highlight: true,
            },
            {
              tier: 'Đối tác tích hợp',
              description: 'Nền tảng LMS, công cụ HR, dịch vụ tư vấn định cư, trung tâm luyện thi IELTS.',
              perks: [
                'API truy cập dữ liệu điểm số',
                'Co-marketing và case study chung',
                'Ưu tiên đề xuất tính năng trên roadmap',
                'Hỗ trợ kỹ thuật tích hợp',
              ],
              cta: 'Khám phá tích hợp',
            },
          ].map(({ tier, description, perks, cta, highlight }) => (
            <div
              key={tier}
              className={`flex flex-col rounded-2xl p-8 ${
                highlight
                  ? 'border-2 border-blue-500 bg-background'
                  : 'border border-border bg-background'
              }`}
            >
              {highlight && (
                <div className="mb-4 self-start rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  Ưu tiên chính
                </div>
              )}
              <h3 className="mb-2 text-base font-bold text-foreground">{tier}</h3>
              <p className="mb-6 text-xs leading-relaxed text-muted-foreground">{description}</p>
              <ul className="mb-8 flex flex-col gap-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className={`mt-0.5 shrink-0 ${highlight ? 'text-blue-500' : 'text-muted-foreground'}`}>
                      &#x2714;
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href="#lien-he"
                className={`mt-auto rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors ${
                  highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'border border-border text-foreground hover:bg-muted'
                }`}
              >
                {cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Liên hệ ───────────────────────────────────────────────────────────── */}
      <section id="lien-he" className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/5 p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Sẵn sàng trao đổi?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Chúng tôi đang xây dựng nền tảng IELTS hàng đầu cho cộng đồng chuyên gia Việt Nam.
              Nếu bạn thấy cơ hội này, hãy liên hệ ngay.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:doitac@ieltsaccelerator.app"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
              >
                Gửi email trực tiếp
              </a>
              <Link
                href="/login"
                className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
              >
                Dùng thử sản phẩm
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Chúng tôi phản hồi mọi yêu cầu hợp tác trong vòng 24 giờ. Có thể liên hệ qua Zalo để trao đổi nhanh hơn.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
          <span className="text-xs text-faint text-center sm:text-left">
            IELTS Accelerator &mdash; Luyện IELTS bằng kiến thức bạn đã có
          </span>
          <div className="flex items-center gap-4 text-xs text-faint">
            <Link href="/partner" className="hover:text-muted-foreground transition-colors">
              English version
            </Link>
            <Link href="/" className="hover:text-muted-foreground transition-colors">
              Trang chủ
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
