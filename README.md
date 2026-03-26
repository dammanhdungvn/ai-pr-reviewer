# AI PR Reviewer

<p align="center">
  <b>AI-powered pull request review automation for GitHub</b><br/>
  Built for the <b>3-Day Fresher Engineering Automation Challenge</b>
</p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a> |
  <a href="./docs/README.vi.md">🇻🇳 Tiếng Việt</a>
</p>

---

## Project Overview

**AI PR Reviewer** is a lightweight workflow automation tool that automatically reviews GitHub pull requests using an AI model and posts structured feedback directly to the PR.

The goal of this project is to reduce repetitive manual review work, help engineers catch obvious issues earlier, and improve engineering workflow efficiency.

This project was built as a working prototype for the **3-Day Fresher Engineering Automation Challenge**.

---

## Challenge Context

### Objective
Build a small project that automates, optimizes, or improves an engineer's workflow, especially by reducing manual work or using AI to improve daily efficiency.

### Why this project fits the challenge
Code review is a common engineering workflow that often takes time and may miss obvious issues during busy periods.

This project addresses that pain point by automatically reviewing PR diffs and posting structured feedback, including:
- issue severity
- why the issue matters
- suggested fixes
- recommended test cases

---

## Problem Statement

In a typical development workflow, pull request review requires manual effort and attention to detail.

Common challenges:
- reviewers may miss obvious issues in small or repetitive PRs
- security problems such as hardcoded secrets may slip through
- risky logic changes may not be caught early
- developers spend extra time doing first-pass review manually

---

## Solution

This project introduces an **AI-based PR review assistant** that runs automatically whenever a pull request is opened or updated.

The automation:
1. listens to GitHub pull request events
2. reads the changed files and patch diffs
3. filters reviewable files
4. sends the visible diff to an AI model
5. receives structured review findings
6. formats the result into a markdown comment
7. posts the comment back to the pull request

This provides a fast first-pass review and helps reduce repetitive manual effort.

---

## How It Works

1. A pull request is opened, reopened, or synchronized
2. GitHub Actions triggers the workflow
3. The script reads PR metadata from the GitHub event context
4. It fetches changed files from the GitHub REST API
5. It filters files that are useful to review
6. It builds a prompt using:
   - PR title and body
   - file patches
   - custom review rules
7. It sends the prompt to the NVIDIA-hosted model
8. The model returns structured JSON
9. The script formats the JSON into a readable PR comment
10. The bot posts or updates the PR comment

---

## Features

- Automatic PR review on GitHub pull request events
- Reviews only visible diffs instead of the whole repository
- Detects issues such as:
  - hardcoded secrets
  - risky authentication logic
  - null/undefined handling problems
  - maintainability concerns
  - missing test suggestions
- Posts structured review comments directly to the PR
- Uses GitHub Secrets for secure API key management
- Keeps the implementation lightweight and easy to understand

---

## Tech Stack

- **GitHub Actions** for workflow automation
- **Node.js** for the review script
- **GitHub REST API** for pull request file and comment handling
- **NVIDIA Build API** for AI inference
- **Markdown** for formatted PR comments

---

## Architecture

```text
Pull Request Event
        ↓
GitHub Actions Workflow
        ↓
Node.js Review Script
        ↓
GitHub API → Get changed files / diff
        ↓
Prompt Builder + Review Rules
        ↓
NVIDIA Model API
        ↓
Structured JSON Review
        ↓
Markdown Formatter
        ↓
Comment posted back to GitHub PR
```

---

## Project Structure

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

## Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd ai-pr-reviewer
```

### 2. Add GitHub Actions secrets
Go to:

**Repository Settings → Secrets and variables → Actions**

Access: `https://build.nvidia.com/models`

Create:
- `NVIDIA_API_KEY` 

Optional:
- `NVIDIA_MODEL`

Or using this api bellow:

`NVIDIA_API_KEY`: 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

`NVIDIA_MODEL`: z-ai/glm4.7

### 3. Push the code
```bash
git add .
git commit -m "feat: initial ai pr reviewer"
git push origin main
```

---

## How to Test

### 1. Create a test branch
```bash
git checkout -b feature/test-pr
```

### 2. Add a demo file with intentionally risky code
```js
function login(password) {
  const API_KEY = "hardcoded-secret";
  if (password == null) {
    return true;
  }
  return false;
}
```

### 3. Commit and push
```bash
git add .
git commit -m "test: add insecure demo code"
git push origin feature/test-pr
```

### 4. Open a Pull Request
Create a PR from:
- **compare:** `feature/test-pr`
- **base:** `main`

### 5. Expected behavior
Once the PR is opened, the GitHub Actions workflow runs automatically and the bot posts a review comment containing findings such as:
- hardcoded secret
- risky authentication logic
- null/undefined handling issue
- suggested test cases

---

## Example Output

Example review result:

> **Overall summary**  
> The added code contains a hardcoded API key and critical authentication logic flaws that allow login bypass.

**Sample findings**
- **[HIGH] Hardcoded sensitive credential**
- **[HIGH] Authentication bypass on null/undefined password**
- **[MEDIUM] Use of loose equality operator**

**Suggested tests**
- Test case for `login(null)` to ensure it returns false
- Test case for `login(undefined)` to ensure it returns false
- Test case for empty string handling

> Replace this section with a real screenshot from your PR comment.

---

## Reflection

I chose this project because pull request review is a real engineering workflow that often takes manual effort and may miss obvious issues when engineers are busy.

This AI PR Reviewer helps improve workflow efficiency by automatically analyzing the visible diff of a pull request and generating a structured first-pass review. It reduces repetitive review work and helps surface important issues earlier, especially security and logic problems.

During implementation, I learned how to:
- automate workflow execution with GitHub Actions
- work with GitHub pull request events and REST APIs
- integrate an LLM into a practical engineering use case
- format AI output into a useful and readable developer-facing comment
- debug common workflow, module, and API integration issues

This project demonstrates initiative, problem solving, and the ability to build a practical internal engineering tool with automation and AI.

---

## Limitations

- Reviews only the visible PR diff, not the full repository context
- May still produce false positives or incomplete suggestions
- Posts a summary comment instead of inline line-by-line review comments
- Does not replace human code review
- Works best for small to medium pull requests

---

## Future Improvements

- Add inline review comments on specific diff lines
- Support repository-specific review rule files
- Add retry/fallback handling for model API failures
- Improve noise filtering and reduce false positives
- Add support for multiple AI providers or local models
- Add a confidence score for each finding