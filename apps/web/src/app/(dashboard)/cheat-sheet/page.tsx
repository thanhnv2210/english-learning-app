import Link from 'next/link'

type Item = {
  issue: string
  tool: string
  description: string
  href: string
  tips?: string[]
}

type Section = {
  id: string
  icon: string
  title: string
  subtitle: string
  color: string
  items: Item[]
}

const SECTIONS: Section[] = [
  {
    id: 'start',
    icon: '🗺️',
    title: 'Khởi đầu đúng hướng',
    subtitle: 'Bắt đầu ở đây nếu bạn chưa biết làm gì trước',
    color: 'border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-900/10',
    items: [
      {
        issue: 'Tôi mới dùng lần đầu, không biết bắt đầu từ đâu',
        tool: 'Lộ trình học theo Sprint',
        description:
          'Ứng dụng có sẵn 22 ticket học tập theo chuẩn IELTS Academic — từ từ vựng, viết, đọc, đến nói. Clone ticket vào sprint, đặt deadline và học theo kế hoạch như làm dự án phần mềm.',
        href: '/projects',
        tips: ['Vào Projects → Backlog → Clone ticket vào sprint hiện tại', 'Mỗi sprint = 1–2 tuần, đặt mục tiêu rõ ràng'],
      },
      {
        issue: 'Tôi không biết mình đang ở band mấy và cần cải thiện kỹ năng nào',
        tool: 'Analytics — Thống kê điểm số',
        description:
          'Sau mỗi buổi luyện tập (Speaking/Writing/Reading/Listening), hệ thống lưu kết quả và tính band điểm trung bình theo từng tiêu chí. Nhìn vào đây để biết mình yếu ở đâu.',
        href: '/analytics',
        tips: ['Band mục tiêu: 6.5 (đủ điều kiện đa số visa/học bổng cho kỹ sư)', 'Tập trung vào tiêu chí có gap lớn nhất trước'],
      },
    ],
  },
  {
    id: 'vocabulary',
    icon: '📚',
    title: 'Xây dựng vốn từ vựng',
    subtitle: 'Từ vựng là nền tảng — đừng bỏ qua phần này',
    color: 'border-purple-200 bg-purple-50 dark:border-purple-800/40 dark:bg-purple-900/10',
    items: [
      {
        issue: 'Tôi hay dùng từ đơn giản, không biết từ học thuật hơn là gì',
        tool: 'Vocabulary — Tra từ học thuật (AWL)',
        description:
          'Nhập từ thông thường, AI sẽ gợi ý từ học thuật tương đương trong Academic Word List. Lưu vào thư viện cá nhân, phân loại theo chủ đề kỹ thuật (AI, Cloud, DevOps...).',
        href: '/vocabulary',
        tips: ['Ví dụ: "use" → "utilize", "show" → "demonstrate", "need" → "require"', 'Lưu ít nhất 5–10 từ mỗi tuần và ôn qua flashcard'],
      },
      {
        issue: 'Tôi dùng từ đúng nhưng câu nghe vẫn gượng, không tự nhiên như người bản ngữ',
        tool: 'Collocations — Cụm từ đi kèm tự nhiên',
        description:
          'Người Việt hay nói "do a mistake" thay vì "make a mistake", "strong rain" thay vì "heavy rain". Collocations giúp bạn dùng từ đúng cách tự nhiên như người bản ngữ.',
        href: '/collocations',
        tips: ['Tìm collocation theo từ hoặc theo cụm', 'AI đề xuất phù hợp Writing Task 1, Task 2, hoặc Speaking'],
      },
      {
        issue: 'Bài viết/nói của tôi thiếu màu sắc, quá khô khan và lặp đi lặp lại',
        tool: 'Idioms — Thành ngữ tiếng Anh',
        description:
          'Thêm idiom đúng chỗ sẽ tăng điểm Lexical Resource đáng kể. AI tra cứu ý nghĩa, cách dùng và cho ví dụ. Lưu những idiom phù hợp với chủ đề kỹ thuật/xã hội bạn hay gặp.',
        href: '/idioms',
        tips: ['"a double-edged sword", "in the long run", "the tip of the iceberg" — rất phổ biến trong IELTS', 'Chỉ cần 10–15 idiom dùng thành thạo là đủ'],
      },
      {
        issue: 'Tôi không biết khi nào dùng "despite" hay "although", "affect" hay "effect"',
        tool: 'Comparisons — So sánh cặp từ dễ nhầm',
        description:
          'Tra cứu sự khác biệt giữa hai từ/cấu trúc dễ nhầm. AI giải thích rõ ngữ cảnh, register (trang trọng/thông thường), và cho ví dụ cụ thể trong IELTS.',
        href: '/compare',
        tips: ['"despite / although / even though" — cấu trúc khác nhau hoàn toàn', '"economic / economical", "historic / historical" — nghĩa khác nhau tinh tế'],
      },
      {
        issue: 'Tôi thấy "onward" và "onwards" đều đúng nhưng không biết khi nào dùng cái nào',
        tool: 'Word Pairs — Từ có thể thay thế nhau',
        description:
          'Một số từ có thể thay thế nhau hoàn toàn (British vs American English), một số chỉ đúng trong ngữ cảnh cụ thể. Word Pairs giải thích sự khác biệt về vùng miền, tính trang trọng và register.',
        href: '/word-pairs',
        tips: ['"onward / onwards", "toward / towards" — British vs American', '"learned / learnt", "dreamed / dreamt" — cả hai đều đúng'],
      },
    ],
  },
  {
    id: 'grammar',
    icon: '⚠️',
    title: 'Tránh bẫy ngữ pháp phổ biến',
    subtitle: 'Lỗi người Việt hay mắc khi viết và nói tiếng Anh',
    color: 'border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-900/10',
    items: [
      {
        issue: 'Tôi hay viết "staffs", "informations", "advices", "furnitures" mà không biết là sai',
        tool: 'Grammar Traps — Bẫy danh từ không đếm được',
        description:
          'Người Việt rất hay thêm "s" vào danh từ không đếm được (uncountable nouns). Grammar Traps liệt kê các lỗi phổ biến nhất, giải thích tại sao sai và cách sửa. Có Quick Checker để kiểm tra câu ngay lập tức.',
        href: '/grammar-traps',
        tips: [
          '"staff" (không có "s"), "information" (không có "s"), "advice" (không có "s")',
          'Quick Checker: dán câu vào → AI phát hiện lỗi ngay',
        ],
      },
      {
        issue: 'Tôi muốn ghi lại những lỗi sai để không lặp lại trong bài thi',
        tool: 'Wrong Decisions — Nhật ký lỗi sai',
        description:
          'Mỗi khi bạn chọn sai đáp án, dùng sai từ, hoặc bị examiner sửa — ghi lại vào đây. AI phân tích tại sao bạn sai và đưa ra chiến lược tránh lỗi trong tương lai.',
        href: '/wrong-decisions',
        tips: ['Ghi ngay sau mỗi buổi luyện tập, khi ký ức còn tươi', 'AI phân tích pattern — bạn hay sai ở dạng câu nào, chủ đề nào'],
      },
    ],
  },
  {
    id: 'skills',
    icon: '🎯',
    title: 'Luyện tập 4 kỹ năng IELTS',
    subtitle: 'Luyện thực chiến với AI examiner nghiêm khắc như thi thật',
    color: 'border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-900/10',
    items: [
      {
        issue: 'Tôi sợ nói, hay ừm ừm liên tục, không biết câu trả lời hay như thế nào',
        tool: 'Speaking Simulator — Luyện nói với AI',
        description:
          'AI đóng vai IELTS Examiner, hỏi Part 1 (câu hỏi cá nhân), Part 2 (cue card 2 phút), và Part 3 (thảo luận chuyên sâu). Nhận xét ngay sau buổi thi về fluency, coherence, và vocabulary.',
        href: '/speaking',
        tips: [
          'Bật microphone, nói thật tự nhiên — đừng chuẩn bị script trước',
          'AI detect filler words ("uh", "um") và báo cáo sau buổi',
          'Chọn chủ đề quen thuộc (Technology, Work) để tự tin hơn',
        ],
      },
      {
        issue: 'Tôi không biết bài Writing Task 2 của mình thiếu gì để đạt band 6.5',
        tool: 'Writing Evaluator — Chấm điểm 4 tiêu chí IELTS',
        description:
          'Viết bài, AI chấm theo đúng 4 tiêu chí: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. Phân tích chi tiết từng câu, gợi ý cải thiện cụ thể.',
        href: '/writing',
        tips: [
          'Mỗi tiêu chí tính 25% — đừng bỏ qua Coherence (cấu trúc bài)',
          'Viết ít nhất 250 từ, không cần quá 300 từ',
          'Band 6.5 = có quan điểm rõ ràng + lý luận có dẫn chứng + ít lỗi ngữ pháp nghiêm trọng',
        ],
      },
      {
        issue: 'Tôi đọc chậm, hay hết giờ khi làm Reading',
        tool: 'Reading Practice — Đọc hiểu với passage AI tạo',
        description:
          'Luyện đọc với passage AI tạo theo chủ đề kỹ thuật (phù hợp với kỹ sư). Dạng câu hỏi True/False/Not Given và short-answer giống thi thật. Highlight đoạn văn khi kiểm tra đáp án.',
        href: '/reading',
        tips: ['Đọc câu hỏi trước, sau đó scan bài — đừng đọc toàn bộ', 'Not Given ≠ False — đây là bẫy phổ biến nhất'],
      },
      {
        issue: 'Tôi nghe không kịp, miss nhiều thông tin trong Listening',
        tool: 'Listening Practice — Nghe transcript AI tạo',
        description:
          'Nghe audio (browser TTS), điền vào form, sau đó xem lại transcript. Tập trung vào dạng note-completion phổ biến trong IELTS. AI tạo nội dung theo chủ đề kỹ thuật quen thuộc.',
        href: '/listening',
        tips: ['Nghe tối đa 2 lần — đúng như thi thật', 'Đọc câu hỏi trước khi audio bắt đầu'],
      },
    ],
  },
  {
    id: 'writing',
    icon: '✍️',
    title: 'Viết tốt hơn mỗi ngày',
    subtitle: 'Công cụ hỗ trợ kỹ năng viết nâng cao',
    color: 'border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10',
    items: [
      {
        issue: 'Tôi muốn xem bài mẫu IELTS Writing Task 2 để học cách viết',
        tool: 'Essay Builder — Tạo bài mẫu từ vocabulary & collocation',
        description:
          'Chọn vocabulary và collocation bạn đã học, AI tạo bài IELTS Task 2 hoàn chỉnh có sử dụng những từ đó. Highlight rõ từ nào được dùng trong bài. Cực kỳ hữu ích để thấy từ "sống" trong ngữ cảnh thật.',
        href: '/essay-builder',
        tips: ['Chọn 3–5 collocation quen thuộc → Generate → xem cách AI đặt câu', 'Đọc bài mẫu rồi viết lại bằng lời mình — không copy'],
      },
      {
        issue: 'Tôi hay lặp từ, không biết cách paraphrase cho tự nhiên',
        tool: 'Paraphrase Guide — Hướng dẫn diễn đạt lại',
        description:
          'Người Việt hay dịch thẳng từ tiếng Việt sang tiếng Anh, dẫn đến câu cứng và lặp từ. Guide này dạy kỹ thuật paraphrase cho cả 4 kỹ năng, 3 cấp độ (Band 6–7–8).',
        href: '/paraphrase',
        tips: ['Paraphrase câu hỏi đề bài ngay trong intro của Task 2', 'Đừng paraphrase bằng cách thay thế từng từ một — thay cả cấu trúc câu'],
      },
      {
        issue: 'Tôi không có ý tưởng để viết về các chủ đề IELTS',
        tool: 'Topic Ideas — Kho ý tưởng 10 chủ đề IELTS',
        description:
          'Danh sách ý tưởng, quan điểm, và dẫn chứng cho 10 chủ đề IELTS phổ biến nhất (Technology, Environment, Education, Work...). Đọc trước khi viết để không bị blank mind.',
        href: '/topic-ideas',
        tips: ['Học thuộc 2–3 dẫn chứng (statistics, examples) cho mỗi chủ đề', 'Chủ đề Technology và Work là lợi thế lớn của kỹ sư so với thí sinh khác'],
      },
      {
        issue: 'Tôi muốn hiểu Connected Speech — tại sao nghe người bản ngữ nói rất khó',
        tool: 'Connected Speech Analyser',
        description:
          'Dán đoạn text vào, AI phân tích các hiện tượng connected speech: linking, elision, assimilation, weak forms... Biết những hiện tượng này giúp bạn nghe Listening tốt hơn và Speaking tự nhiên hơn.',
        href: '/connected-speech',
        tips: ['"want to" → "wanna", "going to" → "gonna" — đây là elision/reduction', 'Áp dụng trong Speaking để tăng điểm Pronunciation'],
      },
    ],
  },
  {
    id: 'extra',
    icon: '🤖',
    title: 'Học thêm ngoài ứng dụng',
    subtitle: 'Tận dụng AI (ChatGPT, Claude) để luyện tập thêm mỗi ngày',
    color: 'border-violet-200 bg-violet-50 dark:border-violet-800/40 dark:bg-violet-900/10',
    items: [
      {
        issue: 'Tôi muốn dùng ChatGPT/Claude để luyện IELTS nhưng không biết hỏi như thế nào',
        tool: 'AI Prompt Library — Bộ sưu tập prompt sẵn',
        description:
          'Hơn 20 prompt sẵn cho Writing, Speaking, Reading, Listening — chỉ cần copy và paste vào ChatGPT/Claude. Có phiên bản cho cả 3 platform: ChatGPT, Claude, Gemini.',
        href: '/prompt-library',
        tips: ['Dùng prompt "IELTS Examiner" để nhận feedback khắt khe như thi thật', 'Thay [TOPIC] và [YOUR ESSAY] bằng nội dung của bạn'],
      },
      {
        issue: 'Tôi muốn hiểu cách trả lời các dạng câu hỏi khác nhau trong IELTS',
        tool: 'How to Answer — Chiến lược trả lời theo dạng câu hỏi',
        description:
          'Hướng dẫn chi tiết cách tiếp cận từng dạng câu hỏi trong cả 4 kỹ năng. Từ TFNG, Multiple Choice, Short Answer (Reading/Listening) đến Opinion, Discussion, Problem-Solution (Writing).',
        href: '/how-to-answer',
      },
      {
        issue: 'Tôi muốn phân tích cấu trúc câu hỏi IELTS để hiểu đề bài chính xác hơn',
        tool: 'Question Anatomy — Giải phẫu câu hỏi',
        description:
          'Phân tích từng thành phần của câu hỏi IELTS: question word, category, exclusion, hedge, relationship, target. Hiểu đúng câu hỏi = trả lời đúng hướng = không bị mất điểm Task Response.',
        href: '/how-to-answer/question-anatomy',
        tips: ['Task Response chiếm 25% điểm — trả lời lệch đề là thảm họa', 'Dành 2–3 phút đọc kỹ đề trước khi viết'],
      },
    ],
  },
]

