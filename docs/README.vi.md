# AI PR Reviewer

<p align="center">
  <b>Công cụ tự động review pull request trên GitHub bằng AI</b><br/>
  Thực hiện cho <b>3-Day Fresher Engineering Automation Challenge</b>
</p>

<p align="center">
  <a href="../README.md">🇬🇧 English</a> |
  <a href="./README.vi.md">🇻🇳 Tiếng Việt</a>
</p>

---

## Tổng quan dự án

**AI PR Reviewer** là một công cụ tự động hóa workflow giúp review Pull Request trên GitHub bằng AI và đăng phản hồi có cấu trúc trực tiếp vào PR.

Mục tiêu của dự án là giảm bớt công việc review thủ công lặp đi lặp lại, giúp phát hiện sớm các vấn đề rõ ràng, và cải thiện hiệu suất làm việc trong quy trình engineering.

Dự án này được xây dựng như một working prototype cho **3-Day Fresher Engineering Automation Challenge**.

---

## Bối cảnh đề bài

### Mục tiêu
Xây dựng một dự án nhỏ giúp tự động hóa, tối ưu hóa hoặc cải thiện quy trình làm việc của kỹ sư, đặc biệt là giảm công việc thủ công hoặc ứng dụng AI để tăng hiệu quả làm việc hằng ngày.

### Vì sao dự án này phù hợp với đề bài
Review Pull Request là một công việc rất thực tế trong workflow của kỹ sư phần mềm. Công việc này tốn thời gian và đôi khi dễ bỏ sót lỗi rõ ràng khi team bận.

Dự án này giải quyết đúng pain point đó bằng cách:
- tự động đọc diff của PR
- phân tích bằng AI
- trả ra nhận xét có cấu trúc
- gợi ý hướng sửa và test cần thêm

---

## Bài toán

Trong workflow phát triển phần mềm thông thường, review Pull Request đòi hỏi thời gian và sự tập trung.

Một số vấn đề hay gặp:
- reviewer có thể bỏ sót lỗi trong các PR nhỏ hoặc lặp lại
- hardcoded secret có thể lọt vào source code
- thay đổi logic rủi ro có thể không được chú ý sớm
- developer mất thời gian cho bước review ban đầu

---

## Giải pháp

Dự án này xây dựng một **AI-based PR review assistant** chạy tự động mỗi khi Pull Request được tạo mới hoặc cập nhật.

Luồng xử lý:
1. lắng nghe sự kiện Pull Request từ GitHub
2. đọc danh sách file thay đổi và patch diff
3. lọc các file phù hợp để review
4. gửi diff nhìn thấy được cho model AI
5. nhận lại kết quả review ở dạng có cấu trúc
6. format thành comment markdown
7. đăng comment đó lên Pull Request

Cách làm này giúp tạo một vòng review ban đầu nhanh hơn và giảm công việc thủ công lặp lại.

---

## Cách hệ thống hoạt động

1. Pull Request được mở, mở lại hoặc cập nhật
2. GitHub Actions kích hoạt workflow
3. Script đọc metadata của PR từ event context
4. Script gọi GitHub REST API để lấy file thay đổi
5. Script lọc các file phù hợp để review
6. Script tạo prompt từ:
   - tiêu đề PR và mô tả PR
   - patch diff
   - bộ review rules
7. Gửi prompt tới model trên NVIDIA
8. Model trả về JSON có cấu trúc
9. Script format JSON thành comment dễ đọc
10. Bot đăng hoặc cập nhật comment trên PR

---

## Tính năng

- Tự động review PR khi có sự kiện pull request
- Chỉ review phần diff nhìn thấy được thay vì toàn bộ repository
- Có thể phát hiện các vấn đề như:
  - hardcoded secret
  - logic xác thực rủi ro
  - lỗi xử lý null/undefined
  - vấn đề về maintainability
  - gợi ý test còn thiếu
- Đăng comment review trực tiếp vào PR
- Dùng GitHub Secrets để quản lý API key an toàn
- Cài đặt gọn, dễ hiểu, phù hợp với prototype trong 3 ngày

---

## Công nghệ sử dụng

- **GitHub Actions** để tự động hóa workflow
- **Node.js** cho script xử lý chính
- **GitHub REST API** để lấy file diff và đăng comment
- **NVIDIA Build API** để gọi model AI
- **Markdown** để format comment trên PR

---

## Kiến trúc

```text
Sự kiện Pull Request
        ↓
GitHub Actions Workflow
        ↓
Node.js Review Script
        ↓
GitHub API → Lấy file thay đổi / diff
        ↓
Prompt Builder + Review Rules
        ↓
NVIDIA Model API
        ↓
Structured JSON Review
        ↓
Markdown Formatter
        ↓
Comment quay lại GitHub PR
```

