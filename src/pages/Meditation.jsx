import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Brain,
  History,
  LoaderCircle,
  Pause,
  Play,
  Sparkles,
  Square,
  Volume2,
  Waves,
} from "lucide-react";
import SEO from "../components/SEO";
import {
  AMBIENT_OPTIONS,
  MEDITATION_DURATIONS,
  MEDITATION_MOODS,
  buildMeditationSpeechSegments,
  formatDurationLabel,
  formatMeditationDate,
  formatRemainingTime,
  generateMeditation,
  loadMeditationHistory,
  saveMeditationToHistory,
} from "../lib/meditation";
import { PERSON_NAME, SITE_NAME, SITE_URL } from "../lib/site";

function getBreathingPhase(pattern, elapsedMs) {
  const inhale = pattern?.inhale || 0;
  const hold = pattern?.hold || 0;
  const exhale = pattern?.exhale || 0;
  const holdAfterExhale = pattern?.holdAfterExhale || 0;
  const totalSeconds = inhale + hold + exhale + holdAfterExhale;

  if (!totalSeconds) return "Breathe";

  const cycleSeconds = (elapsedMs / 1000) % totalSeconds;
  if (cycleSeconds < inhale) return "Inhale";
  if (cycleSeconds < inhale + hold) return "Hold";
  if (cycleSeconds < inhale + hold + exhale) return "Exhale";
  return "Rest";
}

function createAmbientEngine(type) {
  if (typeof window === "undefined") return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.03;
  master.connect(ctx.destination);
  const cleanup = [];

  if (type === "rain") {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.25;

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 800;
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    source.connect(filter);
    filter.connect(master);
    source.start();
    lfo.start();
    cleanup.push(() => source.stop(), () => lfo.stop());
  } else {
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.012 : 0.008;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      cleanup.push(() => oscillator.stop());
    });
  }

  return {
    async start() {
      if (ctx.state === "suspended") await ctx.resume();
    },
    stop() {
      cleanup.forEach((fn) => {
        try {
          fn();
        } catch {
          return null;
        }
        return null;
      });
      master.disconnect();
      ctx.close().catch(() => {});
    },
  };
}

