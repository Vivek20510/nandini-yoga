import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import BlogPostCard from '../components/BlogPostCard';
import { useNavigate, useLocation } from 'react-router-dom';
import PinModal from '../components/PinModal';
import { motion } from 'framer-motion';
import { PlusCircle, FileText } from 'lucide-react'; // Import Lucide icons

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postData);
    };

    const queryParams = new URLSearchParams(location.search);
    const idFromUrl = queryParams.get('id');
    console.log('Blog ID from URL:', idFromUrl);

    if (idFromUrl) {
      setBlogId(idFromUrl);
    }

    fetchBlogPosts();
  }, [location.search]);

  useEffect(() => {
    if (blogId && posts.length > 0) {
      const postElement = document.getElementById(blogId);
      console.log('Post Element:', postElement);
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
        className="min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-24 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-16 gap-6">

            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                Wellness Journal
              </h1>
              <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-xl">
                Insights, reflections, and mindful practices to guide your
                journey toward balance and clarity.
              </p>
            </div>

            <button
              onClick={() => setShowPinModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <PlusCircle size={18} />
              Upload Post
            </button>

          </div>

          {showPinModal && (
            <PinModal
              onSuccess={handlePinSuccess}
              onClose={() => setShowPinModal(false)}
            />
          )}

          {/* If Posts Exist */}
          {posts.length > 0 ? (
            <>
              {/* Featured Post */}
              <div className="mb-20">
                <div id={posts[0].id}>
                  <BlogPostCard post={posts[0]} featured />
                </div>
              </div>

              {/* Remaining Posts Grid */}
              {posts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {posts.slice(1).map((post) => (
                    <div key={post.id} id={post.id}>
                      <BlogPostCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No posts yet
              </h3>
              <p className="mt-3 text-gray-500 text-sm">
                Your wellness insights will appear here once published.
              </p>
            </div>
          )}

        </div>
      </motion.div>
  );
};

export default BlogPage;
