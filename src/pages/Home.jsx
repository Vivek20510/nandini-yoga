import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import YogaAnimation from "../assets/yoga-animation.json";

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
   HOME PAGE
═══════════════════════════════════════ */
const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="font-serif bg-[#FAFAF7] text-[#1D3C52] overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center bg-[#F4F1E6] overflow-hidden"
      >
        {/* Textured background circle */}
        <div className="absolute right-0 top-0 w-[55vw] h-[55vw] rounded-full bg-[#E8E2D0]/50 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-[8%] bottom-[10%] w-40 h-40 rounded-full bg-[#D6CDB8]/40 pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          {/* Left */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Label>15+ Years of Teaching</Label>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-normal leading-[1.08] text-[#1D3C52] tracking-[-0.01em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Still the mind.<br />
              <em className="italic text-[#6B8A9A]">Awaken</em> the body.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-7 text-[16px] leading-[1.8] text-[#5A7485] max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            >
              Certified yoga and meditation teacher based in India. 
              Blending classical yogic philosophy with mindful living — 
              helping practitioners find balance from the inside out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <Link
                to="/contact"
                className="group px-7 py-3.5 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-lg shadow-[#1D3C52]/20"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Start Your Journey
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/about"
                className="text-[13px] tracking-[0.08em] uppercase text-[#8BA5B5] hover:text-[#1D3C52] transition-colors duration-300 font-medium underline underline-offset-4 decoration-[#C5BCA8]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                About Nandini
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="mt-14 flex gap-10 pt-10 border-t border-[#D8D2C4]"
            >
              {[
                { num: "15+", label: "Years Teaching" },
                { num: "500+", label: "Students Guided" },
                { num: "3", label: "Certifications" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold text-[#1D3C52]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</p>
                  <p className="text-[11px] tracking-[0.14em] uppercase text-[#8BA5B5] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Lottie */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="absolute inset-0 rounded-full bg-[#E0D9C8]/30 blur-3xl scale-90" />
            <div className="relative w-[280px] sm:w-[380px] lg:w-[420px]">
              <Lottie animationData={YogaAnimation} loop autoplay />
            </div>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#A09880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-[#A09880] to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══ PHILOSOPHY STRIP ═══ */}
      <section className="py-10 bg-[#1D3C52] overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {Array.from({ length: 4 }).flatMap(() =>
            ["Pranayama", "·", "Asana", "·", "Meditation", "·", "Ayurveda", "·", "Dharana", "·", "Samadhi", "·"]
          ).map((w, i) => (
            <span
              key={i}
              className={`text-[13px] tracking-[0.18em] uppercase ${w === "·" ? "text-[#8BA5B5]" : "text-[#C8D8E0]"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {w}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ═══ ABOUT / MEET NANDINI ═══ */}
      <section className="py-28 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left */}
          <div>
            <FadeUp>
              <Label>About</Label>
              <h2
                className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Meet Nandini Singh
              </h2>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="mt-6 text-[15.5px] leading-[1.9] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Nandini Singh is a certified international yoga and meditation teacher with over 15 years
                of experience guiding students toward balance, strength, and inner clarity. Born and raised
                in India, her roots in yogic tradition run deep.
              </p>
              <p className="mt-5 text-[15.5px] leading-[1.9] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Her approach blends classical yogic philosophy — rooted in Patanjali's Ashtanga system —
                with accessible, modern mindfulness practices. Whether you're a complete beginner or
                an advanced practitioner, she meets you where you are.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div className="mt-10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[13px] tracking-[0.1em] uppercase text-[#1D3C52] font-semibold hover:gap-4 transition-all duration-300 border-b border-[#1D3C52] pb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Full Story →
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Right — Training cards */}
          <div className="space-y-4 pt-2">
            <FadeUp>
              <Label>Training & Certifications</Label>
            </FadeUp>
            {[
              {
                title: "Patanjali Yogpeeth",
                location: "Haridwar, India",
                desc: "Residential yoga & Ayurvedic wellness immersion under traditional gurukul training.",
              },
              {
                title: "Isha Foundation",
                location: "Coimbatore, India",
                desc: "Inner Engineering program and Hatha yoga teacher certification under Sadhguru's lineage.",
              },
              {
                title: "Om Yoga International",
                location: "Rishikesh, India",
                desc: "200-hr & 300-hr teacher training in classical Hatha, Vinyasa, and yogic philosophy.",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="group bg-white border border-[#E8E4D8] rounded-2xl p-6 hover:border-[#A8BDC8] hover:shadow-md transition-all duration-400">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="text-[16px] font-semibold text-[#1D3C52] leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[11px] tracking-[0.14em] uppercase text-[#8BA5B5] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.location}
                      </p>
                    </div>
                    <span className="w-8 h-8 flex-shrink-0 rounded-full border border-[#E8E4D8] flex items-center justify-center group-hover:border-[#1D3C52] transition-colors duration-300">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10 L10 2 M10 2 H4 M10 2 V8" stroke="#1D3C52" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-[1.75] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFFERINGS ═══ */}
      <section className="py-28 bg-[#F0EDE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

          <div className="text-center max-w-2xl mx-auto">
            <FadeUp>
              <Label>Offerings</Label>
              <h2
                className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                A Path for Every Practitioner
              </h2>
              <p className="mt-5 text-[15px] leading-[1.9] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Thoughtfully designed programs rooted in tradition, 
                adapted for modern life — available online and in-person.
              </p>
            </FadeUp>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Beginner Yoga",
                tag: "Foundation",
                desc: "A structured, gentle program covering foundational asanas, proper alignment, and conscious breathwork — safe for all bodies, all ages.",
                detail: "8-week program · Online & Offline"
              },
              {
                num: "02",
                title: "Pranayama & Meditation",
                tag: "Inner Work",
                desc: "Breathing techniques from classical Hatha tradition paired with guided meditation practices for nervous system regulation and clarity of mind.",
                detail: "Ongoing · Online sessions"
              },
              {
                num: "03",
                title: "Ayurveda & Lifestyle",
                tag: "Wellness",
                desc: "Integrating Ayurvedic principles into daily routines — diet, seasonal rhythms, and practices that support long-term wellbeing.",
                detail: "Workshop series · Coming 2025"
              },
            ].map((p, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="group relative bg-white rounded-3xl p-8 border border-[#E0D9C8] hover:border-[#1D3C52]/20 hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-[11px] tracking-[0.2em] uppercase text-[#8BA5B5] font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {p.tag}
                    </span>
                    <span
                      className="text-[2.8rem] font-light text-[#E8E4D8] leading-none select-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {p.num}
                    </span>
                  </div>

                  <h3
                    className="text-[1.4rem] font-semibold text-[#1D3C52] leading-tight mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {p.title}
                  </h3>

                  <p className="text-[14px] leading-[1.8] text-[#6B8A9A] flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {p.desc}
                  </p>

                  <div className="mt-6 pt-5 border-t border-[#EDE8DC] flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-[#A09880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {p.detail}
                    </span>
                    <Link
                      to="/contact"
                      className="text-[12px] text-[#1D3C52] underline underline-offset-2 hover:text-[#2A5470] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY PRACTICE WITH NANDINI ═══ */}
      <section className="py-28 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <FadeUp>
                <Label>The Practice</Label>
                <h2
                  className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  What You'll<br />
                  <em className="italic text-[#8BA5B5]">Carry Forward</em>
                </h2>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "🌿",
                  title: "Stress & Nervous System",
                  desc: "Evidence-backed breathwork to downregulate the nervous system, reduce cortisol, and restore a sense of ease in daily life."
                },
                {
                  icon: "🦴",
                  title: "Mobility & Strength",
                  desc: "Progressive asana sequences that improve joint health, posture, and functional strength — adapted to your unique body."
                },
                {
                  icon: "🧘",
                  title: "Mental Clarity",
                  desc: "Meditation and concentration practices that train attention, reduce mental noise, and improve emotional resilience."
                },
                {
                  icon: "☀️",
                  title: "Sustainable Lifestyle",
                  desc: "Practical tools from Ayurveda and yogic tradition that integrate seamlessly into modern life — no extremes, just balance."
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="bg-[#F4F1E6] rounded-2xl p-7 border border-transparent hover:border-[#D8D2C4] transition-all duration-300">
                    <span className="text-2xl mb-4 block">{item.icon}</span>
                    <h3
                      className="text-[16px] font-semibold text-[#1D3C52] mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] leading-[1.8] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section className="py-24 bg-[#1D3C52]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <svg className="mx-auto mb-8 opacity-30" width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M0 30 L10 0 L20 0 L12 30 Z M20 30 L30 0 L40 0 L32 30 Z" fill="#C8D8E0"/>
            </svg>
            <blockquote
              className="text-[clamp(1.4rem,3vw,2.2rem)] font-normal leading-[1.5] text-[#E8F0F4] italic"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              "Yoga is not about touching your toes. It is what you learn on the way down."
            </blockquote>
            <p className="mt-6 text-[12px] tracking-[0.2em] uppercase text-[#8BA5B5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              — Jigar Gor
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ═══ BLOG TEASER ═══ */}
      <section className="py-28 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <FadeUp>
              <Label>From the Blog</Label>
              <h2
                className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Thoughts on<br />
                <em className="italic text-[#8BA5B5]">Practice & Living</em>
              </h2>
            </FadeUp>
            <FadeUp>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#6B8A9A] hover:text-[#1D3C52] transition-colors font-medium border-b border-[#C5BCA8] pb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                All Posts →
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: "Nov 2024",
                tag: "Breathwork",
                title: "The Science Behind Nadi Shodhana Pranayama",
                desc: "How alternate nostril breathing balances the sympathetic and parasympathetic nervous system — what ancient texts knew long before neuroscience confirmed it.",
              },
              {
                date: "Oct 2024",
                tag: "Philosophy",
                title: "What the Yamas Actually Mean for Modern Life",
                desc: "Patanjali's ethical foundations — ahimsa, satya, asteya — aren't just ancient codes. Here's how I apply them to everyday choices.",
              },
              {
                date: "Sep 2024",
                tag: "Practice",
                title: "Building a Morning Sadhana You'll Actually Keep",
                desc: "The practice doesn't have to be an hour. Here's how I help students build a sustainable 20-minute morning ritual that actually sticks.",
              },
            ].map((post, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <Link to="/blog" className="group block h-full">
                  <div className="h-full bg-white border border-[#E8E4D8] rounded-2xl p-7 hover:border-[#A8BDC8] hover:shadow-lg transition-all duration-400">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] tracking-[0.18em] uppercase text-white bg-[#1D3C52] px-3 py-1 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {post.tag}
                      </span>
                      <span className="text-[11px] text-[#A09880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {post.date}
                      </span>
                    </div>
                    <h3
                      className="text-[17px] font-semibold text-[#1D3C52] leading-snug group-hover:text-[#2A5470] transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.75] text-[#6B8A9A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {post.desc}
                    </p>
                    <span className="inline-block mt-5 text-[12px] text-[#8BA5B5] group-hover:text-[#1D3C52] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Read more →
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-24 bg-[#F0EDE0]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <Label>Stay Connected</Label>
            <h2
              className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Quiet notes on<br />
              <em className="italic text-[#8BA5B5]">yoga & mindful living</em>
            </h2>
            <p className="mt-5 text-[14.5px] leading-[1.8] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Occasional essays, practice guides, and workshop announcements — 
              delivered to your inbox with care. No noise, no sales tactics.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <form
              className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-3.5 rounded-full border border-[#D8D2C4] bg-white text-[14px] text-[#1D3C52] placeholder-[#A09880] focus:outline-none focus:ring-2 focus:ring-[#1D3C52]/20 focus:border-[#1D3C52] transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-[11px] text-[#A09880] tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Unsubscribe at any time. No spam, ever.
            </p>
          </FadeUp>
        </div>
      </section>

    </div>
  );
};

export default Home;
