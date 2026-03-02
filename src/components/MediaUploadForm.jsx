import React, { useState } from 'react';
import axios from 'axios';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Upload, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaUploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle]           = useState('');
  const [desc, setDesc]             = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [pin, setPin]               = useState('');
  const [loading, setLoading]       = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [dragOver, setDragOver]     = useState(false);

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const addFile = (file) => {
    if (file) setMediaFiles(prev => [...prev, file]);
  };

  const handleAddMedia = (e) => addFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) addFile(file);
  };

  const handleRemoveFile = (index) =>
    setMediaFiles(prev => prev.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (!mediaFiles.length || !desc.trim() || !title.trim() || pin.length !== 4) {
      setErrorMsg('Please fill in all fields and add at least one media file.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const uploadedMedia = [];

      for (const file of mediaFiles) {
        const resourceType  = file.type.startsWith('video') ? 'video' : 'image';
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const formData      = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const cloudRes = await axios.post(cloudinaryUrl, formData);
        const { secure_url, resource_type } = cloudRes.data;
        uploadedMedia.push({ url: secure_url, type: resource_type });
      }

      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        desc:  desc.trim(),
        media: uploadedMedia,
        date:  Timestamp.now(),
        pin,
      });

      setTitle(''); setDesc(''); setMediaFiles([]); setPin('');
      onUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        :root {
          --cream: #F7F3EC; --sand: #EDE5D4; --bark: #2C2417;
          --terra: #B8724A; --gold: #C9A058; --white: #FDFAF5;
          --muted: rgba(44,36,23,0.42);
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'Jost', sans-serif;
        }

        .muf-field {
          width: 100%; padding: 12px 16px;
          font-family: var(--font-body); font-size: 0.88rem; color: var(--bark);
          background: var(--white); border: 1px solid rgba(44,36,23,0.14);
          border-radius: 8px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .muf-field::placeholder { color: rgba(44,36,23,0.3); }
        .muf-field:focus { border-color: var(--terra); box-shadow: 0 0 0 3px rgba(184,114,74,0.1); }

        .muf-drop {
          border: 1.5px dashed rgba(44,36,23,0.18); border-radius: 10px;
          padding: 28px 20px; text-align: center; cursor: pointer;
          background: var(--white); transition: border-color 0.2s, background 0.2s;
        }
        .muf-drop.over { border-color: var(--terra); background: rgba(184,114,74,0.04); }
        .muf-drop:hover { border-color: rgba(44,36,23,0.3); }

        .muf-preview {
          background: var(--white); border: 1px solid rgba(44,36,23,0.1);
          border-radius: 10px; overflow: hidden; position: relative;
        }

        .muf-remove {
          position: absolute; top: 8px; right: 8px;
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(44,36,23,0.75); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--cream); transition: background 0.2s;
        }
        .muf-remove:hover { background: var(--bark); }

        .muf-submit {
          width: 100%; padding: 14px;
          font-family: var(--font-body); font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: var(--bark); color: var(--cream);
          border: none; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.22s, transform 0.18s;
        }
        .muf-submit:hover:not(:disabled) { background: #1a160e; transform: translateY(-1px); }
        .muf-submit:disabled { background: rgba(44,36,23,0.25); cursor: not-allowed; }

        .muf-label {
          font-family: var(--font-body); font-size: 0.62rem;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--terra); display: block; margin-bottom: 8px;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(192,97,74,0.08)", border: "1px solid rgba(192,97,74,0.2)", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#b85a3a" }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <div>
          <span className="muf-label">Title</span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title"
            className="muf-field"
          />
        </div>

        {/* Drop zone */}
        <div>
          <span className="muf-label">Media</span>
          <label
            className={`muf-drop${dragOver ? " over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*,video/*" onChange={handleAddMedia} style={{ display: "none" }} />
            <ImagePlus size={22} color="rgba(44,36,23,0.3)" style={{ margin: "0 auto 10px" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "rgba(44,36,23,0.4)", marginBottom: "4px" }}>
              Drop a file or <span style={{ color: "var(--terra)", textDecoration: "underline" }}>browse</span>
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(44,36,23,0.25)", letterSpacing: "0.08em" }}>
              Images & videos supported
            </p>
          </label>
        </div>

        {/* Previews */}
        <AnimatePresence>
          {mediaFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}
            >
              {mediaFiles.map((file, i) => (
                <motion.div
                  key={i}
                  className="muf-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  {file.type.startsWith('image') ? (
                    <img src={URL.createObjectURL(file)} alt={`Preview ${i}`}
                      style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                  ) : (
                    <video src={URL.createObjectURL(file)} controls
                      style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                  )}
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--bark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {file.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--muted)", marginTop: "2px" }}>
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                  <button className="muf-remove" onClick={() => handleRemoveFile(i)}>
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description */}
        <div>
          <span className="muf-label">Description</span>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Write something about this post..."
            rows={4}
            className="muf-field"
            style={{ resize: "vertical", lineHeight: 1.7 }}
          />
        </div>

        {/* PIN */}
        <div>
          <span className="muf-label">Admin PIN</span>
          <input
            type="password"
            maxLength="4"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="••••"
            className="muf-field"
            style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: "1.1rem" }}
          />
        </div>

        {/* Submit */}
        <button onClick={handleUpload} disabled={loading} className="muf-submit">
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(247,243,236,0.3)", borderTopColor: "var(--cream)" }}
              />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={14} />
              Publish Post
            </>
          )}
        </button>

      </div>
    </>
  );
};

export default MediaUploadForm;
