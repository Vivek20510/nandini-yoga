import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  LoaderCircle,
  Pause,
  Play,
  Sparkles,
  Square,
  WandSparkles,
} from "lucide-react";
import SEO from "../components/SEO";
import BreathingVisualizer from "../components/meditation/BreathingVisualizer";
import MeditationLibrarySurface from "../components/meditation/MeditationLibrarySurface";
import {
  MEDITATION_DURATIONS,
  MEDITATION_MOODS,
  buildMeditationSpeechSegments,
  formatDurationLabel,
  formatRemainingTime,
  generateMeditation,
  loadMeditationHistory,
  saveMeditationToHistory,
} from "../lib/meditation";
import {
  clearContinueListening,
  getFeaturedLibrarySessions,
  getLibrarySessionById,
  getLibrarySegmentsForSession,
  getRecommendedSessions,
  LIBRARY_AMBIENT_TRACKS,
  loadContinueListening,
  loadLibraryFavorites,
  loadRecentLibrarySessions,
  MEDITATION_LIBRARY_CATEGORIES,
  MEDITATION_LIBRARY_SESSIONS,
  saveContinueListening,
  saveRecentLibrarySession,
  toggleLibraryFavorite,
} from "../lib/meditationLibrary";
import {
  buildSegmentBoundaries,
  findBoundaryAtTime,
  getSessionDurationMs,
  preloadAudioMetadata,
} from "../lib/meditationAudioEngine";
import {
  isMeditationAssetCached,
  warmMeditationOfflineCache,
} from "../lib/meditationOffline";
import { PERSON_NAME, SITE_NAME, SITE_URL } from "../lib/site";

function findHindiVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang?.toLowerCase().startsWith("hi"));
}

function waitForAudioReady(audio) {
  if (!audio || audio.readyState >= 1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("canplay", handleLoaded);
      audio.removeEventListener("error", handleError);
    };
    const handleLoaded = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("Audio failed to load"));
    };

    audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
    audio.addEventListener("canplay", handleLoaded, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.load();
  });
}

function resolveAudioSrc(src) {
  if (!src || typeof window === "undefined") {
    return src || "";
  }

  return new URL(src, window.location.origin).href;
}

const SEEK_JUMP_MS = 30000;

