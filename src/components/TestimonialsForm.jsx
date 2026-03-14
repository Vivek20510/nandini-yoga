import React, { useState, useCallback, useRef } from "react";
import { Star, CheckCircle, AlertCircle, X, RefreshCw, Camera, Sparkles } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   3D Avatar — local PNGs
───────────────────────────────────────── */
const AVATARS = [
  "/src/assets/avatars/avatar-1.png",
  "/src/assets/avatars/avatar-2.png",
  "/src/assets/avatars/avatar-3.png",
  "/src/assets/avatars/avatar-4.png",
  "/src/assets/avatars/avatar-5.png",
  "/src/assets/avatars/avatar-6.png",
];

const randomAvatar = (exclude = null) => {
  const pool = exclude ? AVATARS.filter((a) => a !== exclude) : AVATARS;
  return pool[Math.floor(Math.random() * pool.length)];
};

/* ─────────────────────────────────────────
   Star Picker
───────────────────────────────────────── */
const STAR_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
const StarPicker = ({ value, onChange }) => {
  const [hov, setHov] = useState(0);
  const active = hov || value;
  return (
    <div className="tf2-star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.button
          key={s} type="button"
          whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHov(s)}
          onMouseLeave={() => setHov(0)}
          onClick={() => onChange(s)}
          className={`tf2-star ${s <= active ? "tf2-star-on" : ""}`}
          aria-label={`${s} stars`}
        >
          <Star size={24} />
        </motion.button>
      ))}
      <AnimatePresence mode="wait">
        <motion.span
          key={active}
          className="tf2-star-word"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
        >
          {STAR_WORDS[active]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   Floating Label wrapper
───────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div className="tf2-field">
    {children}
    <label className="tf2-flabel">
      {label}{required && <span className="tf2-req"> *</span>}
    </label>
  </div>
);

/* ─────────────────────────────────────────
   Mandala rings
───────────────────────────────────────── */
const MandalaRings = () => (
  <svg className="tf2-mandala" viewBox="0 0 260 260" fill="none">
    <circle cx="130" cy="130" r="118" stroke="rgba(201,168,76,0.12)" strokeWidth="1"/>
    <circle cx="130" cy="130" r="100" stroke="rgba(201,168,76,0.09)" strokeWidth="1" strokeDasharray="4 8"/>
    <circle cx="130" cy="130" r="82"  stroke="rgba(201,168,76,0.15)" strokeWidth="1"/>
    <circle cx="130" cy="130" r="64"  stroke="rgba(201,168,76,0.08)" strokeWidth="1" strokeDasharray="2 6"/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <ellipse key={i} cx="130" cy="130" rx="7" ry="18"
        fill="rgba(201,168,76,0.07)"
        transform={`rotate(${deg} 130 130) translate(0 -92)`}
      />
    ))}
  </svg>
);

/* ─────────────────────────────────────────
   Arc progress — 500 word limit
───────────────────────────────────────── */
const MAX_WORDS = 500;

