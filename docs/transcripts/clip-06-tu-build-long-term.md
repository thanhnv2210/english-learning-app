# Clip 6 — Build tool học của chính mình: tư duy dài hạn

**Độ dài mục tiêu:** 4–5 phút
**Định dạng:** Quay màn hình app + editor code + giọng thuyết minh

---

## Transcript (Tiếng Việt)

Hầu hết các tool học được thiết kế để bạn tiêu thụ chúng.

Mở app, làm bài tập, đóng app lại. Công ty đó improve sản phẩm của họ dựa trên data của bạn. Còn bạn thì dùng mãi một thứ không bao giờ thực sự hiểu bạn.

---

**Vấn đề của consumption**

Một sản phẩm làm cho một triệu người không thể tối ưu cho bạn.

Nó không biết bạn hay nhầm lẫn "affect" với "effect". Nó không biết bạn có vốn từ vựng tốt về infrastructure nhưng yếu ở vocabulary cho soft skill. Nó không biết bạn bị mất điểm Coherence vì câu chủ đề trong paragraph của bạn thường quá mơ hồ.

Nhưng bạn biết. Và nếu bạn build tool của chính mình, tool đó cũng sẽ biết.

---

**Lựa chọn khác: build một thứ nhỏ**

Không phải build một sản phẩm hoàn chỉnh. Chỉ cần một tính năng giải quyết đúng vấn đề của bạn.

Một writing scorer. Một danh sách flashcard của riêng bạn. Một chỗ để bạn log lại lỗi sai và AI giải thích.

Đây là folder structure của app này — bắt đầu từ một file duy nhất, một API call duy nhất. Sau sáu tháng nó trở thành cái bạn đang thấy.

---

**Tại sao building compounding**

Khi bạn build một tính năng chấm điểm Writing, bạn phải đọc kỹ rubric IELTS. Không phải đọc lướt — đọc để hiểu đủ sâu để dạy lại cho AI.

Khi bạn build thư viện từ vựng, bạn phải nghĩ về cách từ đó được dùng trong context — không chỉ nghĩa của nó.

Bạn đang học môn đó để build tool. Rồi bạn dùng tool đó để luyện môn đó. Hai vòng lặp này cộng hưởng với nhau.

Sáu tháng làm như vậy tạo ra thứ không có app thương mại nào có được: một tool biết đúng điểm yếu của bạn, vì chính bạn đã build nó để track điều đó.

---

**Điểm bắt đầu cụ thể**

Fork repo này. Chọn một tính năng và làm nó thành của bạn.

Đổi chủ đề Speaking sang đúng domain bạn đang làm việc. Thêm từ vựng chuyên ngành mà bạn cần nhưng app chưa có. Sửa prompt chấm điểm nếu bạn không đồng ý với cách nó đang giải thích điểm Lexical Resource.

Bạn không cần finish nó. Bạn cần bắt đầu và dùng nó. Việc build chính là việc học.

---

**Câu kết**

Những engineer mình thấy cải thiện nhanh nhất không phải là người tìm được app tốt nhất.

Họ là người build một tool nhỏ, dùng nó mỗi ngày, và cải thiện tool đó khi họ tự cải thiện bản thân.

Đó là cách học có tính sở hữu thật sự.

---

## Ghi chú khi thu âm

- Đây là clip quan trọng nhất trong series — nói chậm hơn các clip khác
- Phần "Vấn đề của consumption": có thể để màn hình một app IELTS thương mại bất kỳ để làm contrast — nhưng không cần thiết, chỉ nếu bạn muốn
- Phần "Tại sao building compounding": quay màn hình code editor, scroll qua file prompt trong `lib/ielts/` — không cần giải thích code, chỉ cần người xem thấy đây là thật
- Câu "Việc build chính là việc học" — nói xong, dừng 1 giây, để nó ngấm
- Đây là clip phù hợp nhất để share trong các group developer Việt Nam và Viblo.asia
