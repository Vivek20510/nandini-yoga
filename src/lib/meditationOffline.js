import {
  LIBRARY_AMBIENT_TRACKS,
  MEDITATION_AUDIO_SEGMENTS,
} from "./meditationLibrary";
import { buildAudioUrlList } from "./meditationAudioEngine";

export const MEDITATION_CACHE_VERSION = "ybn-meditation-cache-v3";

const MEDITATION_LIBRARY_AUDIO_URLS = buildAudioUrlList(
  MEDITATION_AUDIO_SEGMENTS,
  LIBRARY_AMBIENT_TRACKS
);

export async function registerMeditationServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export async function warmMeditationOfflineCache() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  try {
    const cache = await window.caches.open(MEDITATION_CACHE_VERSION);
    await cache.addAll(["/meditation", "/logo.png", ...MEDITATION_LIBRARY_AUDIO_URLS]);
    return true;
  } catch {
    return false;
  }
}

export async function isMeditationAssetCached(url) {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  const cache = await window.caches.open(MEDITATION_CACHE_VERSION);
  const match = await cache.match(url);
  return Boolean(match);
}
