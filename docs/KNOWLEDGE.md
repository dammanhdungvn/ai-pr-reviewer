
---

# Tài liệu tổng hợp kiến thức cần học cho project AI PR Reviewer

## 1. Mục tiêu của tài liệu

Tài liệu này giúp intern hiểu rõ những nhóm kiến thức cần nắm để:

* đọc hiểu được toàn bộ project
* tự chạy, sửa lỗi và giải thích lại project
* hiểu vì sao mỗi thành phần được dùng trong hệ thống
* có nền tảng để nâng cấp project sau này

Project **AI PR Reviewer** là một công cụ tự động hóa workflow review Pull Request trên GitHub bằng AI. Khi có PR mới hoặc PR được cập nhật, hệ thống sẽ tự động lấy phần diff của PR, gửi cho model AI phân tích, sau đó format kết quả thành comment và đăng lại lên PR.

---

## 2. Bức tranh tổng thể của project

Luồng chạy của hệ thống:

1. Developer tạo hoặc cập nhật Pull Request
2. GitHub Actions được kích hoạt
3. Workflow chạy script Node.js
4. Script lấy thông tin PR từ GitHub event
5. Script gọi GitHub API để lấy danh sách file thay đổi và patch diff
6. Script lọc các file phù hợp để review
7. Script tạo prompt gửi cho model AI
8. Model trả về kết quả review ở dạng có cấu trúc
9. Script format kết quả thành markdown comment
10. Bot đăng comment lại vào Pull Request

Muốn hiểu hết project, intern phải hiểu từng mắt xích trong chuỗi này.

---

## 3. Các nhóm kiến thức cần học

## A. Git và GitHub cơ bản

Đây là nền tảng bắt buộc vì project chạy xoay quanh Pull Request.

### Cần học

* Repository là gì
* Branch là gì
* Commit, push, pull
* Merge là gì
* Diff là gì
* Pull Request là gì
* Base branch và compare branch
* Changed files trong PR
* Comment trong PR

### Mục tiêu cần đạt

Intern phải trả lời được:

* PR là gì và vì sao project này chạy khi có PR
* Diff trong PR là gì
* Vì sao bot lại chỉ review phần diff chứ không review cả repository

---

## B. GitHub Actions

Đây là phần quan trọng nhất của project vì nó là cơ chế tự động hóa.

### Cần học

* Workflow là gì
* File workflow nằm ở đâu: `.github/workflows/*.yml`
* Event trigger là gì
* `pull_request` event
* Jobs, steps
* `runs-on`
* `env`
* `secrets`
* `permissions`
* `concurrency`

### Mục tiêu cần đạt

Intern phải hiểu:

* Vì sao workflow tự chạy khi mở PR
* File YAML dùng để làm gì
* Step nào setup môi trường, step nào chạy code
* Vì sao phải dùng secret thay vì hardcode API key

---

## C. Environment Variables và Secrets

Project dùng key của GitHub và model API, nên phần này phải hiểu chắc.

### Cần học

* Environment variable là gì
* `process.env` trong Node.js
* GitHub Secrets là gì
* Cách truyền secret từ workflow vào script
* Vì sao không được commit API key lên repo

### Mục tiêu cần đạt

Intern phải hiểu:

* `GITHUB_TOKEN` dùng làm gì
* `NVIDIA_API_KEY` dùng làm gì
* Cách script đọc biến môi trường
* Rủi ro nếu hardcode secret trong source code

---

## D. Node.js cơ bản

Toàn bộ logic chính của project được viết bằng Node.js.

### Cần học

* Cấu trúc project Node.js
* `package.json`
* `"type": "module"`
* `import` / `export`
* `async/await`
* `fetch`
* `JSON.parse`
* `try/catch` hoặc `throw new Error`

### Mục tiêu cần đạt

Intern phải đọc được các file JS trong project và hiểu:

* file nào làm gì
* vì sao dùng async/await
* vì sao lỗi module từng xảy ra khi thiếu `"type": "module"`

---

## E. REST API cơ bản

Project gọi cả GitHub API lẫn model API.

### Cần học

* HTTP method: GET, POST, PATCH
* Request headers
* Authorization Bearer token
* Request body JSON
* Response body JSON
* Status code 200, 401, 404, 500

### Mục tiêu cần đạt

Intern phải hiểu:

