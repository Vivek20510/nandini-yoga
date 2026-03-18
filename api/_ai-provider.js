const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_CHAT_PATH = "/chat/completions";
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
const DEFAULT_TIMEOUT_MS = 20000;

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
  fallbackModels: String(process.env.AI_FALLBACK_MODELS || "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean),
  timeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
});

export const sendAiRequest = async (body) => {
  const { baseUrl, path, timeoutMs } = getAiConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(`AI request timed out after ${timeoutMs}ms`);
      timeoutError.code = "AI_TIMEOUT";
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
