import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import DeletePostsModal from '../components/DeletePostsModal';
import MediaUploadForm from '../components/MediaUploadForm';

const AdminUpload = () => {
  const [posts, setPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(docs);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="absolute top-19 left-6 text-xl font-semibold text-[#7c5e3b] font-serif">
        Welcome, Nandini Mam!
      </div>

      <div className="p-6 max-w-xl mx-auto bg-[#fffdf9] rounded-2xl shadow-lg border border-[#e6d7c3] mt-10 font-serif">
        <h2 className="text-3xl font-bold text-center text-[#7c5e3b] mb-6">🌸 Upload Yoga Post</h2>

        <MediaUploadForm onUploadSuccess={fetchPosts} />

        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-6 w-full py-2 px-4 rounded border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all duration-150"
        >
          🗑️ Manage/Delete Posts
        </button>

        {showDeleteModal && (
          <DeletePostsModal
            posts={posts}
            onClose={() => setShowDeleteModal(false)}
            fetchPosts={fetchPosts}
          />
        )}
      </div>
    </>
  );
};

export default AdminUpload;
