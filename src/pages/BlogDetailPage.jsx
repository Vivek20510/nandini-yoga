import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPost(docSnap.data());
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${id}`;
    if (navigator.share) {
      navigator.share({ title: post?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const media = post?.media || [];
  const formattedDate = post?.date
    ? new Date(post.date.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  const readTime = post?.desc
    ? `${Math.max(1, Math.ceil(post.desc.split(" ").length / 200))} min read`
    : null;

  // Split desc into paragraphs
  const paragraphs = post?.desc
    ? post.desc.split(/\n+/).filter((p) => p.trim().length > 0)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

        :root {
          --cream:   #F7F3EC;
          --sand:    #EDE5D4;
          --bark:    #2C2417;
          --moss:    #4A5C3F;
          --terra:   #B8724A;
          --gold:    #C9A058;
          --white:   #FDFAF5;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body:    'Jost', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bdp-root {
          font-family: var(--font-body);
          background: var(--cream);
          min-height: 100vh;
        }

        /* ── PROGRESS BAR ── */
        .bdp-progress {
          position: fixed; top: 0; left: 0; right: 0;
          height: 2px; z-index: 300;
          background: rgba(44,36,23,0.06);
        }
        .bdp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold), var(--terra));
          transition: width 0.1s linear;
        }

        /* ── STICKY NAV ── */
        .bdp-nav {
          position: fixed; top: 2px; left: 0; right: 0; z-index: 200;
          padding: 18px 48px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(247,243,236,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .bdp-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body);
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(44,36,23,0.5);
          background: none; border: none; cursor: pointer; padding: 0;
          transition: color 0.2s, gap 0.25s;
        }
        .bdp-back-btn:hover { color: var(--bark); gap: 12px; }

        .bdp-share-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-body);
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(44,36,23,0.45);
          background: none; border: 1px solid rgba(44,36,23,0.15);
          padding: 8px 16px; border-radius: 100px;
          cursor: pointer; transition: all 0.2s;
        }
        .bdp-share-btn:hover {
          color: var(--bark);
          border-color: rgba(44,36,23,0.35);
          background: rgba(44,36,23,0.04);
        }
        .bdp-share-btn.copied {
          color: var(--moss);
          border-color: rgba(74,92,63,0.35);
        }

        /* ── HERO AREA ── */
        .bdp-hero {
          background: var(--white);
          padding: 120px 64px 72px;
          border-bottom: 1px solid rgba(44,36,23,0.07);
          position: relative; overflow: hidden;
        }
        .bdp-hero::after {
          content: '';
          position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,160,88,0.08) 0%, transparent 70%);
          top: -20%; right: -10%; pointer-events: none;
        }
        .bdp-hero-inner {
          max-width: 760px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        .bdp-category-pill {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.6rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--terra);
          padding: 4px 12px;
          border: 1px solid rgba(184,114,74,0.3);
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .bdp-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 600; line-height: 1.1;
          color: var(--bark); letter-spacing: -0.01em;
          margin-bottom: 24px;
        }

        .bdp-meta {
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
          margin-bottom: 0;
        }
        .bdp-meta-item {
          font-family: var(--font-body);
          font-size: 0.75rem; letter-spacing: 0.06em;
          color: rgba(44,36,23,0.38);
          display: flex; align-items: center; gap: 6px;
        }
        .bdp-meta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(44,36,23,0.2);
        }

        /* ── MEDIA SECTION ── */
        .bdp-media-section {
          background: var(--sand);
          padding: 60px 64px;
          border-bottom: 1px solid rgba(44,36,23,0.07);
        }
        .bdp-media-inner { max-width: 900px; margin: 0 auto; }

        .bdp-media-main {
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(44,36,23,0.12);
          position: relative;
          background: var(--bark);
        }
        .bdp-media-img {
          width: 100%; display: block;
          max-height: 540px; object-fit: cover;
        }

        /* Nav arrows over media */
        .bdp-media-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(253,250,245,0.9);
          border: none; cursor: pointer;
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--bark); z-index: 5;
          transition: background 0.2s, transform 0.2s;
          box-shadow: 0 4px 16px rgba(44,36,23,0.15);
        }
        .bdp-media-arrow:hover { background: var(--white); transform: translateY(-50%) scale(1.05); }
        .bdp-media-arrow.left { left: 16px; }
        .bdp-media-arrow.right { right: 16px; }

        /* Thumbnails */
        .bdp-thumbs {
          display: flex; gap: 10px; margin-top: 16px;
          overflow-x: auto; padding-bottom: 4px;
        }
        .bdp-thumb {
          width: 72px; height: 52px; flex-shrink: 0;
          border-radius: 8px; overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer; opacity: 0.55;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .bdp-thumb.active {
          border-color: var(--gold);
          opacity: 1;
        }
        .bdp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── CONTENT BODY ── */
        .bdp-content-section {
          padding: 72px 64px 100px;
        }
        .bdp-content-inner {
          max-width: 680px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr;
          gap: 0;
        }

        /* Drop cap on first paragraph */
        .bdp-para {
          font-family: var(--font-body);
          font-size: 1.05rem;
          line-height: 1.9;
          color: rgba(44,36,23,0.75);
          margin-bottom: 28px;
        }
        .bdp-para:first-child::first-letter {
          font-family: var(--font-display);
          font-size: 4.5rem; font-weight: 600;
          float: left; line-height: 0.75;
          margin-right: 10px; margin-top: 8px;
          color: var(--terra);
        }

        /* Decorative divider */
        .bdp-ornament {
          text-align: center; color: var(--gold);
          font-size: 1.2rem; letter-spacing: 12px;
          margin: 48px 0;
          opacity: 0.4;
        }

        /* ── FOOTER CTA ── */
        .bdp-footer-cta {
          background: var(--bark);
          padding: 72px 64px;
          text-align: center;
        }
        .bdp-footer-cta-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 300; line-height: 1.2;
          color: var(--cream); margin-bottom: 12px;
        }
        .bdp-footer-cta-title em { font-style: italic; color: rgba(201,160,88,0.85); }
        .bdp-footer-cta-sub {
          font-family: var(--font-body);
          font-size: 0.88rem; color: rgba(247,243,236,0.45);
          margin-bottom: 32px; line-height: 1.7;
        }
        .bdp-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body);
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 30px; border-radius: 7px;
          background: var(--gold); color: var(--bark);
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .bdp-cta-btn:hover { background: #d4ad68; transform: translateY(-1px); }

        /* ── SKELETON ── */
        @keyframes shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(44,36,23,0.06) 25%, rgba(44,36,23,0.03) 50%, rgba(44,36,23,0.06) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .bdp-nav      { padding: 16px 24px; }
          .bdp-hero     { padding: 100px 24px 56px; }
          .bdp-media-section { padding: 40px 24px; }
          .bdp-content-section { padding: 48px 24px 72px; }
          .bdp-footer-cta { padding: 56px 24px; }
        }
      `}</style>

      {/* ── READ PROGRESS BAR ── */}
      <div className="bdp-progress">
        <div className="bdp-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ── STICKY NAV ── */}
      <nav className="bdp-nav">
        <button className="bdp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={13} />
          Back to Journal
        </button>
        <button className={`bdp-share-btn${copied ? " copied" : ""}`} onClick={handleShare}>
          <Share2 size={13} />
          {copied ? "Copied!" : "Share"}
        </button>
      </nav>

      <div className="bdp-root" ref={contentRef}>

        {/* ── LOADING SKELETON ── */}
        {!post && (
          <div style={{ padding: "140px 64px 80px", maxWidth: 760, margin: "0 auto" }}>
            <div style={{ height: 10, width: 100, marginBottom: 20 }} className="skeleton" />
            <div style={{ height: 48, width: "80%", marginBottom: 12 }} className="skeleton" />
            <div style={{ height: 48, width: "55%", marginBottom: 32 }} className="skeleton" />
            <div style={{ height: 10, width: 180, marginBottom: 60 }} className="skeleton" />
            <div style={{ aspectRatio: "16/9", borderRadius: 16, marginBottom: 40 }} className="skeleton" />
            {[100, 90, 95, 80, 88].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, marginBottom: 14 }} className="skeleton" />
            ))}
          </div>
        )}

        {post && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* ── HERO ── */}
            <header className="bdp-hero">
              <div className="bdp-hero-inner">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {post.category && (
                    <span className="bdp-category-pill">{post.category}</span>
                  )}

                  <h1 className="bdp-title">{post.title}</h1>

                  <div className="bdp-meta">
                    {formattedDate && (
                      <span className="bdp-meta-item">{formattedDate}</span>
                    )}
                    {formattedDate && readTime && <div className="bdp-meta-dot" />}
                    {readTime && (
                      <span className="bdp-meta-item">{readTime}</span>
                    )}
                    {post.author && (
                      <>
                        <div className="bdp-meta-dot" />
                        <span className="bdp-meta-item">By {post.author}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </header>

            {/* ── MEDIA ── */}
            {media.length > 0 && (
              <section className="bdp-media-section">
                <div className="bdp-media-inner">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="bdp-media-main">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeMedia}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {media[activeMedia]?.type === "video" ? (
                            <ReactPlayer
                              url={media[activeMedia].url}
                              controls
                              width="100%"
                              height="100%"
                              style={{ aspectRatio: "16/9" }}
                            />
                          ) : (
                            <img
                              src={media[activeMedia]?.url}
                              alt={`Media ${activeMedia + 1}`}
                              className="bdp-media-img"
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {media.length > 1 && (
                        <>
                          <button
                            className="bdp-media-arrow left"
                            onClick={() => setActiveMedia((p) => (p === 0 ? media.length - 1 : p - 1))}
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            className="bdp-media-arrow right"
                            onClick={() => setActiveMedia((p) => (p === media.length - 1 ? 0 : p + 1))}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail strip */}
                    {media.length > 1 && (
                      <div className="bdp-thumbs">
                        {media.map((item, i) => (
                          <div
                            key={i}
                            className={`bdp-thumb${i === activeMedia ? " active" : ""}`}
                            onClick={() => setActiveMedia(i)}
                          >
                            {item.type !== "video" ? (
                              <img src={item.url} alt={`thumb ${i + 1}`} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "var(--bark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>▶</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </section>
            )}

            {/* ── ARTICLE BODY ── */}
            <section className="bdp-content-section">
              <motion.div
                className="bdp-content-inner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
              >
                {paragraphs.map((para, i) => (
                  <React.Fragment key={i}>
                    <p className="bdp-para">{para}</p>
                    {/* ornament after every ~4 paragraphs */}
                    {(i + 1) % 4 === 0 && i !== paragraphs.length - 1 && (
                      <div className="bdp-ornament">✦ ✦ ✦</div>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            </section>

            {/* ── FOOTER CTA ── */}
            <motion.footer
              className="bdp-footer-cta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 20 }}>🪷</div>
              <p className="bdp-footer-cta-title">
                Ready to begin your <em>own practice?</em>
              </p>
              <p className="bdp-footer-cta-sub">
                Explore Nandini's programs — from beginner yoga to breathwork and Ayurveda.
              </p>
              <button className="bdp-cta-btn" onClick={() => navigate("/contact")}>
                Explore Programs →
              </button>
            </motion.footer>
          </motion.div>
        )}

      </div>
    </>
  );
};

export default BlogDetailPage;