const Meditation = () => {
  const featuredLibrarySessions = useMemo(() => getFeaturedLibrarySessions(), []);
  const initialLibrarySession = featuredLibrarySessions[0] || MEDITATION_LIBRARY_SESSIONS[0];

  const [activeSurface, setActiveSurface] = useState("library");
  const [selectedMood, setSelectedMood] = useState("anxious");
  const [feelingText, setFeelingText] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [remainingMs, setRemainingMs] = useState(durationMinutes * 60 * 1000);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [elapsedBreathingMs, setElapsedBreathingMs] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [continueEntry, setContinueEntry] = useState(null);
  const [selectedLibrarySession, setSelectedLibrarySession] = useState(initialLibrarySession);
  const [isLibraryPlaying, setIsLibraryPlaying] = useState(false);
  const [isLibraryPaused, setIsLibraryPaused] = useState(false);
  const [isLibrarySeeking, setIsLibrarySeeking] = useState(false);
  const [isLibrarySwitchingSegment, setIsLibrarySwitchingSegment] = useState(false);
  const [isLibraryMetadataLoading, setIsLibraryMetadataLoading] = useState(true);
  const [librarySegmentIndex, setLibrarySegmentIndex] = useState(0);
  const [libraryElapsedMs, setLibraryElapsedMs] = useState(0);
  const [libraryRemainingMs, setLibraryRemainingMs] = useState(0);
  const [librarySessionDurationMs, setLibrarySessionDurationMs] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [ambientTrack, setAmbientTrack] = useState(initialLibrarySession.ambientDefaults.track);
  const [ambientVolume, setAmbientVolume] = useState(initialLibrarySession.ambientDefaults.volume);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isDownloadingOffline, setIsDownloadingOffline] = useState(false);
  const [segmentDurationsById, setSegmentDurationsById] = useState({});

  const aiTimerRef = useRef(null);
  const aiTimerEndsAtRef = useRef(0);
  const aiSpeechRef = useRef({ cancelled: false });
  const librarySpeechRef = useRef({ cancelled: false });
  const spokenAudioRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const preloadedAudioBySrcRef = useRef(new Map());
  const segmentDurationsBySrcRef = useRef({});
  const hindiVoiceRef = useRef(null);
  const selectedLibrarySessionRef = useRef(initialLibrarySession);
  const librarySegmentsRef = useRef([]);
  const segmentBoundariesRef = useRef([]);
  const totalLibraryMsRef = useRef(0);
  const libraryElapsedMsRef = useRef(0);
  const librarySegmentIndexRef = useRef(0);
  const isLibraryPlayingRef = useRef(false);
  const isLibraryPausedRef = useRef(false);
  const playbackRateRef = useRef(1);
  const voiceVolumeRef = useRef(1);
  const playRequestIdRef = useRef(0);
  const ttsTickRef = useRef(null);

  const speechSegments = useMemo(() => buildMeditationSpeechSegments(session), [session]);
  const breathingPattern = session?.breathingPattern || {
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdAfterExhale: 0,
    label: "Inhale softly, exhale longer",
  };
  const filteredLibrarySessions = useMemo(
    () =>
      selectedCategory === "All"
        ? MEDITATION_LIBRARY_SESSIONS
        : MEDITATION_LIBRARY_SESSIONS.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  );
  const librarySegments = useMemo(
    () => getLibrarySegmentsForSession(selectedLibrarySession),
    [selectedLibrarySession]
  );
  const segmentBoundaries = useMemo(
    () => buildSegmentBoundaries(librarySegments, segmentDurationsById),
    [librarySegments, segmentDurationsById]
  );
  const totalLibraryMs = useMemo(
    () => getSessionDurationMs(librarySegments, segmentDurationsById),
    [librarySegments, segmentDurationsById]
  );
  const recentSessions = useMemo(
    () =>
      recentEntries
        .map((entry) => getLibrarySessionById(entry.sessionId))
        .filter(Boolean)
        .slice(0, 3),
    [recentEntries]
  );
  const continueSession = useMemo(() => {
    if (!continueEntry?.sessionId) {
      return null;
    }

    const base = getLibrarySessionById(continueEntry.sessionId);
    return base ? { ...base, remainingMs: continueEntry.remainingMs || 0 } : null;
  }, [continueEntry]);
  const recommendedSessions = useMemo(
    () => getRecommendedSessions(selectedLibrarySession.category, selectedLibrarySession.id),
    [selectedLibrarySession]
  );

  useEffect(() => {
    selectedLibrarySessionRef.current = selectedLibrarySession;
  }, [selectedLibrarySession]);

  useEffect(() => {
    librarySegmentsRef.current = librarySegments;
    segmentBoundariesRef.current = segmentBoundaries;
    totalLibraryMsRef.current = totalLibraryMs;
    setLibrarySessionDurationMs(totalLibraryMs);
  }, [librarySegments, segmentBoundaries, totalLibraryMs]);

  useEffect(() => {
    libraryElapsedMsRef.current = libraryElapsedMs;
  }, [libraryElapsedMs]);

  useEffect(() => {
    librarySegmentIndexRef.current = librarySegmentIndex;
  }, [librarySegmentIndex]);

  useEffect(() => {
    isLibraryPlayingRef.current = isLibraryPlaying;
  }, [isLibraryPlaying]);

  useEffect(() => {
    isLibraryPausedRef.current = isLibraryPaused;
  }, [isLibraryPaused]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
    if (spokenAudioRef.current) {
      spokenAudioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    voiceVolumeRef.current = voiceVolume;
    if (spokenAudioRef.current) {
      spokenAudioRef.current.volume = voiceVolume;
    }
  }, [voiceVolume]);

  useEffect(() => {
    setHistory(loadMeditationHistory());
    setFavorites(loadLibraryFavorites());
    setRecentEntries(loadRecentLibrarySessions());
    setContinueEntry(loadContinueListening());
    setSpeechSupported(
      typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof window.SpeechSynthesisUtterance !== "undefined"
    );
    hindiVoiceRef.current = findHindiVoice();
    isMeditationAssetCached("/meditation/audio/intro-arrive.mp3").then(setOfflineReady);
  }, []);

  useEffect(() => {
    if (!session) {
      setRemainingMs(durationMinutes * 60 * 1000);
    }
  }, [durationMinutes, session]);

  function updateLibraryProgress(segmentIndex, offsetMs, persist = true) {
    const boundaries = segmentBoundariesRef.current;
    const safeIndex = Math.max(0, Math.min(segmentIndex, Math.max(boundaries.length - 1, 0)));
    const boundary = boundaries[safeIndex];
    const nextElapsed = boundary
      ? Math.max(0, Math.min(totalLibraryMsRef.current, boundary.startMs + Math.max(0, offsetMs)))
      : 0;

    librarySegmentIndexRef.current = safeIndex;
    libraryElapsedMsRef.current = nextElapsed;
    setLibrarySegmentIndex(safeIndex);
    setLibraryElapsedMs(nextElapsed);
    setLibraryRemainingMs(Math.max(0, totalLibraryMsRef.current - nextElapsed));

    if (persist) {
      const next = {
        sessionId: selectedLibrarySessionRef.current.id,
        elapsedMs: nextElapsed,
        remainingMs: Math.max(0, totalLibraryMsRef.current - nextElapsed),
        segmentIndex: safeIndex,
      };
      saveContinueListening(next);
      setContinueEntry(next);
    }
  }

  function saveRecentListen() {
    saveRecentLibrarySession({
      sessionId: selectedLibrarySessionRef.current.id,
      playedAt: new Date().toISOString(),
      category: selectedLibrarySessionRef.current.category,
    });
    setRecentEntries(loadRecentLibrarySessions());
  }

  function clearAiTimer() {
    if (aiTimerRef.current) {
      window.clearInterval(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }

  function cancelAiSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    aiSpeechRef.current.cancelled = true;
    window.speechSynthesis.cancel();
  }

  function stopAiPlayback() {
    clearAiTimer();
    cancelAiSpeech();
    setStatus(session ? "ready" : "idle");
    setCurrentSegmentIndex(0);
    setElapsedBreathingMs(0);
    setRemainingMs((session?.durationMinutes || durationMinutes) * 60 * 1000);
  }

  function startAiTimer(fromMs) {
    clearAiTimer();
    aiTimerEndsAtRef.current = Date.now() + fromMs;
    setRemainingMs(fromMs);
    aiTimerRef.current = window.setInterval(() => {
      const nextRemaining = Math.max(0, aiTimerEndsAtRef.current - Date.now());
      setRemainingMs(nextRemaining);
      setElapsedBreathingMs(
        (session?.durationMinutes || durationMinutes) * 60 * 1000 - nextRemaining
      );
      if (nextRemaining <= 0) {
        clearAiTimer();
        cancelAiSpeech();
        setStatus("ready");
        setCurrentSegmentIndex(0);
      }
    }, 250);
  }

  function speakAiFromIndex(startIndex) {
    if (!speechSupported || speechSegments.length === 0) {
      return;
    }

    aiSpeechRef.current.cancelled = false;

    const speakNext = (index) => {
      if (aiSpeechRef.current.cancelled || index >= speechSegments.length) {
        return;
      }

      setCurrentSegmentIndex(index);
      const utterance = new window.SpeechSynthesisUtterance(speechSegments[index]);
      utterance.rate = 0.92;
      utterance.onend = () => {
        if (!aiSpeechRef.current.cancelled) {
          speakNext(index + 1);
        }
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext(startIndex);
  }

  function beginAiPlayback(startIndex = 0, fromMs = null) {
    stopLibraryPlayback({ resetPosition: false, clearSaved: false });
    const totalMs = (session?.durationMinutes || durationMinutes) * 60 * 1000;
    const nextRemaining = fromMs ?? totalMs;
    setStatus("playing");
    setCurrentSegmentIndex(startIndex);
    setElapsedBreathingMs(totalMs - nextRemaining);
    startAiTimer(nextRemaining);
    speakAiFromIndex(startIndex);
  }

  function pauseAiPlayback() {
    const nextIndex = Math.min(currentSegmentIndex + 1, Math.max(speechSegments.length - 1, 0));
    clearAiTimer();
    cancelAiSpeech();
    setStatus("paused");
    setCurrentSegmentIndex(nextIndex);
  }

  function clearTtsTimer() {
    if (ttsTickRef.current) {
      window.clearInterval(ttsTickRef.current);
      ttsTickRef.current = null;
    }
  }

  function stopLibrarySpeech() {
    librarySpeechRef.current.cancelled = true;
    clearTtsTimer();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function preloadUpcomingSegments(startIndex) {
    librarySegmentsRef.current.slice(startIndex, startIndex + 3).forEach((segment) => {
      if (segment?.src) {
        preloadAudioMetadata(
          segment.src,
          preloadedAudioBySrcRef,
          segmentDurationsBySrcRef
        ).catch(() => null);
      }
    });
  }

  function resetLibraryPosition() {
    librarySegmentIndexRef.current = 0;
    libraryElapsedMsRef.current = 0;
    setLibrarySegmentIndex(0);
    setLibraryElapsedMs(0);
    setLibraryRemainingMs(totalLibraryMsRef.current);
  }

  function finishLibraryPlayback() {
    playRequestIdRef.current += 1;
    stopLibrarySpeech();
    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
      spokenAudioRef.current.currentTime = 0;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    setIsLibraryPlaying(false);
    setIsLibraryPaused(false);
    setIsLibrarySeeking(false);
    setIsLibrarySwitchingSegment(false);
    resetLibraryPosition();
    clearContinueListening();
    setContinueEntry(null);
  }

  function stopLibraryPlayback(options = {}) {
    const { resetPosition = true, clearSaved = true } = options;

    playRequestIdRef.current += 1;
    stopLibrarySpeech();
    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
      spokenAudioRef.current.currentTime = 0;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      if (resetPosition) {
        ambientAudioRef.current.currentTime = 0;
      }
    }

    setIsLibraryPlaying(false);
    setIsLibraryPaused(false);
    setIsLibrarySeeking(false);
    setIsLibrarySwitchingSegment(false);

    if (resetPosition) {
      resetLibraryPosition();
    }

    if (clearSaved) {
      clearContinueListening();
      setContinueEntry(null);
    }
  }

  function pauseLibraryPlayback() {
    stopLibrarySpeech();
    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    setIsLibraryPlaying(false);
    setIsLibraryPaused(true);
  }

  async function playFallbackTtsSegment(segment, index, offsetMs, autoplay) {
    updateLibraryProgress(index, offsetMs);
    if (!autoplay || !speechSupported || !segment?.textHi) {
      return;
    }

    librarySpeechRef.current.cancelled = false;
    setIsLibrarySwitchingSegment(false);

    const boundary = segmentBoundariesRef.current[index];
    const ttsDurationMs = boundary?.durationMs || Number(segment.durationSeconds || 0) * 1000;
    const startedAt = Date.now() - offsetMs;

    const utterance = new window.SpeechSynthesisUtterance(segment.textHi);
    utterance.lang = "hi-IN";
    utterance.rate = playbackRateRef.current;
    utterance.volume = voiceVolumeRef.current;
    if (hindiVoiceRef.current) {
      utterance.voice = hindiVoiceRef.current;
    }

    utterance.onend = () => {
      clearTtsTimer();
      if (librarySpeechRef.current.cancelled || !isLibraryPlayingRef.current) {
        return;
      }
      playLibraryAtIndex(index + 1, 0, true);
    };

    clearTtsTimer();
    ttsTickRef.current = window.setInterval(() => {
      const nextOffset = Math.min(ttsDurationMs, Date.now() - startedAt);
      updateLibraryProgress(index, nextOffset);
      if (nextOffset >= ttsDurationMs) {
        clearTtsTimer();
      }
    }, 200);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function playLibraryAtIndex(index, offsetMs = 0, autoplay = true) {
    const segments = librarySegmentsRef.current;
    if (!segments.length) {
      return;
    }

    if (index >= segments.length) {
      finishLibraryPlayback();
      return;
    }

    const segment = segments[index];
    const boundary = segmentBoundariesRef.current[index];
    const boundedOffset = Math.max(
      0,
      Math.min(offsetMs, Math.max(0, (boundary?.durationMs || 0) - 60))
    );
    const requestId = ++playRequestIdRef.current;

    setIsLibrarySeeking(false);
    setIsLibrarySwitchingSegment(true);
    stopLibrarySpeech();
    preloadUpcomingSegments(index);
    updateLibraryProgress(index, boundedOffset);

    if (!segment?.src) {
      await playFallbackTtsSegment(segment, index, boundedOffset, autoplay);
      return;
    }

    const spokenAudio = spokenAudioRef.current;
    if (!spokenAudio) {
      return;
    }

    spokenAudio.pause();
    spokenAudio.volume = voiceVolumeRef.current;
    spokenAudio.playbackRate = playbackRateRef.current;

    try {
      await preloadAudioMetadata(
        segment.src,
        preloadedAudioBySrcRef,
        segmentDurationsBySrcRef
      );
      if (requestId !== playRequestIdRef.current) {
        return;
      }

      const nextSrc = resolveAudioSrc(segment.src);
      if (spokenAudio.src !== nextSrc) {
        spokenAudio.src = segment.src;
      }

      await waitForAudioReady(spokenAudio);
      if (requestId !== playRequestIdRef.current) {
        return;
      }

      spokenAudio.currentTime = Math.max(0, boundedOffset / 1000);
      if (autoplay) {
        await spokenAudio.play().catch(() => {});
      }
      setIsLibrarySwitchingSegment(false);
    } catch {
      setIsLibrarySwitchingSegment(false);
      await playFallbackTtsSegment(segment, index, boundedOffset, autoplay);
    }
  }

  async function playLibraryAtElapsed(nextElapsedMs, autoplay = true) {
    const boundedElapsed = Math.max(0, Math.min(totalLibraryMsRef.current, nextElapsedMs));
    const { index, offsetMs } = findBoundaryAtTime(segmentBoundariesRef.current, boundedElapsed);
    await playLibraryAtIndex(index, offsetMs, autoplay);
  }

  async function startLibraryPlayback(startMs = libraryElapsedMsRef.current) {
    stopAiPlayback();
    if (!librarySegmentsRef.current.length || isLibraryMetadataLoading) {
      return;
    }

    saveRecentListen();
    setIsLibraryPlaying(true);
    setIsLibraryPaused(false);
    await playLibraryAtElapsed(startMs, true);
  }

  function toggleLibraryPlayback() {
    if (isLibraryMetadataLoading || isLibrarySeeking || isLibrarySwitchingSegment) {
      return;
    }

    if (isLibraryPlaying) {
      pauseLibraryPlayback();
      return;
    }

    startLibraryPlayback(libraryElapsedMsRef.current);
  }

  async function seekLibraryPlayback(nextElapsedMs) {
    if (isLibraryMetadataLoading || !segmentBoundariesRef.current.length) {
      return;
    }

    const shouldResume = isLibraryPlayingRef.current;
    setIsLibrarySeeking(true);

    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
    }
    stopLibrarySpeech();
    await playLibraryAtElapsed(nextElapsedMs, shouldResume);

    if (!shouldResume) {
      setIsLibraryPlaying(false);
      setIsLibraryPaused(true);
    }
    setIsLibrarySeeking(false);
  }

  function jumpLibraryPlayback(deltaMs) {
    seekLibraryPlayback(libraryElapsedMsRef.current + deltaMs);
  }

  async function handleDownloadOffline() {
    setIsDownloadingOffline(true);
    const ok = await warmMeditationOfflineCache();
    setOfflineReady(ok);
    setIsDownloadingOffline(false);
  }

  function handleToggleFavorite(sessionId) {
    setFavorites(toggleLibraryFavorite(sessionId));
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    clearAiTimer();
    cancelAiSpeech();
    setCurrentSegmentIndex(0);
    setElapsedBreathingMs(0);
    setRemainingMs(durationMinutes * 60 * 1000);
    setStatus("generating");
    stopLibraryPlayback({ resetPosition: false, clearSaved: false });

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

  const aiTotalMs = (session?.durationMinutes || durationMinutes) * 60 * 1000;
  const aiProgressPercent = aiTotalMs ? ((aiTotalMs - remainingMs) / aiTotalMs) * 100 : 0;

  useEffect(() => {
    if (!spokenAudioRef.current) {
      spokenAudioRef.current = new Audio();
      spokenAudioRef.current.preload = "auto";
      spokenAudioRef.current.volume = voiceVolumeRef.current;
      spokenAudioRef.current.playbackRate = playbackRateRef.current;
    }

    const spokenAudio = spokenAudioRef.current;

    const handleTimeUpdate = () => {
      const boundary = segmentBoundariesRef.current[librarySegmentIndexRef.current];
      if (!boundary) {
        return;
      }

      const nextElapsed = Math.min(
        totalLibraryMsRef.current,
        boundary.startMs + Math.max(0, spokenAudio.currentTime * 1000)
      );
      updateLibraryProgress(librarySegmentIndexRef.current, nextElapsed - boundary.startMs);
    };

    const handleEnded = () => {
      if (!isLibraryPlayingRef.current) {
        return;
      }
      playLibraryAtIndex(librarySegmentIndexRef.current + 1, 0, true);
    };

    const handleWaiting = () => {
      if (isLibraryPlayingRef.current) {
        setIsLibrarySwitchingSegment(true);
      }
    };

    const handlePlaying = () => {
      setIsLibrarySwitchingSegment(false);
    };

    spokenAudio.addEventListener("timeupdate", handleTimeUpdate);
    spokenAudio.addEventListener("ended", handleEnded);
    spokenAudio.addEventListener("waiting", handleWaiting);
    spokenAudio.addEventListener("playing", handlePlaying);

    return () => {
      spokenAudio.removeEventListener("timeupdate", handleTimeUpdate);
      spokenAudio.removeEventListener("ended", handleEnded);
      spokenAudio.removeEventListener("waiting", handleWaiting);
      spokenAudio.removeEventListener("playing", handlePlaying);
    };
  }, []);

  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio();
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.preload = "auto";
    }

    const ambient = ambientAudioRef.current;
    ambient.volume = ambientVolume;

    const currentTrack = LIBRARY_AMBIENT_TRACKS.find((item) => item.key === ambientTrack);
    if (!currentTrack?.src) {
      ambient.pause();
      ambient.removeAttribute("src");
      return;
    }

    const nextSrc = resolveAudioSrc(currentTrack.src);
    if (ambient.src !== nextSrc) {
      ambient.src = currentTrack.src;
      ambient.load();
    }

    if (isLibraryPlaying && !isLibraryPaused) {
      ambient.play().catch(() => {});
    } else {
      ambient.pause();
    }
  }, [ambientTrack, ambientVolume, isLibraryPlaying, isLibraryPaused]);

  useEffect(() => {
    let cancelled = false;

    async function prepareLibrarySession() {
      stopLibraryPlayback({ resetPosition: false, clearSaved: false });
      setIsLibraryMetadataLoading(true);
      setIsLibrarySwitchingSegment(false);
      setAmbientTrack(selectedLibrarySession.ambientDefaults.track);
      setAmbientVolume(selectedLibrarySession.ambientDefaults.volume);

      const nextDurations = {};
      await Promise.all(
        librarySegments.map(async (segment) => {
          if (!segment?.src) {
            nextDurations[segment.id] = Number(segment.durationSeconds || 0);
            return;
          }

          const preloaded = await preloadAudioMetadata(
            segment.src,
            preloadedAudioBySrcRef,
            segmentDurationsBySrcRef
          );

          nextDurations[segment.id] = preloaded
            ? Number(segmentDurationsBySrcRef.current[segment.src]) ||
              Number(segment.durationSeconds || 0)
            : Number(segment.durationSeconds || 0);
        })
      );

      if (cancelled) {
        return;
      }

      setSegmentDurationsById(nextDurations);
      setIsLibraryMetadataLoading(false);
    }

    prepareLibrarySession();

    return () => {
      cancelled = true;
    };
  }, [librarySegments, selectedLibrarySession]);

  useEffect(() => {
    const savedElapsed =
      continueEntry?.sessionId === selectedLibrarySession.id ? continueEntry.elapsedMs || 0 : 0;
    const { index, offsetMs } = findBoundaryAtTime(segmentBoundaries, savedElapsed);
    updateLibraryProgress(index, offsetMs, false);
    preloadUpcomingSegments(index);
  }, [continueEntry, segmentBoundaries, selectedLibrarySession.id]);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        window.clearInterval(aiTimerRef.current);
      }
      if (ttsTickRef.current) {
        window.clearInterval(ttsTickRef.current);
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (spokenAudioRef.current) {
        spokenAudioRef.current.pause();
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    };
  }, []);

  const meditationDescription =
    "Choose between a curated Hindi meditation library and an AI-generated session, with improved audio controls, breathing visuals, and offline-ready support.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Meditation Library and AI Sessions",
    description: meditationDescription,
    url: `${SITE_URL}/meditation`,
    about: { "@type": "Person", name: PERSON_NAME },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="bg-[#F7F3EA] text-[#1D3C52]">
      <SEO
        title="Meditation Library and AI Sessions"
        description={meditationDescription}
        canonicalPath="/meditation"
        schema={schema}
      />

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
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#6B8A9A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Sparkles size={14} />
              Phase 2 Meditation
            </span>
            <h1
              className="mt-6 text-[clamp(2.3rem,7vw,4.8rem)] leading-[1.04] tracking-[-0.02em] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              A curated Hindi meditation library
              <br />
              <em className="italic text-[#6B8A9A]">
                with AI sessions still available when you need them
              </em>
            </h1>
            <p
              className="mt-6 max-w-3xl text-[15px] leading-[1.9] text-[#5A7485]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Start instantly with library sessions designed for repeat listening,
              offline-friendly support, and better controls. When you want something
              more personal, switch to AI Session for a custom practice based on how
              you feel today.
            </p>
          </div>

          <div className="mt-8 inline-flex rounded-full border border-[#D8D0BF] bg-white/85 p-1 shadow-[0_12px_30px_rgba(29,60,82,0.06)]">
            <button
              type="button"
              onClick={() => {
                setActiveSurface("library");
                stopAiPlayback();
              }}
              className={`rounded-full px-5 py-3 text-[12px] uppercase tracking-[0.12em] ${
                activeSurface === "library" ? "bg-[#1D3C52] text-white" : "text-[#5A7485]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSurface("ai");
                stopLibraryPlayback({ resetPosition: false, clearSaved: false });
              }}
              className={`rounded-full px-5 py-3 text-[12px] uppercase tracking-[0.12em] ${
                activeSurface === "ai" ? "bg-[#1D3C52] text-white" : "text-[#5A7485]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              AI Session
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:px-12 lg:px-20">
        {activeSurface === "library" ? (
          <MeditationLibrarySurface
            categories={MEDITATION_LIBRARY_CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            featuredSessions={featuredLibrarySessions}
            sessions={filteredLibrarySessions}
            favorites={favorites}
            selectedSession={selectedLibrarySession}
            onSelectSession={setSelectedLibrarySession}
            onToggleFavorite={handleToggleFavorite}
            continueSession={continueSession}
            recentSessions={recentSessions}
            recommendedSessions={recommendedSessions}
            isDownloadingOffline={isDownloadingOffline}
            offlineReady={offlineReady}
            onDownloadOffline={handleDownloadOffline}
            ambientTracks={LIBRARY_AMBIENT_TRACKS}
            playerState={{
              isPlaying: isLibraryPlaying,
              isPaused: isLibraryPaused,
              isSeeking: isLibrarySeeking,
              isSwitchingSegment: isLibrarySwitchingSegment,
              isMetadataLoading: isLibraryMetadataLoading,
              elapsedMs: libraryElapsedMs,
              remainingMs: libraryRemainingMs,
              segmentIndex: librarySegmentIndex,
              segmentCount: librarySegments.length,
              totalMs: librarySessionDurationMs,
              playbackRate,
              voiceVolume,
              ambientTrack,
              ambientVolume,
            }}
            controls={{
              togglePlayback: toggleLibraryPlayback,
              previous: () => jumpLibraryPlayback(-SEEK_JUMP_MS),
              next: () => jumpLibraryPlayback(SEEK_JUMP_MS),
              stop: () => stopLibraryPlayback({ resetPosition: true, clearSaved: true }),
              seek: seekLibraryPlayback,
              setPlaybackRate,
              setVoiceVolume,
              setAmbientTrack,
              setAmbientVolume,
            }}
          />
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)] sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF3F1] text-[#1D3C52]">
                    <WandSparkles size={18} />
                  </div>
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      AI Session
                    </p>
                    <h2
                      className="mt-1 text-[1.7rem] text-[#1D3C52]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Generate a custom meditation
                    </h2>
                  </div>
                </div>

                <form className="mt-6 space-y-6" onSubmit={handleGenerate}>
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Mood
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {MEDITATION_MOODS.map((mood) => (
                        <button
                          key={mood.key}
                          type="button"
                          onClick={() => setSelectedMood(mood.key)}
                          className={`rounded-full px-4 py-2.5 text-[13px] ${
                            selectedMood === mood.key
                              ? "bg-[#1D3C52] text-white"
                              : "border border-[#D8D0BF] text-[#5A7485]"
                          }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="feelingText"
                      className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Or describe how you feel
                    </label>
                    <textarea
                      id="feelingText"
                      rows="3"
                      value={feelingText}
                      onChange={(event) => setFeelingText(event.target.value)}
                      placeholder="I feel mentally scattered and need grounding."
                      className="mt-3 w-full rounded-[24px] border border-[#D8D0BF] bg-[#FBF9F4] px-4 py-3 text-sm leading-7 text-[#1D3C52] outline-none focus:border-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Duration
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {MEDITATION_DURATIONS.map((minutes) => (
                        <button
                          key={minutes}
                          type="button"
                          onClick={() => setDurationMinutes(minutes)}
                          className={`rounded-full px-4 py-2.5 text-[13px] ${
                            durationMinutes === minutes
                              ? "bg-[#DCE8E6] text-[#1D3C52]"
                              : "border border-[#D8D0BF] text-[#5A7485]"
                          }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {formatDurationLabel(minutes)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!speechSupported && (
                    <div className="rounded-[20px] border border-[#E6D8C8] bg-[#FFF7EF] px-4 py-3 text-sm text-[#7A5B49]">
                      Browser voice playback is unavailable here. You can still generate
                      and read the session.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "generating"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1D3C52] px-6 py-3.5 text-[12px] uppercase tracking-[0.14em] text-white disabled:opacity-60"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {status === "generating" ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Creating your meditation
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate meditation
                      </>
                    )}
                  </button>
                </form>
              </div>
              {error && (
                <div className="rounded-[26px] border border-[#E1CFC4] bg-[#FFF5F3] px-5 py-4 text-[#8A544B]">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
                  </div>
                </div>
              )}

              <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)] sm:p-8">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => beginAiPlayback(0)}
                    disabled={!session || status === "generating"}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Play size={15} />
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={pauseAiPlayback}
                    disabled={status !== "playing"}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#5A7485] disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Pause size={15} />
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => beginAiPlayback(currentSegmentIndex, remainingMs)}
                    disabled={status !== "paused"}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D8D0BF] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#5A7485] disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Play size={15} />
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={stopAiPlayback}
                    disabled={!session}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E1CFC4] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#8A544B] disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Square size={15} />
                    Stop
                  </button>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                  <BreathingVisualizer
                    breathingPattern={breathingPattern}
                    elapsedMs={elapsedBreathingMs}
                    remainingLabel={formatRemainingTime(remainingMs)}
                    progressPercent={aiProgressPercent}
                    cueLabel={session?.breathingPattern?.label}
                    theme="dusk"
                  />

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5">
                      <p
                        className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Title
                      </p>
                      <h3
                        className="mt-2 text-[1.4rem] text-[#1D3C52]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {session?.title || "Your meditation will appear here"}
                      </h3>
                      <p
                        className="mt-3 text-sm leading-7 text-[#5A7485]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {session
                          ? `${session.moodLabel} · ${session.tone}`
                          : "Use AI Session when you want something more personal than the curated library."}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-[#E7DEC9] bg-[#FCFAF6] p-5">
                      <p
                        className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Focus point
                      </p>
                      <p
                        className="mt-3 text-sm leading-7 text-[#5A7485]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {session?.focusPoint || "Breath, body, and steadiness."}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[#F8F4EC] p-5">
                      <p
                        className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Opening
                      </p>
                      <p
                        className="mt-3 text-sm leading-7 text-[#4E6677]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {session?.intro || "The AI-generated opening will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-[32px] border border-[#E1D7C5] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
                <p
                  className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Guided steps
                </p>
                <div className="mt-4 space-y-4">
                  {(session?.guidedSteps?.length
                    ? session.guidedSteps
                    : ["Your guided steps will appear here after generation."]).map(
                    (step, index) => (
                      <div
                        key={`${index}-${step.slice(0, 16)}`}
                        className="rounded-[22px] border border-[#E7DEC9] bg-[#FCFAF6] p-4"
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.16em] text-[#8BA5B5]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Step {index + 1}
                        </p>
                        <p
                          className="mt-2 text-sm leading-7 text-[#4E6677]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {step}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[32px] border border-[#D6DFDC] bg-[#EAF2F0] p-6">
                <p
                  className="text-[11px] uppercase tracking-[0.18em] text-[#6B8A9A]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Recent AI sessions
                </p>
                <div className="mt-4 space-y-3">
                  {history.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSession(item);
                        setStatus("ready");
                        setRemainingMs(item.durationMinutes * 60 * 1000);
                        setElapsedBreathingMs(0);
                      }}
                      className="block w-full rounded-[22px] bg-white/75 p-4 text-left"
                    >
                      <h4
                        className="text-[1rem] text-[#1D3C52]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="mt-1 text-sm text-[#4E6677]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.moodLabel} · {formatDurationLabel(item.durationMinutes)}
                      </p>
                    </button>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Contact Nandini
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
};

export default Meditation;
