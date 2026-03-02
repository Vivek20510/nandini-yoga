import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── ANIMATION VARIANTS ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const TIMELINE = [
  { year: "2008", event: "Began spiritual studies in Rishikesh at the foothills of the Himalayas." },
  { year: "2012", event: "Certified in Hatha Yoga and Ayurvedic healing at Patanjali Yogpeeth." },
  { year: "2016", event: "Launched international teaching — workshops across India, Europe & Southeast Asia." },
  { year: "2020", event: "Completed advanced pranayama training with Isha Foundation." },
  { year: "2023", event: "Founded Yoga by Nandini — offering personalised programs worldwide." },
];

const PHILOSOPHY = [
  {
    icon: "🌬",
    title: "Mindful Movement",
    body: "Each class integrates breath with movement to cultivate a state of presence — where the body and mind arrive at the same moment.",
  },
  {
    icon: "🌿",
    title: "Holistic Healing",
    body: "A balanced weaving of yoga, Ayurveda, and meditation — addressing not just the physical body but the whole self.",
  },
  {
    icon: "🪷",
    title: "Personal Growth",
    body: "Every student carries a different story. Nandini's teaching meets each person where they are, and guides them gently forward.",
  },
];

const CERTIFICATIONS = [
  { org: "Patanjali Yogpeeth", focus: "Ayurveda & Pranayama", country: "Haridwar, India" },
  { org: "Isha Foundation", focus: "Inner Engineering & Hatha Yoga", country: "Coimbatore, India" },
  { org: "Om Yoga International", focus: "500-hr Teacher Training", country: "Rishikesh, India" },
];

