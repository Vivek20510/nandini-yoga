const HISTORY_KEY = "ybn_meditation_history_v1";
const HISTORY_LIMIT = 10;

export const MEDITATION_MOODS = [
  { key: "anxious", label: "Anxious" },
  { key: "overthinking", label: "Overthinking" },
  { key: "tired", label: "Tired" },
  { key: "angry", label: "Angry" },
];

export const MEDITATION_DURATIONS = [2, 3, 5, 7, 10];

export const AMBIENT_OPTIONS = [
  { key: "rain", label: "Rain" },
  { key: "flute", label: "Flute" },
];

export function createMeditationId() {
  return `med-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeMeditationSession(value) {
  const breathing = value?.breathingPattern || {};

  return {
    id: value?.id || createMeditationId(),
    title: String(value?.title || "Guided Meditation").trim(),
    moodLabel: String(value?.moodLabel || "Custom").trim(),
    durationMinutes: Number(value?.durationMinutes || 2),
    tone: String(value?.tone || "Gentle and grounding").trim(),
    focusPoint: String(value?.focusPoint || "Breath at the heart center").trim(),
    breathingPattern: {
      inhale: Math.max(2, Number(breathing.inhale || 4)),
      hold: Math.max(0, Number(breathing.hold || 0)),
      exhale: Math.max(2, Number(breathing.exhale || 6)),
      holdAfterExhale: Math.max(0, Number(breathing.holdAfterExhale || 0)),
      label: String(breathing.label || "Inhale softly, exhale longer").trim(),
    },
    intro: String(value?.intro || "").trim(),
    guidedSteps: Array.isArray(value?.guidedSteps)
      ? value.guidedSteps.map((item) => String(item || "").trim()).filter(Boolean)
      : [],
    closing: String(value?.closing || "").trim(),
    generatedAt: value?.generatedAt || new Date().toISOString(),
  };
}

export async function generateMeditation(payload) {
  const response = await fetch("/api/generate-meditation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.ok || !data?.session) {
    throw new Error(data?.message || "We could not create a meditation right now.");
  }

  return normalizeMeditationSession(data.session);
}

export function loadMeditationHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeMeditationSession);
  } catch {
    return [];
  }
}

export function saveMeditationToHistory(session) {
  if (typeof window === "undefined") {
    return [];
  }

  const normalized = normalizeMeditationSession(session);
  const current = loadMeditationHistory().filter((item) => item.id !== normalized.id);
  const next = [normalized, ...current].slice(0, HISTORY_LIMIT);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function buildMeditationSpeechSegments(session) {
  if (!session) {
    return [];
  }

  return [session.intro, ...(session.guidedSteps || []), session.closing]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
}

export function formatMeditationDate(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDurationLabel(minutes) {
  return `${minutes} min`;
}

export function formatRemainingTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
