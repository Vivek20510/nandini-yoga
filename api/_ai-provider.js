const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_CHAT_PATH = "/chat/completions";
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct:free";

const buildHeaders = () => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing AI_API_KEY");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const json = (res, status, payload) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

export const getAiConfig = () => ({
  baseUrl: (process.env.AI_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, ""),
  path: process.env.AI_API_CHAT_PATH || DEFAULT_CHAT_PATH,
  model: process.env.AI_MODEL || DEFAULT_MODEL,
});

export const sendAiRequest = async (body) => {
  const { baseUrl, path } = getAiConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
};
