import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ─────────── FADE-UP HELPER ─────────── */
const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─────────── SECTION LABEL ─────────── */
const Label = ({ children }) => (
  <span
    className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-5"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {children}
  </span>
);

/* ─────────── DIVIDER ─────────── */
const Divider = () => (
  <div className="flex items-center gap-3 my-2">
    <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#D5CFC0]" />
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="2.5" stroke="#B5A98A" strokeWidth="1"/>
    </svg>
    <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#D5CFC0]" />
  </div>
);

/* ═══════════════════════════════════════
   404 NOT FOUND PAGE
═══════════════════════════════════════ */
const NotFound = () => {
  return (
    <div className="font-serif bg-[#FAFAF7] text-[#1D3C52] overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F4F1E6] overflow-hidden">
        {/* Background circles for aesthetic */}
        <div className="absolute right-0 top-0 w-[55vw] h-[55vw] rounded-full bg-[#E8E2D0]/30 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute left-[10%] bottom-[15%] w-32 h-32 rounded-full bg-[#D6CDB8]/25 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-24 text-center w-full relative z-10">
          <FadeUp>
            <Label>Page Not Found</Label>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className="text-[clamp(4rem,12vw,8rem)] font-normal leading-[0.9] text-[#1D3C52] tracking-[-0.02em] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              404
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Divider />
          </FadeUp>

          <FadeUp delay={0.3}>
            <p
              className="text-[18px] leading-[1.8] text-[#5A7485] max-w-2xl mx-auto mb-12"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            >
              Oops! This pose doesn't exist in our practice. Let's guide you back to finding your balance and inner peace.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                to="/"
                className="group px-8 py-4 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-lg shadow-[#1D3C52]/20"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Return Home
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/contact"
                className="group px-8 py-4 rounded-full border border-[#1D3C52] text-[#1D3C52] text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#1D3C52] hover:text-white transition-all duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get in Touch
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
};

export default NotFound;