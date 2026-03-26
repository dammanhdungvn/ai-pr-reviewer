const MARKER = "<!-- ai-pr-reviewer -->";

export function getCommentMarker() {
  return MARKER;
}

export function formatReviewComment(review, prContext, reviewableFiles) {
  const findings = Array.isArray(review.findings) ? review.findings : [];
  const tests = Array.isArray(review.test_recommendations)
    ? review.test_recommendations
    : [];

  const findingLines =
    findings.length === 0
      ? ["- Không phát hiện vấn đề rõ ràng nào từ diff hiện tại."]
      : findings.map((f, idx) => {
          return [
            `${idx + 1}. **[${(f.severity || "low").toUpperCase()}] ${f.title || "Unnamed finding"}**`,
            `   - File: \`${f.file || "unknown"}\``,
            `   - Vị trí gợi ý: ${f.line_hint || "N/A"}`,
            `   - Tại sao quan trọng: ${f.why_it_matters || "N/A"}`,
            `   - Gợi ý sửa: ${f.suggestion || "N/A"}`
          ].join("\n");
        });

  const testLines =
    tests.length === 0
      ? ["- Không có đề xuất test bổ sung."]
      : tests.map((t) => `- ${t}`);

  return `${MARKER}
## 🤖 AI PR Reviewer

**PR:** ${prContext.title}
**Files reviewed:** ${reviewableFiles.length}
**Confidence:** ${review.confidence || "medium"}

### Overall summary
${review.summary || "Không có summary."}

### Findings
${findingLines.join("\n\n")}

### Suggested tests
${testLines.join("\n")}

---
> Đây là review tự động từ diff hiện tại. Reviewer con người vẫn nên kiểm tra lại các điểm quan trọng.
`;
}