* script gọi API GitHub để lấy file changed như thế nào
* script gửi prompt cho model AI như thế nào
* lỗi 404, 401, 500 thường có nghĩa gì

---

## F. GitHub API cho Pull Request

Đây là phần kết nối trực tiếp với GitHub.

### Cần học

* Lấy danh sách file thay đổi trong PR
* Lấy comment trong PR
* Tạo comment mới
* Cập nhật comment cũ
* Phân biệt issue comment và review comment

### Mục tiêu cần đạt

Intern phải giải thích được:

* project lấy diff từ đâu
* comment được đăng lại như thế nào
* vì sao bản MVP dùng comment tổng hợp thay vì inline comment theo từng dòng

---

## G. Event Context của GitHub Actions

Workflow không tự biết đang xử lý PR nào nếu không đọc event payload.

### Cần học

* `GITHUB_EVENT_PATH`
* `GITHUB_REPOSITORY`
* Payload JSON của sự kiện `pull_request`

### Mục tiêu cần đạt

Intern phải hiểu:

* script biết PR number bằng cách nào
* script biết owner/repo bằng cách nào
* vì sao phải đọc event thay vì hardcode

---

## H. JSON và Structured Data

Kết quả từ model được yêu cầu trả về ở dạng JSON để dễ xử lý.

### Cần học

* JSON object
* JSON array
* Parsing JSON
* Output schema
* Structured output là gì

### Mục tiêu cần đạt

Intern phải hiểu:

* vì sao model không nên trả text tự do
* vì sao JSON giúp format comment ổn định hơn
* cấu trúc output gồm những gì: summary, findings, test recommendations

---

## I. Prompt Engineering cơ bản

Đây là phần AI quan trọng nhất trong project.

### Cần học

* Prompt là gì
* System prompt và user prompt
* Cách giới hạn phạm vi cho model
* Cách yêu cầu model trả JSON
* Cách giảm hallucination
* Cách giảm false positive

### Mục tiêu cần đạt

Intern phải hiểu:

* vì sao prompt quyết định chất lượng review
* vì sao phải yêu cầu “review only visible diff”
* vì sao phải cấm model suy diễn quá mức từ phần code không thấy

---

## J. Rule-based Filtering

Project không đẩy mọi thứ vào model một cách mù quáng.

### Cần học

* Lọc file nào nên review
* Ignore lock files, binary files, generated files
* Cắt ngắn patch dài
* Tư duy giảm noise và tiết kiệm token

### Mục tiêu cần đạt

Intern phải hiểu:

* vì sao không nên gửi toàn bộ PR vào model
* vì sao phải bỏ qua file `.lock`, file ảnh, file build
* vì sao preprocessing là phần quan trọng của hệ thống AI ứng dụng

---

## K. Markdown Formatting

Kết quả cuối cùng được hiển thị trong PR dưới dạng markdown comment.

### Cần học

* Heading
* Bullet list
* Code block
* Quote block
* Cách format nội dung dễ đọc

### Mục tiêu cần đạt

Intern phải hiểu:

* vì sao output cần được format rõ ràng
* vì sao comment đẹp giúp project trông chuyên nghiệp hơn
* cấu trúc một comment review tốt gồm những phần nào

---

## L. Debugging và đọc log

Đây là kỹ năng rất quan trọng để tự vận hành project.

### Cần học

* Đọc log GitHub Actions
* Phân biệt lỗi workflow, lỗi path, lỗi module, lỗi API
* Debug bằng `console.log`
* Kiểm tra file tồn tại bằng `ls`, `cat`, `pwd`
* Kiểm tra biến env
* Kiểm tra response text từ API

### Mục tiêu cần đạt

Intern phải tự xử lý được các lỗi như:

* không tìm thấy file
* lỗi module Node.js
* thiếu secret
* sai endpoint model
* model trả response không đúng format

---

## M. Security cơ bản trong automation

Dù đây là MVP, vẫn cần hiểu tư duy an toàn.

### Cần học

* Không hardcode secret
* Không để lộ API key trong code, ảnh, commit
* Cẩn thận khi chạy workflow trên PR từ fork
* Chỉ cấp quyền vừa đủ cho workflow

### Mục tiêu cần đạt

Intern phải hiểu:

* vì sao secret phải để trong GitHub Secrets
* vì sao automation có thể tạo rủi ro nếu thiết kế sai
* vì sao project chỉ nên đọc diff thay vì chạy code không tin cậy

---

