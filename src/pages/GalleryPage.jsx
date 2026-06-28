import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SEO from "../components/SEO";
import { SITE_URL } from "../lib/site";

/* ── Shared animation wrapper (same as Home / About) ── */
const FadeUp = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-48px" }}
    transition={{ duration: 0.38, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children }) => (
  <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-yoga-sage">
    <span className="h-px w-5 bg-yoga-sage" />
    {children}
  </div>
);

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Classes", value: "class" },
  { label: "Events", value: "event" },
  { label: "Workshops", value: "workshop" },
];

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

  const galleryDescription =
    "Browse yoga class, workshop, and event photos from Yoga by Nandini. Explore small-group sessions and the community in practice.";

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

  /* ── Filtering ── */
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

  const navigate = useCallback(
    (dir) => {
      setLightbox((prev) => ({
        ...prev,
        index: (prev.index + dir + filtered.length) % filtered.length,
      }));
    },
    [filtered.length]
  );

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    },
    [lightbox.isOpen, navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentItem = filtered[lightbox.index];

  return (
    <main className="min-h-screen overflow-x-hidden bg-yoga-paper font-body text-yoga-ink">
      <SEO
        title="Gallery | Yoga by Nandini"
        description={galleryDescription}
        canonicalPath="/gallery"
        schema={gallerySchema}
      />

      {/* ── Page Header ── */}
      <section className="border-b border-yoga-border px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <SectionLabel>Gallery</SectionLabel>
            <h1 className="font-display text-[42px] font-bold leading-[1.08] text-yoga-ink sm:text-6xl lg:text-7xl">
              Classes &{" "}
              <em className="text-yoga-clay">Events.</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-yoga-ink/60 md:text-base">
              A look at the practice — small groups, quiet focus, and students at every level.
            </p>
          </motion.div>

          {/* ── Filter tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.1, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`min-h-[36px] rounded-full border px-4 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                  activeFilter === f.value
                    ? "border-yoga-ink bg-yoga-ink text-yoga-paper"
                    : "border-yoga-border bg-white text-yoga-ink/55 hover:border-yoga-ink/40 hover:text-yoga-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="px-5 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-yoga-mist"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3">
              <span className="font-display text-4xl text-yoga-ink/20">✦</span>
              <p className="text-sm text-yoga-ink/40">Nothing here yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              >
                {filtered.map((item, index) => (
                  <FadeUp key={item.id} delay={(index % 8) * 0.04}>
                    <button
                      onClick={() => openLightbox(index)}
                      className="group relative w-full overflow-hidden rounded-2xl border border-yoga-border bg-yoga-mist aspect-[4/3] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yoga-sage"
                      aria-label={`View ${item.title}`}
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-yoga-ink/70 via-yoga-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Video play icon */}
                      {item.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <Play size={18} className="translate-x-0.5 fill-white text-white" />
                          </div>
                        </div>
                      )}

                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="line-clamp-2 text-left text-[13px] font-medium leading-snug text-white">
                          {item.title}
                        </p>
                      </div>

                      {/* Category badge */}
                      {item.category && (
                        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/80 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-yoga-ink backdrop-blur-sm">
                          {item.category}
                        </div>
                      )}
                    </button>
                  </FadeUp>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox.isOpen && currentItem && (
          <>
            {/* Scrim */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
              onClick={closeLightbox}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
              onClick={closeLightbox}
            >
              <div
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                {/* Media */}
                <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-2xl bg-black/30">
                  {currentItem.isVideo ? (
                    <video
                      key={currentItem.id}
                      src={currentItem.image}
                      controls
                      autoPlay
                      className="max-h-[70vh] max-w-full rounded-2xl"
                    />
                  ) : (
                    <img
                      key={currentItem.id}
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="max-h-[70vh] max-w-full rounded-2xl object-contain"
                    />
                  )}
                </div>

                {/* Caption */}
                <div className="mt-4 text-center">
                  <p className="font-display text-lg font-bold text-white">{currentItem.title}</p>
                  {currentItem.category && (
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                      {currentItem.category}
                    </p>
                  )}
                  {filtered.length > 1 && (
                    <p className="mt-2 text-[10px] tracking-widest text-white/30">
                      {lightbox.index + 1} / {filtered.length}
                    </p>
                  )}
                </div>

                {/* Prev / Next */}
                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={() => navigate(-1)}
                      className="absolute left-0 top-1/2 -translate-x-14 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigate(1)}
                      className="absolute right-0 top-1/2 translate-x-14 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
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
    </main>
  );
};

export default GalleryPage;