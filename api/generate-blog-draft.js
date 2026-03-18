import { getAiConfig, json, sendAiRequest } from "./_ai-provider.js";

const MAX_FIELD_LENGTH = 1000;
const MAX_NOTES_LENGTH = 3000;

const parseKeywords = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

const trimField = (value, maxLength = MAX_FIELD_LENGTH) =>
  String(value || "").trim().slice(0, maxLength);

const normalizeDraft = (payload = {}) => {
  const title = trimField(payload.title, 140);
  const excerpt = trimField(payload.excerpt, 240);
  const body = trimField(payload.body, 12000);
  const category = trimField(payload.category, 60);
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => trimField(tag, 40)).filter(Boolean).slice(0, 8)
    : parseKeywords(payload.tags);
  const metaDescription = trimField(payload.metaDescription, 160);

  return {
    title,
    excerpt,
    body,
    category,
    tags,
    metaDescription,
  };
};

const validateDraft = (draft) =>
  Boolean(
    draft.title &&
      draft.excerpt &&
      draft.body &&
      draft.category &&
      draft.tags.length > 0 &&
      draft.metaDescription
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Method not allowed." });
  }

  try {
    const {
      topic,
      audience,
      tone,
      keywords,
      length,
      notes,
      pin,
    } = req.body || {};

    const expectedPin = process.env.ADMIN_PIN || process.env.VITE_ADMIN_PIN;

    if (expectedPin && String(pin || "").trim() !== String(expectedPin).trim()) {
      return json(res, 401, {
        ok: false,
        code: "INVALID_PIN",
        message: "Admin PIN is incorrect.",
      });
    }

    const cleanTopic = trimField(topic, 180);
    const cleanAudience = trimField(audience, 140);
    const cleanTone = trimField(tone, 80);
    const cleanLength = trimField(length, 40);
    const cleanKeywords = parseKeywords(keywords);
    const cleanNotes = trimField(notes, MAX_NOTES_LENGTH);

    if (!cleanTopic || !cleanAudience || !cleanTone || !cleanLength || cleanKeywords.length === 0) {
      return json(res, 400, {
        ok: false,
        code: "INVALID_REQUEST",
        message: "Topic, audience, tone, keywords, and length are required.",
      });
    }

    const { model } = getAiConfig();
    const systemPrompt = [
      "You are a wellness content assistant for Yoga By Nandini.",
      "Return valid JSON only, with no markdown fences and no commentary.",
      'Use this exact shape: {"title":"","excerpt":"","body":"","category":"","tags":[],"metaDescription":""}.',
      "Write warm, clear, beginner-friendly blog content grounded in yoga, meditation, pranayama, Ayurveda, and mindful living.",
      "Avoid medical claims, clickbait, and exaggerated promises.",
      "Keep the body structured in short paragraphs with natural transitions.",
      "Generate a practical article that feels publishable after light editing.",
      "Make the meta description concise and under 160 characters.",
    ].join(" ");

    const userPrompt = [
      `Topic: ${cleanTopic}`,
      `Audience: ${cleanAudience}`,
      `Tone: ${cleanTone}`,
      `Desired length: ${cleanLength}`,
      `Keywords: ${cleanKeywords.join(", ")}`,
      cleanNotes ? `Additional notes: ${cleanNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { response, data } = await sendAiRequest({
      model,
      temperature: 0.8,
      max_tokens: 1200,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_object",
      },
    });

    if (!response.ok) {
      return json(res, response.status || 502, {
        ok: false,
        code: "AI_PROVIDER_ERROR",
        message: data?.error?.message || data?.message || "Could not generate a draft right now.",
      });
    }

    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return json(res, 502, {
        ok: false,
        code: "EMPTY_AI_RESPONSE",
        message: "The AI provider returned an empty draft.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return json(res, 502, {
        ok: false,
        code: "INVALID_AI_JSON",
        message: "The AI provider returned an invalid draft format.",
      });
    }

    const draft = normalizeDraft(parsed);

    if (!validateDraft(draft)) {
      return json(res, 502, {
        ok: false,
        code: "INCOMPLETE_AI_DRAFT",
        message: "The AI draft was incomplete. Please try again.",
      });
    }

    return json(res, 200, { ok: true, draft });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      code: "SERVER_ERROR",
      message:
        error.message === "Missing AI_API_KEY"
          ? "AI generation is not configured yet."
          : "Something went wrong while generating the draft.",
    });
  }
}
