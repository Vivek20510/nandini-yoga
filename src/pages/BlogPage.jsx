import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import BlogPostCard from '../components/BlogPostCard';
import { useNavigate, useLocation } from 'react-router-dom';
import PinModal from '../components/PinModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, BookOpen } from 'lucide-react';

/* ─────────── FADE-UP HELPER ─────────── */
const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─────────── SECTION LABEL ─────────── */
const Label = ({ children }) => (
  <span
    className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {children}
  </span>
);

/* ─────────── CATEGORY PILL ─────────── */
const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300 ${
      active
        ? "bg-[#1D3C52] text-white shadow-md"
        : "bg-transparent border border-[#D8D2C4] text-[#8BA5B5] hover:border-[#1D3C52] hover:text-[#1D3C52]"
    }`}
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {label}
  </button>
);

/* ═══════════════════════════════════════
   BLOG PAGE
═══════════════════════════════════════ */
const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();

  // Derive unique categories from posts
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const postData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postData);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const idFromUrl = queryParams.get('id');
    if (idFromUrl) setBlogId(idFromUrl);

    fetchBlogPosts();
  }, [location.search]);

  useEffect(() => {
    if (blogId && posts.length > 0) {
      const postElement = document.getElementById(blogId);
      if (postElement) {
        setTimeout(() => {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  }, [blogId, posts]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    navigate('/admin');
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FAFAF7]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* ═══ HERO HEADER ═══ */}
      <section className="bg-[#F4F1E6] pt-20 pb-16 border-b border-[#E8E4D8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Label>Wellness Journal</Label>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2rem,4.5vw,3.5rem)] font-normal leading-[1.1] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Thoughts on<br />
                <em className="italic text-[#8BA5B5]">Practice & Living</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="mt-5 text-[15px] leading-[1.85] text-[#5A7485] max-w-xl"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Essays on yoga philosophy, breathwork, Ayurveda, and the quiet 
                discipline of building a life rooted in practice.
              </motion.p>
            </div>

            {/* Upload button — admin only, hidden in plain sight */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowPinModal(true)}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D8D2C4] text-[12px] tracking-[0.1em] uppercase font-medium text-[#8BA5B5] hover:border-[#1D3C52] hover:text-[#1D3C52] transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <PlusCircle size={15} />
              New Post
            </motion.button>
          </div>

          {/* Category filter pills */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ PIN MODAL ═══ */}
      <AnimatePresence>
        {showPinModal && (
          <PinModal
            onSuccess={handlePinSuccess}
            onClose={() => setShowPinModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══ CONTENT ═══ */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-[#F0EDE0] animate-pulse h-64" />
            ))}
          </div>
        )}

        {/* Posts */}
        {!loading && filteredPosts.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {/* Featured Post */}
              <div className="mb-16" id={filteredPosts[0].id}>
                <FadeUp>
                  <div className="relative group bg-white rounded-3xl border border-[#E8E4D8] overflow-hidden hover:shadow-xl hover:border-[#A8BDC8] transition-all duration-500">
                    <BlogPostCard post={filteredPosts[0]} featured />
                    {/* Featured badge */}
                    <div className="absolute top-6 left-6">
                      <span
                        className="px-3 py-1 rounded-full bg-[#1D3C52] text-white text-[10px] tracking-[0.2em] uppercase font-medium"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Latest
                      </span>
                    </div>
                  </div>
                </FadeUp>
              </div>

              {/* Post count */}
              {filteredPosts.length > 1 && (
                <FadeUp>
                  <div className="flex items-center gap-4 mb-10">
                    <span
                      className="text-[11px] tracking-[0.18em] uppercase text-[#A09880]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {filteredPosts.length - 1} more {filteredPosts.length - 1 === 1 ? "essay" : "essays"}
                    </span>
                    <span className="flex-1 h-[1px] bg-[#E8E4D8]" />
                  </div>
                </FadeUp>
              )}

              {/* Grid */}
              {filteredPosts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.slice(1).map((post, i) => (
                    <FadeUp key={post.id} delay={i * 0.08}>
                      <div
                        id={post.id}
                        className="group bg-white rounded-2xl border border-[#E8E4D8] overflow-hidden hover:shadow-lg hover:border-[#A8BDC8] transition-all duration-400"
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
            transition={{ duration: 0.6 }}
            className="text-center py-32"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F0EDE0] mb-7">
              <BookOpen className="text-[#A09880]" size={22} />
            </div>
            <h3
              className="text-[1.4rem] font-normal text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {activeCategory === "All" ? "No posts yet" : `No posts in "${activeCategory}"`}
            </h3>
            <p
              className="mt-3 text-[14px] text-[#8BA5B5] max-w-sm mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {activeCategory === "All"
                ? "Wellness insights and essays will appear here once published."
                : "Try selecting a different category above."}
            </p>
            {activeCategory !== "All" && (
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-6 text-[12px] tracking-[0.1em] uppercase text-[#1D3C52] underline underline-offset-4 font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View all posts
              </button>
            )}
          </motion.div>
        )}

      </section>

      {/* ═══ NEWSLETTER FOOTER STRIP ═══ */}
      {!loading && posts.length > 0 && (
        <section className="bg-[#1D3C52] py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <FadeUp>
              <p
                className="text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Stay Connected
              </p>
              <h2
                className="text-[1.6rem] font-normal text-[#E8F0F4] leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Get essays delivered<br />
                <em className="italic text-[#8BA5B5]">directly to your inbox</em>
              </h2>
              <form
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-5 py-3 rounded-full border border-[#2E5470] bg-[#243F56] text-[14px] text-[#C8D8E0] placeholder-[#6B8A9A] focus:outline-none focus:ring-2 focus:ring-[#8BA5B5]/30 transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-white text-[#1D3C52] text-[12px] tracking-[0.12em] uppercase font-semibold hover:bg-[#F4F1E6] transition-all duration-300"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Subscribe
                </button>
              </form>
            </FadeUp>
          </div>
        </section>
      )}

    </motion.div>
  );
};

export default BlogPage;
