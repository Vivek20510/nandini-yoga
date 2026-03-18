import React, { useMemo, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Edit, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../firebase";
import BlogGenerate from "./BlogGenerate";
import { Alert, Card, Field } from "./BlogManageHelpers";
import { getPrimaryBlogMedia } from "../lib/blogMedia";

const mediaCount = (media = []) => {
  const images = media.filter((item) => item.type === "image").length;
  const videos = media.filter((item) => item.type === "video").length;
  const chunks = [];
  if (images) chunks.push(`${images} photo${images > 1 ? "s" : ""}`);
  if (videos) chunks.push(`${videos} video${videos > 1 ? "s" : ""}`);
  return chunks.join(" · ") || "0 items";
};

const BlogManage = ({ posts, fetchPosts, onUploadSuccess }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [deletePin, setDeletePin] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) =>
        [
          post.title,
          post.desc,
          post.excerpt,
          post.category,
          Array.isArray(post.tags) ? post.tags.join(", ") : post.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [posts, searchQuery]
  );

  const togglePost = (id) =>
    setSelectedPostIds((prev) =>
      prev.includes(id)
        ? prev.filter((value) => value !== id)
        : [...prev, id]
    );

  const handleDelete = async (ids) => {
    if (deletePin !== import.meta.env.VITE_ADMIN_PIN) {
      setDeleteError("Incorrect PIN.");
      return;
    }
    setIsDeleting(true);
    try {
      for (const id of ids) await deleteDoc(doc(db, "posts", id));
      fetchPosts();
      setSelectedPostIds([]);
      setDeleteError("");
      setDeletePin("");
    } catch {
      setDeleteError("Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditTitle(post.title || "");
    setEditDesc(post.desc || "");
  };

  const handleSaveEdit = async () => {
    if (deletePin !== import.meta.env.VITE_ADMIN_PIN) {
      setDeleteError("Incorrect PIN.");
      return;
    }
    try {
      await updateDoc(doc(db, "posts", editingPost), {
        title: editTitle.trim(),
        desc: editDesc.trim(),
      });
      fetchPosts();
      setEditingPost(null);
      setEditTitle("");
      setEditDesc("");
    } catch {
      setDeleteError("Edit failed. Please try again.");
    }
  };

  return (
    <div className="text-[#2C2417]">
      <div className="mb-6 border-b border-[#d8cfbf] pb-5">
        <h2
          className="text-[1.9rem] leading-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Blog <em className="text-[#B8724A]">Studio</em>
        </h2>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7a6b5b]">
          Create, generate, and manage your journal
        </p>
      </div>

      <div className="mb-7 flex rounded-xl bg-[#EDE5D4] p-1">
        {["upload", "manage"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] ${
              activeTab === tab
                ? "bg-[#FDFAF5] text-[#2C2417] shadow-sm"
                : "text-[#6f6254]"
            }`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab === "upload" ? "New Post" : `Manage (${posts.length})`}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <BlogGenerate onUploadSuccess={onUploadSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card title="Post Library">
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.5fr,0.85fr]">
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b5b]"
                    />
                    <input
                      className="w-full rounded-lg border border-[#cbbca7] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#B8724A]"
                      placeholder="Search posts…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Field label="Admin PIN">
                    <input
                      type="password"
                      className="w-full rounded-lg border border-[#cbbca7] bg-white px-4 py-3 text-sm outline-none focus:border-[#B8724A]"
                      maxLength="4"
                      value={deletePin}
                      onChange={(e) => setDeletePin(e.target.value)}
                      placeholder="• • • •"
                    />
                  </Field>
                </div>

                {deleteError && <Alert kind="error" text={deleteError} />}

                {selectedPostIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#d7ccbc] bg-[#EDE5D4] px-4 py-3">
                    <span className="flex-1 text-sm text-[#2C2417]">
                      {selectedPostIds.length} selected
                    </span>
                    <button
                      className="rounded-lg border border-[#cbbca7] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#6f6254]"
                      onClick={() => setSelectedPostIds([])}
                      type="button"
                    >
                      Clear
                    </button>
                    <button
                      className="rounded-lg bg-[#c0614a] px-3 py-2 text-xs uppercase tracking-[0.12em] text-white"
                      onClick={() => handleDelete(selectedPostIds)}
                      disabled={isDeleting}
                      type="button"
                    >
                      {isDeleting ? "Deleting" : "Delete"}
                    </button>
                  </div>
                )}

                {filteredPosts.length > 0 && (
                  <label className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[#6f6254]">
                    <input
                      type="checkbox"
                      checked={selectedPostIds.length === filteredPosts.length}
                      onChange={() =>
                        setSelectedPostIds(
                          selectedPostIds.length === filteredPosts.length
                            ? []
                            : filteredPosts.map((post) => post.id)
                        )
                      }
                    />
                    Select all
                  </label>
                )}

                <div className="space-y-3">
                  {filteredPosts.length === 0 ? (
                    <div className="rounded-xl border border-[#e3d9ca] bg-[#fffdf9] p-5">
                      <p className="text-sm italic text-[#7a6b5b]">
                        No posts found.
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => {
                      const firstMedia = getPrimaryBlogMedia(post.media);
                      const isEditing = editingPost === post.id;
                      const isSelected = selectedPostIds.includes(post.id);

                      return (
                        <div
                          key={post.id}
                          className={`rounded-2xl border bg-[#FDFAF5] p-4 shadow-sm ${
                            isSelected
                              ? "border-[#B8724A]"
                              : "border-[#d7ccbc]"
                          }`}
                        >
                          <div className="flex gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePost(post.id)}
                              className="mt-1"
                            />
                              {firstMedia?.type === "image" ? (
                                <img
                                  src={firstMedia.url}
                                  alt={firstMedia.alt || `${post.title || "Post"} thumbnail`}
                                  className="h-14 w-14 rounded-lg object-cover"
                                />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#EDE5D4] text-xs uppercase tracking-[0.14em] text-[#6f6254]">
                                Media
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              {isEditing ? (
                                <div className="space-y-3">
                                  <input
                                    className="w-full rounded-lg border border-[#cbbca7] bg-white px-4 py-3 text-sm outline-none focus:border-[#B8724A]"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                  />
                                  <textarea
                                    className="min-h-[90px] w-full rounded-lg border border-[#cbbca7] bg-white px-4 py-3 text-sm outline-none focus:border-[#B8724A]"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      className="rounded-lg bg-[#5a8a6a] px-3 py-2 text-xs uppercase tracking-[0.12em] text-white"
                                      onClick={handleSaveEdit}
                                      type="button"
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="rounded-lg border border-[#cbbca7] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#6f6254]"
                                      onClick={() => setEditingPost(null)}
                                      type="button"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p
                                    className="truncate text-[1.15rem] leading-none text-[#2C2417]"
                                    style={{
                                      fontFamily:
                                        "'Cormorant Garamond', Georgia, serif",
                                    }}
                                  >
                                    {post.title || "Untitled"}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-[#6f6254]">
                                    {post.excerpt ||
                                      post.desc ||
                                      "No summary yet."}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {post.category && (
                                      <span className="rounded-full bg-[#EDE5D4] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6f6254]">
                                        {post.category}
                                      </span>
                                    )}
                                    {Array.isArray(post.tags) &&
                                      post.tags.slice(0, 3).map((tag) => (
                                        <span
                                          key={tag}
                                          className="rounded-full bg-[#EDE5D4] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6f6254]"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                  </div>
                                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#8a7a6a]">
                                    {mediaCount(post.media)}
                                  </p>
                                </>
                              )}
                            </div>
                            {!isEditing && (
                              <div className="flex gap-2">
                                <button
                                  className="rounded-lg border border-[#cbbca7] p-2 text-[#6f6254]"
                                  onClick={() => handleEdit(post)}
                                  type="button"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="rounded-lg border border-[#e0b4ab] p-2 text-[#b34f3a]"
                                  onClick={() => handleDelete([post.id])}
                                  type="button"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManage;
