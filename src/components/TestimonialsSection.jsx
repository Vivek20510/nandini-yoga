import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { db } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

/* ─── Palette & tokens ─────────────────────────────────────── */
const C = {
  bg:        "#0B1620",
  surface:   "#111E2A",
  surfaceHi: "#162434",
  border:    "rgba(255,255,255,0.07)",
  gold:      "#C9A96E",
  goldDim:   "rgba(201,169,110,0.18)",
  cream:     "#EDE8DC",
  muted:     "#6B8A9A",
  mutedLo:   "#3A5060",
};

/* ─── Tiny helpers ─────────────────────────────────────────── */
const MAX_CHARS = 200;

function StarRow({ rating }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.8 2.7,10.5 3.5,7 1,4.8 4.5,4.5"
            fill={i < rating ? C.gold : C.mutedLo}
          />
        </svg>
      ))}
    </div>
  );
}

/* ─── Individual card ──────────────────────────────────────── */
function Card({ t, index, featured = false }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isLong = t.text.length > MAX_CHARS;
  const displayText =
    isLong && !expanded ? t.text.slice(0, MAX_CHARS).trimEnd() + "…" : t.text;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: featured
          ? `linear-gradient(145deg, ${C.surfaceHi} 0%, ${C.surface} 100%)`
          : C.surface,
        border: `1px solid ${featured ? "rgba(201,169,110,0.3)" : C.border}`,
        borderRadius: 24,
        padding: featured ? "2.2rem 2rem" : "1.8rem 1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: featured
          ? "0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,169,110,0.1)"
          : "0 4px 24px rgba(0,0,0,0.3)",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = featured
          ? "rgba(201,169,110,0.55)"
          : "rgba(255,255,255,0.15)";
        e.currentTarget.style.boxShadow = featured
          ? "0 12px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.2)"
          : "0 8px 32px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = featured
          ? "rgba(201,169,110,0.3)"
          : C.border;
        e.currentTarget.style.boxShadow = featured
          ? "0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,169,110,0.1)"
          : "0 4px 24px rgba(0,0,0,0.3)";
      }}
    >
      {/* Decorative quote mark */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: featured ? 18 : 14,
          right: featured ? 22 : 18,
          fontSize: featured ? 90 : 64,
          lineHeight: 1,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: featured ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.035)",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-4px",
        }}
      >
        "
      </span>

      {/* Top: avatar + meta */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          {featured && (
            <div
              style={{
                position: "absolute",
                inset: -3,
                borderRadius: "50%",
                background: `conic-gradient(${C.gold} 0%, transparent 55%, ${C.gold} 100%)`,
                opacity: 0.55,
              }}
            />
          )}
          <img
            src={t.image}
            alt={t.name}
            style={{
              position: "relative",
              width: featured ? 58 : 48,
              height: featured ? 58 : 48,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "top",
              border: `2px solid ${featured ? C.gold : C.mutedLo}`,
              display: "block",
            }}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: featured ? 18 : 15,
              fontWeight: 600,
              color: C.cream,
              margin: 0,
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: featured ? C.gold : C.muted,
              margin: "4px 0 7px",
              wordBreak: "break-word",
            }}
          >
            {t.role}
          </p>
          <StarRow rating={t.rating} />
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: featured
            ? `linear-gradient(90deg, ${C.gold}44, transparent)`
            : `linear-gradient(90deg, rgba(255,255,255,0.08), transparent)`,
          marginBottom: 18,
          flexShrink: 0,
        }}
      />

      {/* Quote text */}
      <div
        style={
          expanded
            ? {
                overflowY: "auto",
                maxHeight: 200,
                paddingRight: 4,
                scrollbarWidth: "thin",
                scrollbarColor: `${C.mutedLo} transparent`,
              }
            : { minHeight: 72 }
        }
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: featured ? 14.5 : 13,
            lineHeight: 1.95,
            color: C.muted,
            margin: 0,
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {displayText}
        </p>
      </div>

      {/* Read more toggle */}
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop: 10,
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: C.gold,
            opacity: 0.7,
            padding: 0,
            textDecoration: "underline",
            textDecorationColor: "rgba(201,169,110,0.3)",
            textUnderlineOffset: 3,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </motion.div>
  );
}

/* ─── Main section ─────────────────────────────────────────── */
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "testimonials"),
          where("approved", "==", true),
          orderBy("date", "desc")
        );
        const snap = await getDocs(q);
        setTestimonials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <section
        style={{
          minHeight: 320,
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: 20,
            height: 20,
            border: `2px solid ${C.mutedLo}`,
            borderTopColor: C.gold,
            borderRadius: "50%",
            animation: "_spin 0.8s linear infinite",
          }}
        />
      </section>
    );

  if (!testimonials.length)
    return (
      <section
        style={{
          minHeight: 200,
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: C.muted,
          }}
        >
          No testimonials yet.
        </p>
      </section>
    );

  const [first, ...rest] = testimonials;

  return (
    <section
      style={{
        background: C.bg,
        padding: "6rem 0 7rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* Top ambient gold glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 360,
          background: `radial-gradient(ellipse, rgba(201,169,110,0.055) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 1.5rem",
          position: "relative",
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 48,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.mutedLo})`,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.gold,
                fontWeight: 600,
              }}
            >
              Student Voices
            </span>
            <div
              style={{
                width: 48,
                height: 1,
                background: `linear-gradient(90deg, ${C.mutedLo}, transparent)`,
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: C.cream,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            What They{" "}
            <em style={{ fontStyle: "italic", color: C.gold }}>Say</em>
          </h2>
        </motion.div>

        {/* ── Cards layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          {first && (
            <div
              style={{
                gridRow: rest.length >= 2 ? "span 2" : "span 1",
              }}
            >
              <Card t={first} index={0} featured />
            </div>
          )}
          {rest.map((t, i) => (
            <Card key={t.id} t={t} index={i + 1} />
          ))}
        </div>

        {/* ── Decorative bottom rule ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "4.5rem",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}50, transparent)`,
            transformOrigin: "center",
          }}
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
