import React, { useState } from 'react';
import axios from 'axios';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MediaUploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleUpload = async () => {
    if (!mediaFiles.length || !desc.trim() || !title.trim() || pin.length !== 4) {
      setErrorMsg('⚠️ Please provide all required fields.');
      return;
    }
  
    setLoading(true);
    setErrorMsg('');
  
    try {
      const uploadedMedia = [];
  
      for (const file of mediaFiles) {
        const resourceType = file.type.startsWith('video') ? 'video' : 'image';
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
  
        const cloudRes = await axios.post(cloudinaryUrl, formData);
        const { secure_url, resource_type } = cloudRes.data;
  
        uploadedMedia.push({ url: secure_url, type: resource_type });
      }
  
      // Save all media in one document
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        desc: desc.trim(),
        media: uploadedMedia,
        date: Timestamp.now(),
        pin: pin,
      });
  
      alert('✅ All media uploaded and saved!');
      setTitle('');
      setDesc('');
      setMediaFiles([]);
      setPin('');
      onUploadSuccess();
    } catch (err) {
      console.error('❌ Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFiles((prev) => [...prev, file]);
    }
  };

  const handleRemoveFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full border p-3 rounded mb-3"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleAddMedia}
        className="w-full border p-3 rounded mb-3"
      />

      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative border p-2 rounded bg-white shadow-sm">
              {file.type.startsWith('image') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="h-28 w-full object-cover rounded"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="h-28 w-full object-cover rounded"
                  onLoadedMetadata={(e) => {
                    file._duration = e.target.duration.toFixed(2);
                  }}
                  controls
                />
              )}

              <div className="text-sm mt-2">
                <p className="truncate">{file.name}</p>
                <p className="text-gray-500 text-xs">
                  {Math.round(file.size / 1024)} KB
                  {file._duration && ` • ${file._duration}s`}
                </p>
              </div>

              <button
                onClick={() => handleRemoveFile(index)}
                className="absolute top-2 left-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter description"
        className="w-full border p-3 rounded mb-3"
        rows={3}
      />

      <input
        type="password"
        maxLength="4"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 4-digit PIN"
        className="w-full border p-3 rounded mb-3 text-center tracking-widest"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading ? 'bg-gray-400' : 'bg-[#8b6f4c] hover:bg-[#755c3c]'
        }`}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default MediaUploadForm;
