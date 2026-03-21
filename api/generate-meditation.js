/* eslint-env node */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "deepseek/deepseek-chat-v3";
const CRISIS_RE =
  /\b(suicide|kill myself|self harm|hurt myself|end my life|want to die|die tonight|can'?t go on)\b/i;

const json = (res, status, payload) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const fallbackSafetySession = (moodLabel, durationMinutes) => ({
  title: "Pause and Reach for Immediate Support",
  moodLabel,
  durationMinutes,
  tone: "Warm, steady, and safety-first",
  focusPoint: "Feel both feet on the floor and notice one object near you",
  breathingPattern: {
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdAfterExhale: 0,
    label: "Breathe in for 4, breathe out for 6",
  },
  intro:
    "Before meditation, please pause and reach out to a trusted person nearby right now. If you may be in immediate danger or might act on these feelings, call emergency services now.",
  guidedSteps: [
    "Place one hand on your chest and one on your belly. Let your exhale be longer than your inhale for three rounds.",
    "Say out loud where you are and name five things you can see. Keep your attention in the room, not inside the spiral.",
    "Contact someone you trust, a local crisis line, or emergency support and stay connected until you are not alone with this feeling.",
  ],
  closing:
    "You do not need to carry this alone. Immediate human support is the next right step.",
  generatedAt: new Date().toISOString(),
});

const buildSystemPrompt = () => `
You create safe, gentle, non-clinical guided meditation sessions for a yoga and mindfulness website.
Return only valid JSON with this exact shape:
{
  "title": string,
  "moodLabel": string,
  "durationMinutes": number,
  "tone": string,
  "focusPoint": string,
  "breathingPattern": {
    "inhale": number,
    "hold": number,
    "exhale": number,
    "holdAfterExhale": number,
    "label": string
  },
  "intro": string,
  "guidedSteps": string[],
  "closing": string
}

Rules:
- Keep the tone supportive, grounded, and rooted in breath awareness.
- Do not diagnose, treat, or mention therapy.
- Do not mention being an AI.
- guidedSteps must contain 4 to 7 short paragraphs.
- Make the pace feel appropriate for the requested duration.
- Use plain, soothing language for spoken guidance.
- Keep breathing counts realistic and safe for a general audience.
- Output JSON only with double quotes and no markdown.
`.trim();

function normalizeSession(session, moodLabel, durationMinutes) {
  const breathing = session?.breathingPattern || {};

  return {
    title: String(session?.title || "Personal Guided Meditation").trim(),
    moodLabel: String(session?.moodLabel || moodLabel).trim(),
    durationMinutes,
    tone: String(session?.tone || "Calm and steady").trim(),
    focusPoint: String(session?.focusPoint || "Breath at the center of the chest").trim(),
    breathingPattern: {
      inhale: Math.max(2, Math.min(8, Number(breathing.inhale || 4))),
      hold: Math.max(0, Math.min(6, Number(breathing.hold || 0))),
      exhale: Math.max(2, Math.min(10, Number(breathing.exhale || 6))),
      holdAfterExhale: Math.max(0, Math.min(6, Number(breathing.holdAfterExhale || 0))),
      label: String(breathing.label || "Inhale softly, exhale longer").trim(),
    },
    intro: String(session?.intro || "").trim(),
    guidedSteps: Array.isArray(session?.guidedSteps)
      ? session.guidedSteps.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 7)
      : [],
    closing: String(session?.closing || "").trim(),
    generatedAt: new Date().toISOString(),
  };
}

function parseModelContent(data) {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("Meditation provider returned an invalid response.");
  }

  return JSON.parse(content);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Method not allowed." });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

    const moodPreset = String(req.body?.moodPreset || "").trim();
    const feelingText = String(req.body?.feelingText || "").trim();
    const durationMinutes = Number(req.body?.durationMinutes);
    const moodLabel = feelingText || moodPreset;

    if (!moodLabel) {
      return json(res, 400, {
        ok: false,
        message: "Share a feeling or choose a mood before generating.",
      });
    }

    if (feelingText.length > 220) {
      return json(res, 400, {
        ok: false,
        message: "Please keep the custom feeling under 220 characters.",
      });
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes < 2 || durationMinutes > 10) {
      return json(res, 400, {
        ok: false,
        message: "Choose a meditation length between 2 and 10 minutes.",
      });
    }

    if (CRISIS_RE.test(moodLabel)) {
      return json(res, 200, {
        ok: true,
        session: fallbackSafetySession(moodLabel, durationMinutes),
      });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VITE_SITE_URL || "http://localhost:5173",
        "X-Title": "Yoga By Nandini Meditation",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        temperature: 0.8,
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt() },
          {
            role: "user",
            content: `Create a ${durationMinutes}-minute guided meditation for someone feeling "${moodLabel}".`,
          },
        ],
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(res, response.status || 502, {
        ok: false,
        message: data?.error?.message || "Meditation generation failed.",
      });
    }

    const session = normalizeSession(parseModelContent(data), moodLabel, durationMinutes);

    if (!session.intro || session.guidedSteps.length === 0 || !session.closing) {
      throw new Error("Meditation response was incomplete.");
    }

    return json(res, 200, {
      ok: true,
      session,
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      message:
        error.message === "Missing OPENROUTER_API_KEY"
          ? "Meditation generation is not configured yet."
          : "We could not create a meditation right now. Please try again in a moment.",
    });
  }
}
