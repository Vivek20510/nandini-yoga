export function getSegmentDurationMs(segment, durationMap = {}) {
  const resolved = Number(durationMap?.[segment?.id]);
  if (Number.isFinite(resolved) && resolved > 0) {
    return resolved * 1000;
  }

  return Math.max(0, Number(segment?.durationSeconds || 0) * 1000);
}

export function buildSegmentBoundaries(segments = [], durationMap = {}) {
  let cursor = 0;

  return segments.map((segment) => {
    const durationMs = getSegmentDurationMs(segment, durationMap);
    const boundary = {
      id: segment.id,
      startMs: cursor,
      endMs: cursor + durationMs,
      durationMs,
    };
    cursor += durationMs;
    return boundary;
  });
}

export function getSessionDurationMs(segments = [], durationMap = {}) {
  return buildSegmentBoundaries(segments, durationMap).reduce(
    (total, boundary) => total + boundary.durationMs,
    0
  );
}

export function findBoundaryAtTime(boundaries = [], elapsedMs = 0) {
  if (!boundaries.length) {
    return { index: 0, boundary: null, offsetMs: 0 };
  }

  const boundedElapsed = Math.max(0, elapsedMs);
  const index = boundaries.findIndex((boundary) => boundedElapsed < boundary.endMs);
  const resolvedIndex = index === -1 ? boundaries.length - 1 : index;
  const boundary = boundaries[resolvedIndex];
  return {
    index: resolvedIndex,
    boundary,
    offsetMs: Math.max(0, boundedElapsed - boundary.startMs),
  };
}

export function buildAudioUrlList(segments = [], ambientTracks = []) {
  const urls = new Set();

  segments.forEach((segment) => {
    if (segment?.src) {
      urls.add(segment.src);
    }
  });

  ambientTracks.forEach((track) => {
    if (track?.src) {
      urls.add(track.src);
    }
  });

  return Array.from(urls);
}

export function preloadAudioMetadata(src, cacheRef, durationRef) {
  if (!src) {
    return Promise.resolve(null);
  }

  const cached = cacheRef.current.get(src);
  if (cached) {
    return cached;
  }

  const promise = new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;

    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("error", handleError);
    };

    const handleLoaded = () => {
      cleanup();
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        durationRef.current[src] = audio.duration;
      }
      resolve(audio);
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load ${src}`));
    };

    audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.load();
  }).catch(() => null);

  cacheRef.current.set(src, promise);
  return promise;
}