const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

        :root {
          --cream:  #F7F3EC;
          --sand:   #EDE5D4;
          --bark:   #2C2417;
          --moss:   #4A5C3F;
          --terra:  #B8724A;
          --gold:   #C9A058;
          --white:  #FDFAF5;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body:    'Jost', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .about-root { background: var(--cream); font-family: var(--font-body); }

        /* ── HERO ── */
        .about-hero {
          background: var(--white);
          min-height: 85vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 120px 64px 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .about-hero::before {
          content: '';
          position: absolute;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(74,92,63,0.07) 0%, transparent 70%);
          top: -15%; left: -10%; pointer-events: none;
        }
        .about-hero::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,160,88,0.09) 0%, transparent 70%);
          bottom: 0; right: -8%; pointer-events: none;
        }
        .about-hero-inner { max-width: 1200px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }
        .about-hero-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }

        .section-label {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--font-body); font-size: 0.65rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--terra); margin-bottom: 20px;
        }
        .section-label::after { content: ''; width: 48px; height: 1px; background: rgba(184,114,74,0.3); }

        .about-hero-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300; line-height: 1.08; letter-spacing: -0.01em;
          color: var(--bark);
        }
        .about-hero-title em { font-style: italic; color: var(--moss); }

        .about-hero-quote {
          background: var(--sand);
          border-radius: 12px; padding: 36px;
          border-left: 3px solid var(--gold);
          position: relative;
        }
        .about-hero-quote::before {
          content: '"';
          font-family: var(--font-display);
          font-size: 8rem; line-height: 0.6;
          position: absolute; top: 20px; left: 20px;
          color: rgba(201,160,88,0.15); pointer-events: none;
        }
        .about-hero-quote p {
          font-family: var(--font-display);
          font-size: 1.25rem; font-style: italic;
          line-height: 1.6; color: rgba(44,36,23,0.7);
          position: relative; z-index: 1;
        }
        .about-hero-quote cite {
          display: block; margin-top: 14px;
          font-family: var(--font-body); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(44,36,23,0.35); font-style: normal;
        }

        /* ── BIO SECTION ── */
        .about-bio {
          background: var(--sand);
          padding: 100px 64px;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .about-bio-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.1fr;
          gap: 80px; align-items: start;
        }

        .about-portrait {
          position: relative;
        }
        .about-portrait-card {
          background: var(--white);
          border: 1px solid rgba(44,36,23,0.08);
          border-radius: 16px; overflow: hidden;
          aspect-ratio: 3/4;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .about-portrait-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, var(--gold), var(--terra));
        }
        .about-portrait-placeholder {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
        }

        /* Stats strip */
        .about-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(44,36,23,0.1);
          border-radius: 10px; overflow: hidden; margin-top: 16px;
        }
        .about-stat {
          background: var(--white); padding: 18px 12px; text-align: center;
        }
        .about-stat-num {
          font-family: var(--font-display);
          font-size: 1.8rem; font-weight: 600; color: var(--terra);
        }
        .about-stat-label {
          font-family: var(--font-body); font-size: 0.65rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(44,36,23,0.4); margin-top: 3px;
        }

        .about-bio-text {
          font-family: var(--font-body); font-size: 1rem;
          line-height: 1.85; color: rgba(44,36,23,0.65);
        }
        .about-bio-text + .about-bio-text { margin-top: 20px; }

        /* cert tags */
        .cert-card {
          background: var(--white);
          border: 1px solid rgba(44,36,23,0.07);
          border-radius: 10px; padding: 20px 24px;
          display: flex; align-items: flex-start; gap: 16px;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .cert-card:hover { box-shadow: 0 12px 32px rgba(44,36,23,0.08); transform: translateY(-2px); }
        .cert-num {
          font-family: var(--font-display); font-size: 1.4rem;
          font-weight: 600; color: rgba(201,160,88,0.4);
          line-height: 1; flex-shrink: 0; min-width: 28px;
        }
        .cert-org {
          font-family: var(--font-display); font-size: 1.05rem;
          font-weight: 600; color: var(--bark); margin-bottom: 4px;
        }
        .cert-focus {
          font-family: var(--font-body); font-size: 0.8rem;
          color: rgba(44,36,23,0.5); letter-spacing: 0.03em;
        }
        .cert-country {
          font-family: var(--font-body); font-size: 0.65rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--terra); margin-top: 4px;
        }

        /* ── TIMELINE ── */
        .about-timeline {
          background: var(--white);
          padding: 100px 64px;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .about-timeline-inner { max-width: 800px; margin: 0 auto; }
        .timeline-track {
          position: relative; margin-top: 56px;
          padding-left: 40px;
          border-left: 1px solid rgba(44,36,23,0.1);
        }
        .timeline-item {
          position: relative; margin-bottom: 48px;
        }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-dot {
          position: absolute; left: -47px; top: 4px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--gold);
          border: 2px solid var(--white);
          box-shadow: 0 0 0 3px rgba(201,160,88,0.2);
        }
        .timeline-year {
          font-family: var(--font-display); font-size: 1.5rem;
          font-weight: 600; color: var(--terra); margin-bottom: 6px;
        }
        .timeline-event {
          font-family: var(--font-body); font-size: 0.95rem;
          line-height: 1.75; color: rgba(44,36,23,0.6);
        }

        /* ── PHILOSOPHY ── */
        .about-philosophy {
          background: var(--bark);
          padding: 100px 64px;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .about-philosophy-inner { max-width: 1200px; margin: 0 auto; }
        .phil-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; margin-top: 56px;
        }
        .phil-card {
          background: rgba(247,243,236,0.05);
          border: 1px solid rgba(247,243,236,0.08);
          border-radius: 14px; padding: 40px 32px;
          transition: background 0.3s, transform 0.3s;
        }
        .phil-card:hover { background: rgba(247,243,236,0.09); transform: translateY(-4px); }
        .phil-icon { font-size: 2rem; margin-bottom: 20px; }
        .phil-title {
          font-family: var(--font-display); font-size: 1.4rem;
          font-weight: 600; color: var(--cream); margin-bottom: 12px;
        }
        .phil-body {
          font-family: var(--font-body); font-size: 0.875rem;
          line-height: 1.8; color: rgba(247,243,236,0.5);
        }

        /* ── CLOSING QUOTE ── */
        .about-closing {
          background: var(--cream);
          padding: 100px 64px;
          text-align: center;
        }
        .about-closing-inner { max-width: 700px; margin: 0 auto; }
        .about-closing-quote {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-style: italic; font-weight: 400;
          line-height: 1.5; color: rgba(44,36,23,0.7);
          margin-bottom: 40px;
        }
        .about-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.75rem;
          font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 30px; border-radius: 7px;
          background: var(--bark); color: var(--cream);
          text-decoration: none;
          transition: background 0.22s, transform 0.18s;
        }
        .about-cta-btn:hover { background: #1a160e; transform: translateY(-1px); }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 28s linear infinite; }

        @media (max-width: 900px) {
          .about-hero { padding: 100px 28px 60px; min-height: auto; }
          .about-hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .about-bio { padding: 72px 28px; }
          .about-bio-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-timeline { padding: 72px 28px; }
          .about-philosophy { padding: 72px 28px; }
          .phil-grid { grid-template-columns: 1fr; }
          .about-closing { padding: 72px 28px; }
        }
      `}</style>

      <motion.div
        className="about-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >

        {/* ── HERO ── */}
        <section className="about-hero" ref={heroRef}>
          {/* Decorative ring */}
          <div className="spin-slow" style={{ position: "absolute", top: "10%", right: "5%", width: 200, height: 200, borderRadius: "50%", border: "1px dashed rgba(44,36,23,0.08)", pointerEvents: "none", zIndex: 0 }} />

          <div className="about-hero-inner">
            <motion.div className="about-hero-grid" variants={stagger} initial="hidden" animate="show">

              {/* Left */}
              <motion.div variants={fadeUp}>
                <div className="section-label">About</div>
                <h1 className="about-hero-title">
                  The woman <br />
                  <em>behind the mat.</em>
                </h1>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(44,36,23,0.5)", marginTop: 20, maxWidth: 420 }}>
                  Fifteen years of practice, thousands of students, and one unwavering belief — that stillness is the foundation of a meaningful life.
                </p>
              </motion.div>

              {/* Right — pull quote */}
              <motion.div variants={fadeUp} custom={1}>
                <div className="about-hero-quote">
                  <p>"Yoga is not about touching your toes. It is what you learn on the way down."</p>
                  <cite>— Jigar Gor</cite>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ── BIO + CERTIFICATIONS ── */}
        <section className="about-bio">
          <div className="about-bio-inner">

            {/* Left — portrait + stats */}
            <motion.div
              className="about-portrait"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="about-portrait-card">
                <div className="about-portrait-placeholder">
                  <span style={{ fontSize: "5rem" }}>🪷</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontStyle: "italic", color: "rgba(44,36,23,0.3)" }}>Nandini Singh</span>
                </div>
              </div>
              <div className="about-stats">
                {[["15+", "Years"], ["3K+", "Students"], ["50+", "Workshops"]].map(([num, label]) => (
                  <div key={label} className="about-stat">
                    <p className="about-stat-num">{num}</p>
                    <p className="about-stat-label">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — text + certs */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp}>
                <div className="section-label">Her Story</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 400, lineHeight: 1.2, color: "var(--bark)", marginBottom: 24 }}>
                  Rooted in tradition. <br />
                  <span style={{ fontStyle: "italic" }}>Open to the world.</span>
                </h2>
                <p className="about-bio-text">
                  Nandini Singh is a globally certified yoga and meditation teacher whose path began in the sacred valleys of Rishikesh. Her teaching draws from the living roots of Indian philosophy — Patanjali's Yoga Sutras, Ayurvedic science, and the subtle art of pranayama.
                </p>
                <p className="about-bio-text" style={{ marginTop: 18 }}>
                  Over fifteen years, she has guided thousands of students — from beginners discovering their first breath to advanced practitioners deepening long-standing practices. Her approach is unhurried, precise, and deeply personal.
                </p>
              </motion.div>

              {/* Certifications */}
              <motion.div variants={fadeUp} custom={1} style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--terra)", marginBottom: 8 }}>Certifications</p>
                {CERTIFICATIONS.map(({ org, focus, country }, i) => (
                  <motion.div key={i} className="cert-card" variants={fadeUp} custom={i + 2}>
                    <span className="cert-num">0{i + 1}</span>
                    <div>
                      <p className="cert-org">{org}</p>
                      <p className="cert-focus">{focus}</p>
                      <p className="cert-country">{country}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="about-timeline">
          <div className="about-timeline-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label">Journey</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, lineHeight: 1.2, color: "var(--bark)" }}>
                Milestones along <span style={{ fontStyle: "italic" }}>the path.</span>
              </h2>
            </motion.div>

            <div className="timeline-track">
              {TIMELINE.map(({ year, event }, i) => (
                <motion.div
                  key={i}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="timeline-dot" />
                  <p className="timeline-year">{year}</p>
                  <p className="timeline-event">{event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHILOSOPHY ── */}
        <section className="about-philosophy">
          <div className="about-philosophy-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(247,243,236,0.4)", marginBottom: 16 }}>
                <span>Teaching Philosophy</span>
                <span style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.1)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.2 }}>
                What guides every <span style={{ fontStyle: "italic" }}>session.</span>
              </h2>
            </motion.div>

            <motion.div
              className="phil-grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {PHILOSOPHY.map(({ icon, title, body }, i) => (
                <motion.div key={i} className="phil-card" variants={fadeUp} custom={i}>
                  <div className="phil-icon">{icon}</div>
                  <h3 className="phil-title">{title}</h3>
                  <p className="phil-body">{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="about-closing">
          <motion.div
            className="about-closing-inner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontSize: "2rem", marginBottom: 28 }}>✦</div>
            <p className="about-closing-quote">
              "Each breath is a brushstroke painting your inner canvas with peace, balance, and joy."
            </p>
            <Link to="/contact" className="about-cta-btn">
              Begin your practice →
            </Link>
          </motion.div>
        </section>

      </motion.div>
    </>
  );
};

export default About;
