export const config = {
  githubToken: process.env.GITHUB_TOKEN,
  githubApiUrl: process.env.GITHUB_API_URL || "https://api.github.com",
  repository: process.env.GITHUB_REPOSITORY,
  eventPath: process.env.GITHUB_EVENT_PATH,

  nvidiaApiKey: process.env.NVIDIA_API_KEY,
  nvidiaBaseUrl: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
  model: process.env.NVIDIA_MODEL || "z-ai/glm4.7",

  maxFiles: Number(process.env.MAX_FILES || 20),
  maxPatchChars: Number(process.env.MAX_PATCH_CHARS || 8000)
};