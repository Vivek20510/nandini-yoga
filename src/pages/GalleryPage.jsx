import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SEO from "../components/SEO";
import { SITE_URL } from "../lib/site";

/* ─────────────────────────────────────────────
   Variants
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: 12, transition: { duration: 0.25 } },
};

const scrimVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const lightboxVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.22 } },
};

/* ─────────────────────────────────────────────
   Category badge colour map
───────────────────────────────────────────── */
const badgeStyles = {
  class: "bg-[#D4E6EF]/90 text-[#1D3C52]",
  event: "bg-[#EAE6D8]/90 text-[#5C4A1E]",
  workshop: "bg-[#E2EDE5]/90 text-[#1E4A2C]",
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });
  const galleryDescription =
    "Browse yoga class, workshop, and retreat photos from Yoga By Nandini. Explore the teaching style, sessions, and mindful wellness community in action.";

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Yoga Gallery",
    url: `${SITE_URL}/gallery`,
    description: galleryDescription,
  };

  /* ── Fetch ── */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          category: doc.data().category,
          title: doc.data().title,
          image: doc.data().imageUrl,
          isVideo: doc.data().isVideo ?? false,
          date: doc.data().date?.toDate() ?? new Date(),
        }));
        setGalleryItems(docs.sort((a, b) => b.date - a.date));
      } catch (err) {
        console.error("Gallery fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lightbox]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Filtering ── */
  const filters = [
    { label: "All", value: "all" },
    { label: "Classes", value: "class" },
    { label: "Events", value: "event" },
    { label: "Workshops", value: "workshop" },
  ];

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  /* ── Lightbox helpers ── */
  const openLightbox = (index) => {
    setLightbox({ isOpen: true, index });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, index: 0 });
    document.body.style.overflow = "";
  };

  const navigate = (dir) => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + dir + filtered.length) % filtered.length,
    }));
  };

  const currentItem = filtered[lightbox.index];

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24">
      <SEO
        title="Yoga Class and Workshop Gallery"
        description={galleryDescription}
        canonicalPath="/gallery"
        schema={gallerySchema}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── Page Header ── */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <LayoutGrid size={12} />
            Gallery
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.15] text-[#1D3C52]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Classes &amp; Events
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-4 text-[15px] leading-[1.8] text-[#5A7485]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Explore our vibrant community through photos and videos of classes,
            retreats, and workshops.
          </motion.p>
        </div>

        {/* ── Filter Tabs ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`relative px-5 py-2 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1D3C52]/40 ${
                activeFilter === filter.value
                  ? "bg-[#1D3C52] text-white shadow-md shadow-[#1D3C52]/25"
                  : "bg-white text-[#4A6B7C] border border-[#E2DDD0] hover:border-[#1D3C52]/40 hover:text-[#1D3C52]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {filter.label}
              {activeFilter === filter.value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-[#1D3C52] -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Skeleton / Empty / Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-[#E8E4D8] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <span className="text-5xl">🌿</span>
            <p
              className="text-[#8BA5B5] text-sm tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              No items in this category yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index % 8}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  onClick={() => openLightbox(index)}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer bg-[#E8E4D8] shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2332]/75 via-[#0E2332]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Video play icon */}
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play size={20} className="text-white fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Caption – slides up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <h3
                      className="text-white text-[15px] font-semibold leading-snug line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Category badge – always visible */}
                  <div
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] tracking-[0.12em] uppercase font-bold backdrop-blur-sm ${
                      badgeStyles[item.category] ?? "bg-white/80 text-[#1D3C52]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.category}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ──────────────── Lightbox ──────────────── */}
      <AnimatePresence>
        {lightbox.isOpen && currentItem && (
          <>
            {/* Scrim */}
            <motion.div
              key="scrim"
              variants={scrimVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              onClick={closeLightbox}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              variants={lightboxVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            >
              <div
                className="relative pointer-events-auto w-full max-w-4xl mx-auto px-14 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── Close ── */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-10 right-14 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                {/* ── Media ── */}
                <div className="w-full max-h-[70vh] flex items-center justify-center rounded-xl overflow-hidden bg-black/30">
                  {currentItem.isVideo ? (
                    <video
                      key={currentItem.id}
                      src={currentItem.image}
                      controls
                      autoPlay
                      className="max-w-full max-h-[70vh] rounded-xl"
                    />
                  ) : (
                    <img
                      key={currentItem.id}
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="max-w-full max-h-[70vh] object-contain rounded-xl"
                    />
                  )}
                </div>

                {/* ── Caption ── */}
                <div className="mt-5 text-center">
                  <h3
                    className="text-white text-xl font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {currentItem.title}
                  </h3>
                  <p
                    className="mt-1.5 text-white/55 text-[11px] uppercase tracking-[0.14em]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {currentItem.category}
                  </p>
                </div>

                {/* ── Counter ── */}
                {filtered.length > 1 && (
                  <p
                    className="mt-3 text-white/40 text-[11px] tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {lightbox.index + 1} / {filtered.length}
                  </p>
                )}

                {/* ── Prev / Next ── */}
                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={() => navigate(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigate(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