const wordCount = (text) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const ArcProgress = ({ count }) => {
  const pct  = Math.min(count / MAX_WORDS, 1);
  const r    = 10;
  const circ = 2 * Math.PI * r;
  const fill = circ * pct;
  const over = count > MAX_WORDS;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="14" cy="14" r={r} stroke="rgba(44,36,23,0.1)" strokeWidth="2.5" fill="none"/>
      <circle
        cx="14" cy="14" r={r}
        stroke={over ? "#C0503A" : count > MAX_WORDS * 0.8 ? "#C9A84C" : "#4A5C3F"}
        strokeWidth="2.5" fill="none"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.3s, stroke 0.3s" }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const TestimonialsForm = () => {
  const [formData, setFormData] = useState({
    name: "", role: "", email: "", text: "", rating: 5, image: null,
  });
  const [currentAvatar, setCurrentAvatar] = useState(() => randomAvatar());
  const [imagePreview,  setImagePreview]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState(null);
  const [isShuffling,   setIsShuffling]   = useState(false);
  const [dragOver,      setDragOver]      = useState(false);
  const fileRef = useRef();

  const displayAvatar = imagePreview || currentAvatar;
  const words = wordCount(formData.text);
  const overLimit = words > MAX_WORDS;

  /* ── Shuffle ── */
  const shuffleAvatar = useCallback(() => {
    if (imagePreview) return;
    setIsShuffling(true);
    setCurrentAvatar((prev) => randomAvatar(prev));
    setTimeout(() => setIsShuffling(false), 500);
  }, [imagePreview]);

  /* ── Input ── */
  const handleInput = (e) => {
    const { name, value } = e.target;
    // Block typing past word limit for the text field
    if (name === "text") {
      const wc = wordCount(value);
      if (wc > MAX_WORDS) return; // hard stop
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ── File handling ── */
  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFormData((p) => ({ ...p, image: file }));
    const r = new FileReader();
    r.onload = () => setImagePreview(r.result);
    r.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData((p) => ({ ...p, image: null }));
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Cloudinary upload ── */
  const uploadToCloudinary = async (file) => {
    const d = new FormData();
    d.append("file", file);
    d.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, d
    );
    return res.data.secure_url;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (overLimit) return;
    setLoading(true);
    setError(null);
    try {
      let imageUrl;

      if (formData.image) {
        // User uploaded their own photo → upload to Cloudinary
        imageUrl = await uploadToCloudinary(formData.image);
      } else {
        // No photo → fetch the local 3D avatar PNG as a blob → upload to Cloudinary
        const response = await fetch(currentAvatar);
        const blob     = await response.blob();
        const file     = new File([blob], "avatar.png", { type: "image/png" });
        imageUrl       = await uploadToCloudinary(file);
      }

      await addDoc(collection(db, "testimonials"), {
        name:     formData.name,
        role:     formData.role,
        email:    formData.email || null,
        text:     formData.text,
        rating:   formData.rating,
        image:    imageUrl,          // always a Cloudinary URL
        date:     Timestamp.now(),
        approved: false,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const reset = () => {
    setSubmitted(false);
    setFormData({ name: "", role: "", email: "", text: "", rating: 5, image: null });
    setImagePreview(null);
    setCurrentAvatar(randomAvatar());
    setError(null);
  };

  /* ══════════════════════════════════════
     CSS
  ══════════════════════════════════════ */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --f-ink:   #1C2B1E;
      --f-cream: #F8F3EA;
      --f-sand:  #EDE5D0;
      --f-bark:  #2C2417;
      --f-moss:  #3D5240;
      --f-gold:  #C9A84C;
      --f-terra: #B8724A;
      --f-red:   #C0503A;
      --f-white: #FDFAF5;
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-mono:  'DM Mono', monospace;
      --font-sans:  'DM Sans', sans-serif;
    }

    .tf2-card {
      max-width: 900px; margin: 0 auto;
      display: grid; grid-template-columns: 340px 1fr;
      border-radius: 28px; overflow: hidden;
      box-shadow:
        0 0 0 1px rgba(28,43,30,0.08),
        0 4px 12px rgba(28,43,30,0.06),
        0 20px 60px rgba(28,43,30,0.14),
        0 40px 100px rgba(28,43,30,0.08);
    }

    /* ── LEFT ── */
    .tf2-left {
      background: var(--f-ink);
      padding: 52px 32px 44px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: space-between;
      position: relative; overflow: hidden; gap: 28px;
    }
    .tf2-left::before {
      content: ''; position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 70% 50% at 30% 10%,  rgba(201,168,76,0.22) 0%, transparent 60%),
        radial-gradient(ellipse 60% 60% at 80% 80%,  rgba(61,82,64,0.55)  0%, transparent 55%),
        radial-gradient(ellipse 80% 40% at 50% 100%, rgba(44,36,23,0.6)   0%, transparent 60%);
      pointer-events: none; z-index: 0;
    }
    .tf2-left::after {
      content: ''; position: absolute; inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none; z-index: 0;
    }
    .tf2-left-body {
      position: relative; z-index: 1;
      display: flex; flex-direction: column;
      align-items: center; gap: 22px; width: 100%;
    }
    .tf2-vert-label {
      position: absolute; top: 50%; left: -38px;
      transform: translateY(-50%) rotate(-90deg);
      font-family: var(--font-mono); font-size: 9px;
      letter-spacing: 0.35em; text-transform: uppercase;
      color: rgba(255,255,255,0.12); white-space: nowrap;
      pointer-events: none; z-index: 1;
    }

    /* Avatar */
    .tf2-avatar-cluster {
      position: relative; width: 170px; height: 170px;
      display: flex; align-items: center; justify-content: center;
    }
    .tf2-mandala {
      position: absolute; inset: -50px;
      width: calc(100% + 100px); height: calc(100% + 100px);
      animation: tf2-mandalaSpin 30s linear infinite;
      opacity: 0.8; pointer-events: none;
    }
    @keyframes tf2-mandalaSpin { to { transform: rotate(360deg); } }

    .tf2-orbit-ring {
      position: absolute; inset: -18px; border-radius: 50%;
      border: 1px solid rgba(201,168,76,0.2);
      animation: tf2-orbitSpin 10s linear infinite;
    }
    .tf2-orbit-ring::before {
      content: ''; position: absolute; top: -6px; left: 50%;
      transform: translateX(-50%);
      width: 11px; height: 11px; border-radius: 50%;
      background: var(--f-gold);
      box-shadow: 0 0 14px var(--f-gold), 0 0 6px rgba(255,255,255,0.6);
    }
    @keyframes tf2-orbitSpin { to { transform: rotate(360deg); } }

    .tf2-glow-ring {
      position: absolute; inset: -8px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
      box-shadow: 0 0 40px rgba(201,168,76,0.15);
    }

    .tf2-avatar-img {
      width: 150px; height: 150px; border-radius: 50%;
      object-fit: cover; object-position: center top;
      background: #000;
      border: 3px solid rgba(255,255,255,0.1);
      box-shadow: 0 0 0 8px rgba(201,168,76,0.08), 0 24px 56px rgba(0,0,0,0.5);
      display: block; position: relative; z-index: 2;
      transition: border-color 0.3s;
    }
    .tf2-avatar-img.is-photo {
      background: transparent;
      border-color: rgba(201,168,76,0.4);
      object-position: center center;
    }

    .tf2-avatar-del {
      position: absolute; top: 10px; right: 10px;
      width: 26px; height: 26px; border-radius: 50%;
      background: var(--f-red); border: 2px solid rgba(255,255,255,0.9);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: white; z-index: 3;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35); transition: transform 0.15s;
    }
    .tf2-avatar-del:hover { transform: scale(1.12); }

    /* Avatar dot pickers */
    .tf2-avatar-dots {
      display: flex; gap: 6px; align-items: center;
      position: relative; z-index: 1;
    }
    .tf2-avatar-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: none; padding: 0; cursor: pointer;
      transition: all 0.2s;
    }
    .tf2-avatar-dot.active {
      background: var(--f-gold);
      transform: scale(1.4);
      box-shadow: 0 0 6px rgba(201,168,76,0.6);
    }

    .tf2-shuffle {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: var(--font-mono); font-size: 10px;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: rgba(255,255,255,0.28);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 100px; padding: 7px 18px;
      cursor: pointer; transition: all 0.22s;
    }
    .tf2-shuffle:hover {
      color: var(--f-gold);
      border-color: rgba(201,168,76,0.35);
      background: rgba(201,168,76,0.08);
    }

    .tf2-left-title {
      font-family: var(--font-serif); font-size: 28px;
      font-weight: 400; line-height: 1.25;
      color: rgba(255,255,255,0.9); text-align: center;
    }
    .tf2-left-title em { font-style: italic; color: var(--f-gold); }

    .tf2-left-sub {
      font-family: var(--font-sans); font-size: 12px; line-height: 1.7;
      color: rgba(255,255,255,0.28); text-align: center; max-width: 210px;
    }

    .tf2-hairline {
      width: 48px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent);
    }

    .tf2-upload {
      position: relative; z-index: 1; width: 100%;
      border: 1.5px dashed rgba(255,255,255,0.1);
      border-radius: 12px; padding: 14px 16px;
      display: flex; align-items: center; gap: 12px;
      cursor: pointer; transition: all 0.22s;
      background: rgba(255,255,255,0.025);
    }
    .tf2-upload:hover, .tf2-upload--drag {
      border-color: rgba(201,168,76,0.45);
      background: rgba(201,168,76,0.07);
    }
    .tf2-upload-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.06);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.3); flex-shrink: 0; transition: all 0.22s;
    }
    .tf2-upload:hover .tf2-upload-icon { background: rgba(201,168,76,0.12); color: var(--f-gold); }
    .tf2-upload-txt strong {
      display: block; font-family: var(--font-sans);
      font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5);
    }
    .tf2-upload-txt span {
      font-family: var(--font-mono); font-size: 9.5px; color: rgba(255,255,255,0.18);
    }

    /* ── RIGHT ── */
    .tf2-right {
      background: var(--f-cream); padding: 44px 44px 40px;
      display: flex; flex-direction: column;
    }
    .tf2-right-head { margin-bottom: 30px; }
    .tf2-eyebrow {
      display: inline-flex; align-items: center; gap: 10px;
      font-family: var(--font-mono); font-size: 9px;
      letter-spacing: 0.28em; text-transform: uppercase;
      color: var(--f-terra); margin-bottom: 10px;
    }
    .tf2-eyebrow::after { content:''; width:24px; height:1px; background:rgba(184,114,74,0.4); }
    .tf2-h2 {
      font-family: var(--font-serif); font-size: 30px;
      font-weight: 400; line-height: 1.2; color: var(--f-bark);
    }
    .tf2-h2 em { font-style: italic; color: var(--f-moss); }

    .tf2-form { display:flex; flex-direction:column; gap:18px; flex:1; }
    .tf2-row  { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

    .tf2-field { position:relative; }
    .tf2-field input, .tf2-field textarea {
      width: 100%; font-family: var(--font-sans);
      font-size: 14px; color: var(--f-bark);
      background: rgba(255,255,255,0.7);
      border: 1.5px solid rgba(44,36,23,0.12);
      border-radius: 10px; padding: 22px 14px 8px;
      outline: none; resize: none; line-height: 1.65;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
      backdrop-filter: blur(4px);
    }
    .tf2-field textarea { min-height: 120px; padding-top: 24px; }
    .tf2-field input::placeholder,
    .tf2-field textarea::placeholder { color: transparent; }
    .tf2-field input:focus, .tf2-field textarea:focus {
      background: var(--f-white);
      border-color: rgba(61,82,64,0.45);
      box-shadow: 0 0 0 3px rgba(61,82,64,0.08);
    }
    .tf2-field textarea.over-limit {
      border-color: rgba(192,80,58,0.4) !important;
      box-shadow: 0 0 0 3px rgba(192,80,58,0.08) !important;
    }

    .tf2-flabel {
      position: absolute; left: 14px; top: 15px;
      font-family: var(--font-sans); font-size: 13px;
      color: rgba(44,36,23,0.32); pointer-events: none;
      transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
      transform-origin: left top;
    }
    .tf2-req { color: var(--f-terra); }
    .tf2-field input:focus ~ .tf2-flabel,
    .tf2-field input:not(:placeholder-shown) ~ .tf2-flabel,
    .tf2-field textarea:focus ~ .tf2-flabel,
    .tf2-field textarea:not(:placeholder-shown) ~ .tf2-flabel {
      transform: translateY(-8px) scale(0.72);
      color: var(--f-moss); font-weight: 600; letter-spacing: 0.04em;
    }

    /* Word counter row */
    .tf2-charrow {
      display: flex; align-items: center;
      justify-content: flex-end; gap: 6px; margin-top: 5px;
    }
    .tf2-charnum {
      font-family: var(--font-mono); font-size: 10px;
      color: rgba(44,36,23,0.3); transition: color 0.2s;
    }
    .tf2-charnum.over { color: var(--f-red); font-weight: 600; }

    .tf2-word-hint {
      font-family: var(--font-mono); font-size: 9px;
      color: rgba(44,36,23,0.25); margin-right: auto;
      letter-spacing: 0.05em;
    }

    /* Rating */
    .tf2-rating-block { display:flex; flex-direction:column; gap:8px; }
    .tf2-section-label {
      font-family: var(--font-mono); font-size: 9px;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: rgba(44,36,23,0.32);
    }
    .tf2-star-row { display:flex; align-items:center; gap:4px; }
    .tf2-star {
      background: none; border: none; cursor: pointer; padding: 2px;
      color: rgba(44,36,23,0.14); transition: color 0.15s; line-height: 1;
    }
    .tf2-star-on { color: var(--f-gold); }
    .tf2-star-on svg { fill: var(--f-gold); }
    .tf2-star-word {
      font-family: var(--font-serif); font-size: 18px;
      font-style: italic; color: rgba(44,36,23,0.5); margin-left: 8px;
    }

    /* Error */
    .tf2-error {
      display:flex; align-items:center; gap:8px;
      background: rgba(192,80,58,0.06);
      border: 1px solid rgba(192,80,58,0.22);
      border-radius: 10px; padding: 11px 14px;
      font-family: var(--font-sans); font-size: 13px; color: var(--f-red);
    }

    /* Submit */
    .tf2-btn {
      margin-top: 4px; position: relative; overflow: hidden;
      width: 100%; padding: 16px 24px;
      font-family: var(--font-mono); font-size: 11px;
      font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
      background: var(--f-ink); color: var(--f-cream);
      border: none; border-radius: 10px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: background 0.25s, transform 0.18s, box-shadow 0.18s;
      box-shadow: 0 6px 24px rgba(28,43,30,0.22);
    }
    .tf2-btn::after {
      content: ''; position: absolute; top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
      transition: left 0.55s ease;
    }
    .tf2-btn:hover::after { left: 160%; }
    .tf2-btn:hover:not(:disabled) {
      background: #0e1a10; transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(28,43,30,0.28);
    }
    .tf2-btn:disabled { background: rgba(28,43,30,0.25); cursor: not-allowed; box-shadow: none; }
    .tf2-spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(253,250,245,0.2);
      border-top-color: var(--f-cream);
      animation: tf2-spin 0.7s linear infinite;
    }
    @keyframes tf2-spin { to { transform: rotate(360deg); } }

    /* Success */
    .tf2-success-right {
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; text-align:center; padding:56px 40px; gap: 0;
    }
    .tf2-success-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(61,82,64,0.1); border: 1.5px solid rgba(61,82,64,0.2);
      display: flex; align-items: center; justify-content: center;
      color: var(--f-moss); margin-bottom: 22px;
    }
    .tf2-success-h {
      font-family: var(--font-serif); font-size: 32px; font-weight: 400;
      color: var(--f-bark); line-height: 1.2; margin-bottom: 14px;
    }
    .tf2-success-h em { font-style: italic; color: var(--f-moss); }
    .tf2-success-p {
      font-family: var(--font-sans); font-size: 14px; line-height: 1.75;
      color: rgba(44,36,23,0.55); max-width: 300px; margin-bottom: 32px;
    }
    .tf2-success-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--font-mono); font-size: 9.5px;
      letter-spacing: 0.1em; text-transform: uppercase; color: var(--f-moss);
      background: rgba(61,82,64,0.07); border: 1px solid rgba(61,82,64,0.18);
      border-radius: 100px; padding: 8px 18px; margin-bottom: 20px;
    }
    .tf2-success-again {
      background: none; border: none; cursor: pointer;
      font-family: var(--font-sans); font-size: 12px; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--f-terra);
      text-decoration: underline; text-decoration-color: rgba(184,114,74,0.3);
      text-underline-offset: 3px; transition: color 0.2s;
    }
    .tf2-success-again:hover { color: var(--f-bark); }

    /* Responsive */
    @media (max-width: 860px) {
      .tf2-card { grid-template-columns: 1fr; border-radius: 22px; }
      .tf2-left {
        padding: 28px 24px 24px; flex-direction: row;
        flex-wrap: wrap; align-items: center; gap: 16px;
      }
      .tf2-left-body { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 16px; }
      .tf2-vert-label { display: none; }
      .tf2-mandala    { display: none; }
      .tf2-avatar-cluster { width: 86px; height: 86px; flex-shrink: 0; }
      .tf2-orbit-ring { display: none; }
      .tf2-glow-ring  { display: none; }
      .tf2-avatar-img { width: 86px; height: 86px; box-shadow: none; }
      .tf2-left-title { font-size: 22px; text-align: left; }
      .tf2-left-sub   { display: none; }
      .tf2-hairline   { display: none; }
      .tf2-upload     { display: none; }
      .tf2-avatar-dots { display: none; }
      .tf2-right { padding: 30px 24px 28px; }
      .tf2-row   { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .tf2-card { border-radius: 18px; }
      .tf2-left { padding: 22px 18px 20px; }
      .tf2-right { padding: 24px 18px 22px; }
      .tf2-h2 { font-size: 24px; }
      .tf2-form { gap: 14px; }
      .tf2-right-head { margin-bottom: 22px; }
      .tf2-field input, .tf2-field textarea { font-size: 13.5px; padding: 20px 12px 7px; }
      .tf2-field textarea { min-height: 100px; }
      .tf2-btn { font-size: 10.5px; padding: 14px 20px; }
    }
    @media (max-width: 400px) {
      .tf2-card { border-radius: 14px; }
      .tf2-right { padding: 20px 14px 18px; }
      .tf2-h2 { font-size: 20px; }
      .tf2-avatar-cluster { width: 68px; height: 68px; }
      .tf2-avatar-img { width: 68px; height: 68px; }
      .tf2-left-title { font-size: 18px; }
      .tf2-success-right { padding: 40px 20px; }
      .tf2-success-h { font-size: 24px; }
    }
  `;

  /* ── SUCCESS ── */
  if (submitted) return (
    <>
      <style>{css}</style>
      <motion.div className="tf2-card"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
      >
        <div className="tf2-left">
          <div className="tf2-left-body">
            <div className="tf2-avatar-cluster">
              <MandalaRings />
              <div className="tf2-orbit-ring" />
              <div className="tf2-glow-ring" />
              <img src={displayAvatar} alt=""
                className={`tf2-avatar-img ${imagePreview ? "is-photo" : ""}`} />
            </div>
            <div className="tf2-left-title">Thank you,<br/><em>sincerely.</em></div>
          </div>
        </div>
        <div className="tf2-right">
          <div className="tf2-success-right">
            <motion.div className="tf2-success-icon"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
            >
              <CheckCircle size={30} strokeWidth={1.5} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="tf2-success-badge"><Sparkles size={12} />Under Review</div>
              <div className="tf2-success-h">Received with <em>gratitude</em></div>
              <p className="tf2-success-p">
                Your testimonial is being reviewed and will appear on the site once approved. Your words truly matter.
              </p>
              <button className="tf2-success-again" onClick={reset}>
                Submit another testimonial
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );

  /* ── FORM ── */
  return (
    <>
      <style>{css}</style>
      <motion.div className="tf2-card"
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
      >
        {/* ══ LEFT ══ */}
        <div className="tf2-left">
          <div className="tf2-vert-label">Share your journey</div>
          <div className="tf2-left-body">

            {/* Avatar */}
            <div className="tf2-avatar-cluster">
              <MandalaRings />
              <div className="tf2-orbit-ring" />
              <div className="tf2-glow-ring" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={displayAvatar}
                  src={displayAvatar}
                  alt="Your avatar"
                  className={`tf2-avatar-img ${imagePreview ? "is-photo" : ""}`}
                  initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 8 }}
                  transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}
                />
              </AnimatePresence>
              {imagePreview && (
                <button className="tf2-avatar-del" type="button" onClick={clearImage} aria-label="Remove">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Dot pickers */}
            {!imagePreview && (
              <div className="tf2-avatar-dots">
                {AVATARS.map((av, i) => (
                  <button key={i} type="button"
                    className={`tf2-avatar-dot ${av === currentAvatar ? "active" : ""}`}
                    onClick={() => setCurrentAvatar(av)}
                    aria-label={`Avatar ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Shuffle */}
            {!imagePreview && (
              <motion.button className="tf2-shuffle" type="button"
                onClick={shuffleAvatar} whileTap={{ scale: 0.94 }}
              >
                <motion.span
                  animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{ display: "flex" }}
                >
                  <RefreshCw size={12} />
                </motion.span>
                New avatar
              </motion.button>
            )}

            <div className="tf2-hairline" />
            <div className="tf2-left-title">Share your <em>story.</em></div>
            <p className="tf2-left-sub">Your words inspire others to begin their own wellness journey with Nandini.</p>
            <div className="tf2-hairline" />

            {/* Upload */}
            <input ref={fileRef} type="file" accept="image/*"
              onChange={(e) => processFile(e.target.files[0])}
              style={{ display: "none" }} id="tf2-file"
            />
            <label htmlFor="tf2-file"
              className={`tf2-upload ${dragOver ? "tf2-upload--drag" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
            >
              <div className="tf2-upload-icon"><Camera size={15} /></div>
              <div className="tf2-upload-txt">
                <strong>{imagePreview ? "Change photo" : "Upload your photo"}</strong>
                <span>Replaces avatar · PNG, JPG</span>
              </div>
            </label>

          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="tf2-right">
          <div className="tf2-right-head">
            <div className="tf2-eyebrow">Testimonial</div>
            <h2 className="tf2-h2">How has yoga <em>changed</em> you?</h2>
          </div>

          <form className="tf2-form" onSubmit={handleSubmit}>

            <div className="tf2-row">
              <Field label="Full Name" required>
                <input type="text" name="name" value={formData.name}
                  onChange={handleInput} required placeholder="Full Name" autoComplete="name" />
              </Field>
              <Field label="Role / City" required>
                <input type="text" name="role" value={formData.role}
                  onChange={handleInput} required placeholder="Role / City" />
              </Field>
            </div>

            <Field label="Email address (optional)">
              <input type="email" name="email" value={formData.email}
                onChange={handleInput} placeholder="Email address (optional)" autoComplete="email" />
            </Field>

            {/* Testimonial + word counter */}
            <div>
              <div className="tf2-field">
                <textarea
                  name="text" value={formData.text}
                  onChange={handleInput} required rows={5}
                  placeholder="Your testimonial"
                  className={overLimit ? "over-limit" : ""}
                />
                <label className="tf2-flabel">
                  Your testimonial <span className="tf2-req"> *</span>
                </label>
              </div>
              <div className="tf2-charrow">
                <span className="tf2-word-hint">words</span>
                <ArcProgress count={words} />
                <span className={`tf2-charnum ${overLimit ? "over" : ""}`}>
                  {words} / {MAX_WORDS}
                </span>
              </div>
            </div>

            <div className="tf2-rating-block">
              <div className="tf2-section-label">Your Rating</div>
              <StarPicker value={formData.rating}
                onChange={(r) => setFormData((p) => ({ ...p, rating: r }))} />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div className="tf2-error"
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <AlertCircle size={15} />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading || overLimit} className="tf2-btn">
              {loading
                ? <><div className="tf2-spinner" /> Submitting…</>
                : overLimit
                  ? `${words - MAX_WORDS} words over limit`
                  : "Submit Testimonial"
              }
            </button>

          </form>
        </div>
      </motion.div>
    </>
  );
};

export default TestimonialsForm;