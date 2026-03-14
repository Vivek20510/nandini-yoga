import React, { useState } from 'react';
import { deleteDoc, doc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';
import { X, Upload, ImagePlus, Edit, Trash2, Search, Check, ChevronDown, FileImage, Film, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #F7F3EC;
    --sand: #EDE5D4;
    --bark: #2C2417;
    --bark-soft: rgba(44,36,23,0.07);
    --bark-mid: rgba(44,36,23,0.18);
    --bark-muted: rgba(44,36,23,0.4);
    --terra: #B8724A;
    --terra-light: rgba(184,114,74,0.1);
    --gold: #C9A058;
    --white: #FDFAF5;
    --red: #c0614a;
    --red-light: rgba(192,97,74,0.1);
    --green: #5a8a6a;
    --green-light: rgba(90,138,106,0.12);
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 10px;
    --radius-sm: 6px;
    --shadow: 0 2px 16px rgba(44,36,23,0.06), 0 1px 4px rgba(44,36,23,0.04);
    --shadow-md: 0 4px 24px rgba(44,36,23,0.1), 0 2px 8px rgba(44,36,23,0.06);
  }

  .bm-root * { box-sizing: border-box; }

  .bm-root {
    font-family: var(--font-body);
    color: var(--bark);
    background: var(--cream);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .bm-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 0 0 24px;
    border-bottom: 1px solid var(--bark-mid);
    margin-bottom: 24px;
  }

  .bm-title {
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 4vw, 1.9rem);
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.1;
    color: var(--bark);
    margin: 0;
  }

  .bm-title em {
    font-style: italic;
    color: var(--terra);
  }

  .bm-subtitle {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--bark-muted);
    margin-top: 4px;
  }

  /* ── Tabs ── */
  .bm-tabs {
    display: flex;
    gap: 2px;
    padding: 4px;
    background: var(--sand);
    border-radius: var(--radius);
    margin-bottom: 28px;
  }

  .bm-tab {
    flex: 1;
    padding: 9px 12px;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius) - 2px);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--bark-muted);
    cursor: pointer;
    transition: all 0.22s ease;
  }

  .bm-tab:hover:not(.active) {
    color: var(--bark);
    background: rgba(44,36,23,0.04);
  }

  .bm-tab.active {
    background: var(--white);
    color: var(--bark);
    box-shadow: var(--shadow);
  }

  /* ── Label ── */
  .bm-label {
    display: block;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--terra);
    font-weight: 500;
    margin-bottom: 8px;
  }

  /* ── Field ── */
  .bm-field {
    width: 100%;
    padding: 11px 14px;
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--bark);
    background: var(--white);
    border: 1.5px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .bm-field::placeholder { color: rgba(44,36,23,0.28); }

  .bm-field:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px var(--terra-light);
  }

  textarea.bm-field {
    resize: vertical;
    line-height: 1.7;
    min-height: 100px;
  }

  /* ── Drop zone ── */
  .bm-drop {
    position: relative;
    border: 1.5px dashed var(--bark-mid);
    border-radius: var(--radius);
    padding: 36px 20px;
    text-align: center;
    cursor: pointer;
    background: var(--white);
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    overflow: hidden;
  }

  .bm-drop input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .bm-drop.over,
  .bm-drop:hover {
    border-color: var(--terra);
    background: var(--terra-light);
    transform: scale(1.005);
  }

  .bm-drop-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--sand);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
  }

  .bm-drop-text {
    font-size: 0.85rem;
    color: var(--bark-muted);
    margin: 0 0 4px;
  }

  .bm-drop-sub {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(44,36,23,0.25);
  }

  /* ── Media grid ── */
  .bm-media-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (min-width: 480px) {
    .bm-media-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .bm-media-card {
    position: relative;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--white);
    border: 1px solid var(--bark-mid);
    box-shadow: var(--shadow);
  }

  .bm-media-thumb {
    width: 100%;
    height: 100px;
    object-fit: cover;
    display: block;
  }

  .bm-media-info {
    padding: 8px 10px;
  }

  .bm-media-name {
    font-size: 0.72rem;
    color: var(--bark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bm-media-size {
    font-size: 0.62rem;
    color: var(--bark-muted);
    margin-top: 2px;
  }

  .bm-media-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(44,36,23,0.72);
    backdrop-filter: blur(4px);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    transition: background 0.2s;
    padding: 0;
  }

  .bm-media-remove:hover { background: var(--bark); }

  .bm-media-type-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    padding: 2px 7px;
    border-radius: 20px;
    background: rgba(44,36,23,0.62);
    backdrop-filter: blur(4px);
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--cream);
  }

  /* ── PIN input ── */
  .bm-pin-wrap {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .bm-pin-digit {
    width: 52px;
    height: 52px;
    text-align: center;
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--bark);
    background: var(--white);
    border: 1.5px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.1em;
  }

  .bm-pin-digit:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px var(--terra-light);
  }

  /* single PIN field fallback */
  .bm-pin-single {
    width: 100%;
    padding: 12px;
    text-align: center;
    letter-spacing: 0.5em;
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 300;
    color: var(--bark);
    background: var(--white);
    border: 1.5px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .bm-pin-single:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px var(--terra-light);
  }

  /* ── Submit button ── */
  .bm-submit {
    width: 100%;
    padding: 14px;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    background: var(--bark);
    color: var(--cream);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.22s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 2px 12px rgba(44,36,23,0.18);
  }

  .bm-submit:hover:not(:disabled) {
    background: #1a160e;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(44,36,23,0.24);
  }

  .bm-submit:active:not(:disabled) { transform: translateY(0); }

  .bm-submit:disabled {
    background: rgba(44,36,23,0.2);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* ── Alert ── */
  .bm-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .bm-alert.error {
    background: var(--red-light);
    border: 1px solid rgba(192,97,74,0.22);
    color: var(--red);
  }

  .bm-alert.success {
    background: var(--green-light);
    border: 1px solid rgba(90,138,106,0.22);
    color: var(--green);
  }

  /* ── Divider ── */
  .bm-divider {
    height: 1px;
    background: var(--bark-mid);
    margin: 4px 0;
  }

  /* ── Search ── */
  .bm-search-wrap {
    position: relative;
  }

  .bm-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--bark-muted);
  }

  .bm-search {
    width: 100%;
    padding: 10px 14px 10px 38px;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--bark);
    background: var(--white);
    border: 1.5px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .bm-search::placeholder { color: rgba(44,36,23,0.28); }

  .bm-search:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px var(--terra-light);
  }

  /* ── Bulk bar ── */
  .bm-bulk-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--sand);
    border: 1px solid var(--bark-mid);
    border-radius: var(--radius-sm);
  }

  .bm-bulk-count {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--bark);
    flex: 1;
    min-width: 80px;
  }

  .bm-ghost-btn {
    padding: 6px 10px;
    background: transparent;
    border: 1px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--bark-muted);
    cursor: pointer;
    transition: all 0.18s;
  }

  .bm-ghost-btn:hover {
    border-color: var(--bark);
    color: var(--bark);
    background: var(--bark-soft);
  }

  .bm-danger-btn {
    padding: 7px 14px;
    background: var(--red);
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--white);
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
  }

  .bm-danger-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .bm-danger-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* ── Select all row ── */
  .bm-select-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 2px;
  }

  .bm-checkbox {
    width: 17px;
    height: 17px;
    accent-color: var(--terra);
    cursor: pointer;
    flex-shrink: 0;
  }

  .bm-select-label {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--bark-muted);
  }

  /* ── Post card ── */
  .bm-post-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 2px;
  }

  .bm-post-list::-webkit-scrollbar { width: 4px; }
  .bm-post-list::-webkit-scrollbar-track { background: transparent; }
  .bm-post-list::-webkit-scrollbar-thumb { background: var(--bark-mid); border-radius: 4px; }

  .bm-post-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: var(--white);
    border: 1px solid var(--bark-mid);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .bm-post-card:hover {
    box-shadow: var(--shadow-md);
    border-color: rgba(44,36,23,0.28);
  }

  .bm-post-card.selected {
    border-color: var(--terra);
    background: rgba(184,114,74,0.03);
  }

  .bm-post-thumb {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid var(--bark-mid);
  }

  .bm-post-body {
    flex: 1;
    min-width: 0;
  }

  .bm-post-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    color: var(--bark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 3px;
  }

  .bm-post-meta {
    font-size: 0.7rem;
    color: var(--bark-muted);
    letter-spacing: 0.06em;
  }

  .bm-post-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    align-self: flex-start;
  }

  .bm-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--bark-mid);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.18s;
    color: var(--bark-muted);
    padding: 0;
  }

  .bm-icon-btn:hover { background: var(--bark-soft); color: var(--bark); border-color: var(--bark); }
  .bm-icon-btn.edit:hover { border-color: var(--gold); color: var(--gold); }
  .bm-icon-btn.del:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }

  /* ── Edit form inside card ── */
  .bm-edit-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }

  .bm-edit-actions {
    display: flex;
    gap: 8px;
  }

  .bm-save-btn {
    padding: 7px 14px;
    background: var(--green);
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.18s;
  }

  .bm-save-btn:hover { opacity: 0.88; }

  .bm-cancel-btn {
    padding: 7px 14px;
    background: transparent;
    border: 1px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--bark-muted);
    cursor: pointer;
    transition: all 0.18s;
  }

  .bm-cancel-btn:hover { border-color: var(--bark); color: var(--bark); }

  /* ── PIN row in manage ── */
  .bm-pin-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .bm-pin-sm {
    width: 80px;
    padding: 8px 10px;
    text-align: center;
    letter-spacing: 0.4em;
    font-size: 1rem;
    font-family: var(--font-display);
    color: var(--bark);
    background: var(--white);
    border: 1.5px solid var(--bark-mid);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .bm-pin-sm:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px var(--terra-light);
  }

  /* ── Empty state ── */
  .bm-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--bark-muted);
  }

  .bm-empty-icon {
    font-size: 2rem;
    margin-bottom: 10px;
    opacity: 0.4;
  }

  .bm-empty-text {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-style: italic;
    color: var(--bark-muted);
  }

  /* ── Spinner ── */
  @keyframes bm-spin { to { transform: rotate(360deg); } }
  .bm-spinner {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(247,243,236,0.3);
    border-top-color: var(--cream);
    animation: bm-spin 0.9s linear infinite;
  }

  /* ── Responsive ── */
  @media (max-width: 400px) {
    .bm-pin-digit { width: 44px; height: 44px; font-size: 1.4rem; }
    .bm-media-thumb { height: 80px; }
    .bm-post-thumb { width: 46px; height: 46px; }
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const mediaCount = (media = []) => {
  const imgs = media.filter(m => m.type === 'image').length;
  const vids = media.filter(m => m.type === 'video').length;
  const parts = [];
  if (imgs) parts.push(`${imgs} photo${imgs > 1 ? 's' : ''}`);
  if (vids) parts.push(`${vids} video${vids > 1 ? 's' : ''}`);
  return parts.join(' · ') || '0 items';
};

// ─── Main ────────────────────────────────────────────────────────────────────

const BlogManage = ({ posts, onClose, fetchPosts, onUploadSuccess }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const [deletePin, setDeletePin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const filteredPosts = posts.filter(p =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.desc || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePostSelect = (id) =>
    setSelectedPostIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectAllPosts = () => setSelectedPostIds(filteredPosts.map(p => p.id));
  const clearSelection = () => setSelectedPostIds([]);

  const handleBulkDelete = async () => {
    if (deletePin !== import.meta.env.VITE_ADMIN_PIN) { setDeleteError('Incorrect PIN.'); return; }
    setIsDeleting(true);
    try {
      for (const id of selectedPostIds) await deleteDoc(doc(db, 'posts', id));
      fetchPosts(); clearSelection(); setDeletePin(''); setDeleteError('');
    } catch (err) {
      setDeleteError('Bulk delete failed. Please try again.');
    } finally { setIsDeleting(false); }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id); setEditTitle(post.title); setEditDesc(post.desc);
    setDeleteError('');
  };

  const handleSaveEdit = async () => {
    if (deletePin !== import.meta.env.VITE_ADMIN_PIN) { setDeleteError('Incorrect PIN.'); return; }
    try {
      await updateDoc(doc(db, 'posts', editingPost), {
        title: editTitle.trim(), desc: editDesc.trim(),
      });
      fetchPosts(); setEditingPost(null); setEditTitle(''); setEditDesc(''); setDeletePin(''); setDeleteError('');
    } catch (err) { setDeleteError('Edit failed. Try again.'); }
  };

  const handleCancelEdit = () => {
    setEditingPost(null); setEditTitle(''); setEditDesc('');
    setDeletePin(''); setDeleteError('');
  };

  const handleSingleDelete = async (postId) => {
    if (deletePin !== import.meta.env.VITE_ADMIN_PIN) { setDeleteError('Incorrect PIN.'); return; }
    if (!window.confirm('Delete this post?')) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', postId)); fetchPosts(); setDeleteError('');
    } catch (err) { setDeleteError('Delete failed. Try again.');
    } finally { setIsDeleting(false); }
  };

  const addFile = (file) => { if (file) setMediaFiles(prev => [...prev, file]); };
  const handleAddMedia = (e) => { addFile(e.target.files[0]); e.target.value = ''; };
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0]; if (file) addFile(file);
  };
  const handleRemoveFile = (i) => setMediaFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (!mediaFiles.length || !desc.trim() || !title.trim() || pin.length !== 4) {
      setErrorMsg('Please fill in all fields and add at least one media file.'); return;
    }
    setLoading(true); setErrorMsg('');
    try {
      const uploadedMedia = [];
      for (const file of mediaFiles) {
        const resourceType = file.type.startsWith('video') ? 'video' : 'image';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData
        );
        uploadedMedia.push({ url: res.data.secure_url, type: res.data.resource_type });
      }
      await addDoc(collection(db, 'posts'), {
        title: title.trim(), desc: desc.trim(),
        media: uploadedMedia, date: Timestamp.now(), pin,
      });
      setTitle(''); setDesc(''); setMediaFiles([]); setPin('');
      onUploadSuccess();
    } catch (err) {
      setErrorMsg('Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="bm-root">
      <style>{styles}</style>

      {/* Header */}
      <div className="bm-header">
        <div>
          <h2 className="bm-title">Blog <em>Studio</em></h2>
          <p className="bm-subtitle">Create & manage your journal</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bm-tabs">
        <button
          className={`bm-tab${activeTab === 'upload' ? ' active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          New Post
        </button>
        <button
          className={`bm-tab${activeTab === 'manage' ? ' active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage ({posts.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <UploadTab
              title={title} setTitle={setTitle}
              desc={desc} setDesc={setDesc}
              mediaFiles={mediaFiles}
              pin={pin} setPin={setPin}
              loading={loading} errorMsg={errorMsg}
              dragOver={dragOver} setDragOver={setDragOver}
              handleAddMedia={handleAddMedia}
              handleDrop={handleDrop}
              handleRemoveFile={handleRemoveFile}
              handleUpload={handleUpload}
            />
          </motion.div>
        ) : (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <ManageTab
              filteredPosts={filteredPosts}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedPostIds={selectedPostIds}
              togglePostSelect={togglePostSelect}
              selectAllPosts={selectAllPosts}
              clearSelection={clearSelection}
              handleBulkDelete={handleBulkDelete}
              handleSingleDelete={handleSingleDelete}
              deletePin={deletePin} setDeletePin={setDeletePin}
              isDeleting={isDeleting} deleteError={deleteError}
              editingPost={editingPost}
              editTitle={editTitle} setEditTitle={setEditTitle}
              editDesc={editDesc} setEditDesc={setEditDesc}
              handleEdit={handleEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Upload Tab ───────────────────────────────────────────────────────────────

const UploadTab = ({
  title, setTitle, desc, setDesc, mediaFiles, pin, setPin,
  loading, errorMsg, dragOver, setDragOver,
  handleAddMedia, handleDrop, handleRemoveFile, handleUpload,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

    <AnimatePresence>
      {errorMsg && (
        <motion.div
          className="bm-alert error"
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          {errorMsg}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Title */}
    <div>
      <span className="bm-label">Title</span>
      <input
        type="text"
        className="bm-field"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Give this post a name…"
      />
    </div>

    {/* Drop zone */}
    <div>
      <span className="bm-label">Media</span>
      <label
        className={`bm-drop${dragOver ? ' over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept="image/*,video/*" onChange={handleAddMedia} />
        <div className="bm-drop-icon">
          <ImagePlus size={20} color="var(--terra)" />
        </div>
        <p className="bm-drop-text">
          Drop a file or{' '}
          <span style={{ color: 'var(--terra)', textDecoration: 'underline' }}>browse</span>
        </p>
        <p className="bm-drop-sub">Images &amp; videos · Tap to add more</p>
      </label>
    </div>

    {/* Previews */}
    <AnimatePresence>
      {mediaFiles.length > 0 && (
        <motion.div
          className="bm-media-grid"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        >
          {mediaFiles.map((file, i) => (
            <motion.div
              key={i}
              className="bm-media-card"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <div className="bm-media-type-badge">
                {file.type.startsWith('image') ? 'photo' : 'video'}
              </div>

              {file.type.startsWith('image') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i}`}
                  className="bm-media-thumb"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="bm-media-thumb"
                  muted playsInline
                />
              )}

              <div className="bm-media-info">
                <p className="bm-media-name">{file.name}</p>
                <p className="bm-media-size">{fmtSize(file.size)}</p>
              </div>

              <button className="bm-media-remove" onClick={() => handleRemoveFile(i)} type="button">
                <X size={11} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Description */}
    <div>
      <span className="bm-label">Description</span>
      <textarea
        className="bm-field"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Write something about this post…"
        rows={4}
      />
    </div>

    {/* PIN */}
    <div>
      <span className="bm-label">Admin PIN</span>
      <input
        type="password"
        className="bm-pin-single"
        maxLength="4"
        value={pin}
        onChange={e => setPin(e.target.value)}
        placeholder="• • • •"
        autoComplete="current-password"
      />
    </div>

    {/* Divider */}
    <div className="bm-divider" />

    {/* Submit */}
    <button className="bm-submit" onClick={handleUpload} disabled={loading} type="button">
      {loading ? (
        <><div className="bm-spinner" /> Uploading…</>
      ) : (
        <><Upload size={14} /> Publish Post</>
      )}
    </button>
  </div>
);

// ─── Manage Tab ───────────────────────────────────────────────────────────────

const ManageTab = ({
  filteredPosts, searchQuery, setSearchQuery, selectedPostIds,
  togglePostSelect, selectAllPosts, clearSelection,
  handleBulkDelete, handleSingleDelete,
  deletePin, setDeletePin, isDeleting, deleteError,
  editingPost, editTitle, setEditTitle, editDesc, setEditDesc,
  handleEdit, handleSaveEdit, handleCancelEdit,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

    {/* Search */}
    <div className="bm-search-wrap">
      <Search size={15} className="bm-search-icon" />
      <input
        type="text"
        className="bm-search"
        placeholder="Search posts…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>

    {/* PIN row (always visible in manage) */}
    <div>
      <span className="bm-label">Admin PIN</span>
      <input
        type="password"
        className="bm-pin-sm"
        maxLength="4"
        placeholder="• • • •"
        value={deletePin}
        onChange={e => setDeletePin(e.target.value)}
      />
    </div>

    <AnimatePresence>
      {deleteError && (
        <motion.div
          className="bm-alert error"
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          {deleteError}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Bulk bar */}
    <AnimatePresence>
      {selectedPostIds.length > 0 && (
        <motion.div
          className="bm-bulk-bar"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <span className="bm-bulk-count">{selectedPostIds.length} selected</span>
          <button className="bm-ghost-btn" onClick={clearSelection} type="button">Clear</button>
          <button
            className="bm-danger-btn"
            onClick={handleBulkDelete}
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Select all */}
    {filteredPosts.length > 0 && (
      <div className="bm-select-row">
        <input
          type="checkbox"
          className="bm-checkbox"
          checked={selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0}
          onChange={selectedPostIds.length === filteredPosts.length ? clearSelection : selectAllPosts}
        />
        <span className="bm-select-label">Select all</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--bark-muted)' }}>
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </span>
      </div>
    )}

    {/* Post list */}
    <div className="bm-post-list">
      {filteredPosts.length === 0 ? (
        <div className="bm-empty">
          <div className="bm-empty-icon">✦</div>
          <p className="bm-empty-text">No posts found</p>
        </div>
      ) : (
        filteredPosts.map((post) => {
          const firstMedia = post.media?.[0];
          const isEditing = editingPost === post.id;
          const isSelected = selectedPostIds.includes(post.id);

          return (
            <motion.div
              key={post.id}
              className={`bm-post-card${isSelected ? ' selected' : ''}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                className="bm-checkbox"
                style={{ marginTop: 4 }}
                checked={isSelected}
                onChange={() => togglePostSelect(post.id)}
              />

              {/* Thumbnail */}
              {firstMedia?.type === 'image' ? (
                <img src={firstMedia.url} alt="thumb" className="bm-post-thumb" />
              ) : (
                <video src={firstMedia?.url} className="bm-post-thumb" muted playsInline />
              )}

              {/* Body */}
              <div className="bm-post-body">
                {isEditing ? (
                  <div className="bm-edit-form">
                    <input
                      type="text"
                      className="bm-field"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      placeholder="Post title"
                      style={{ padding: '8px 10px', fontSize: '0.82rem' }}
                    />
                    <textarea
                      className="bm-field"
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      rows={2}
                      placeholder="Description"
                      style={{ padding: '8px 10px', fontSize: '0.82rem', minHeight: 'unset' }}
                    />
                    <div className="bm-edit-actions">
                      <button className="bm-save-btn" onClick={handleSaveEdit} type="button">
                        <Check size={12} /> Save
                      </button>
                      <button className="bm-cancel-btn" onClick={handleCancelEdit} type="button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="bm-post-title">{post.title || 'Untitled'}</p>
                    <p className="bm-post-meta">{mediaCount(post.media)}</p>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="bm-post-actions">
                  <button
                    className="bm-icon-btn edit"
                    onClick={() => handleEdit(post)}
                    type="button"
                    title="Edit post"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="bm-icon-btn del"
                    onClick={() => handleSingleDelete(post.id)}
                    disabled={isDeleting}
                    type="button"
                    title="Delete post"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  </div>
);

export default BlogManage;