const Meditation = () => {
  const [selectedMood, setSelectedMood] = useState("anxious");
  const [feelingText, setFeelingText] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [ambientType, setAmbientType] = useState("rain");
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [remainingMs, setRemainingMs] = useState(durationMinutes * 60 * 1000);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [elapsedBreathingMs, setElapsedBreathingMs] = useState(0);
  const timerRef = useRef(null);
  const timerEndsAtRef = useRef(0);
  const speechStateRef = useRef({ cancelled: false, index: 0 });
  const ambientEngineRef = useRef(null);

  const speechSegments = useMemo(() => buildMeditationSpeechSegments(session), [session]);
  const breathingPattern = session?.breathingPattern || {
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdAfterExhale: 0,
    label: "Inhale softly, exhale longer",
  };

  useEffect(() => {
    setHistory(loadMeditationHistory());
    setSpeechSupported(
      typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof window.SpeechSynthesisUtterance !== "undefined"
    );
  }, []);

  useEffect(() => {
    if (!session) setRemainingMs(durationMinutes * 60 * 1000);
  }, [durationMinutes, session]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (ambientEngineRef.current) {
        ambientEngineRef.current.stop();
        ambientEngineRef.current = null;
      }
    };
  }, []);

  const meditationDescription =
    "Create a personalized guided meditation based on how you feel right now, with a calming script, breath pattern, voice playback, and a mindful timer.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mood-Based Meditation",
    description: meditationDescription,
    url: `${SITE_URL}/meditation`,
    about: { "@type": "Person", name: PERSON_NAME },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopAmbient() {
    if (ambientEngineRef.current) {
      ambientEngineRef.current.stop();
      ambientEngineRef.current = null;
    }
  }

  function cancelSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    speechStateRef.current.cancelled = true;
    window.speechSynthesis.cancel();
  }

  function stopPlayback() {
    clearTimer();
    cancelSpeech();
    stopAmbient();
    setStatus(session ? "ready" : "idle");
    setCurrentSegmentIndex(0);
    setElapsedBreathingMs(0);
    setRemainingMs((session?.durationMinutes || durationMinutes) * 60 * 1000);
  }

  useEffect(() => {
    if (!ambientEnabled || status === "idle" || status === "error" || status === "ready" || !session) {
      stopAmbient();
      return undefined;
    }

    const engine = createAmbientEngine(ambientType);
    ambientEngineRef.current = engine;

    if (engine) {
      engine.start();
    }

    return () => {
      if (ambientEngineRef.current) {
        ambientEngineRef.current.stop();
        ambientEngineRef.current = null;
      }
    };
  }, [ambientEnabled, ambientType, session, status]);

  function startTimer(fromMs) {
    clearTimer();
    timerEndsAtRef.current = Date.now() + fromMs;
    setRemainingMs(fromMs);

    timerRef.current = window.setInterval(() => {
      const nextRemaining = Math.max(0, timerEndsAtRef.current - Date.now());
      setRemainingMs(nextRemaining);
      setElapsedBreathingMs(((session?.durationMinutes || durationMinutes) * 60 * 1000) - nextRemaining);

      if (nextRemaining <= 0) {
        clearTimer();
        cancelSpeech();
        stopAmbient();
        setStatus("ready");
        setCurrentSegmentIndex(0);
      }
    }, 250);
  }

  function speakFromIndex(startIndex) {
    if (!speechSupported || !voiceEnabled || speechSegments.length === 0) return;

    speechStateRef.current.cancelled = false;
    speechStateRef.current.index = startIndex;

    const speakNext = (index) => {
      if (speechStateRef.current.cancelled || index >= speechSegments.length) return;

      speechStateRef.current.index = index;
      setCurrentSegmentIndex(index);

      const utterance = new window.SpeechSynthesisUtterance(speechSegments[index]);
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.onend = () => {
        if (!speechStateRef.current.cancelled) speakNext(index + 1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext(startIndex);
  }

  function beginPlayback(startIndex = 0, fromMs = null) {
    const totalMs = (session?.durationMinutes || durationMinutes) * 60 * 1000;
    const nextRemaining = fromMs ?? totalMs;

    setStatus("playing");
    setCurrentSegmentIndex(startIndex);
    setElapsedBreathingMs(totalMs - nextRemaining);
    startTimer(nextRemaining);

    if (voiceEnabled) {
      cancelSpeech();
      speakFromIndex(startIndex);
    }
  }

  function handlePause() {
    const nextIndex = Math.min(currentSegmentIndex + 1, Math.max(speechSegments.length - 1, 0));
    clearTimer();
    cancelSpeech();
    stopAmbient();
    setStatus("paused");
    setCurrentSegmentIndex(nextIndex);
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    clearTimer();
    cancelSpeech();
    stopAmbient();
    setCurrentSegmentIndex(0);
    setElapsedBreathingMs(0);
    setRemainingMs(durationMinutes * 60 * 1000);
    setStatus("generating");

    try {
      const nextSession = await generateMeditation({
        moodPreset: selectedMood,
        feelingText: feelingText.trim(),
        durationMinutes,
      });

      setSession(nextSession);
      setHistory(saveMeditationToHistory(nextSession));
      setRemainingMs(nextSession.durationMinutes * 60 * 1000);
      setElapsedBreathingMs(0);
      setCurrentSegmentIndex(0);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "We could not create a meditation right now.");
      setStatus("error");
    }
  }

  function handleLoadFromHistory(item) {
    stopPlayback();
    setSession(item);
    setSelectedMood(
      MEDITATION_MOODS.find((entry) => entry.label.toLowerCase() === item.moodLabel.toLowerCase())?.key ||
        selectedMood
    );
    setFeelingText("");
    setDurationMinutes(item.durationMinutes);
    setRemainingMs(item.durationMinutes * 60 * 1000);
    setElapsedBreathingMs(0);
    setCurrentSegmentIndex(0);
    setError("");
    setStatus("ready");
  }

  const phaseLabel = getBreathingPhase(breathingPattern, elapsedBreathingMs);
  const totalMs = (session?.durationMinutes || durationMinutes) * 60 * 1000;
  const progressPercent = totalMs ? ((totalMs - remainingMs) / totalMs) * 100 : 0;

  return (
    <div className="bg-[#F7F3EA] text-[#1D3C52]">
      <SEO title="Mood-Based Meditation" description={meditationDescription} canonicalPath="/meditation" schema={schema} />

      <style>{`
        @keyframes meditationPulse {
          0% { transform: scale(0.92); opacity: 0.72; }
          35% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.92); opacity: 0.72; }
        }
      `}</style>

      <section className="relative overflow-hidden bg-[#F1ECDD]">
        <div className="absolute left-[-10%] top-16 h-56 w-56 rounded-full bg-[#E0D4BF]/60 blur-3xl" />
        <div className="absolute right-[-5%] top-10 h-72 w-72 rounded-full bg-[#D6E0DE]/65 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 md:px-12 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Sparkles size={14} />
                Personalized Meditation
              </span>
              <h1 className="mt-6 text-[clamp(2.3rem,7vw,4.6rem)] leading-[1.05] tracking-[-0.02em] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Meet your mind
                <br />
                <em className="italic text-[#6B8A9A]">with a custom guided pause</em>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.9] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Share how you feel right now and receive a calm, tailored meditation with breath pacing, a focus point, and optional voice guidance to help you settle.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-full bg-[#1D3C52] px-6 py-3 text-[12px] uppercase tracking-[0.1em] text-white transition hover:bg-[#274F69]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Work With Nandini
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-4 py-3 text-[12px] uppercase tracking-[0.1em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Brain size={14} />
                  2 to 10 minute sessions
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E1D7C5] bg-white/85 p-6 shadow-[0_25px_80px_rgba(29,60,82,0.08)] backdrop-blur">
              <form className="space-y-6" onSubmit={handleGenerate}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Choose a feeling
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {MEDITATION_MOODS.map((mood) => {
                      const active = selectedMood === mood.key;
                      return (
                        <button
                          key={mood.key}
                          type="button"
                          onClick={() => setSelectedMood(mood.key)}
                          className={`rounded-full px-4 py-2.5 text-[13px] transition ${active ? "bg-[#1D3C52] text-white" : "border border-[#D8D0BF] bg-[#FBF9F4] text-[#5A7485] hover:border-[#9BB0BB]"}`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {mood.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="feelingText" className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Or type it in your own words
                  </label>
                  <textarea
                    id="feelingText"
                    rows="3"
                    value={feelingText}
                    onChange={(event) => setFeelingText(event.target.value)}
                    placeholder="Example: I feel scattered after a long day and need grounding."
                    className="mt-3 w-full rounded-[24px] border border-[#D8D0BF] bg-[#FBF9F4] px-4 py-3 text-sm leading-7 text-[#1D3C52] outline-none transition focus:border-[#8BA5B5]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Meditation length
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {MEDITATION_DURATIONS.map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setDurationMinutes(minutes)}
                        className={`rounded-full px-4 py-2.5 text-[13px] transition ${durationMinutes === minutes ? "bg-[#DCE8E6] text-[#1D3C52]" : "border border-[#D8D0BF] bg-white text-[#5A7485] hover:border-[#9BB0BB]"}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {formatDurationLabel(minutes)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center justify-between rounded-[22px] border border-[#D8D0BF] bg-[#FBF9F4] px-4 py-3">
                    <span className="text-[13px] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Voice playback
                    </span>
                    <input type="checkbox" checked={voiceEnabled} onChange={() => setVoiceEnabled((value) => !value)} disabled={!speechSupported} className="h-4 w-4 accent-[#1D3C52]" />
                  </label>
                  <label className="flex items-center justify-between rounded-[22px] border border-[#D8D0BF] bg-[#FBF9F4] px-4 py-3">
                    <span className="text-[13px] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Ambient sound
                    </span>
                    <input type="checkbox" checked={ambientEnabled} onChange={() => setAmbientEnabled((value) => !value)} className="h-4 w-4 accent-[#1D3C52]" />
                  </label>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Ambient mood
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {AMBIENT_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setAmbientType(option.key)}
                        className={`rounded-full px-4 py-2.5 text-[13px] transition ${ambientType === option.key ? "bg-[#E6EFEF] text-[#1D3C52]" : "border border-[#D8D0BF] bg-white text-[#5A7485] hover:border-[#9BB0BB]"}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!speechSupported && (
                  <div className="rounded-[20px] border border-[#E6D8C8] bg-[#FFF7EF] px-4 py-3 text-sm text-[#7A5B49]">
                    Voice playback is not available in this browser, but you can still generate, read, and time the meditation.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "generating" || (!selectedMood && !feelingText.trim())}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1D3C52] px-6 py-3.5 text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-[#274F69] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {status === "generating" ? <><LoaderCircle size={16} className="animate-spin" />Creating your meditation</> : <><Sparkles size={16} />Generate meditation</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:px-12 lg:px-20">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {error && (
              <div className="rounded-[26px] border border-[#E1CFC4] bg-[#FFF5F3] px-5 py-4 text-[#8A544B]">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
                </div>
              </div>
            )}

            <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Guided playback</p>
                  <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {session?.title || "Your meditation will appear here"}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.8] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {session ? `${session.moodLabel} · ${formatDurationLabel(session.durationMinutes)} · ${session.tone}` : "Choose a feeling, set your duration, and generate a personalized session."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => beginPlayback(0)} disabled={!session || status === "generating"} className="inline-flex items-center gap-2 rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white disabled:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Play size={15} />
                    Play
                  </button>
                  <button type="button" onClick={handlePause} disabled={status !== "playing"} className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#5A7485] disabled:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Pause size={15} />
                    Pause
                  </button>
                  <button type="button" onClick={() => beginPlayback(currentSegmentIndex, remainingMs)} disabled={status !== "paused"} className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#5A7485] disabled:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Volume2 size={15} />
                    Resume
                  </button>
                  <button type="button" onClick={stopPlayback} disabled={!session} className="inline-flex items-center gap-2 rounded-full border border-[#E1CFC4] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#8A544B] disabled:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Square size={15} />
                    Stop
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div className="flex flex-col items-center rounded-[30px] bg-[#F6F3EC] px-6 py-8 text-center">
                  <div
                    className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[#D7D7D2] bg-[radial-gradient(circle_at_center,_#E8F1EF_0%,_#DDE7E4_45%,_#F7F3EA_100%)]"
                    style={{
                      animation: session ? `meditationPulse ${breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale + breathingPattern.holdAfterExhale || 10}s ease-in-out infinite` : "none",
                    }}
                  >
                    <div className="absolute inset-5 rounded-full border border-white/60" />
                    <div className="absolute inset-10 rounded-full border border-[#B7CBCD]/55" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{phaseLabel}</p>
                      <p className="mt-2 text-3xl text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{formatRemainingTime(remainingMs)}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-[12px] uppercase tracking-[0.12em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {session ? breathingPattern.label : "Breathing pattern will appear here"}
                  </p>

                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-[#7D9CAA] transition-[width] duration-300" style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Focus point</p>
                    <p className="mt-3 text-[15px] leading-[1.8] text-[#1D3C52]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{session?.focusPoint || "Breath, body, and steadiness."}</p>
                  </div>
                  <div className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tone</p>
                    <p className="mt-3 text-[15px] leading-[1.8] text-[#1D3C52]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{session?.tone || "Gentle, grounding, and spacious."}</p>
                  </div>
                  <div className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5 sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Breathing pattern</p>
                    <p className="mt-3 text-[15px] leading-[1.8] text-[#1D3C52]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {session ? `Inhale ${breathingPattern.inhale}s${breathingPattern.hold ? `, hold ${breathingPattern.hold}s` : ""}, exhale ${breathingPattern.exhale}s${breathingPattern.holdAfterExhale ? `, rest ${breathingPattern.holdAfterExhale}s` : ""}.` : "The AI-generated breath rhythm will appear here."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Meditation script</p>
                  <h3 className="mt-3 text-[1.8rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Text guidance</h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Waves size={14} />
                  {ambientEnabled ? `${ambientType} ambience on` : "Ambient sound off"}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="rounded-[24px] bg-[#F8F4EC] p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Opening</p>
                  <p className="mt-3 text-[15px] leading-[1.9] text-[#4E6677]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{session?.intro || "Your personalized opening will appear here after generation."}</p>
                </div>

                <div className="grid gap-4">
                  {(session?.guidedSteps?.length ? session.guidedSteps : ["Your guided steps will appear here, one gentle passage at a time."]).map((step, index) => (
                    <div key={`${index}-${step.slice(0, 18)}`} className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Step {index + 1}</p>
                      <p className="mt-3 text-[15px] leading-[1.9] text-[#4E6677]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[24px] bg-[#EDF3F1] p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Closing</p>
                  <p className="mt-3 text-[15px] leading-[1.9] text-[#365769]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{session?.closing || "The closing reflection will appear here."}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF3F1] text-[#1D3C52]">
                  <History size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Recent sessions</p>
                  <h3 className="mt-1 text-[1.5rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Meditation history</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {history.length === 0 && (
                  <div className="rounded-[24px] bg-[#F8F4EC] p-5 text-sm leading-7 text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Your recent meditations will be saved locally on this device so you can revisit them anytime.
                  </div>
                )}

                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLoadFromHistory(item)}
                    className="block w-full rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5 text-left transition hover:border-[#9BB0BB]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatMeditationDate(item.generatedAt)}</p>
                    <h4 className="mt-2 text-[1.05rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.moodLabel} · {formatDurationLabel(item.durationMinutes)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#D6DFDC] bg-[#EAF2F0] p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>A softer next step</p>
              <h3 className="mt-3 text-[1.7rem] leading-[1.15] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Want a guided practice designed by a teacher?
              </h3>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#4E6677]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Use this meditation for daily support, then reach out if you want private guidance in breathwork, meditation, or a fuller yoga routine.
              </p>
              <Link to="/contact" className="mt-6 inline-flex rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Contact Nandini
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Meditation;
