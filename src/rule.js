export const REVIEW_RULES = [
  "Tập trung vào bug thực tế, null/undefined handling, validate input, error handling.",
  "Phát hiện hardcode nhạy cảm như secret, token, password, API key.",
  "Kiểm tra logic có thể gây regressions hoặc edge case rõ ràng.",
  "Đánh giá maintainability: tên biến/hàm khó hiểu, duplicate logic, điều kiện rối.",
  "Đề xuất test cases còn thiếu nếu diff có thay đổi logic quan trọng.",
  "Chỉ nêu vấn đề khi có bằng chứng từ diff. Không bịa phần code không thấy.",
  "Nếu không đủ bằng chứng, phải nói rõ là low confidence hoặc không chắc chắn."
];

const IGNORE_PATTERNS = [
  /\.lock$/i,
  /package-lock\.json$/i,
  /pnpm-lock\.yaml$/i,
  /yarn\.lock$/i,
  /\.min\.(js|css)$/i,
  /\.(png|jpg|jpeg|gif|svg|ico|webp|pdf|zip)$/i,
  /^dist\//i,
  /^build\//i,
  /^coverage\//i
];

export function isReviewableFile(file) {
  if (!file) return false;
  if (!file.patch) return false;
  if (file.status === "removed") return false;

  return !IGNORE_PATTERNS.some((pattern) => pattern.test(file.filename));
}

export function trimPatch(patch, maxChars) {
  if (!patch) return "";
  if (patch.length <= maxChars) return patch;
  return `${patch.slice(0, maxChars)}\n... [PATCH TRUNCATED]`;
}