---

## Cấu trúc thư mục

```text
ai-pr-reviewer/
├─ .github/
│  └─ workflows/
│     └─ ai-pr-reviewer.yml
├─ docs/
│  └─ README.vi.md
├─ src/
│  ├─ config.js
│  ├─ context.js
│  ├─ github.js
│  ├─ rules.js
│  ├─ prompt.js
│  ├─ llm.js
│  ├─ format.js
│  └─ index.js
├─ package.json
└─ README.md
```

---

## Cách cài đặt

### 1. Clone repository
```bash
git clone <your-repository-url>
cd ai-pr-reviewer
```

### 2. Tạo GitHub Actions secrets
Vào:

**Repository Settings → Secrets and variables → Actions**

Truy cập vào: `https://build.nvidia.com/models`

Tạo:
- `NVIDIA_API_KEY` -> 

Có thể thêm:
- `NVIDIA_MODEL`

### 3. Push code lên GitHub
```bash
git add .
git commit -m "feat: initial ai pr reviewer"
git push origin main
```

---

## Cách kiểm thử

### 1. Tạo branch test
```bash
git checkout -b feature/test-pr
```

### 2. Tạo file code demo có lỗi chủ đích
```js
function login(password) {
  const API_KEY = "hardcoded-secret";
  if (password == null) {
    return true;
  }
  return false;
}
```

### 3. Commit và push
```bash
git add .
git commit -m "test: add insecure demo code"
git push origin feature/test-pr
```

### 4. Mở Pull Request
Tạo PR từ:
- **compare:** `feature/test-pr`
- **base:** `main`

### 5. Kết quả kỳ vọng
Sau khi PR được mở, GitHub Actions sẽ tự động chạy và bot sẽ đăng comment review với các nội dung như:
- hardcoded secret
- logic xác thực rủi ro
- lỗi xử lý null/undefined
- gợi ý test cần thêm

---

## Ví dụ đầu ra

Ví dụ comment review:

> **Overall summary**  
> The added code contains a hardcoded API key and critical authentication logic flaws that allow login bypass.

**Ví dụ findings**
- **[HIGH] Hardcoded sensitive credential**
- **[HIGH] Authentication bypass on null/undefined password**
- **[MEDIUM] Use of loose equality operator**

**Ví dụ suggested tests**
- Test case cho `login(null)` để đảm bảo trả về false
- Test case cho `login(undefined)` để đảm bảo trả về false
- Test case xử lý chuỗi rỗng

> Bạn nên thay phần này bằng ảnh chụp màn hình comment thật trong PR để README thuyết phục hơn.

---

## Phần phản ánh

Mình chọn đề tài này vì review Pull Request là một workflow engineering rất thực tế, thường tốn thời gian và có thể bỏ sót lỗi rõ ràng khi team đang bận.

AI PR Reviewer giúp cải thiện hiệu suất làm việc bằng cách tự động phân tích phần diff nhìn thấy được của Pull Request và tạo review ban đầu có cấu trúc. Công cụ này giúp giảm bớt công việc review lặp lại và hỗ trợ phát hiện sớm các vấn đề quan trọng, đặc biệt là lỗi logic và rủi ro bảo mật.

Trong quá trình thực hiện, mình học được cách:
- tự động hóa workflow bằng GitHub Actions
- làm việc với GitHub pull request events và REST APIs
- tích hợp LLM vào một use case engineering thực tế
- format đầu ra AI thành comment hữu ích cho developer
- debug các lỗi phổ biến liên quan đến workflow, module và API integration

Dự án này thể hiện tinh thần chủ động, khả năng giải quyết vấn đề và khả năng xây dựng một công cụ nội bộ hữu ích bằng automation và AI.

---

## Giới hạn hiện tại

- Chỉ review phần diff nhìn thấy được, không hiểu toàn bộ context của repository
- Vẫn có thể tạo false positive hoặc gợi ý chưa đầy đủ
- Hiện tại đăng comment tổng hợp, chưa comment inline theo từng dòng
- Không thay thế hoàn toàn human code review
- Hoạt động tốt nhất với PR nhỏ đến vừa

---

## Hướng phát triển tiếp theo

- Thêm inline review comments theo đúng dòng diff
- Hỗ trợ file rules riêng cho từng repository
- Thêm retry/fallback khi model API lỗi
- Giảm noise và false positives
- Hỗ trợ nhiều AI provider hoặc local models
- Thêm confidence score cho từng finding