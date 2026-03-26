import { config } from "./config.js";
import { getPrContext } from "./context.js";
import { listPullRequestFiles, upsertBotComment } from "./github.js";
import { isReviewableFile } from "./rules.js";
import { buildPrompt } from "./prompt.js";
import { reviewWithModel } from "./llm.js";
import { formatReviewComment, getCommentMarker } from "./format.js";

async function main() {
  if (!config.githubToken) {
    throw new Error("Missing GITHUB_TOKEN");
  }

  if (!config.nvidiaApiKey) {
    throw new Error("Missing NVIDIA_API_KEY");
  }

  const prContext = getPrContext();
  console.log(`Reviewing PR #${prContext.pullNumber} in ${prContext.owner}/${prContext.repo}`);

  const allFiles = await listPullRequestFiles(prContext);
  const reviewableFiles = allFiles.filter(isReviewableFile);

  if (reviewableFiles.length === 0) {
    const body = `${getCommentMarker()}
## 🤖 AI PR Reviewer

Không có file text/code nào phù hợp để review tự động trong PR này.
`;
    await upsertBotComment({
      owner: prContext.owner,
      repo: prContext.repo,
      issueNumber: prContext.pullNumber,
      body,
      marker: getCommentMarker()
    });
    console.log("No reviewable files found.");
    return;
  }

  const prompt = buildPrompt(prContext, reviewableFiles);
  const review = await reviewWithModel(prompt);
  const commentBody = formatReviewComment(review, prContext, reviewableFiles);

  await upsertBotComment({
    owner: prContext.owner,
    repo: prContext.repo,
    issueNumber: prContext.pullNumber,
    body: commentBody,
    marker: getCommentMarker()
  });

  console.log("AI review comment posted successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});