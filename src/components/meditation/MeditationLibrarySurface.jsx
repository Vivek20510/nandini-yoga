import React from "react";
import { Download, Heart, Languages, Pause, Play, SkipBack, SkipForward, Volume2, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import BreathingVisualizer from "./BreathingVisualizer";
import {
  formatDurationLabel,
  formatRemainingTime,
} from "../../lib/meditation";

const MeditationLibrarySurface = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  featuredSessions,
  sessions,
  favorites,
  selectedSession,
  onSelectSession,
  onToggleFavorite,
  continueSession,
  recentSessions,
  recommendedSessions,
  isDownloadingOffline,
  offlineReady,
  onDownloadOffline,
  playerState,
  controls,
  ambientTracks,
}) => {
  const totalVirtualMs = playerState.totalMs || selectedSession.durationMinutes * 60 * 1000;
  const progressPercent = totalVirtualMs
    ? ((totalVirtualMs - playerState.remainingMs) / totalVirtualMs) * 100
    : 0;
  const controlsDisabled = playerState.isMetadataLoading || playerState.isSwitchingSegment;
  const playButtonLabel = playerState.isPlaying && !playerState.isPaused ? "Pause" : "Play";

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Meditation Library
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Hindi-first sessions designed for repeat practice
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Start instantly with curated meditations, reusable Hindi guidance, smoother audio controls, and offline-ready playback for your most-used sessions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onDownloadOffline}
              disabled={isDownloadingOffline}
              className="inline-flex items-center gap-2 rounded-full border border-[#C7D6D0] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-[#1D3C52] disabled:opacity-60"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Download size={15} />
              {isDownloadingOffline ? "Downloading" : offlineReady ? "Cached Offline" : "Save Offline"}
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EDF3F1] px-4 py-3 text-[12px] uppercase tracking-[0.12em] text-[#54707A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Languages size={14} />
              Hindi primary
            </span>
          </div>
        </div>

        {continueSession && (
          <div className="mt-6 rounded-[26px] border border-[#E1D7C5] bg-[#F8F4EC] p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Continue Listening
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[1.1rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {continueSession.titleHi}
                </h3>
                <p className="mt-1 text-sm text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Resume from {formatRemainingTime(continueSession.remainingMs || 0)} remaining
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectSession(continueSession)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Play size={15} />
                Open Session
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-4 py-2.5 text-[12px] uppercase tracking-[0.1em] ${selectedCategory === "All" ? "bg-[#1D3C52] text-white" : "border border-[#D8D0BF] text-[#5A7485]"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2.5 text-[12px] uppercase tracking-[0.1em] ${selectedCategory === category ? "bg-[#DCE8E6] text-[#1D3C52]" : "border border-[#D8D0BF] text-[#5A7485]"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Featured
                </p>
                <h3 className="mt-2 text-[1.5rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Start here
                </h3>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {featuredSessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session)}
                  className={`rounded-[24px] border p-5 text-left transition ${selectedSession.id === session.id ? "border-[#8FA9B5] bg-[#F4F8F7]" : "border-[#E7DEC9] bg-[#FCFAF6]"}`}
                >
                  <img src={session.coverImage} alt={session.title} className="h-40 w-full rounded-[18px] object-cover" />
                  <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {session.category}
                  </p>
                  <h4 className="mt-2 text-[1.15rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {session.titleHi}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {session.descriptionHi}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sessions
              </p>
              <h3 className="mt-2 text-[1.5rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Browse the library
              </h3>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sessions.map((session) => {
                const isFavorite = favorites.includes(session.id);
                return (
                  <div
                    key={session.id}
                    className={`rounded-[24px] border p-5 transition ${selectedSession.id === session.id ? "border-[#8FA9B5] bg-[#F4F8F7]" : "border-[#E7DEC9] bg-[#FCFAF6]"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => onSelectSession(session)} className="text-left">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {session.category}
                        </p>
                        <h4 className="mt-2 text-[1.1rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          {session.titleHi}
                        </h4>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(session.id)}
                        className={`rounded-full p-2 ${isFavorite ? "bg-[#F6DEE0] text-[#B04858]" : "bg-white text-[#8BA5B5]"}`}
                      >
                        <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {session.descriptionHi}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {formatDurationLabel(session.durationMinutes)}
                      </span>
                      <span className="rounded-full bg-[#EDF3F1] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#54707A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Hindi
                      </span>
                      <span className="rounded-full bg-[#F2EEE3] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8A765C]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {session.offlineEligible ? "Offline ready" : "Online only"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Now Playing
                </p>
                <h3 className="mt-2 text-[1.65rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {selectedSession.titleHi}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {selectedSession.descriptionHi}
                </p>
              </div>
              <img src={selectedSession.coverImage} alt={selectedSession.title} className="h-20 w-20 rounded-[18px] object-cover" />
            </div>

            <div className="mt-6">
              <BreathingVisualizer
                breathingPattern={selectedSession.breathingPattern}
                elapsedMs={playerState.elapsedMs}
                remainingLabel={formatRemainingTime(playerState.remainingMs)}
                progressPercent={progressPercent}
                cueLabel={selectedSession.breathingPattern.label}
                theme="sage"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={controls.previous} disabled={controlsDisabled} className="rounded-full border border-[#D8D0BF] p-3 text-[#5A7485] disabled:opacity-50">
                <SkipBack size={16} />
              </button>
              <button type="button" onClick={controls.togglePlayback} disabled={playerState.isMetadataLoading} className="rounded-full bg-[#1D3C52] p-4 text-white disabled:opacity-50">
                {playerState.isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button type="button" onClick={controls.next} disabled={controlsDisabled} className="rounded-full border border-[#D8D0BF] p-3 text-[#5A7485] disabled:opacity-50">
                <SkipForward size={16} />
              </button>
              <button type="button" onClick={controls.stop} disabled={controlsDisabled && !playerState.isPlaying} className="rounded-full border border-[#E1CFC4] px-4 py-3 text-[12px] uppercase tracking-[0.12em] text-[#8A544B] disabled:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Stop
              </button>
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {playerState.isMetadataLoading
                  ? "Loading audio..."
                  : playerState.isSwitchingSegment
                    ? "Preparing next segment..."
                    : playButtonLabel}
              </span>
            </div>

            <div className="mt-6">
              <input
                type="range"
                min="0"
                max={Math.max(1, totalVirtualMs)}
                value={Math.min(totalVirtualMs, playerState.elapsedMs)}
                onChange={(event) => controls.seek(Number(event.target.value))}
                disabled={playerState.isMetadataLoading}
                className="w-full accent-[#1D3C52]"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span>{formatRemainingTime(playerState.remainingMs)}</span>
                <span>
                  Segment {playerState.segmentIndex + 1} / {playerState.segmentCount}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="rounded-[22px] border border-[#E7DEC9] bg-[#FCFAF6] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Volume2 size={15} />
                    Voice volume
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {Math.round(playerState.voiceVolume * 100)}%
                  </span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={playerState.voiceVolume} onChange={(event) => controls.setVoiceVolume(Number(event.target.value))} className="mt-3 w-full accent-[#1D3C52]" />
              </label>

              <label className="rounded-[22px] border border-[#E7DEC9] bg-[#FCFAF6] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Waves size={15} />
                    Ambient volume
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {Math.round(playerState.ambientVolume * 100)}%
                  </span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={playerState.ambientVolume} onChange={(event) => controls.setAmbientVolume(Number(event.target.value))} className="mt-3 w-full accent-[#1D3C52]" />
              </label>

              <div className="rounded-[22px] border border-[#E7DEC9] bg-[#FCFAF6] px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {ambientTracks.map((track) => (
                    <button
                      key={track.key}
                      type="button"
                      onClick={() => controls.setAmbientTrack(track.key)}
                      className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${playerState.ambientTrack === track.key ? "bg-[#DCE8E6] text-[#1D3C52]" : "border border-[#D8D0BF] text-[#5A7485]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {track.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#E7DEC9] bg-[#FCFAF6] px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {[0.9, 1, 1.1].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => controls.setPlaybackRate(speed)}
                      className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${playerState.playbackRate === speed ? "bg-[#DCE8E6] text-[#1D3C52]" : "border border-[#D8D0BF] text-[#5A7485]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-[#F8F4EC] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Benefits
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSession.benefits.map((benefit) => (
                  <span key={benefit} className="rounded-full bg-white px-3 py-1 text-[11px] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {recentSessions.length > 0 && (
            <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Recent listens
              </p>
              <div className="mt-4 space-y-3">
                {recentSessions.map((session) => (
                  <button key={session.id} type="button" onClick={() => onSelectSession(session)} className="block w-full rounded-[20px] border border-[#E7DEC9] bg-[#FCFAF6] p-4 text-left">
                    <h4 className="text-[1rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {session.titleHi}
                    </h4>
                    <p className="mt-1 text-sm text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {session.category}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recommendedSessions.length > 0 && (
            <div className="rounded-[32px] border border-[#D9E3DD] bg-white p-6 shadow-[0_18px_60px_rgba(29,60,82,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Recommended next
              </p>
              <div className="mt-4 space-y-3">
                {recommendedSessions.map((session) => (
                  <button key={session.id} type="button" onClick={() => onSelectSession(session)} className="block w-full rounded-[20px] border border-[#E7DEC9] bg-[#FCFAF6] p-4 text-left">
                    <h4 className="text-[1rem] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {session.titleHi}
                    </h4>
                    <p className="mt-1 text-sm text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {session.descriptionHi}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[32px] border border-[#D6DFDC] bg-[#EAF2F0] p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Need personal guidance?
            </p>
            <h3 className="mt-3 text-[1.6rem] leading-[1.15] text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Pair the library with a teacher-led practice
            </h3>
            <p className="mt-4 text-[15px] leading-[1.9] text-[#4E6677]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Use these sessions daily, then reach out if you want a breathwork or meditation practice designed around your body, schedule, and goals.
            </p>
            <Link to="/contact" className="mt-6 inline-flex rounded-full bg-[#1D3C52] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Contact Nandini
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MeditationLibrarySurface;
