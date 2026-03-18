const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_CHAT_PATH = "/chat/completions";
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
const DEFAULT_TIMEOUT_MS = 28000;

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

const createAiError = (code, message, extra = {}) => {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, extra);
  return error;
};

export const sendAiRequest = async (body) => {
  const { baseUrl, path, timeoutMs } = getAiConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let timeoutActive = true;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const rawText = await response.text();
    clearTimeout(timeout);
    timeoutActive = false;

    if (!rawText.trim()) {
      throw createAiError("AI_EMPTY_RESPONSE", "The AI provider returned an empty payload.", {
        response,
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw createAiError("AI_INVALID_JSON", "The AI provider returned invalid JSON.", {
        response,
        rawText,
      });
    }

    return { response, data, rawText };
  } catch (error) {
    if (error.name === "AbortError") {
      throw createAiError("AI_TIMEOUT", `AI request timed out after ${timeoutMs}ms`);
    }

    throw error;
  } finally {
    if (timeoutActive) {
      clearTimeout(timeout);
    }
  }
};
