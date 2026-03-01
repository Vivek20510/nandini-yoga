import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── SHARED STYLES (injected once via a module-level flag) ── */
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
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

    .bpc-root {
      font-family: var(--font-body);
      background: var(--white);
      border: 1px solid rgba(44,36,23,0.08);
      border-radius: 14px;
      overflow: hidden;
      transition: box-shadow 0.35s, transform 0.35s;
      position: relative;
    }
    .bpc-root::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--gold), var(--terra));
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.4s ease;
      z-index: 2;
    }
    .bpc-root:hover::before { transform: scaleX(1); }
    .bpc-root:hover {
      box-shadow: 0 24px 56px rgba(44,36,23,0.1);
      transform: translateY(-5px);
    }

    .bpc-root.featured {
      display: flex; flex-direction: column;
    }
    @media (min-width: 1024px) {
      .bpc-root.featured { flex-direction: row; }
      .bpc-root.featured .bpc-media { width: 55%; flex-shrink: 0; }
      .bpc-root.featured .bpc-content { width: 45%; }
    }

    .bpc-media { position: relative; overflow: hidden; }
    .bpc-media-inner {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .bpc-media-slide { min-width: 100%; }
    .bpc-media-img {
      width: 100%; aspect-ratio: 16/10;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }
    .bpc-root:hover .bpc-media-img { transform: scale(1.03); }

    .bpc-dots {
      position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 7px; z-index: 3;
    }
    .bpc-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(255,255,255,0.5);
      border: none; cursor: pointer; padding: 0;
      transition: background 0.2s, transform 0.2s;
    }
    .bpc-dot.active {
      background: var(--cream);
      transform: scale(1.3);
    }

    .bpc-nav-btn {
      position: absolute; top: 50%; transform: translateY(-50%);
      background: rgba(253,250,245,0.85);
      border: none; cursor: pointer;
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; color: var(--bark);
      transition: background 0.2s, opacity 0.2s;
      opacity: 0; z-index: 3;
    }
    .bpc-media:hover .bpc-nav-btn { opacity: 1; }
    .bpc-nav-btn.prev { left: 12px; }
    .bpc-nav-btn.next { right: 12px; }
    .bpc-nav-btn:hover { background: var(--white); }

    .bpc-content {
      padding: 28px 32px 26px;
      display: flex; flex-direction: column; justify-content: space-between;
      flex: 1;
    }

    .bpc-tag {
      display: inline-block;
      font-family: var(--font-body);
      font-size: 0.6rem; font-weight: 500;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--terra);
      padding: 3px 10px;
      border: 1px solid rgba(184,114,74,0.3);
      border-radius: 100px;
      margin-bottom: 14px;
    }

    .bpc-date {
      font-family: var(--font-body);
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      color: rgba(44,36,23,0.38);
      margin-bottom: 10px;
    }

    .bpc-title {
      font-family: var(--font-display);
      font-weight: 600;
      color: var(--bark);
      line-height: 1.2;
      margin-bottom: 12px;
    }
    .bpc-title.featured-title { font-size: clamp(1.5rem, 2.5vw, 2rem); }
    .bpc-title.regular-title  { font-size: 1.25rem; }

    .bpc-desc {
      font-family: var(--font-body);
      font-size: 0.875rem;
      line-height: 1.8;
      color: rgba(44,36,23,0.55);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .bpc-read-btn {
      margin-top: 20px;
      display: inline-flex; align-items: center; gap: 7px;
      font-family: var(--font-body);
      font-size: 0.72rem; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--moss);
      background: none; border: none; cursor: pointer; padding: 0;
      transition: gap 0.25s, color 0.2s;
    }
    .bpc-read-btn:hover { gap: 12px; color: var(--bark); }

    .bpc-footer {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(44,36,23,0.07);
      display: flex; justify-content: space-between; align-items: center;
    }

    .bpc-share-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--font-body);
      font-size: 0.72rem; font-weight: 400;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(44,36,23,0.38);
      background: none; border: none; cursor: pointer; padding: 0;
      transition: color 0.2s;
    }
    .bpc-share-btn:hover { color: var(--bark); }

    .bpc-read-time {
      font-family: var(--font-body);
      font-size: 0.68rem;
      color: rgba(44,36,23,0.28);
      letter-spacing: 0.06em;
    }
  `;
  document.head.appendChild(style);
}

/* ── COMPONENT ── */
const BlogPostCard = ({ post, featured = false }) => {
  injectStyles();

  const { title, media = [], desc, date, category } = post;
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleEnd = (e) => {
    if (!isDragging.current) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX.current;
    if (diff > 50) setCurrentIndex((p) => (p === 0 ? media.length - 1 : p - 1));
    if (diff < -50) setCurrentIndex((p) => (p === media.length - 1 ? 0 : p + 1));
    isDragging.current = false;
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    if (navigator.share) {
      navigator.share({ title, text: "Check out this wellness post", url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard");
    }
  };

  const formattedDate = date
    ? new Date(date.seconds * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  // Estimate read time from desc
  const readTime = desc ? `${Math.max(1, Math.ceil(desc.split(" ").length / 200))} min read` : null;

  return (
    <article className={`bpc-root${featured ? " featured" : ""}`}>

      {/* ── MEDIA ── */}
      {media.length > 0 && (
        <div
          className="bpc-media"
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={() => (isDragging.current = false)}
        >
          <div className="bpc-media-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {media.map((item, i) => (
              <div key={i} className="bpc-media-slide">
                {item.type === "video" ? (
                  <ReactPlayer url={item.url} controls width="100%" height="100%" />
                ) : (
                  <img src={item.url} alt={`Media ${i + 1}`} loading="lazy" className="bpc-media-img" />
                )}
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          {media.length > 1 && (
            <>
              <button className="bpc-nav-btn prev" onClick={() => setCurrentIndex((p) => (p === 0 ? media.length - 1 : p - 1))}>‹</button>
              <button className="bpc-nav-btn next" onClick={() => setCurrentIndex((p) => (p === media.length - 1 ? 0 : p + 1))}>›</button>
            </>
          )}

          {/* Dots */}
          {media.length > 1 && (
            <div className="bpc-dots">
              {media.map((_, i) => (
                <button key={i} className={`bpc-dot${i === currentIndex ? " active" : ""}`} onClick={() => setCurrentIndex(i)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="bpc-content">
        <div>
          {category && <span className="bpc-tag">{category}</span>}
          {formattedDate && <p className="bpc-date">{formattedDate}</p>}

          <h2 className={`bpc-title${featured ? " featured-title" : " regular-title"}`}>
            {title}
          </h2>

          <p className="bpc-desc">{desc}</p>

          <button className="bpc-read-btn" onClick={() => navigate(`/blog/${post.id}`)}>
            Read Article <span style={{ fontSize: "1rem" }}>→</span>
          </button>
        </div>

        <div className="bpc-footer">
          <button className="bpc-share-btn" onClick={handleShare}>
            <Share2 size={13} /> Share
          </button>
          {readTime && <span className="bpc-read-time">{readTime}</span>}
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
