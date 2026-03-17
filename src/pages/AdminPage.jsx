import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import BlogManage from '../components/BlogManage';
import GalleryManage from '../components/GalleryManage';
import NewsletterManage from '../components/NewsletterManage';
import TestimonialsManage from '../components/TestimonialsManage';
import PinModal from '../components/PinModal';
import SEO from '../components/SEO';

const AdminUpload = () => {
  const [posts, setPosts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(docs);
  };

  const fetchGallery = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGalleryItems(docs);
  };

  const fetchTestimonialsCount = async () => {
    const querySnapshot = await getDocs(collection(db, 'testimonials'));
    setTestimonialsCount(querySnapshot.size);
  };

  useEffect(() => {
    fetchPosts();
    fetchGallery();
    fetchTestimonialsCount();
  }, []);

  const filteredDashboardPosts = posts.filter(p =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tags || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDashboardGallery = galleryItems.filter(g =>
    (g.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = {
    dashboard: {
      title: 'Dashboard',
      eyebrow: 'Admin Workspace',
      subtitle: 'Overview, quick actions, and recent activity across your content.',
      searchable: true,
      searchPlaceholder: 'Search recent posts or gallery items...',
    },
    posts: {
      title: 'Yoga Posts',
      eyebrow: 'Content Library',
      subtitle: 'Create, edit, and manage long-form content for your students.',
      searchable: false,
    },
    gallery: {
      title: 'Gallery',
      eyebrow: 'Media Library',
      subtitle: 'Upload and maintain the visual side of the studio experience.',
      searchable: false,
    },
    newsletter: {
      title: 'Newsletter',
      eyebrow: 'Audience',
      subtitle: 'Track signups and jump into MailerLite campaign workflows.',
      searchable: false,
    },
    testimonials: {
      title: 'Testimonials',
      eyebrow: 'Social Proof',
      subtitle: 'Review submissions and keep homepage testimonials fresh.',
      searchable: false,
    },
  }[activeTab];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
  setIsAuthenticated(false);
  setActiveTab('dashboard');
  setSearchQuery('');
  setSidebarOpen(false);
  window.location.href = '/'; // ← add this line
};

  const navItems = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'posts', icon: '✦', label: 'Yoga Posts' },
    { id: 'gallery', icon: '⊞', label: 'Gallery' },
    { id: 'newsletter', icon: '✉', label: 'Newsletter' },
    { id: 'testimonials', icon: '★', label: 'Testimonials' },
  ];

  return (
    <>
      <SEO title="Admin" canonicalPath="/admin" robots="noindex,nofollow" />
      {!isAuthenticated ? (
        <PinModal onSuccess={() => setIsAuthenticated(true)} onClose={() => window.location.href = '/'} />
      ) : (
        <>
          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #FDFAF5;
          --cream2: #F5F0E8;
          --cream3: #EDE7DA;
          --sand: #D9CFBF;
          --tan: #B8A898;
          --brown: #7A5C3E;
          --brown-light: #9B7355;
          --brown-pale: #E8DDD0;
          --text-dark: #2C1F14;
          --text-mid: #5A4535;
          --text-light: #8C7A6A;
          --text-faint: #B5A898;
          --white: #FFFFFF;
          --red-soft: #C4533A;
          --red-bg: #FDF0ED;
          --green-dot: #5A8A5A;
          --sidebar-w: 240px;
          --shadow-sm: 0 1px 3px rgba(100,70,40,0.08), 0 1px 2px rgba(100,70,40,0.06);
          --shadow-md: 0 4px 16px rgba(100,70,40,0.1), 0 2px 6px rgba(100,70,40,0.07);
          --shadow-lg: 0 12px 40px rgba(100,70,40,0.13), 0 4px 12px rgba(100,70,40,0.08);
          --radius: 16px;
          --radius-sm: 10px;
          --radius-xs: 6px;
        }

        .adm { 
          min-height: 100vh; 
          background: var(--cream); 
          font-family: 'Outfit', sans-serif; 
          color: var(--text-dark);
          display: flex;
        }

        /* ── SIDEBAR ── */
        .adm-sidebar {
          width: var(--sidebar-w);
          background: var(--white);
          border-right: 1px solid var(--cream3);
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
        }

        .adm-sidebar-logo {
          padding: 0 24px 28px;
          border-bottom: 1px solid var(--cream3);
          margin-bottom: 16px;
        }

        .adm-logo-mark {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--brown);
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .adm-logo-sub {
          font-size: 11px;
          color: var(--text-faint);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 4px;
          font-weight: 500;
        }

        .adm-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 12px;
          flex: 1;
        }

        .adm-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--radius-sm);
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-light);
          transition: all 0.18s;
          width: 100%;
          text-align: left;
        }

        .adm-nav-item:hover { background: var(--cream2); color: var(--text-mid); }

        .adm-nav-item.active {
          background: var(--brown-pale);
          color: var(--brown);
          font-weight: 600;
        }

        .adm-nav-icon {
          font-size: 17px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .adm-nav-badge {
          margin-left: auto;
          background: var(--cream3);
          color: var(--text-light);
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 100px;
        }

        .adm-nav-item.active .adm-nav-badge {
          background: var(--brown);
          color: var(--white);
        }

        .adm-sidebar-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--cream3);
          margin-top: auto;
        }

        .adm-sidebar-kicker {
          font-size: 10px;
          color: var(--text-faint);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .adm-user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .adm-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brown-light), var(--brown));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 15px; color: var(--white); font-weight: 600;
          flex-shrink: 0;
        }

        .adm-user-name {
          font-size: 13px; font-weight: 600; color: var(--text-dark);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .adm-user-role {
          font-size: 11px; color: var(--text-faint);
          display: flex; align-items: center; gap: 4px;
        }

        .adm-online-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green-dot);
          display: inline-block;
        }

        /* ── OVERLAY (mobile) ── */
        .adm-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(44,31,20,0.4);
          z-index: 99;
          backdrop-filter: blur(2px);
        }

        /* ── MAIN ── */
        .adm-main {
          flex: 1;
          margin-left: var(--sidebar-w);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── TOP BAR ── */
        .adm-topbar {
          background: var(--white);
          border-bottom: 1px solid var(--cream3);
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: sticky; top: 0; z-index: 50;
        }

        .adm-menu-btn {
          display: none;
          width: 36px; height: 36px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--cream3);
          background: none;
          cursor: pointer;
          align-items: center; justify-content: center;
          font-size: 18px; color: var(--text-mid);
        }

        .adm-topbar-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 600;
          color: var(--text-dark);
          line-height: 1.05;
        }

        .adm-topbar-copy {
          flex: 1;
          min-width: 0;
        }

        .adm-topbar-kicker {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-faint);
          margin-bottom: 5px;
          font-weight: 600;
        }

        .adm-topbar-subtitle {
          font-size: 12px;
          color: var(--text-light);
          margin-top: 5px;
          line-height: 1.5;
        }

        .adm-search-wrap {
          position: relative;
          display: flex; align-items: center;
        }

        .adm-search-icon {
          position: absolute; left: 12px;
          font-size: 14px; color: var(--text-faint);
          pointer-events: none;
        }

        .adm-search {
          width: 220px;
          padding: 8px 14px 8px 36px;
          border-radius: 100px;
          border: 1px solid var(--cream3);
          background: var(--cream2);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: var(--text-dark);
          transition: all 0.2s;
          outline: none;
        }

        .adm-search:focus {
          border-color: var(--brown-light);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(155,115,85,0.12);
          width: 260px;
        }

        .adm-search::placeholder { color: var(--text-faint); }

        .adm-topbar-actions {
          display: flex; align-items: center; gap: 8px;
        }

        .adm-icon-btn {
          width: 36px; height: 36px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--cream3);
          background: var(--white);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: var(--text-mid);
          transition: all 0.15s;
        }

        .adm-icon-btn:hover { background: var(--cream2); border-color: var(--sand); }

        .adm-logout-btn {
          padding: 9px 14px;
          border-radius: 100px;
          border: 1px solid rgba(196,83,58,0.2);
          background: var(--red-bg);
          color: var(--red-soft);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }

        .adm-logout-btn:hover {
          background: #FBE4DF;
          border-color: rgba(196,83,58,0.35);
        }

        /* ── BODY ── */
        .adm-body {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .adm-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--cream2);
          color: var(--brown);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        /* ── DASHBOARD ── */
        .adm-section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-faint);
          margin-bottom: 16px;
        }

        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .adm-stat {
          background: var(--white);
          border: 1px solid var(--cream3);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }

        .adm-stat:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

        .adm-stat-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--cream2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .adm-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 600;
          color: var(--text-dark); line-height: 1;
        }

        .adm-stat-name {
          font-size: 13px; color: var(--text-light);
          margin-top: 6px; font-weight: 500;
        }

        .adm-stat-chip {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--cream2); border-radius: 100px;
          padding: 3px 10px; font-size: 11px; color: var(--text-light);
          font-weight: 500; margin-top: 10px;
        }

        /* ── CARDS GRID ── */
        .adm-cards-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .adm-quick-card {
          background: var(--white);
          border: 1px solid var(--cream3);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 16px;
        }

        .adm-quick-card:hover { box-shadow: var(--shadow-md); border-color: var(--brown-light); transform: translateY(-1px); }

        .adm-quick-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: var(--brown-pale);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }

        .adm-quick-label {
          font-size: 15px; font-weight: 600; color: var(--text-dark);
        }

        .adm-quick-sub {
          font-size: 12px; color: var(--text-light); margin-top: 3px;
        }

        .adm-quick-arrow {
          margin-left: auto; color: var(--tan); font-size: 18px;
        }

        .adm-section-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .adm-pill-btn {
          border: 1px solid var(--cream3);
          background: var(--white);
          color: var(--text-mid);
          border-radius: 999px;
          padding: 9px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }

        .adm-pill-btn:hover {
          border-color: var(--sand);
          background: var(--cream2);
        }

        .adm-pill-btn.active {
          background: var(--brown-pale);
          border-color: rgba(122,92,62,0.18);
          color: var(--brown);
        }

        .adm-dashboard-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .adm-mini-list {
          padding: 6px 24px 20px;
        }

        .adm-mini-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid var(--cream3);
        }

        .adm-mini-row:last-child { border-bottom: none; }

        .adm-mini-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }

        .adm-mini-meta {
          margin-top: 4px;
          font-size: 12px;
          color: var(--text-light);
        }

        .adm-mini-chip {
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--cream2);
          color: var(--text-mid);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ── PANEL ── */
        .adm-panel {
          background: var(--white);
          border: 1px solid var(--cream3);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .adm-panel-head {
          padding: 20px 24px;
          border-bottom: 1px solid var(--cream3);
          display: flex; align-items: center; gap: 14px;
        }

        .adm-panel-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--brown-pale);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }

        .adm-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 600; color: var(--text-dark);
        }

        .adm-panel-sub {
          font-size: 12px; color: var(--text-faint);
          margin-top: 2px; text-transform: uppercase;
          letter-spacing: 0.06em; font-weight: 500;
        }

        .adm-panel-body { padding: 24px; }

        /* ── POST LIST ── */
        .adm-list-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--cream3);
          background: var(--cream);
        }

        .adm-list-count {
          font-size: 13px; color: var(--text-light); font-weight: 500;
        }

        .adm-list-actions { display: flex; gap: 8px; }

        .adm-btn {
          padding: 8px 16px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--cream3);
          background: var(--white);
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--text-mid); cursor: pointer;
          transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }

        .adm-btn:hover { background: var(--cream2); border-color: var(--sand); }

        .adm-btn-primary {
          background: var(--brown);
          border-color: var(--brown);
          color: var(--white);
        }

        .adm-btn-primary:hover { background: var(--brown-light); border-color: var(--brown-light); }

        .adm-btn-danger {
          border-color: rgba(196,83,58,0.25);
          background: var(--red-bg);
          color: var(--red-soft);
        }

        .adm-btn-danger:hover { background: #FADDDB; border-color: rgba(196,83,58,0.4); }

        .adm-post-row {
          display: flex; align-items: center;
          padding: 14px 24px;
          border-bottom: 1px solid var(--cream3);
          gap: 14px;
          transition: background 0.15s;
          cursor: pointer;
        }

        .adm-post-row:last-child { border-bottom: none; }
        .adm-post-row:hover { background: var(--cream2); }

        .adm-post-thumb {
          width: 44px; height: 44px;
          border-radius: var(--radius-xs);
          background: var(--cream3);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          overflow: hidden;
        }

        .adm-post-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .adm-post-title {
          font-size: 14px; font-weight: 600; color: var(--text-dark);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 260px;
        }

        .adm-post-meta {
          font-size: 12px; color: var(--text-faint); margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .adm-post-tag {
          display: inline-flex;
          background: var(--cream2); border: 1px solid var(--cream3);
          border-radius: 100px; padding: 3px 10px;
          font-size: 11px; color: var(--text-light); font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .adm-post-row-actions {
          margin-left: auto; display: flex; gap: 6px; flex-shrink: 0;
        }

        .adm-row-btn {
          width: 30px; height: 30px;
          border-radius: 7px;
          border: 1px solid var(--cream3);
          background: var(--white);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--text-light);
          transition: all 0.15s;
        }

        .adm-row-btn:hover { background: var(--cream2); border-color: var(--sand); color: var(--text-mid); }

        .adm-row-btn.del:hover { background: var(--red-bg); border-color: rgba(196,83,58,0.3); color: var(--red-soft); }

        /* ── GALLERY GRID ── */
        .adm-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          padding: 24px;
        }

        .adm-gallery-item {
          aspect-ratio: 1;
          border-radius: var(--radius-sm);
          background: var(--cream3);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid var(--cream3);
        }

        .adm-gallery-item:hover { transform: scale(1.03); box-shadow: var(--shadow-md); }

        .adm-gallery-item img { width: 100%; height: 100%; object-fit: cover; }

        .adm-gallery-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px; font-size: 22px; color: var(--tan);
        }

        .adm-gallery-placeholder span {
          font-size: 10px; color: var(--text-faint);
          font-weight: 500; text-align: center; padding: 0 8px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          width: 100%;
        }

        .adm-gallery-overlay {
          position: absolute; inset: 0;
          background: rgba(44,31,20,0.55);
          opacity: 0;
          display: flex; align-items: center; justify-content: center;
          gap: 6px;
          transition: opacity 0.2s;
        }

        .adm-gallery-item:hover .adm-gallery-overlay { opacity: 1; }

        .adm-gallery-ov-btn {
          width: 30px; height: 30px;
          border-radius: 7px;
          background: rgba(255,255,255,0.9);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--text-dark);
          transition: background 0.15s;
        }

        .adm-gallery-ov-btn:hover { background: var(--white); }

        /* ── EMPTY STATE ── */
        .adm-empty {
          padding: 48px 24px;
          text-align: center;
          color: var(--text-faint);
        }

        .adm-empty-icon { font-size: 36px; margin-bottom: 12px; }
        .adm-empty-text { font-size: 14px; font-weight: 500; color: var(--text-light); }
        .adm-empty-sub { font-size: 13px; margin-top: 4px; }

        /* ── TIP BOX ── */
        .adm-tip {
          background: linear-gradient(135deg, var(--brown-pale), #F5EAD9);
          border: 1px solid rgba(122,92,62,0.2);
          border-radius: var(--radius);
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex; gap: 14px; align-items: flex-start;
        }

        .adm-tip-icon { font-size: 20px; flex-shrink: 0; }

        .adm-tip-title { font-size: 13px; font-weight: 600; color: var(--brown); margin-bottom: 4px; }

        .adm-tip-text { font-size: 13px; color: var(--text-mid); line-height: 1.6; }

        /* ── FORM WRAP ── */
        .adm-form-wrap { padding: 24px; }

        /* ── BOTTOM NAV (mobile only) ── */
        .adm-bottom-nav { display: none; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar.open { transform: translateX(0); }
          .adm-overlay.open { display: block; }
          .adm-menu-btn { display: flex; }
          .adm-main { margin-left: 0; padding-bottom: 64px; }
          .adm-topbar { padding: 0 16px; }
          .adm-topbar-subtitle { display: none; }
          .adm-search { width: 160px; }
          .adm-search:focus { width: 180px; }
          .adm-body { padding: 16px; }
          .adm-cards-row { grid-template-columns: 1fr; }
          .adm-stats-grid { grid-template-columns: 1fr 1fr; }
          .adm-dashboard-grid { grid-template-columns: 1fr; }
          .adm-post-title { max-width: 140px; }
          .adm-bottom-nav {
            display: flex;
            position: fixed; bottom: 0; left: 0; right: 0;
            background: var(--white);
            border-top: 1px solid var(--cream3);
            z-index: 90;
            box-shadow: 0 -4px 20px rgba(100,70,40,0.08);
          }
          .adm-bnav-item {
            flex: 1;
            display: flex; flex-direction: column; align-items: center;
            padding: 10px 0;
            border: none; background: none; cursor: pointer;
            font-family: 'Outfit', sans-serif;
            font-size: 10px; font-weight: 500;
            color: var(--text-faint);
            gap: 4px; transition: color 0.15s;
          }
          .adm-bnav-item.active { color: var(--brown); }
          .adm-bnav-icon { font-size: 18px; }
        }

        @media (max-width: 420px) {
          .adm-stats-grid { grid-template-columns: 1fr; }
          .adm-topbar-actions { gap: 6px; }
          .adm-search-wrap { display: none; }
          .adm-logout-btn { padding: 9px 12px; font-size: 11px; }
        }

        /* ── MANAGE SECTION ── */
        .mgr-tabs {
          display: flex;
          background: var(--cream2);
          border-radius: var(--radius-sm);
          padding: 4px;
          gap: 4px;
          margin-bottom: 20px;
          width: fit-content;
        }

        .mgr-tab {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: none;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; gap: 7px;
        }

        .mgr-tab.active {
          background: var(--white);
          color: var(--brown);
          box-shadow: var(--shadow-sm);
        }

        .mgr-tab-count {
          background: var(--cream3);
          border-radius: 100px;
          padding: 1px 7px;
          font-size: 11px;
        }

        .mgr-tab.active .mgr-tab-count {
          background: var(--brown-pale);
          color: var(--brown);
        }

        /* Toolbar */
        .mgr-toolbar {
          display: flex; align-items: center;
          gap: 10px; flex-wrap: wrap;
          padding: 14px 20px;
          background: var(--cream);
          border-bottom: 1px solid var(--cream3);
        }

        .mgr-toolbar-left { display: flex; align-items: center; gap: 8px; flex: 1; }
        .mgr-toolbar-right { display: flex; align-items: center; gap: 6px; }

        .mgr-select-all {
          font-size: 12px; color: var(--text-light);
          display: flex; align-items: center; gap: 6px;
          cursor: pointer; font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid var(--cream3);
          background: var(--white);
          font-family: 'Outfit', sans-serif;
          transition: all 0.15s;
        }

        .mgr-select-all:hover { border-color: var(--sand); background: var(--cream2); }

        .mgr-selection-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          background: linear-gradient(90deg, var(--brown-pale), #F8EDE0);
          border-bottom: 1px solid rgba(122,92,62,0.18);
          font-size: 13px; font-weight: 500; color: var(--brown);
          animation: fadeUp 0.2s ease;
        }

        .mgr-sel-count {
          background: var(--brown);
          color: var(--white);
          border-radius: 100px;
          padding: 2px 10px;
          font-size: 12px; font-weight: 600;
        }

        .mgr-view-toggle {
          display: flex;
          background: var(--white);
          border: 1px solid var(--cream3);
          border-radius: 8px;
          overflow: hidden;
        }

        .mgr-view-btn {
          width: 32px; height: 32px;
          border: none; background: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--text-faint);
          transition: all 0.15s;
        }

        .mgr-view-btn.active { background: var(--brown-pale); color: var(--brown); }
        .mgr-view-btn:hover:not(.active) { background: var(--cream2); color: var(--text-mid); }

        /* Card grid for posts */
        .mgr-post-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          padding: 20px;
        }

        .mgr-post-card {
          border-radius: var(--radius-sm);
          border: 2px solid var(--cream3);
          background: var(--white);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .mgr-post-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--sand); }
        .mgr-post-card.selected { border-color: var(--brown-light); box-shadow: 0 0 0 3px rgba(155,115,85,0.18); }

        .mgr-card-img {
          width: 100%; height: 130px;
          object-fit: cover;
          background: var(--cream3);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; color: var(--tan);
        }

        .mgr-card-img img { width: 100%; height: 100%; object-fit: cover; }

        .mgr-card-body { padding: 12px 14px; }

        .mgr-card-title {
          font-size: 13px; font-weight: 600; color: var(--text-dark);
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mgr-card-meta {
          font-size: 11px; color: var(--text-faint);
          margin-top: 5px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
        }

        .mgr-card-tag {
          background: var(--cream2);
          border: 1px solid var(--cream3);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 10px; color: var(--text-light); font-weight: 500;
        }

        .mgr-card-actions {
          padding: 10px 14px;
          border-top: 1px solid var(--cream3);
          display: flex; gap: 6px;
        }

        .mgr-card-btn {
          flex: 1;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid var(--cream3);
          background: var(--cream2);
          font-family: 'Outfit', sans-serif;
          font-size: 11px; font-weight: 500;
          color: var(--text-mid); cursor: pointer;
          transition: all 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }

        .mgr-card-btn:hover { background: var(--cream3); border-color: var(--sand); }

        .mgr-card-btn.del {
          border-color: rgba(196,83,58,0.2);
          background: var(--red-bg);
          color: var(--red-soft);
        }

        .mgr-card-btn.del:hover { background: #FAD9D5; }

        /* Checkbox overlay on card */
        .mgr-card-check {
          position: absolute; top: 8px; left: 8px;
          width: 22px; height: 22px;
          border-radius: 6px;
          border: 2px solid rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 11px;
        }

        .mgr-card-check.checked {
          background: var(--brown);
          border-color: var(--brown);
          color: var(--white);
        }

        /* List view for posts */
        .mgr-post-list-row {
          display: flex; align-items: center;
          padding: 12px 20px;
          gap: 14px;
          border-bottom: 1px solid var(--cream3);
          transition: background 0.15s;
          cursor: pointer;
        }

        .mgr-post-list-row:last-child { border-bottom: none; }
        .mgr-post-list-row:hover { background: var(--cream2); }
        .mgr-post-list-row.selected { background: linear-gradient(90deg, var(--brown-pale), transparent); }

        .mgr-list-check {
          width: 18px; height: 18px;
          border-radius: 5px;
          border: 2px solid var(--sand);
          background: var(--white);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; font-size: 10px;
          transition: all 0.15s;
        }

        .mgr-list-check.checked { background: var(--brown); border-color: var(--brown); color: var(--white); }

        .mgr-list-thumb {
          width: 56px; height: 56px;
          border-radius: 10px;
          overflow: hidden; flex-shrink: 0;
          background: var(--cream3);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: var(--tan);
          border: 1px solid var(--cream3);
        }

        .mgr-list-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .mgr-list-info { flex: 1; min-width: 0; }

        .mgr-list-title {
          font-size: 14px; font-weight: 600; color: var(--text-dark);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .mgr-list-meta {
          font-size: 12px; color: var(--text-faint); margin-top: 3px;
          display: flex; align-items: center; gap: 8px;
        }

        .mgr-list-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--tan); flex-shrink: 0;
        }

        .mgr-list-actions { display: flex; gap: 6px; flex-shrink: 0; }

        /* Gallery manage grid - bigger + checkboxes */
        .mgr-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 14px;
          padding: 20px;
        }

        .mgr-gallery-card {
          border-radius: var(--radius-sm);
          border: 2px solid var(--cream3);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          background: var(--cream3);
        }

        .mgr-gallery-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--sand); }
        .mgr-gallery-card.selected { border-color: var(--brown-light); box-shadow: 0 0 0 3px rgba(155,115,85,0.18); }

        .mgr-gallery-img {
          width: 100%; aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }

        .mgr-gallery-img-placeholder {
          width: 100%; aspect-ratio: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px; font-size: 24px; color: var(--tan);
          background: var(--cream3);
        }

        .mgr-gallery-card-foot {
          padding: 8px 10px;
          background: var(--white);
          border-top: 1px solid var(--cream3);
          display: flex; align-items: center; justify-content: space-between;
        }

        .mgr-gallery-name {
          font-size: 11px; font-weight: 500; color: var(--text-mid);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 1;
        }

        /* animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .adm-animate { animation: fadeUp 0.3s ease both; }
        .adm-animate-d1 { animation-delay: 0.05s; }
        .adm-animate-d2 { animation-delay: 0.1s; }
        .adm-animate-d3 { animation-delay: 0.15s; }
        .adm-animate-d4 { animation-delay: 0.2s; }
      `}</style>

      <div className="adm">
        {/* Sidebar */}
        <aside className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="adm-sidebar-logo">
            <div className="adm-logo-mark">🌸 Nandini</div>
            <div className="adm-logo-sub">Yoga Studio · Admin</div>
          </div>

          <nav className="adm-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`adm-nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
                {item.id === 'posts' && (
                  <span className="adm-nav-badge">{posts.length}</span>
                )}
                {item.id === 'gallery' && (
                  <span className="adm-nav-badge">{galleryItems.length}</span>
                )}
                {item.id === 'testimonials' && (
                  <span className="adm-nav-badge">{testimonialsCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="adm-sidebar-footer">
            <div className="adm-sidebar-kicker">Signed In</div>
            <div className="adm-user">
              <div className="adm-avatar">N</div>
              <div>
                <div className="adm-user-name">Nandini Mam</div>
                <div className="adm-user-role">
                  <span className="adm-online-dot" /> Administrator
                </div>
              </div>
            </div>
            <button className="adm-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        <div
          className={`adm-overlay${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <div className="adm-main">
          {/* Top bar */}
          <header className="adm-topbar">
            <button className="adm-menu-btn" onClick={() => setSidebarOpen(v => !v)}>☰</button>
            <div className="adm-topbar-copy">
              <div className="adm-topbar-kicker">{activeSection.eyebrow}</div>
              <h1 className="adm-topbar-title">{activeSection.title}</h1>
              <p className="adm-topbar-subtitle">{activeSection.subtitle}</p>
            </div>
            {activeSection.searchable && (
              <div className="adm-search-wrap">
                <span className="adm-search-icon">⌕</span>
                <input
                  className="adm-search"
                  placeholder={activeSection.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="adm-topbar-actions">
              <button
                className="adm-icon-btn"
                title="Refresh"
                onClick={() => { fetchPosts(); fetchGallery(); fetchTestimonialsCount(); }}
              >
                ↻
              </button>
              <button className="adm-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          {/* Body */}
          <main className="adm-body">
            <div className="adm-breadcrumb">Admin / {activeSection.title}</div>

            {/* ─── DASHBOARD ─── */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="adm-section-nav adm-animate">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`adm-pill-btn${activeTab === item.id ? ' active' : ''}`}
                      onClick={() => handleTabChange(item.id)}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>

                <div className="adm-section-label adm-animate">Overview</div>

                <div className="adm-stats-grid">
                  {[
                    { icon: '✦', val: posts.length, name: 'Total Posts', chip: 'Yoga Articles' },
                    { icon: '⊞', val: galleryItems.length, name: 'Gallery Items', chip: 'Media Files' },
                    { icon: '✉', val: 'Live', name: 'Newsletter', chip: 'MailerLite Connected' },
                    { icon: '★', val: testimonialsCount, name: 'Testimonials', chip: 'Pending + Approved' },
                  ].map((s, i) => (
                    <div className={`adm-stat adm-animate adm-animate-d${i + 1}`} key={i}>
                      <div className="adm-stat-icon">{s.icon}</div>
                      <div className="adm-stat-val">{s.val}</div>
                      <div className="adm-stat-name">{s.name}</div>
                      <div className="adm-stat-chip">{s.chip}</div>
                    </div>
                  ))}
                </div>

                <div className="adm-section-label adm-animate">Quick Actions</div>

                <div className="adm-cards-row adm-animate adm-animate-d2">
                  <div className="adm-quick-card" onClick={() => setActiveTab('posts')}>
                    <div className="adm-quick-icon">🌸</div>
                    <div>
                      <div className="adm-quick-label">Upload Yoga Post</div>
                      <div className="adm-quick-sub">Add new article or video</div>
                    </div>
                    <span className="adm-quick-arrow">→</span>
                  </div>
                  <div className="adm-quick-card" onClick={() => setActiveTab('gallery')}>
                    <div className="adm-quick-icon">🖼️</div>
                    <div>
                      <div className="adm-quick-label">Upload to Gallery</div>
                      <div className="adm-quick-sub">Add images & media</div>
                    </div>
                    <span className="adm-quick-arrow">→</span>
                  </div>
                  <div className="adm-quick-card" onClick={() => setActiveTab('newsletter')}>
                    <div className="adm-quick-icon">✉</div>
                    <div>
                      <div className="adm-quick-label">Open Newsletter</div>
                      <div className="adm-quick-sub">Review subscribers and MailerLite activity</div>
                    </div>
                    <span className="adm-quick-arrow">→</span>
                  </div>
                </div>

                <div className="adm-dashboard-grid">
                  <div className="adm-panel adm-animate adm-animate-d3">
                    <div className="adm-panel-head">
                      <div className="adm-panel-icon">✦</div>
                      <div>
                        <div className="adm-panel-title">Recent Posts</div>
                        <div className="adm-panel-sub">
                          {searchQuery ? `Filtered by "${searchQuery}"` : 'Latest content from the yoga journal'}
                        </div>
                      </div>
                    </div>
                    {filteredDashboardPosts.length === 0 ? (
                      <div className="adm-empty">
                        <div className="adm-empty-icon">🌱</div>
                        <div className="adm-empty-text">
                          {searchQuery ? 'No posts match your search' : 'No posts yet'}
                        </div>
                        <div className="adm-empty-sub">
                          {searchQuery ? 'Try a different keyword or clear the search.' : 'Upload your first yoga post to get started.'}
                        </div>
                      </div>
                    ) : (
                      filteredDashboardPosts.slice(0, 5).map(post => (
                        <div className="adm-post-row" key={post.id}>
                          <div className="adm-post-thumb">
                            {post.thumbnail ? <img src={post.thumbnail} alt="" /> : '🌸'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="adm-post-title">{post.title || 'Untitled Post'}</div>
                            <div className="adm-post-meta">{post.category || post.type || 'Yoga'}</div>
                          </div>
                          {post.tags && <span className="adm-post-tag">{post.tags.split(',')[0]}</span>}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="adm-panel adm-animate adm-animate-d4">
                    <div className="adm-panel-head">
                      <div className="adm-panel-icon">⊞</div>
                      <div>
                        <div className="adm-panel-title">Media & Next Steps</div>
                        <div className="adm-panel-sub">What to update next inside the admin workspace</div>
                      </div>
                    </div>
                    <div className="adm-mini-list">
                      {(filteredDashboardGallery.length > 0 ? filteredDashboardGallery.slice(0, 3) : galleryItems.slice(0, 3)).map(item => (
                        <div className="adm-mini-row" key={item.id}>
                          <div>
                            <div className="adm-mini-title">{item.title || 'Untitled gallery item'}</div>
                            <div className="adm-mini-meta">{item.category || 'Gallery item'}</div>
                          </div>
                          <span className="adm-mini-chip">Gallery</span>
                        </div>
                      ))}
                      <div className="adm-mini-row">
                        <div>
                          <div className="adm-mini-title">Newsletter campaigns</div>
                          <div className="adm-mini-meta">Review audience growth and schedule your next quiet note.</div>
                        </div>
                        <span className="adm-mini-chip">Newsletter</span>
                      </div>
                      <div className="adm-mini-row">
                        <div>
                          <div className="adm-mini-title">Testimonials check-in</div>
                          <div className="adm-mini-meta">Keep homepage reviews fresh and approve pending stories.</div>
                        </div>
                        <span className="adm-mini-chip">Social Proof</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── POSTS ─── */}
            {activeTab === 'posts' && (
              <div>
                <div className="adm-tip adm-animate">
                  <span className="adm-tip-icon">💡</span>
                  <div>
                    <div className="adm-tip-title">Upload Tip</div>
                    <div className="adm-tip-text">Use descriptive titles and tags. This helps students find relevant content faster.</div>
                  </div>
                </div>

                <BlogManage posts={posts} fetchPosts={fetchPosts} onUploadSuccess={fetchPosts} />
              </div>
            )}

            {/* ─── GALLERY ─── */}
            {activeTab === 'gallery' && (
              <div>
                <div className="adm-tip adm-animate">
                  <span className="adm-tip-icon">🖼️</span>
                  <div>
                    <div className="adm-tip-title">Gallery Tip</div>
                    <div className="adm-tip-text">Keep images consistent — recommended: square crops at 1080×1080px for best display.</div>
                  </div>
                </div>

                <GalleryManage onUploadSuccess={fetchGallery} />
              </div>
            )}

            {/* ─── NEWSLETTER ─── */}
            {activeTab === 'newsletter' && (
              <div>
                <div className="adm-tip adm-animate">
                  <span className="adm-tip-icon">✉</span>
                  <div>
                    <div className="adm-tip-title">Newsletter Tip</div>
                    <div className="adm-tip-text">Capture signups here, then use MailerLite for campaigns, automations, and detailed analytics.</div>
                  </div>
                </div>

                <NewsletterManage />
              </div>
            )}

            {/* ─── TESTIMONIALS ─── */}
            {activeTab === 'testimonials' && (
              <div>
                <div className="adm-tip adm-animate">
                  <span className="adm-tip-icon">💬</span>
                  <div>
                    <div className="adm-tip-title">Testimonials Tip</div>
                    <div className="adm-tip-text">Review pending testimonials regularly. Approved testimonials appear on the homepage carousel.</div>
                  </div>
                </div>

                <TestimonialsManage />
              </div>
            )}

          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="adm-bottom-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`adm-bnav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="adm-bnav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  )}
</>
  );
};

export default AdminUpload;
