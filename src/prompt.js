import { REVIEW_RULES, trimPatch } from "./rules.js";
import { config } from "./config.js";

export function buildPrompt(prContext, files) {
  const selectedFiles = files.slice(0, config.maxFiles).map((file) => {
    const patch = trimPatch(file.patch || "", config.maxPatchChars);

    return [
      `FILE: ${file.filename}`,
      `STATUS: ${file.status}`,
      `ADDITIONS: ${file.additions}`,
      `DELETIONS: ${file.deletions}`,
      "PATCH:",
      patch
    ].join("\n");
  });

  const system = `
You are an experienced senior software engineer reviewing a pull request.

Your job:
- Review only the visible diff.
- Focus on correctness, bugs, security, edge cases, maintainability, and missing tests.
- Do not invent repository context that is not visible.
- If evidence is weak, say so.
- Return valid JSON only.
`;

  const user = `
PR TITLE:
${prContext.title}

PR BODY:
${prContext.body || "(empty)"}

REVIEW RULES:
${REVIEW_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}

FILES:
${selectedFiles.join("\n\n====================\n\n")}

Return JSON in this exact shape:
{
  "summary": "short overall summary",
  "confidence": "high | medium | low",
  "findings": [
    {
      "severity": "high | medium | low",
      "file": "path/to/file",
      "line_hint": "optional line or hunk hint",
      "title": "short issue title",
      "why_it_matters": "why this matters",
      "suggestion": "concrete fix suggestion"
    }
  ],
  "test_recommendations": [
    "list of suggested tests"
  ]
}
`;

  return {
    system,
    user
  };
}