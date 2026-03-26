import { config } from "./config.js";

function extractJson(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced) return JSON.parse(fenced[1]);

  const fallback = trimmed.match(/\{[\s\S]*\}/);
  if (fallback) return JSON.parse(fallback[0]);

  throw new Error("Model output is not valid JSON");
}

export async function reviewWithModel({ system, user }) {
  const url = `${config.nvidiaBaseUrl}/chat/completions`;

  console.log("NVIDIA URL:", url);
  console.log("NVIDIA model:", config.model);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.nvidiaApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      top_p: 1,
      max_tokens: 3000,
      stream: false,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`NVIDIA API error ${response.status}: ${rawText}`);
  }

  const data = JSON.parse(rawText);
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`No content returned from model. Full response: ${rawText}`);
  }

  return extractJson(content);
}