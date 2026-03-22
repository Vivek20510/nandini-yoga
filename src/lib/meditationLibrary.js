import yogaPose from "../assets/yoga-pose.png";
import yogaPoseAlt from "../assets/yoga-pose-3.png";

export const MEDITATION_LIBRARY_CATEGORIES = [
  "Stress & Anxiety",
  "Overthinking",
  "Sleep & Deep Rest",
  "Morning Reset",
  "Focus & Work Break",
  "Anger Release",
  "Breathwork Basics",
];

export const LIBRARY_STORAGE_KEYS = {
  favorites: "ybn_meditation_library_favorites_v1",
  recent: "ybn_meditation_library_recent_v1",
  continue: "ybn_meditation_continue_v1",
};

export const LIBRARY_AMBIENT_TRACKS = [
  { key: "rain", label: "Rain", src: "/meditation/ambient/rain.wav" },
  { key: "tanpura", label: "Tanpura", src: "/meditation/ambient/tanpura.wav" },
  { key: "flute", label: "Flute", src: null },
  { key: "silence", label: "Silence", src: null },
];

export const MEDITATION_AUDIO_SEGMENTS = [
{
  id: "intro-arrive",
  kind: "intro",
  label: "Aagman",
  language: "hi",
  src: "/meditation/audio/intro-arrive.mp3",
  durationSeconds: 26,
  textHi:
    "Aankhen komal roop se band kar lijiye. Saans ko badalne ki jaldi na karein. Sirf mehsoos kijiye ki aap yahan hain, surakshit hain, aur ab dheere dheere andar ki taraf laut rahe hain.",
  },
  {
    id: "ground-body",
    kind: "grounding",
    label: "Sharir ko sthir karna",
    language: "hi",
    src: "/meditation/audio/ground-body.mp3",
    durationSeconds: 28,
    textHi:
      "Apne pairon, kamar aur kandhon par dhyan laaiye. Jahan jahan sharir zameen ya kursi ko chhoo raha hai, wahan halka sa bhaar mehsoos kijiye. Sharir ko pakadne ki jagah usse samarthan milne dijiye.",
  },
  {
    id: "breath-soft-46",
    kind: "breath",
    label: "Saans 4-6",
    language: "hi",
    src: "/meditation/audio/breath-soft-46.mp3",
    durationSeconds: 32,
    textHi:
      "Ab naak se chaar ki ginti tak saans andar lijiye. Aur chhe ki ginti tak saans bahar chhodiye. Har exhale ko thoda lamba hone dijiye, jaise sharir bojh halka kar raha ho.",
  },
  {
    id: "breath-box",
    kind: "breath",
    label: "Box breath",
    language: "hi",
    src: "/meditation/audio/breath-box.mp3",
    durationSeconds: 32,
    textHi:
      "Chaar ginti mein saans lijiye, chaar ginti mein rokiye, chaar ginti mein chhodiye, aur chaar ginti ki shaant viram mein thehriye. Ginti ke saath ek samaan, sthir lehar banaiye.",
  },
  {
    id: "transition-soften",
    kind: "transition",
    label: "Komal badlaav",
    language: "hi",
    src: "/meditation/audio/transition-soften.mp3",
    durationSeconds: 18,
    textHi:
      "Agar mann bhatak raha ho to use pyar se wapas laaiye. Har baar wapas aana hi abhyas hai.",
  },
  {
    id: "stress-release",
    kind: "category",
    label: "Tanav mukt",
    language: "hi",
    src: "/meditation/audio/stress-release.mp3",
    durationSeconds: 36,
    textHi:
      "Apne maathay, daanton aur kandhon ko dheela padne dijiye. Har saans bahar nikalte waqt sochiye ki tanav sharir se pighal kar nikal raha hai.",
  },
  {
    id: "overthinking-clear",
    kind: "category",
    label: "Mann ko halka karna",
    language: "hi",
    src: "/meditation/audio/overthinking-clear.mp3",
    durationSeconds: 34,
    textHi:
      "Vicharon ko rokna zaroori nahi hai. Unhe aane aur jaane dijiye, jaise aasman mein badal. Aap vichar nahi, aap dekhne wale hain.",
  },
  {
    id: "sleep-rest",
    kind: "category",
    label: "Nidra ki taiyaari",
    language: "hi",
    src: "/meditation/audio/sleep-rest.mp3",
    durationSeconds: 38,
    textHi:
      "Aankhon ke ird gird, gale ke paas aur pet ke beech mulayamta mehsoos kijiye. Sharir ko yeh sandesh dijiye ki ab aaram sambhav hai.",
  },
  {
    id: "morning-rise",
    kind: "category",
    label: "Subah ka jagran",
    language: "hi",
    src: "/meditation/audio/morning-rise.mp3",
    durationSeconds: 30,
    textHi:
      "Saans ke saath sharir mein halka sa ujala aane dijiye. Reedh ki haddi ko narm lambai dijiye aur din ki shuruaat saaf man se kijiye.",
  },
  {
    id: "focus-center",
    kind: "category",
    label: "Ekagrata",
    language: "hi",
    src: "/meditation/audio/focus-center.mp3",
    durationSeconds: 34,
    textHi:
      "Dhyan ko sirf ek bindu par tikaaiye, shayad saans ki thandak ya naak ke dvaar par halka sparsh. Jitna saral, utna gahra.",
  },
  {
    id: "anger-cool",
    kind: "category",
    label: "Krodh ko thandak",
    language: "hi",
    src: "/meditation/audio/anger-cool.mp3",
    durationSeconds: 36,
    textHi:
      "Apni garam urja ko na dabaiye, na uske saath beh jaiye. Bas use saans ke saath dheere dheere thanda hone dijiye, jaise garm mitti par halki baarish.",
  },
  {
    id: "basics-awareness",
    kind: "category",
    label: "Mool saans jagrukta",
    language: "hi",
    src: "/meditation/audio/basics-awareness.mp3",
    durationSeconds: 32,
    textHi:
      "Saans jaisi hai vaise hi dekhte rahiye. Koi prayas nahi, koi zid nahi. Bas andar jaati aur bahar aati prerna ko mehsoos kijiye.",
  },
  {
    id: "closing-gratitude",
    kind: "closing",
    label: "Kritagyata samapan",
    language: "hi",
    src: "/meditation/audio/closing-gratitude.mp3",
    durationSeconds: 24,
    textHi:
      "Apne mann aur sharir ka dhanyavaad kijiye ki aapne kuch pal apne liye rakhe. Jab taiyar hon, dheere se aankhen kholiye aur is shaanti ko saath le chaliye.",
  },
];

