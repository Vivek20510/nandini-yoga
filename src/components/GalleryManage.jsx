import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Upload, ImagePlus, Edit, Trash2, Check, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryManage = ({ onUploadSuccess }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Upload form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('class');
  const [mediaFile, setMediaFile] = useState(null);
  const [pin, setPin] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('class');
  const [editPin, setEditPin] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [deletePin, setDeletePin] = useState('');

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const adminPin = import.meta.env.VITE_ADMIN_PIN;

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleryItems(docs);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => setMediaFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setMediaFile(file);
  };

  const handleRemoveFile = () => setMediaFile(null);

  const handleUpload = async () => {
    if (!mediaFile || !title.trim() || pin !== adminPin) {
      setErrorMsg('Please fill in all fields and enter correct PIN.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const resourceType = mediaFile.type.startsWith('video') ? 'video' : 'image';
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const formData = new FormData();
      formData.append('file', mediaFile);
      formData.append('upload_preset', uploadPreset);

      const cloudRes = await axios.post(cloudinaryUrl, formData);
      const { secure_url } = cloudRes.data;

      await addDoc(collection(db, 'gallery'), {
        title: title.trim(),
        category,
        imageUrl: secure_url,
        isVideo: resourceType === 'video',
        date: Timestamp.now(),
        pin: adminPin
    });

      setTitle(''); setCategory('class'); setMediaFile(null); setPin('');
      fetchGallery();
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditPin('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCategory('class');
    setEditPin('');
  };

  const saveEdit = async () => {
    if (editPin !== adminPin) {
      setErrorMsg('Incorrect PIN for edit.');
      return;
    }

    try {
      await updateDoc(doc(db, 'gallery', editingId), {
        title: editTitle.trim(),
        category: editCategory,
      });
      fetchGallery();
      cancelEdit();
    } catch (err) {
      console.error('Edit error:', err);
      setErrorMsg('Edit failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (deletePin !== adminPin) {
      setErrorMsg('Incorrect PIN for delete.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'gallery', deletingId));
      fetchGallery();
      setDeletingId(null);
      setDeletePin('');
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMsg('Delete failed. Please try again.');
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
          --radius: 10px; --shadow: 0 2px 16px rgba(44,36,23,0.06);
        }

        .gm-root * { box-sizing: border-box; }
        .gm-root { font-family: var(--font-body); color: var(--bark); background: var(--cream); }

        .gm-header {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          padding: 0 0 24px; border-bottom: 1px solid rgba(44,36,23,0.14); margin-bottom: 24px;
        }
        .gm-title { font-family: var(--font-display); font-size: 1.9rem; font-weight: 400; color: var(--bark); margin: 0; }
        .gm-subtitle { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(44,36,23,0.4); margin-top: 4px; }

        .gm-tabs { display: flex; gap: 2px; padding: 4px; background: var(--sand); border-radius: 10px; margin-bottom: 28px; }
        .gm-tab { flex: 1; padding: 9px 12px; border: none; background: transparent; border-radius: calc(10px - 2px); font-family: var(--font-body); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(44,36,23,0.4); cursor: pointer; transition: all 0.22s; }
        .gm-tab:hover:not(.active) { color: var(--bark); background: rgba(44,36,23,0.04); }
        .gm-tab.active { background: var(--white); color: var(--bark); box-shadow: var(--shadow); }

        .gm-label { display: block; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--terra); margin-bottom: 8px; }

        .gm-field { width: 100%; padding: 12px 16px; font-family: var(--font-body); font-size: 0.88rem; color: var(--bark); background: var(--white); border: 1px solid rgba(44,36,23,0.14); border-radius: 8px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .gm-field::placeholder { color: rgba(44,36,23,0.3); }
        .gm-field:focus { border-color: var(--terra); box-shadow: 0 0 0 3px rgba(184,114,74,0.1); }

        .gm-select { width: 100%; padding: 12px 16px; font-family: var(--font-body); font-size: 0.88rem; color: var(--bark); background: var(--white); border: 1px solid rgba(44,36,23,0.14); border-radius: 8px; outline: none; transition: border-color 0.2s; }
        .gm-select:focus { border-color: var(--terra); }

        .gm-drop { border: 1.5px dashed rgba(44,36,23,0.18); border-radius: 10px; padding: 28px 20px; text-align: center; cursor: pointer; background: var(--white); transition: border-color 0.2s, background 0.2s; }
        .gm-drop.over { border-color: var(--terra); background: rgba(184,114,74,0.04); }
        .gm-drop:hover { border-color: rgba(44,36,23,0.3); }

        .gm-preview { background: var(--white); border: 1px solid rgba(44,36,23,0.1); border-radius: 10px; overflow: hidden; position: relative; }
        .gm-preview img, .gm-preview video { width: 100%; height: 120px; object-fit: cover; display: block; }
        .gm-preview div { padding: 10px 12px; }
        .gm-preview p { font-family: var(--font-body); font-size: 0.75rem; color: var(--bark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .gm-preview p:last-child { font-size: 0.65rem; color: var(--muted); margin-top: 0; }

        .gm-remove { position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; border-radius: 50%; background: rgba(44,36,23,0.75); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--cream); transition: background 0.2s; }
        .gm-remove:hover { background: var(--bark); }

        .gm-submit { width: 100%; padding: 14px; font-family: var(--font-body); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; background: var(--bark); color: var(--cream); border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.22s, transform 0.18s; }
        .gm-submit:hover:not(:disabled) { background: #1a160e; transform: translateY(-1px); }
        .gm-submit:disabled { background: rgba(44,36,23,0.25); cursor: not-allowed; }

        .gm-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 8px; font-size: 0.8rem; line-height: 1.5; }
        .gm-alert.error { background: rgba(192,97,74,0.08); border: 1px solid rgba(192,97,74,0.2); color: #b85a3a; }

        .gm-list { display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; padding-right: 2px; }
        .gm-list::-webkit-scrollbar { width: 4px; }
        .gm-list::-webkit-scrollbar-track { background: transparent; }
        .gm-list::-webkit-scrollbar-thumb { background: rgba(44,36,23,0.2); border-radius: 4px; }

        .gm-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--white); border: 1px solid rgba(44,36,23,0.1); border-radius: 10px; box-shadow: var(--shadow); transition: box-shadow 0.2s, border-color 0.2s; }
        .gm-card:hover { box-shadow: 0 4px 24px rgba(44,36,23,0.1); border-color: rgba(44,36,23,0.28); }

        .gm-thumb { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(44,36,23,0.1); }

        .gm-body { flex: 1; min-width: 0; }
        .gm-card-title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; color: var(--bark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px; }
        .gm-meta { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.06em; }

        .gm-actions { display: flex; gap: 6px; flex-shrink: 0; align-self: flex-start; }
        .gm-icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(44,36,23,0.1); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; color: var(--muted); padding: 0; }
        .gm-icon-btn:hover { background: rgba(44,36,23,0.04); color: var(--bark); border-color: var(--bark); }
        .gm-icon-btn.edit:hover { border-color: var(--gold); color: var(--gold); }
        .gm-icon-btn.del:hover { border-color: #b85a3a; color: #b85a3a; background: rgba(192,97,74,0.04); }

        .gm-edit-form { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .gm-edit-actions { display: flex; gap: 8px; }
        .gm-save-btn { padding: 7px 14px; background: #5a8a6a; border: none; border-radius: 8px; font-family: var(--font-body); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--white); cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.18s; }
        .gm-save-btn:hover { opacity: 0.88; }
        .gm-cancel-btn { padding: 7px 14px; background: transparent; border: 1px solid rgba(44,36,23,0.1); border-radius: 8px; font-family: var(--font-body); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: all 0.18s; }
        .gm-cancel-btn:hover { border-color: var(--bark); color: var(--bark); }

        .gm-pin-input { width: 100%; padding: 12px; text-align: center; letter-spacing: 0.3em; font-size: 1.1rem; font-family: var(--font-display); color: var(--bark); background: var(--white); border: 1px solid rgba(44,36,23,0.14); border-radius: 8px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .gm-pin-input:focus { border-color: var(--terra); box-shadow: 0 0 0 3px rgba(184,114,74,0.1); }

        .gm-empty { text-align: center; padding: 40px 20px; color: var(--muted); }
        .gm-empty-icon { font-size: 2rem; margin-bottom: 10px; opacity: 0.4; }
        .gm-empty-text { font-family: var(--font-display); font-size: 1.05rem; font-style: italic; }

        @keyframes gm-spin { to { transform: rotate(360deg); } }
        .gm-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(247,243,236,0.3); border-top-color: var(--cream); animation: gm-spin 0.9s linear infinite; }

        @media (max-width: 400px) { .gm-thumb { width: 46px; height: 46px; } }
      `}</style>

      <div className="gm-root">
        <div className="gm-header">
          <div>
            <h2 className="gm-title">Gallery <em>Management</em></h2>
            <p className="gm-subtitle">Upload and manage gallery items</p>
          </div>
        </div>

        <div className="gm-tabs">
          <button className={`gm-tab${activeTab === 'upload' ? ' active' : ''}`} onClick={() => setActiveTab('upload')}>
            Upload
          </button>
          <button className={`gm-tab${activeTab === 'manage' ? ' active' : ''}`} onClick={() => setActiveTab('manage')}>
            Manage ({galleryItems.length})
          </button>
        </div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="gm-alert error"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'upload' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="gm-label">Title</span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Gallery item title"
                className="gm-field"
              />
            </div>

            <div>
              <span className="gm-label">Category</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="gm-select"
              >
                <option value="class">Class</option>
                <option value="event">Event</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>

            <div>
              <span className="gm-label">Media</span>
              <label
                className={`gm-drop${dragOver ? " over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: "none" }} />
                <ImagePlus size={22} color="rgba(44,36,23,0.3)" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "rgba(44,36,23,0.4)", marginBottom: "4px" }}>
                  Drop a file or <span style={{ color: "var(--terra)", textDecoration: "underline" }}>browse</span>
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(44,36,23,0.25)", letterSpacing: "0.08em" }}>
                  Images & videos supported
                </p>
              </label>
            </div>

            <AnimatePresence>
              {mediaFile && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="gm-preview"
                >
                  {mediaFile.type.startsWith('image') ? (
                    <img src={URL.createObjectURL(mediaFile)} alt="Preview" />
                  ) : (
                    <video src={URL.createObjectURL(mediaFile)} controls />
                  )}
                  <div>
                    <p>{mediaFile.name}</p>
                    <p>{Math.round(mediaFile.size / 1024)} KB</p>
                  </div>
                  <button className="gm-remove" onClick={handleRemoveFile}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <span className="gm-label">Admin PIN</span>
              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••"
                className="gm-field"
                style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: "1.1rem" }}
              />
            </div>

            <button onClick={handleUpload} disabled={loading} className="gm-submit">
              {loading ? (
                <>
                  <div className="gm-spinner" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Add to Gallery
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            {galleryItems.length === 0 ? (
              <div className="gm-empty">
                <div className="gm-empty-icon">📷</div>
                <p className="gm-empty-text">No gallery items yet</p>
              </div>
            ) : (
              <div className="gm-list">
                {galleryItems.map((item) => (
                  <div key={item.id} className="gm-card">
                    <img src={item.imageUrl} alt={item.title} className="gm-thumb" />
                    <div className="gm-body">
                      {editingId === item.id ? (
                        <div className="gm-edit-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="gm-field"
                            placeholder="Title"
                          />
                          <select
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                            className="gm-select"
                          >
                            <option value="class">Class</option>
                            <option value="event">Event</option>
                            <option value="workshop">Workshop</option>
                          </select>
                          <input
                            type="password"
                            maxLength="4"
                            value={editPin}
                            onChange={e => setEditPin(e.target.value)}
                            placeholder="PIN"
                            className="gm-pin-input"
                          />
                          <div className="gm-edit-actions">
                            <button onClick={saveEdit} className="gm-save-btn">
                              <Check size={12} />
                              Save
                            </button>
                            <button onClick={cancelEdit} className="gm-cancel-btn">
                              <XIcon size={12} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="gm-card-title">{item.title}</h3>
                          <p className="gm-meta">{item.category} • {item.isVideo ? 'Video' : 'Image'}</p>
                        </>
                      )}
                    </div>
                    {editingId !== item.id && (
                      <div className="gm-actions">
                        <button className="gm-icon-btn edit" onClick={() => startEdit(item)}>
                          <Edit size={14} />
                        </button>
                        <button className="gm-icon-btn del" onClick={() => setDeletingId(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {deletingId && (
              <div style={{ marginTop: 20, padding: 16, background: 'var(--white)', border: '1px solid rgba(44,36,23,0.1)', borderRadius: 10 }}>
                <p style={{ marginBottom: 12, fontSize: '0.9rem' }}>Enter PIN to confirm deletion:</p>
                <input
                  type="password"
                  maxLength="4"
                  value={deletePin}
                  onChange={e => setDeletePin(e.target.value)}
                  placeholder="••••"
                  className="gm-pin-input"
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={handleDelete} className="gm-save-btn" style={{ background: '#b85a3a' }}>
                    <Trash2 size={12} />
                    Delete
                  </button>
                  <button onClick={() => { setDeletingId(null); setDeletePin(''); }} className="gm-cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GalleryManage;