## N. Tư duy sản phẩm và engineering workflow

Đây là phần giúp intern không chỉ “code được” mà còn “hiểu vì sao project có giá trị”.

### Cần học

* Pain point trong code review
* Manual work là gì
* First-pass review là gì
* False positive là gì
* Human-in-the-loop là gì
* MVP là gì

### Mục tiêu cần đạt

Intern phải giải thích được:

* project này giúp ích gì cho engineer
* vì sao AI PR Reviewer không thay thế hoàn toàn human reviewer
* vì sao đây là một internal tool hợp lý cho challenge automation

---

## 4. Mapping kiến thức với từng file trong project

### `.github/workflows/ai-pr-reviewer.yml`

Kiến thức liên quan:

* GitHub Actions
* event trigger
* secrets
* permissions
* concurrency

### `package.json`

Kiến thức liên quan:

* Node.js project setup
* ES Modules
* scripts

### `src/config.js`

Kiến thức liên quan:

* environment variables
* config management

### `src/context.js`

Kiến thức liên quan:

* GitHub event payload
* PR metadata

### `src/github.js`

Kiến thức liên quan:

* GitHub REST API
* authentication
* PR comments

### `src/rules.js`

Kiến thức liên quan:

* rule-based filtering
* preprocessing
* ignore patterns
* token control

### `src/prompt.js`

Kiến thức liên quan:

* prompt engineering
* structured output
* hallucination control

### `src/llm.js`

Kiến thức liên quan:

* model API integration
* fetch
* JSON parsing
* response validation
* error handling

### `src/format.js`

Kiến thức liên quan:

* markdown formatting
* readable review output

### `src/index.js`

Kiến thức liên quan:

* orchestration
* end-to-end workflow control
* glue logic giữa các module

---

## 5. Thứ tự học được khuyến nghị

## Giai đoạn 1: Hiểu project chạy như thế nào

Học trước:

1. Git cơ bản
2. Pull Request
3. GitHub Actions
4. Secrets và environment variables
5. Node.js cơ bản

Sau giai đoạn này, intern sẽ hiểu **vì sao project chạy**.

## Giai đoạn 2: Hiểu project xử lý dữ liệu như thế nào

Học tiếp:
6. REST API
7. GitHub API cho PR
8. JSON
9. Markdown

Sau giai đoạn này, intern sẽ hiểu **dữ liệu đi qua hệ thống như thế nào**.

## Giai đoạn 3: Hiểu AI trong project hoạt động như thế nào

Học tiếp:
10. Prompt engineering
11. Structured output
12. Rule filtering
13. False positive / hallucination basics

Sau giai đoạn này, intern sẽ hiểu **AI được dùng đúng ở đâu và bị giới hạn ra sao**.

## Giai đoạn 4: Hiểu cách vận hành và sửa lỗi

Học tiếp:
14. Debugging workflow logs
15. Error handling
16. Security basics

Sau giai đoạn này, intern sẽ hiểu **cách maintain project**.

---

## 6. Checklist năng lực sau khi học xong

Một intern được xem là đã hiểu project khi có thể:

* giải thích luồng hoạt động từ PR đến bot comment
* mô tả vai trò của GitHub Actions trong hệ thống
* giải thích vì sao dùng secret thay vì hardcode key
* đọc hiểu từng file chính trong project
* giải thích được prompt đang làm gì
* hiểu vì sao output phải là JSON có cấu trúc
* tự debug được lỗi workflow cơ bản
* giải thích được giá trị thực tế của project trong engineering workflow
* nêu được giới hạn hiện tại của hệ thống
* đề xuất được ít nhất 2 hướng nâng cấp hợp lý

---

## 7. Kết luận

Để hiểu project AI PR Reviewer, intern không cần học AI quá rộng hoặc quá hàn lâm. Điều quan trọng là phải hiểu đúng các kiến thức được áp dụng trực tiếp trong hệ thống, bao gồm:

* Git và Pull Request
* GitHub Actions
* Secrets và environment variables
* Node.js cơ bản
* REST API
* GitHub API
* JSON và structured output
* Prompt engineering
* Rule filtering
* Markdown formatting
* Debugging
* Security basics
* Tư duy workflow automation

Nếu nắm chắc các phần trên, intern không chỉ hiểu được project hiện tại mà còn có đủ nền tảng để tự mở rộng hoặc build những workflow automation tools tương tự sau này.

---