export const MEDITATION_LIBRARY_SESSIONS = [
  {
    id: "stress-reset",
    slug: "stress-reset",
    title: "Stress Reset",
    titleHi: "तनाव से राहत",
    description: "A calming pause to settle a busy nervous system and soften bodily tension.",
    descriptionHi: "तनाव भरे दिन के बाद तंत्रिका तंत्र को शांत करने और शरीर की जकड़न नरम करने के लिए।",
    benefits: ["Shoulder and jaw softening", "Longer exhale rhythm", "Quick emotional reset"],
    category: "Stress & Anxiety",
    durationMinutes: 5,
    breathingPattern: { inhale: 4, hold: 0, exhale: 6, holdAfterExhale: 0, label: "4 in, 6 out" },
    coverImage: yogaPose,
    featured: true,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "ground-body", "breath-soft-46", "stress-release", "transition-soften", "closing-gratitude"],
    ambientDefaults: { track: "rain", volume: 0.22 },
    offlineEligible: true,
  },
  {
    id: "mind-clear",
    slug: "mind-clear",
    title: "Mind Clear Break",
    titleHi: "अतिविचार शांति",
    description: "A short guided pause to loosen mental loops and return to one steady anchor.",
    descriptionHi: "बहुत सोचने की आदत को नरम कर ध्यान को एक स्थिर बिंदु पर वापस लाने के लिए।",
    benefits: ["Less mental clutter", "Gentle concentration", "Workday reset"],
    category: "Overthinking",
    durationMinutes: 7,
    breathingPattern: { inhale: 4, hold: 2, exhale: 6, holdAfterExhale: 0, label: "4 in, 2 hold, 6 out" },
    coverImage: yogaPoseAlt,
    featured: true,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "breath-soft-46", "overthinking-clear", "focus-center", "transition-soften", "closing-gratitude"],
    ambientDefaults: { track: "tanpura", volume: 0.18 },
    offlineEligible: true,
  },
  {
    id: "sleep-rest-deep",
    slug: "sleep-rest-deep",
    title: "Deep Rest Before Sleep",
    titleHi: "गहरी नींद की तैयारी",
    description: "A bedtime sequence to slow the body and prepare for deep, restful sleep.",
    descriptionHi: "नींद से पहले शरीर और मन को धीमा कर गहरे विश्राम की तैयारी करने के लिए।",
    benefits: ["Bedtime calm", "Slower breath", "Soft release in the belly"],
    category: "Sleep & Deep Rest",
    durationMinutes: 10,
    breathingPattern: { inhale: 4, hold: 0, exhale: 8, holdAfterExhale: 0, label: "4 in, 8 out" },
    coverImage: yogaPose,
    featured: true,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "ground-body", "sleep-rest", "breath-soft-46", "transition-soften", "closing-gratitude"],
    ambientDefaults: { track: "flute", volume: 0.16 },
    offlineEligible: true,
  },
  {
    id: "morning-prana",
    slug: "morning-prana",
    title: "Morning Prana Reset",
    titleHi: "सुबह की नई ऊर्जा",
    description: "Wake up the breath gently and begin the day with clarity and warmth.",
    descriptionHi: "सुबह की शुरुआत कोमल जागरूकता और नई ऊर्जा के साथ करने के लिए।",
    benefits: ["Morning clarity", "Gentle alertness", "Uplifted posture"],
    category: "Morning Reset",
    durationMinutes: 5,
    breathingPattern: { inhale: 4, hold: 2, exhale: 4, holdAfterExhale: 2, label: "Balanced 4-2-4-2" },
    coverImage: yogaPoseAlt,
    featured: false,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "morning-rise", "breath-box", "focus-center", "closing-gratitude"],
    ambientDefaults: { track: "tanpura", volume: 0.16 },
    offlineEligible: true,
  },
  {
    id: "work-focus-pause",
    slug: "work-focus-pause",
    title: "Work Focus Pause",
    titleHi: "काम के बीच एकाग्रता विराम",
    description: "A practical midday reset for attention, posture, and mental steadiness.",
    descriptionHi: "काम के बीच ध्यान, बैठने की स्थिति और मानसिक स्थिरता को पुनः स्थापित करने के लिए।",
    benefits: ["Sharper focus", "Fewer mental jumps", "Desk-friendly reset"],
    category: "Focus & Work Break",
    durationMinutes: 3,
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4, label: "Box breath 4-4-4-4" },
    coverImage: yogaPoseAlt,
    featured: false,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "breath-box", "focus-center", "closing-gratitude"],
    ambientDefaults: { track: "silence", volume: 0 },
    offlineEligible: true,
  },
  {
    id: "cooling-anger-release",
    slug: "cooling-anger-release",
    title: "Cooling Anger Release",
    titleHi: "क्रोध से ठहराव",
    description: "Cool strong emotion without suppressing it and return to steadier ground.",
    descriptionHi: "तेज़ भावनाओं को दबाए बिना धीरे धीरे ठंडा कर स्थिरता में लौटने के लिए।",
    benefits: ["Cool down faster", "Space before reaction", "Longer exhale"],
    category: "Anger Release",
    durationMinutes: 7,
    breathingPattern: { inhale: 4, hold: 0, exhale: 7, holdAfterExhale: 1, label: "4 in, 7 out, 1 rest" },
    coverImage: yogaPose,
    featured: false,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "ground-body", "anger-cool", "breath-soft-46", "closing-gratitude"],
    ambientDefaults: { track: "rain", volume: 0.18 },
    offlineEligible: true,
  },
  {
    id: "breath-basics",
    slug: "breath-basics",
    title: "Breath Awareness Basics",
    titleHi: "सांस जागरूकता की शुरुआत",
    description: "A beginner-friendly introduction to observing breath without pressure.",
    descriptionHi: "शुरुआती साधकों के लिए बिना दबाव के सांस को देखना सीखने की सरल शुरुआत।",
    benefits: ["Beginner-friendly", "Easy daily habit", "Nervous system steadiness"],
    category: "Breathwork Basics",
    durationMinutes: 4,
    breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdAfterExhale: 0, label: "Even 4-4 breathing" },
    coverImage: yogaPoseAlt,
    featured: false,
    audioMode: "segmented_hindi",
    segmentIds: ["intro-arrive", "basics-awareness", "breath-soft-46", "closing-gratitude"],
    ambientDefaults: { track: "silence", volume: 0 },
    offlineEligible: true,
  },
];

function readJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLibrarySessionById(id) {
  return MEDITATION_LIBRARY_SESSIONS.find((item) => item.id === id) || null;
}

export function getSegmentById(id) {
  return MEDITATION_AUDIO_SEGMENTS.find((item) => item.id === id) || null;
}

export function getLibrarySegmentsForSession(session) {
  return (session?.segmentIds || []).map(getSegmentById).filter(Boolean);
}

export function getFeaturedLibrarySessions() {
  return MEDITATION_LIBRARY_SESSIONS.filter((item) => item.featured);
}

export function getRecommendedSessions(category, currentId) {
  return MEDITATION_LIBRARY_SESSIONS.filter(
    (item) => item.category === category && item.id !== currentId
  ).slice(0, 3);
}

export function loadLibraryFavorites() {
  return readJson(LIBRARY_STORAGE_KEYS.favorites, []);
}

export function toggleLibraryFavorite(sessionId) {
  const current = new Set(loadLibraryFavorites());
  if (current.has(sessionId)) {
    current.delete(sessionId);
  } else {
    current.add(sessionId);
  }
  const next = Array.from(current);
  writeJson(LIBRARY_STORAGE_KEYS.favorites, next);
  return next;
}

export function loadRecentLibrarySessions() {
  return readJson(LIBRARY_STORAGE_KEYS.recent, []);
}

export function saveRecentLibrarySession(entry) {
  const current = loadRecentLibrarySessions().filter((item) => item.sessionId !== entry.sessionId);
  const next = [entry, ...current].slice(0, 8);
  writeJson(LIBRARY_STORAGE_KEYS.recent, next);
  return next;
}

export function loadContinueListening() {
  return readJson(LIBRARY_STORAGE_KEYS.continue, null);
}

export function saveContinueListening(entry) {
  writeJson(LIBRARY_STORAGE_KEYS.continue, entry);
  return entry;
}

export function clearContinueListening() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LIBRARY_STORAGE_KEYS.continue);
}

export function getTotalSegmentDuration(session) {
  return getLibrarySegmentsForSession(session).reduce(
    (total, segment) => total + Number(segment.durationSeconds || 0),
    0
  );
}
