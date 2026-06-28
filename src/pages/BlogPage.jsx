import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import BlogPostCard from "../components/BlogPostCard";
import { useNavigate, useLocation } from "react-router-dom";
import PinModal from "../components/PinModal";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import SEO from "../components/SEO";
import NewsletterSection from "../components/NewsletterSection";
import { SITE_URL } from "../lib/site";

/* ── Shared animation wrapper (same as Home / About / Gallery) ── */
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

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();

  const blogDescription =
    "Read yoga, pranayama, and mindful living articles from Yoga by Nandini. Practical guidance for building a calmer, stronger daily practice.";

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Yoga by Nandini — Blog",
    url: `${SITE_URL}/blog`,
    description: blogDescription,
  };

  /* ── Derived data ── */
  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ];

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  /* ── Fetch ── */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    const id = new URLSearchParams(location.search).get("id");
    if (id) setBlogId(id);
    fetchPosts();
  }, [location.search]);

  /* ── Scroll to linked post ── */
  useEffect(() => {
    if (!blogId || posts.length === 0) return;
    const el = document.getElementById(blogId);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
  }, [blogId, posts]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    navigate("/admin");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-yoga-paper font-body text-yoga-ink">
      <SEO
        title="Yoga & Pranayama Blog | Yoga by Nandini"
        description={blogDescription}
        canonicalPath="/blog"
        schema={blogSchema}
      />

      {/* ── Pin modal ── */}
      <AnimatePresence>
        {showPinModal && (
          <PinModal
            onSuccess={handlePinSuccess}
            onClose={() => setShowPinModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <section className="border-b border-yoga-border px-5 pb-10 pt-32 md:px-10 md:pb-14 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <SectionLabel>Writing</SectionLabel>
            <h1 className="max-w-2xl font-display text-[42px] font-bold leading-[1.08] text-yoga-ink sm:text-6xl lg:text-7xl">
              Thoughts on{" "}
              <em className="text-yoga-clay">practice.</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-yoga-ink/60 md:text-base">
              Articles on yoga philosophy, breathwork, and the quiet discipline of
              building a life rooted in practice.
            </p>
          </motion.div>

          {/* ── Category filter ── */}
          {!loading && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.12, ease: "easeOut" }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`min-h-[36px] rounded-full border px-4 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    activeCategory === cat
                      ? "border-yoga-ink bg-yoga-ink text-yoga-paper"
                      : "border-yoga-border bg-white text-yoga-ink/55 hover:border-yoga-ink/40 hover:text-yoga-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-yoga-mist"
                />
              ))}
            </div>
          )}

          {/* Posts */}
          {!loading && filteredPosts.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Featured / latest post */}
                <FadeUp className="mb-10 md:mb-14">
                  <div
                    id={filteredPosts[0].id}
                    className="relative overflow-hidden rounded-2xl border border-yoga-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    {/* "Latest" badge */}
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-yoga-ink px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-yoga-paper">
                      Latest
                    </div>
                    <BlogPostCard post={filteredPosts[0]} featured />
                  </div>
                </FadeUp>

                {/* Divider + count */}
                {filteredPosts.length > 1 && (
                  <FadeUp className="mb-8 flex items-center gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-yoga-ink/35">
                      {filteredPosts.length - 1}{" "}
                      {filteredPosts.length - 1 === 1 ? "more post" : "more posts"}
                    </span>
                    <span className="h-px flex-1 bg-yoga-border" />
                  </FadeUp>
                )}

                {/* Post grid */}
                {filteredPosts.length > 1 && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.slice(1).map((post, i) => (
                      <FadeUp key={post.id} delay={i * 0.05}>
                        <div
                          id={post.id}
                          className="h-full overflow-hidden rounded-2xl border border-yoga-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                        >
                          <BlogPostCard post={post} />
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!loading && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-28 text-center"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-yoga-border bg-yoga-mist">
                <BookOpen className="h-5 w-5 text-yoga-ink/30" />
              </div>
              <h3 className="font-display text-2xl font-bold text-yoga-ink/60">
                {activeCategory === "All"
                  ? "No posts yet"
                  : `No posts in "${activeCategory}"`}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-7 text-yoga-ink/40">
                {activeCategory === "All"
                  ? "Essays and articles will appear here once published."
                  : "Try a different category above."}
              </p>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-5 min-h-[44px] border-b border-yoga-ink text-sm font-medium text-yoga-ink"
                >
                  View all posts
                </button>
              )}
            </motion.div>
          )}

        </div>
      </section>

      {/* ── Newsletter ── */}
      {!loading && posts.length > 0 && <NewsletterSection />}
    </main>
  );
};

export default BlogPage;