import React from "react";

function getPhase(pattern, elapsedMs) {
  const inhale = pattern?.inhale || 0;
  const hold = pattern?.hold || 0;
  const exhale = pattern?.exhale || 0;
  const holdAfterExhale = pattern?.holdAfterExhale || 0;
  const total = inhale + hold + exhale + holdAfterExhale;

  if (!total) {
    return "Breathe";
  }

  const second = (elapsedMs / 1000) % total;
  if (second < inhale) return "Inhale";
  if (second < inhale + hold) return "Hold";
  if (second < inhale + hold + exhale) return "Exhale";
  return "Rest";
}

const BreathingVisualizer = ({
  breathingPattern,
  elapsedMs,
  remainingLabel,
  progressPercent,
  theme = "sage",
  cueLabel,
}) => {
  const phaseLabel = getPhase(breathingPattern, elapsedMs);
  const duration =
    (breathingPattern?.inhale || 0) +
      (breathingPattern?.hold || 0) +
      (breathingPattern?.exhale || 0) +
      (breathingPattern?.holdAfterExhale || 0) || 10;

  const themes = {
    sage: "from-[#E8F1EF] via-[#DDE7E4] to-[#F7F3EA]",
    dawn: "from-[#F7EBD8] via-[#F4DFC9] to-[#FAF3E8]",
    dusk: "from-[#E5ECF4] via-[#D3DFEC] to-[#EEF3F8]",
  };

  return (
    <div className="flex flex-col items-center rounded-[30px] bg-[#F6F3EC] px-6 py-8 text-center">
      <div
        className={`relative flex h-52 w-52 items-center justify-center rounded-full border border-[#D7D7D2] bg-gradient-to-br ${themes[theme] || themes.sage}`}
        style={{ animation: `meditationPulse ${duration}s ease-in-out infinite` }}
      >
        <div className="absolute inset-4 rounded-full border border-white/60" />
        <div className="absolute inset-10 rounded-full border border-[#B7CBCD]/55" />
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#7D9CAA ${progressPercent}%, rgba(255,255,255,0) 0%)`, mask: "radial-gradient(circle at center, transparent 62%, black 64%)", WebkitMask: "radial-gradient(circle at center, transparent 62%, black 64%)" }} />
        <div className="relative z-10">
          <p
            className="text-[11px] uppercase tracking-[0.16em] text-[#8BA5B5]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {phaseLabel}
          </p>
          <p
            className="mt-2 text-3xl text-[#1D3C52]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {remainingLabel}
          </p>
        </div>
      </div>

      <p
        className="mt-5 text-[12px] uppercase tracking-[0.12em] text-[#6B8A9A]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {cueLabel || breathingPattern?.label || "Steady breath"}
      </p>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#7D9CAA] transition-[width] duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
};

export default BreathingVisualizer;
