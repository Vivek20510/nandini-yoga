import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection, query, where, orderBy,
  getDocs, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { CheckCircle, XCircle, Edit, Trash2, Star, Lock, Loader2, RefreshCw } from "lucide-react";
import TestimonialAvatarManage from "./TestimonialAvatarManage";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

/* ─────────────────────────────────────────────
   Inline PIN Modal (no external dependency)
───────────────────────────────────────────── */
const PinModal = ({ title = "Enter Admin PIN", onConfirm, onClose }) => {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 3) refs[i + 1].current?.focus();
    if (next.every((d) => d !== "") && i === 3) {
      submit(next.join(""));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const submit = async (pin) => {
    if (pin !== ADMIN_PIN) {
      setError("Incorrect PIN. Try again.");
      setDigits(["", "", "", ""]);
      refs[0].current?.focus();
      return;
    }
    setLoading(true);
    await onConfirm(pin);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <Lock size={22} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your 4-digit admin PIN</p>
        </div>

        {/* PIN inputs */}
        <div className="flex justify-center gap-3 mb-4">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 mb-4">{error}</p>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => submit(digits.join(""))}
            disabled={loading || digits.some((d) => d === "")}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Star Rating Display
───────────────────────────────────────────── */
const StarRating = ({ rating, max = 5, onChange }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i + 1)}
        className={onChange ? "focus:outline-none cursor-pointer" : "cursor-default"}
      >
        <Star
          size={onChange ? 20 : 14}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Testimonial Card
───────────────────────────────────────────── */
const TestimonialCard = ({ testimonial, isPending, onApprove, onReject, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-gray-100"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold text-lg">
            {testimonial.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{testimonial.name}</h3>
          <p className="text-xs text-gray-500 truncate">{testimonial.role}</p>
          <div className="mt-1">
            <StarRating rating={testimonial.rating} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 flex-shrink-0">
        {isPending ? (
          <>
            <button
              onClick={onApprove}
              title="Approve"
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <CheckCircle size={19} />
            </button>
            <button
              onClick={onReject}
              title="Reject & Delete"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <XCircle size={19} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              title="Edit"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit size={19} />
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={19} />
            </button>
          </>
        )}
      </div>
    </div>

    <p className="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-3">{testimonial.text}</p>

    {testimonial.email && (
      <p className="mt-2 text-xs text-gray-400">✉ {testimonial.email}</p>
    )}
    {testimonial.date && (
      <p className="mt-1 text-xs text-gray-400">
        {new Date(testimonial.date?.toDate?.() ?? testimonial.date).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   Edit Form
───────────────────────────────────────────── */
const EditForm = ({ data, onChange, onSave, onCancel }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
        placeholder="Name"
      />
      <input
        type="text"
        value={data.role}
        onChange={(e) => onChange({ ...data, role: e.target.value })}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
        placeholder="Role"
      />
    </div>
    <textarea
      value={data.text}
      onChange={(e) => onChange({ ...data, text: e.target.value })}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
      rows={3}
      placeholder="Testimonial text"
    />
    <div className="flex items-center justify-between">
      <StarRating rating={data.rating} onChange={(r) => onChange({ ...data, rating: r })} />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const TestimonialsManage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [modal, setModal] = useState(null); // { type, id, title }
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [pendingSnap, approvedSnap] = await Promise.all([
        getDocs(query(collection(db, "testimonials"), where("approved", "==", false), orderBy("date", "desc"))),
        getDocs(query(collection(db, "testimonials"), where("approved", "==", true), orderBy("date", "desc"))),
      ]);
      setPendingTestimonials(pendingSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setApprovedTestimonials(approvedSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ── PIN confirmed — run action ── */
  const handlePinConfirm = async (pin) => {
    setError("");
    try {
      const ref = doc(db, "testimonials", modal.id);

      if (modal.type === "approve") {
        await updateDoc(ref, { approved: true, pin });
        showSuccess("Testimonial approved ✓");

      } else if (modal.type === "reject") {
        // Pending docs have no pin — write it first so the delete rule passes
        await updateDoc(ref, { pin });
        await deleteDoc(ref);
        showSuccess("Testimonial rejected and removed.");

      } else if (modal.type === "delete") {
        await deleteDoc(ref);
        showSuccess("Testimonial deleted.");

      } else if (modal.type === "update") {
        await updateDoc(ref, { ...editData, pin });
        setEditingId(null);
        setEditData({});
        showSuccess("Testimonial updated ✓");
      }

      await fetchTestimonials(true);
      setModal(null);
    } catch (err) {
      console.error("Action failed:", err);
      setError("Action failed: " + err.message);
      throw err; // re-throw so PinModal stays open on failure
    }
  };

  const openModal = (type, id, title) => setModal({ type, id, title });

  const tabs = [
    { label: "Pending", value: "pending", count: pendingTestimonials.length, color: "text-amber-600 bg-amber-50" },
    { label: "Approved", value: "approved", count: approvedTestimonials.length, color: "text-green-600 bg-green-50" },
  ];

  const list = activeTab === "pending" ? pendingTestimonials : approvedTestimonials;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading testimonials…</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <TestimonialAvatarManage />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Manage Testimonials</h1>
        <button
          onClick={() => fetchTestimonials(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Toasts ── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl">
          {successMsg}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-gray-800 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === tab.value ? "bg-white/20 text-white" : tab.color
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {list.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          {activeTab === "pending" ? "No pending testimonials 🎉" : "No approved testimonials yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((t) => (
            <div key={t.id}>
              {editingId === t.id ? (
                <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
                  <EditForm
                    data={editData}
                    onChange={setEditData}
                    onSave={() => openModal("update", t.id, "Save Changes")}
                    onCancel={() => { setEditingId(null); setEditData({}); }}
                  />
                </div>
              ) : (
                <TestimonialCard
                  testimonial={t}
                  isPending={activeTab === "pending"}
                  onApprove={() => openModal("approve", t.id, "Approve Testimonial")}
                  onReject={() => openModal("reject", t.id, "Reject & Delete")}
                  onEdit={() => {
                    setEditingId(t.id);
                    setEditData({ name: t.name, role: t.role, text: t.text, rating: t.rating });
                  }}
                  onDelete={() => openModal("delete", t.id, "Delete Testimonial")}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PIN Modal ── */}
      {modal && (
        <PinModal
          title={modal.title}
          onConfirm={handlePinConfirm}
          onClose={() => { setModal(null); setError(""); }}
        />
      )}
    </div>
  );
};

export default TestimonialsManage;
