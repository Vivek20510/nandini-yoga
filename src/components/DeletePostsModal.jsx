import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const DeletePostsModal = ({ posts, onClose, fetchPosts }) => {
  const [pin, setPin] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
  };

  const handleDelete = async () => {
    if (pin !== import.meta.env.VITE_ADMIN_PIN) {
      setError('❌ Incorrect PIN.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', postToDelete));
      alert('🗑️ Post deleted successfully!');
      fetchPosts();
      onClose();
    } catch (err) {
      console.error('❌ Delete failed:', err);
      setError('Delete failed. Try again.');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg border relative">
        <h3 className="text-xl font-bold mb-4 text-[#7c5e3b]">🗑️ Delete Posts</h3>
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {postToDelete && (
            <div>
              <input
                type="password"
                className="p-2 w-full mb-4 border rounded"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <button
                onClick={handleDelete}
                className={`text-red-600 font-bold hover:underline text-sm ${isDeleting && 'cursor-not-allowed'}`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          )}

          {!postToDelete && (
            <div className="space-y-4">
              {posts.map((post) => {
                const firstMedia = post.media?.[0];
                const typeIcons = post.media?.map((m) =>
                  m.type === 'image' ? '🖼️' : '🎥'
                );

                return (
                  <div
                    key={post.id}
                    className="border p-3 rounded-lg bg-[#fdf9f3] shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 w-4/5">
                      {/* Thumbnail */}
                      {firstMedia?.type === 'image' ? (
                        <img
                          src={firstMedia.url}
                          alt="thumbnail"
                          className="w-14 h-14 rounded object-cover border"
                        />
                      ) : (
                        <video
                          src={firstMedia?.url}
                          className="w-14 h-14 rounded object-cover border"
                          muted
                          playsInline
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-[#6e5a3d] truncate">{post.title}</p>
                        <p className="text-xs text-[#a49a88] truncate">
                          {typeIcons?.join(' ')} • {post.media?.length} item{post.media?.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="text-red-600 font-bold hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletePostsModal;
