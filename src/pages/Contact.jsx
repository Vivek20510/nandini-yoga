import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import TestimonialsForm from "../components/TestimonialsForm";

/* ── DATA ── */
const MESSAGE_SUGGESTIONS = {
  "General Enquiry": "I'd love to learn more about your sessions and offerings.",
  "Personal Yoga Session": "I'm interested in booking a personal yoga session at my home.",
  "Yoga Camp Participation": "I'd like to know more about upcoming yoga camps and how to join.",
  "Corporate or Workplace Wellness": "We're exploring wellness options for our team. Can we connect?",
  "Collaboration / Partnership": "I'm interested in collaborating or partnering with your team.",
  "Feedback": "I recently attended a session and would love to share my thoughts.",
  "Other": "I have a unique question or something else to share.",
};

const CONTACT_ITEMS = [
  { icon: <Mail size={16} />, label: "Email",  value: "yoga.nandinisingh@gmail.com", href: "mailto:yoga.nandinisingh@gmail.com" },
  { icon: <Phone size={16} />, label: "Phone",  value: "+91 9340885284",              href: "tel:+919340885284" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };

const Contact = () => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [reason,    setReason]    = useState("General Enquiry");
  const [message,   setMessage]   = useState(MESSAGE_SUGGESTIONS["General Enquiry"]);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const serviceID      = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID_own = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER;
    const templateID_usr = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_USER;
    const publicKey      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs
      .sendForm(serviceID, templateID_own, form.current, publicKey)
      .then(() => emailjs.sendForm(serviceID, templateID_usr, form.current, publicKey))
      .then(() => { setSubmitted(true); setLoading(false); })
      .catch((err) => { console.error(err); setError("Something went wrong. Please try again."); setLoading(false); });
  };

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

        .ct-root {
          background: var(--cream);
          min-height: 100vh;
          font-family: var(--font-body);
        }

        /* ─────────────────────────
           HERO
        ───────────────────────── */
        .ct-hero {
          background: var(--white);
          padding: 130px 80px 88px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }

        .ct-hero::after {
          content: '';
          position: absolute;
          width: 550px; height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,114,74,0.08) 0%, transparent 70%);
          top: -15%; right: -8%;
          pointer-events: none;
        }

        .ct-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-label {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--font-body);
          font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--terra); margin-bottom: 20px;
        }

        .section-label::after {
          content: ''; width: 48px; height: 1px;
          background: rgba(184,114,74,0.3);
        }

        .ct-title {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 300; line-height: 1.08;
          letter-spacing: -0.01em; color: var(--bark);
        }

        .ct-title em { font-style: italic; color: var(--moss); }

        .ct-subtitle {
          font-family: var(--font-body);
          font-size: 1rem; line-height: 1.8;
          color: rgba(44,36,23,0.5);
          max-width: 440px; margin-top: 20px;
        }

        /* ─────────────────────────
           MAIN GRID
        ───────────────────────── */
        .ct-main { padding: 80px 80px 100px; }

        .ct-main-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 80px;
          align-items: start;
        }

        /* ─────────────────────────
           LEFT SIDEBAR
        ───────────────────────── */
        .ct-sidebar-title {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 600;
          color: var(--bark); margin-bottom: 8px;
        }

        .ct-sidebar-sub {
          font-family: var(--font-body);
          font-size: 0.875rem; line-height: 1.75;
          color: rgba(44,36,23,0.5); margin-bottom: 36px;
        }

        .ct-contact-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }

        .ct-contact-item:last-of-type { border-bottom: none; }

        .ct-contact-icon {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--sand);
          display: flex; align-items: center; justify-content: center;
          color: var(--terra); flex-shrink: 0;
        }

        .ct-contact-label {
          font-family: var(--font-body);
          font-size: 0.62rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(44,36,23,0.35);
          margin-bottom: 3px;
        }

        .ct-contact-value {
          font-family: var(--font-body);
          font-size: 0.875rem; color: var(--bark);
          text-decoration: none; transition: color 0.2s;
          word-break: break-all;
        }

        .ct-contact-value:hover { color: var(--terra); }

        /* availability */
        .ct-availability {
          margin-top: 36px; padding: 20px 22px;
          background: rgba(74,92,63,0.07);
          border: 1px solid rgba(74,92,63,0.15);
          border-radius: 10px;
          display: flex; align-items: flex-start; gap: 12px;
        }

        .ct-avail-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--moss); flex-shrink: 0; margin-top: 5px;
          box-shadow: 0 0 0 3px rgba(74,92,63,0.2);
          animation: pulse-dot 2.5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(74,92,63,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(74,92,63,0.07); }
        }

        .ct-avail-text {
          font-family: var(--font-body);
          font-size: 0.82rem; line-height: 1.65;
          color: rgba(44,36,23,0.6);
        }

        .ct-avail-text strong { color: var(--moss); font-weight: 500; }

        /* ─────────────────────────
           FORM CARD
        ───────────────────────── */
        .ct-form-card {
          background: var(--white);
          border: 1px solid rgba(44,36,23,0.07);
          border-radius: 16px;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .ct-form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--terra));
        }

        .ct-field { margin-bottom: 22px; }

        .ct-label {
          display: block; font-family: var(--font-body);
          font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(44,36,23,0.4); margin-bottom: 8px;
        }

        .ct-input, .ct-select, .ct-textarea {
          width: 100%; font-family: var(--font-body);
          font-size: 0.9rem; color: var(--bark);
          background: var(--cream);
          border: 1px solid rgba(44,36,23,0.1);
          border-radius: 8px; padding: 13px 16px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }

        .ct-input::placeholder, .ct-textarea::placeholder {
          color: rgba(44,36,23,0.25);
        }

        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          border-color: rgba(44,36,23,0.3);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(44,36,23,0.05);
        }

        .ct-select { appearance: none; cursor: pointer; }
        .ct-textarea { resize: vertical; min-height: 120px; line-height: 1.7; }

        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .ct-select-wrap { position: relative; }
        .ct-select-caret {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(44,36,23,0.35); font-size: 0.7rem;
        }

        .ct-submit-btn {
          width: 100%; padding: 15px 24px;
          font-family: var(--font-body); font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          background: var(--bark); color: var(--cream);
          border: none; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.22s, transform 0.18s;
          margin-top: 8px;
        }

        .ct-submit-btn:hover:not(:disabled) { background: #1a160e; transform: translateY(-1px); }
        .ct-submit-btn:disabled { background: rgba(44,36,23,0.3); cursor: not-allowed; transform: none; }

        .ct-error {
          font-family: var(--font-body); font-size: 0.8rem;
          color: #B85C4A;
          background: rgba(184,92,74,0.07);
          border: 1px solid rgba(184,92,74,0.2);
          border-radius: 7px; padding: 10px 14px; margin-bottom: 16px;
        }

        /* spinner dots */
        .ct-dots { display: inline-flex; gap: 3px; align-items: center; }
        .ct-dots span {
          width: 4px; height: 4px; border-radius: 50%;
          background: currentColor; opacity: 0.5;
          animation: dot-bounce 1s ease-in-out infinite;
        }
        .ct-dots span:nth-child(2) { animation-delay: 0.15s; }
        .ct-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dot-bounce { 0%,80%,100% { transform: scale(0.6); } 40% { transform: scale(1); opacity:1; } }

        /* ─────────────────────────
           SUCCESS
        ───────────────────────── */
        .ct-success {
          background: var(--white);
          border: 1px solid rgba(44,36,23,0.07);
          border-radius: 16px;
          padding: 72px 48px;
          text-align: center;
          max-width: 680px;
          margin: 80px auto;
          position: relative; overflow: hidden;
        }

        .ct-success::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--moss), var(--gold));
        }

        .ct-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(74,92,63,0.1);
          border: 1px solid rgba(74,92,63,0.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; color: var(--moss);
        }

        .ct-success-title {
          font-family: var(--font-display);
          font-size: 2.2rem; font-weight: 400;
          color: var(--bark); margin-bottom: 14px; line-height: 1.2;
        }

        .ct-success-body {
          font-family: var(--font-body); font-size: 0.9rem;
          line-height: 1.8; color: rgba(44,36,23,0.55);
          max-width: 400px; margin: 0 auto 36px;
        }

        .ct-success-btns {
          display: flex; gap: 14px;
          justify-content: center; flex-wrap: wrap;
        }

        .ct-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.75rem;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 7px;
          background: var(--bark); color: var(--cream);
          text-decoration: none; transition: background 0.22s;
        }

        .ct-btn-primary:hover { background: #1a160e; }

        .ct-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.75rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 7px;
          border: 1px solid rgba(44,36,23,0.2); color: var(--bark);
          text-decoration: none;
          transition: border-color 0.22s, background 0.22s;
        }

        .ct-btn-outline:hover { border-color: var(--bark); background: rgba(44,36,23,0.04); }

        /* ─────────────────────────
           TESTIMONIALS SECTION
        ───────────────────────── */
        .ct-testimonials-section {
          padding: 80px 80px 100px;
          border-top: 1px solid rgba(44,36,23,0.07);
        }

        .ct-testimonials-inner { max-width: 860px; margin: 0 auto; }

        .ct-testimonials-hd {
          text-align: center; margin-bottom: 48px;
        }

        .ct-testimonials-hd h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 400; color: var(--bark); margin-bottom: 12px;
        }

        .ct-testimonials-hd h2 em { font-style: italic; color: var(--moss); }

        .ct-testimonials-hd p {
          font-family: var(--font-body);
          font-size: 0.95rem; line-height: 1.75;
          color: rgba(44,36,23,0.5);
          max-width: 400px; margin: 0 auto;
        }

        /* ─────────────────────────
           MEDIA QUERIES
        ───────────────────────── */

        /* Large desktop (1400px+) */
        @media (min-width: 1400px) {
          .ct-hero  { padding: 140px 120px 96px; }
          .ct-main  { padding: 96px 120px 120px; }
          .ct-testimonials-section { padding: 96px 120px 120px; }
        }

        /* Tablet landscape / small desktop (1024px – 1199px) */
        @media (max-width: 1199px) {
          .ct-hero  { padding: 120px 48px 72px; }
          .ct-main  { padding: 64px 48px 88px; }
          .ct-main-inner { gap: 56px; }
          .ct-testimonials-section { padding: 64px 48px 88px; }
          .ct-form-card { padding: 40px 36px; }
        }

        /* Tablet portrait (768px – 1023px) */
        @media (max-width: 1023px) {
          .ct-hero  { padding: 110px 36px 64px; }
          .ct-main  { padding: 56px 36px 80px; }
          .ct-main-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .ct-testimonials-section { padding: 56px 36px 80px; }
          .ct-form-card { padding: 36px 32px; }
          .ct-title { font-size: clamp(2.6rem, 5.5vw, 3.8rem); }
          .ct-success { padding: 56px 36px; margin: 56px auto; }
          .ct-success-title { font-size: 2rem; }
        }

        /* Large mobile / small tablet (600px – 767px) */
        @media (max-width: 767px) {
          .ct-hero  { padding: 96px 24px 56px; }
          .ct-main  { padding: 48px 24px 72px; }
          .ct-testimonials-section { padding: 48px 24px 72px; }

          .ct-title { font-size: clamp(2.2rem, 7vw, 3rem); }
          .ct-subtitle { font-size: 0.92rem; max-width: 100%; }

          .ct-form-card { padding: 28px 22px; }

          /* Two-column name/email row → single column */
          .ct-row { grid-template-columns: 1fr; gap: 0; }

          .ct-sidebar-title { font-size: 1.3rem; }
          .ct-sidebar-sub { font-size: 0.84rem; margin-bottom: 28px; }

          .ct-contact-item { padding: 14px 0; gap: 12px; }
          .ct-contact-icon { width: 32px; height: 32px; }

          .ct-availability { padding: 16px 18px; }
          .ct-avail-text { font-size: 0.8rem; }

          .ct-success { padding: 44px 24px; margin: 40px auto; }
          .ct-success-title { font-size: 1.75rem; }
          .ct-success-body { font-size: 0.875rem; }
          .ct-success-btns { flex-direction: column; align-items: center; }
          .ct-btn-primary, .ct-btn-outline { width: 100%; justify-content: center; }

          .ct-testimonials-hd h2 { font-size: clamp(1.6rem, 6vw, 2.2rem); }
          .ct-testimonials-hd p  { font-size: 0.88rem; }
        }

        /* Mobile (up to 599px) */
        @media (max-width: 599px) {
          .ct-hero  { padding: 88px 18px 48px; }
          .ct-main  { padding: 40px 18px 64px; }
          .ct-testimonials-section { padding: 40px 18px 64px; }

          .ct-title { font-size: clamp(2rem, 8.5vw, 2.6rem); }
          .ct-subtitle { font-size: 0.875rem; }

          .ct-form-card { padding: 22px 16px; border-radius: 12px; }

          .ct-input, .ct-select, .ct-textarea {
            font-size: 0.875rem;
            padding: 11px 13px;
          }

          .ct-submit-btn {
            padding: 14px 20px;
            font-size: 0.74rem;
          }

          .ct-label { font-size: 0.6rem; }

          .ct-contact-value { font-size: 0.82rem; }

          .ct-section-label-text { display: none; } /* hide long label text if needed */

          .ct-success { border-radius: 12px; padding: 36px 18px; }
          .ct-success-icon { width: 52px; height: 52px; }
          .ct-success-title { font-size: 1.55rem; }

          .ct-availability { padding: 14px 14px; border-radius: 8px; }
        }

        /* Extra small (up to 380px) */
        @media (max-width: 380px) {
          .ct-hero { padding: 80px 16px 40px; }
          .ct-main { padding: 32px 16px 56px; }
          .ct-testimonials-section { padding: 32px 16px 56px; }

          .ct-title { font-size: 1.9rem; }
          .ct-form-card { padding: 18px 14px; }

          .ct-input, .ct-select, .ct-textarea { padding: 10px 12px; font-size: 0.84rem; }

          .ct-contact-icon { width: 30px; height: 30px; }
          .ct-contact-value { font-size: 0.78rem; }
        }
      `}</style>

      <motion.div
        className="ct-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* ── HERO ── */}
        <header className="ct-hero">
          <div className="ct-hero-inner">
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.div className="section-label" variants={fadeUp}>Get in touch</motion.div>
              <motion.h1 className="ct-title" variants={fadeUp}>
                Let's begin <br /><em>together.</em>
              </motion.h1>
              <motion.p className="ct-subtitle" variants={fadeUp}>
                Whether you're curious about personal sessions, corporate wellness, or simply have a question — reach out.
              </motion.p>
            </motion.div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="ct-main">
          <div className="ct-main-inner">

            {submitted ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <motion.div
                  className="ct-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ct-success-icon"><CheckCircle size={26} /></div>
                  <h3 className="ct-success-title">
                    Thank you for <span style={{ fontStyle: "italic" }}>reaching out.</span>
                  </h3>
                  <p className="ct-success-body">
                    Your message has been received. We'll be in touch soon. In the meantime, explore Nandini's programs and wellness insights.
                  </p>
                  <div className="ct-success-btns">
                    <Link to="/" className="ct-btn-primary">Back to Home <ArrowRight size={13} /></Link>
                    <Link to="/blog" className="ct-btn-outline">Read the Blog</Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                {/* ── LEFT: Contact Info ── */}
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.div variants={fadeUp}>
                    <h2 className="ct-sidebar-title">Contact Details</h2>
                    <p className="ct-sidebar-sub">
                      Reach out for personal yoga sessions, corporate wellness programs, retreats, or event collaborations.
                    </p>
                  </motion.div>

                  {CONTACT_ITEMS.map(({ icon, label, value, href }, i) => (
                    <motion.div key={i} className="ct-contact-item" variants={fadeUp} custom={i + 1}>
                      <div className="ct-contact-icon">{icon}</div>
                      <div>
                        <p className="ct-contact-label">{label}</p>
                        <a href={href} className="ct-contact-value">{value}</a>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div className="ct-availability" variants={fadeUp} custom={3}>
                    <div className="ct-avail-dot" />
                    <p className="ct-avail-text">
                      <strong>Currently accepting new students.</strong> Online and in-person sessions available across India and internationally.
                    </p>
                  </motion.div>
                </motion.div>

                {/* ── RIGHT: Form ── */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ct-form-card">
                    <form ref={form} onSubmit={sendEmail}>

                      <div className="ct-row">
                        <div className="ct-field">
                          <label className="ct-label">Your Name *</label>
                          <input type="text" name="name" required className="ct-input" placeholder="Anjali Kumar" />
                        </div>
                        <div className="ct-field">
                          <label className="ct-label">Your Email *</label>
                          <input type="email" name="email" required className="ct-input" placeholder="you@email.com" />
                        </div>
                      </div>

                      <div className="ct-field">
                        <label className="ct-label">Subject</label>
                        <div className="ct-select-wrap">
                          <select
                            name="subject"
                            value={reason}
                            onChange={(e) => {
                              setReason(e.target.value);
                              setMessage(MESSAGE_SUGGESTIONS[e.target.value] || "");
                            }}
                            className="ct-select"
                          >
                            {Object.keys(MESSAGE_SUGGESTIONS).map((k) => (
                              <option key={k}>{k}</option>
                            ))}
                          </select>
                          <span className="ct-select-caret">▾</span>
                        </div>
                      </div>

                      <div className="ct-field">
                        <label className="ct-label">Message</label>
                        <textarea
                          name="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="ct-textarea"
                          placeholder="Write your message..."
                        />
                      </div>

                      {error && <p className="ct-error">{error}</p>}

                      <button type="submit" disabled={loading} className="ct-submit-btn">
                        {loading ? (
                          <>
                            Sending
                            <span className="ct-dots">
                              <span /><span /><span />
                            </span>
                          </>
                        ) : (
                          <>Send Message <ArrowRight size={14} /></>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* ── TESTIMONIALS ── */}
        <section className="ct-testimonials-section">
          <div className="ct-testimonials-inner">
            <motion.div
              className="ct-testimonials-hd"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2>Share Your <em>Yoga Journey</em></h2>
              <p>Your experience can inspire others. Submit your testimonial below.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <TestimonialsForm />
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Contact;
