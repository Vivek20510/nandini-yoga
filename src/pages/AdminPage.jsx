import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import DeletePostsModal from '../components/DeletePostsModal';

const AdminUpload = () => {
  const [title, setTitle] = useState('');  // Added state for title
  const [desc, setDesc] = useState('');
  const [media, setMedia] = useState(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(docs);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpload = async () => {
    if (!media || !desc.trim() || !title.trim() || pin.length !== 4) {
      return alert('⚠️ Please provide title, media, description, and a 4-digit PIN.');
    }

    setLoading(true);
  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const resourceType = media.type.startsWith('video') ? 'video' : 'image';
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append('file', media);
    formData.append('upload_preset', uploadPreset);

    const cloudRes = await axios.post(cloudinaryUrl, formData);
    const { secure_url, resource_type } = cloudRes.data;

    await addDoc(collection(db, 'posts'), {
      title: title.trim(),
      desc: desc.trim(),
      url: secure_url,
      type: resource_type,
      date: Timestamp.now(),
      pin: pin,
    });

    alert('✅ Uploaded successfully!');
    setTitle('');
    setDesc('');
    setMedia(null);
    setPin('');
    fetchPosts();
  } catch (err) {
    console.error('❌ Upload failed:', err);
    alert('Upload failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
  <div className="absolute top-4 left-6 text-xl font-semibold text-[#7c5e3b] font-serif">
  Welcome, Nandini Mam!
</div>

    <div className="p-6 max-w-xl mx-auto bg-[#fffdf9] rounded-2xl shadow-lg border border-[#e6d7c3] mt-10 font-serif">
      <h2 className="text-3xl font-bold text-center text-[#7c5e3b] mb-6">
        🌸 Upload Yoga Post
      </h2>

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full border border-[#d5c4af] p-3 rounded mb-4 bg-[#fdfaf5] placeholder:text-[#99876b]"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
        className="block w-full mb-4 border border-[#d5c4af] p-3 rounded cursor-pointer bg-[#f9f6f1]"
      />

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Write a short description..."
        rows="3"
        className="w-full border border-[#d5c4af] p-3 rounded mb-4 resize-none bg-[#fdfaf5] placeholder:text-[#99876b]"
      />

      <input
        type="password"
        maxLength="4"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 4-digit PIN"
        className="w-full border border-[#d5c4af] p-3 rounded mb-4 bg-[#fdfaf5] text-[#8b6f4c] placeholder:text-[#99876b] tracking-widest text-center"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-all duration-200 ${
          loading
            ? 'bg-[#cbbfa8] cursor-not-allowed'
            : 'bg-[#8b6f4c] hover:bg-[#755c3c]'
        }`}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

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
