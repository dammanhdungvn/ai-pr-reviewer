import { config } from "./config.js";

function extractJson(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced) {
    return JSON.parse(fenced[1]);
  }

  const fallback = trimmed.match(/\{[\s\S]*\}/);
  if (fallback) {
    return JSON.parse(fallback[0]);
  }

  throw new Error("Model output is not valid JSON");
}

export async function reviewWithModel({ system, user }) {
  const response = await fetch(`${config.nvidiaBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.nvidiaApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from model");
  }

  return extractJson(content);
}