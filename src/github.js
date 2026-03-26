import { config } from "./config.js";

async function githubRequest(path, options = {}) {
  const response = await fetch(`${config.githubApiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "ai-pr-reviewer-bot",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function listPullRequestFiles({ owner, repo, pullNumber }) {
  const files = [];
  let page = 1;

  while (true) {
    const data = await githubRequest(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`
    );

    files.push(...data);

    if (data.length < 100) break;
    page += 1;
  }

  return files;
}

export async function listIssueComments({ owner, repo, issueNumber }) {
  const comments = [];
  let page = 1;

  while (true) {
    const data = await githubRequest(
      `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100&page=${page}`
    );

    comments.push(...data);

    if (data.length < 100) break;
    page += 1;
  }

  return comments;
}

export async function createIssueComment({ owner, repo, issueNumber, body }) {
  return githubRequest(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body })
  });
}

export async function updateIssueComment({ owner, repo, commentId, body }) {
  return githubRequest(`/repos/${owner}/${repo}/issues/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ body })
  });
}

export async function upsertBotComment({ owner, repo, issueNumber, body, marker }) {
  const comments = await listIssueComments({ owner, repo, issueNumber });
  const existing = comments.find((c) => typeof c.body === "string" && c.body.includes(marker));

  if (existing) {
    return updateIssueComment({
      owner,
      repo,
      commentId: existing.id,
      body
    });
  }

  return createIssueComment({ owner, repo, issueNumber, body });
}