function ItemCard({ item }: { item: Item }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1">
        <p className="text-xs italic text-faint">
          &ldquo;{item.issue}&rdquo;
        </p>
        <h3 className="text-sm font-semibold text-foreground">{item.tool}</h3>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>

      {item.tips && item.tips.length > 0 && (
        <ul className="flex flex-col gap-1">
          {item.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-blue-500">→</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Mở trang →
      </Link>
    </div>
  )
}

export default function CheatSheetPage() {
  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto pb-16">
      {/* Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Cheat Sheet — Khám phá ứng dụng</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Chào mừng bạn! Trang này giúp bạn tìm đúng công cụ cho đúng vấn đề —
          từ xây dựng từ vựng, luyện 4 kỹ năng, đến theo dõi tiến độ học IELTS.
          Mỗi tính năng đều mở trong tab mới để bạn tiện khám phá.
        </p>
        <p className="text-xs text-faint">
          Mục tiêu: IELTS Band 6.5 — đủ điều kiện cho hầu hết visa, học bổng và yêu cầu tuyển dụng quốc tế dành cho kỹ sư phần mềm.
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <section key={section.id} className="flex flex-col gap-4">
          <div className={`rounded-xl border p-4 ${section.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              <div>
                <h2 className="text-base font-bold text-foreground">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <ItemCard key={item.href} item={item} />
            ))}
          </div>
        </section>
      ))}

      {/* Footer tip */}
      <div className="rounded-xl border border-border bg-muted p-5 text-center">
        <p className="text-sm font-semibold text-foreground">Lời khuyên từ người đã đi qua hành trình này</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Đừng cố dùng hết tất cả tính năng cùng một lúc. Hãy chọn{' '}
          <span className="font-medium text-foreground">một kỹ năng yếu nhất</span>, luyện tập đều đặn mỗi ngày,
          ghi lại lỗi sai và xem lại cuối tuần. Consistency beats intensity.
        </p>
      </div>
    </div>
  )
}
