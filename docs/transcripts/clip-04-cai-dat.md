# Clip 4 — Clone và chạy app trong 10 phút

**Độ dài mục tiêu:** 5–7 phút
**Định dạng:** Quay màn hình terminal + browser (không cần camera)

---

## Transcript (Tiếng Việt)

Clip này dành cho developer muốn chạy app này trên máy của mình — hoặc muốn fork lại và tự tuỳ chỉnh.

Mình sẽ đi từng bước. Tổng cộng khoảng 10 phút.

---

**Bước 1 — Clone và cài dependencies**

```bash
git clone <link repo>
cd english-learning-app
pnpm install
```

Đây là pnpm monorepo tiêu chuẩn. Cài khoảng một phút.

---

**Bước 2 — Tạo file môi trường**

Vào thư mục `apps/web`, tạo file `.env.local`. Có ba thứ cần điền:

```
ANTHROPIC_API_KEY=...
DATABASE_URL=...
NEXT_PUBLIC_OLLAMA_ENABLED=false
```

API key Anthropic lấy tại console.anthropic.com. Model mặc định là Haiku — rẻ, nhanh. Một ngày luyện tập đầy đủ tốn chưa đến tiền một ly cà phê.

Database thì mình dùng Neon.tech — miễn phí, tạo project xong có connection string ngay, không cần cài PostgreSQL local.

---

**Bước 3 — Khởi tạo database**

```bash
cd apps/web
pnpm db:push
pnpm db:seed:vocabulary
pnpm db:seed:speaking-topics
pnpm db:seed:projects
```

Push schema trước, rồi seed dữ liệu mẫu. Chạy khoảng 30 giây.

---

**Bước 4 — Khởi động app**

```bash
PORT=3000 pnpm dev:clean
```

Mở browser vào `http://localhost:3000`.

---

**Bước 5 — Thử lần đầu**

Mình sẽ thử Writing trước — dán một đoạn essay vào, nhấn chấm điểm, xem kết quả.

Rồi thử Speaking — chọn topic, bắt đầu Part 1, nói vài câu, xem examiner phản hồi như thế nào.

---

Vậy là xong. Bạn đã có một môi trường luyện IELTS chạy hoàn toàn trên máy của mình.

Bước tiếp theo không phải là dùng — mà là thay đổi một thứ gì đó. Đổi prompt, thêm chủ đề mới, bỏ một tính năng bạn không cần. Đó là lúc nó thực sự trở thành tool của bạn.

---

## Ghi chú khi thu âm

- Tăng font terminal lên to trước khi quay (Cmd+= vài lần)
- Xoá history terminal trước khi quay — tránh lộ API key cũ hoặc path nhạy cảm
- Chuẩn bị sẵn `.env.local` đã điền đủ thông tin — không nên gõ API key thật trong lúc quay
- Phần "Bước 5" quan trọng nhất — đây là lúc người xem thấy app hoạt động thật sự
- Nếu lệnh nào chạy chậm, đừng im lặng — nói "đang chờ cài xong, bình thường mất khoảng 30 giây"
