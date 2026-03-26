import fs from "node:fs";
import { config } from "./config.js";

export function getPrContext() {
  if (!config.repository) {
    throw new Error("Missing GITHUB_REPOSITORY");
  }

  if (!config.eventPath) {
    throw new Error("Missing GITHUB_EVENT_PATH");
  }

  const [owner, repo] = config.repository.split("/");
  const event = JSON.parse(fs.readFileSync(config.eventPath, "utf8"));
  const pr = event.pull_request;

  if (!pr) {
    throw new Error("This workflow must be triggered by pull_request");
  }

  return {
    owner,
    repo,
    pullNumber: pr.number,
    title: pr.title || "",
    body: pr.body || "",
    htmlUrl: pr.html_url || "",
    headSha: pr.head?.sha || "",
    baseSha: pr.base?.sha || ""
  };
}