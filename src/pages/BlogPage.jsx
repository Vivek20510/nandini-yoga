import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import BlogPostCard from '../components/BlogPostCard';
import { useNavigate } from 'react-router-dom';
import PinModal from '../components/PinModal';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const postData = querySnapshot.docs.map((doc) => doc.data());
      setPosts(postData);
    };

    fetchBlogPosts();
  }, []);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    navigate('/admin');
  };

  return (
    <motion.div
      className="min-h-screen bg-[#fffaf5] font-serif text-[#444] px-4 sm:px-6 py-10 sm:py-14"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4 sm:gap-0">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-[#5e3c58] tracking-wide"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            🌸Blog
          </motion.h1>

          <motion.button
  onClick={() => setShowPinModal(true)}
  className="bg-transparent border-2 border-[#a15e7c] text-[#a15e7c] px-6 py-3 rounded-xl shadow-sm hover:bg-[#a15e7c] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#e3c0cf] focus:ring-offset-2"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Upload Post
</motion.button>

        </div>

        {/* Pin Modal */}
        {showPinModal && (
          <PinModal
            onSuccess={handlePinSuccess}
            onClose={() => setShowPinModal(false)}
          />
        )}

        


        {/* Blog Posts - Hero + Chronological Feed */}
        <div className="space-y-20">
          {posts.length > 0 && (
            <>
              {/* Hero Post (First Post) */}
              <motion.div
                key={0}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="border-b border-[#e8decf] pb-12 mb-10">
                  <BlogPostCard post={posts[0]} />
                </div>
              </motion.div>

              {/* Remaining Posts */}
              <motion.div
                className="space-y-16"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
              >
                {posts.slice(1).map((post, index) => (
                  <motion.div
                    key={index + 1}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <BlogPostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>




        {/* No Posts State (Optional) */}
        {posts.length === 0 && (
          <div className="text-center text-[#8b6f4c] mt-20 text-lg italic">
            No blog posts yet. Be the first to upload one!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
