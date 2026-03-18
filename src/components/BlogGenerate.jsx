import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import axios from "axios";
import { ArrowDown, ArrowUp, Check, Crop, ImagePlus, Sparkles, Star, Trash2, Upload, Video, X } from "lucide-react";
import { db } from "../firebase";
import { Alert, Card, Field } from "./BlogManageHelpers";

const emptyDraft = { title: "", excerpt: "", body: "", category: "", tags: "", metaDescription: "" };
const emptyPrompt = { topic: "", audience: "", tone: "Warm and grounding", keywords: "", length: "900-1200 words", notes: "" };
const ASPECT_PRESETS = [{ key: "16:9", label: "16:9", aspect: 16 / 9 }, { key: "4:3", label: "4:3", aspect: 4 / 3 }, { key: "1:1", label: "1:1", aspect: 1 }, { key: "original", label: "Original", aspect: undefined }];
const inputClassName = "w-full rounded-lg border border-[#cbbca7] bg-white px-4 py-3 text-sm outline-none focus:border-[#B8724A]";
const textareaClassName = "w-full rounded-lg border border-[#cbbca7] bg-white px-4 py-3 text-sm outline-none focus:border-[#B8724A]";
const splitTags = (value) => String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean);
const createMediaId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const revokePreview = (url) => { if (url?.startsWith("blob:")) URL.revokeObjectURL(url); };
const createCenteredCrop = (width, height, aspect) => {
  if (!aspect) return { unit: "%", x: 5, y: 5, width: 90, height: 90 };
  return centerCrop(makeAspectCrop({ unit: "%", width: 82 }, aspect, width, height), width, height);
};
const getCroppedBlob = async (image, crop, aspectKey) => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const canvas = document.createElement("canvas");
  if (aspectKey === "original") {
    const maxDimension = 1600;
    const ratio = crop.width / crop.height;
    if (ratio >= 1) {
      canvas.width = maxDimension;
      canvas.height = Math.round(maxDimension / ratio);
    } else {
      canvas.height = maxDimension;
      canvas.width = Math.round(maxDimension * ratio);
    }
  } else {
    canvas.width = aspectKey === "1:1" ? 1080 : aspectKey === "4:3" ? 1200 : 1600;
    canvas.height = aspectKey === "1:1" ? 1080 : aspectKey === "4:3" ? 900 : 900;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Crop canvas is unavailable.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Failed to create cropped image."))), "image/jpeg", 0.92));
};
const createMediaDraft = (file, options = {}) => ({
  id: options.id || createMediaId(),
  type: file.type.startsWith("image/") ? "image" : "video",
  sourceFile: file,
  uploadFile: file,
  previewUrl: URL.createObjectURL(file),
  alt: options.alt || "",
  isCover: Boolean(options.isCover),
  aspectKey: options.aspectKey || "16:9",
  edited: false,
});

const BlogGenerate = ({ onUploadSuccess }) => {
  const [draft, setDraft] = useState(emptyDraft);
  const [promptForm, setPromptForm] = useState(emptyPrompt);
  const [mediaItems, setMediaItems] = useState([]);
  const [pin, setPin] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [aiError, setAiError] = useState("");
  const [usedAiDraft, setUsedAiDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cropEditor, setCropEditor] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const addInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceTargetIdRef = useRef(null);
  const cropImageRef = useRef(null);

  const setDraftField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const setPromptField = (field, value) => setPromptForm((prev) => ({ ...prev, [field]: value }));
  const canGenerate = promptForm.topic.trim() && promptForm.audience.trim() && promptForm.tone.trim() && promptForm.keywords.trim() && promptForm.length.trim() && pin.length === 4;
  const ensureSingleCover = (items) => {
    const hasCover = items.some((item) => item.isCover);
    return items.map((item, index) => ({ ...item, isCover: hasCover ? item.isCover : index === 0 }));
  };
  const clearDraft = () => {
    mediaItems.forEach((item) => revokePreview(item.previewUrl));
    if (cropEditor?.sourceUrl) revokePreview(cropEditor.sourceUrl);
    setDraft(emptyDraft); setPromptForm(emptyPrompt); setMediaItems([]); setPin(""); setErrorMsg(""); setAiError(""); setStatusMsg(""); setUsedAiDraft(false); setCropEditor(null); setCrop(undefined); setCompletedCrop(null);
  };
  const closeCropEditor = () => {
    if (cropEditor?.sourceUrl) revokePreview(cropEditor.sourceUrl);
    setCropEditor(null); setCrop(undefined); setCompletedCrop(null);
  };
  const openCropEditor = (item) => {
    if (item.type !== "image") return;
    setCropEditor({ id: item.id, aspectKey: item.aspectKey || "16:9", sourceUrl: URL.createObjectURL(item.sourceFile) });
    setCrop(undefined); setCompletedCrop(null);
  };
  const addMediaFiles = (files) => {
    const fileList = Array.from(files || []).filter(Boolean);
    if (fileList.length === 0) return;
    setErrorMsg(""); setStatusMsg("");
    const newItems = fileList.map((file, index) => createMediaDraft(file, { isCover: mediaItems.length === 0 && index === 0 }));
    setMediaItems((prev) => ensureSingleCover([...prev, ...newItems]));
    const firstImage = newItems.find((item) => item.type === "image");
    if (firstImage) openCropEditor(firstImage);
  };
  const handleGenerate = async () => {
    if (!canGenerate) return setAiError("Fill in the AI prompt fields and admin PIN before generating.");
    if (Object.values(draft).some((value) => String(value || "").trim()) && !window.confirm("Replace the current draft with a new AI draft?")) return;
    setAiLoading(true); setAiError(""); setStatusMsg("");
    try {
      const { data } = await axios.post("/api/generate-blog-draft", { ...promptForm, pin });
      setDraft({ title: data.draft.title || "", excerpt: data.draft.excerpt || "", body: data.draft.body || "", category: data.draft.category || "", tags: Array.isArray(data.draft.tags) ? data.draft.tags.join(", ") : "", metaDescription: data.draft.metaDescription || "" });
      setUsedAiDraft(true); setStatusMsg("AI draft generated. Review and edit it before publishing.");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      setAiError(status === 504 ? message || "The AI request timed out. Please try again in a moment." : message || "AI draft generation failed.");
    } finally {
      setAiLoading(false);
    }
  };
  const handleUpload = async () => {
    if (!draft.title.trim() || !draft.body.trim() || !draft.excerpt.trim() || !draft.metaDescription.trim() || pin.length !== 4) return setErrorMsg("Complete the draft and admin PIN before publishing.");
    setLoading(true); setErrorMsg(""); setStatusMsg("");
    try {
      const uploadedMedia = [];
      for (const item of mediaItems) {
        const resourceType = item.type === "video" ? "video" : "image";
        const formData = new FormData();
        formData.append("file", item.uploadFile);
        formData.append("upload_preset", uploadPreset);
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData);
        uploadedMedia.push({ url: response.data.secure_url, type: response.data.resource_type, alt: item.type === "image" ? item.alt.trim() : "", isCover: item.isCover });
      }
      await addDoc(collection(db, "posts"), { title: draft.title.trim(), desc: draft.body.trim(), excerpt: draft.excerpt.trim(), category: draft.category.trim(), tags: splitTags(draft.tags), metaDescription: draft.metaDescription.trim(), media: uploadedMedia, date: Timestamp.now(), pin, generatedByAi: usedAiDraft });
      clearDraft(); if (onUploadSuccess) onUploadSuccess(); setStatusMsg("Post published successfully.");
    } catch {
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const setCoverItem = (id) => setMediaItems((prev) => prev.map((item) => ({ ...item, isCover: item.id === id })));
  const moveMediaItem = (id, direction) => setMediaItems((prev) => {
    const index = prev.findIndex((item) => item.id === id); const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
    const next = [...prev]; const [item] = next.splice(index, 1); next.splice(nextIndex, 0, item); return ensureSingleCover(next);
  });
  const removeMediaItem = (id) => setMediaItems((prev) => {
    const target = prev.find((item) => item.id === id); if (target) revokePreview(target.previewUrl);
    const next = prev.filter((item) => item.id !== id); if (next.length > 0 && !next.some((item) => item.isCover)) next[0] = { ...next[0], isCover: true }; return next;
  });
  const requestReplaceMedia = (id) => { replaceTargetIdRef.current = id; if (replaceInputRef.current) { replaceInputRef.current.value = ""; replaceInputRef.current.click(); } };
  const handleReplaceMedia = (file) => {
    if (!file || !replaceTargetIdRef.current) return;
    const targetId = replaceTargetIdRef.current; replaceTargetIdRef.current = null;
    setMediaItems((prev) => prev.map((item) => {
      if (item.id !== targetId) return item;
      revokePreview(item.previewUrl);
      const nextItem = createMediaDraft(file, { id: item.id, alt: item.type === "image" ? item.alt : "", isCover: item.isCover, aspectKey: item.aspectKey });
      return file.type.startsWith("image/") ? nextItem : { ...nextItem, alt: "" };
    }));
    if (file.type.startsWith("image/")) openCropEditor({ id: targetId, type: "image", sourceFile: file, aspectKey: mediaItems.find((item) => item.id === targetId)?.aspectKey || "16:9" });
  };
  const handleAltChange = (id, value) => setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, alt: value } : item)));
  const handleCropAspectChange = (aspectKey) => {
    if (!cropEditor || !cropImageRef.current) return;
    const preset = ASPECT_PRESETS.find((item) => item.key === aspectKey);
    setCropEditor((prev) => ({ ...prev, aspectKey }));
    setCrop(createCenteredCrop(cropImageRef.current.width, cropImageRef.current.height, preset?.aspect));
    setCompletedCrop(null);
  };
  const saveCropChanges = async () => {
    if (!cropEditor) return;
    if (!cropImageRef.current || !completedCrop?.width || !completedCrop?.height) return setErrorMsg("Adjust the crop area before saving.");
    try {
      const blob = await getCroppedBlob(cropImageRef.current, completedCrop, cropEditor.aspectKey);
      const croppedFile = new File([blob], `blog-media-${cropEditor.id}.jpg`, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(croppedFile);
      setMediaItems((prev) => prev.map((item) => {
        if (item.id !== cropEditor.id) return item;
        revokePreview(item.previewUrl);
        return { ...item, uploadFile: croppedFile, previewUrl, aspectKey: cropEditor.aspectKey, edited: true };
      }));
      closeCropEditor();
    } catch {
      setErrorMsg("Failed to save crop changes.");
    }
  };

  return (
    <div className="space-y-5">
      {errorMsg && <Alert kind="error" text={errorMsg} />}
      {aiError && <Alert kind="error" text={aiError} />}
      {statusMsg && <Alert kind="success" text={statusMsg} />}
      <input ref={addInputRef} className="hidden" type="file" accept="image/*,video/*" multiple onChange={(e) => { addMediaFiles(e.target.files); e.target.value = ""; }} />
      <input ref={replaceInputRef} className="hidden" type="file" accept="image/*,video/*" onChange={(e) => { handleReplaceMedia(e.target.files?.[0]); e.target.value = ""; }} />
      <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-5">
          <Card title="AI Draft Assistant">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-4"><p className="text-sm leading-6 text-[#6f6254]">Start with the AI assistant to build a strong first draft, then refine the post before publishing.</p></div>
              <Field label="Topic"><input className={inputClassName} value={promptForm.topic} onChange={(e) => setPromptField("topic", e.target.value)} placeholder="Yoga for stress relief, morning pranayama..." /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Audience"><input className={inputClassName} value={promptForm.audience} onChange={(e) => setPromptField("audience", e.target.value)} placeholder="Beginners, busy professionals..." /></Field>
                <Field label="Tone"><input className={inputClassName} value={promptForm.tone} onChange={(e) => setPromptField("tone", e.target.value)} placeholder="Warm and grounding" /></Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Keywords" hint="comma separated"><input className={inputClassName} value={promptForm.keywords} onChange={(e) => setPromptField("keywords", e.target.value)} placeholder="online yoga, pranayama, meditation" /></Field>
                <Field label="Length"><select className={inputClassName} value={promptForm.length} onChange={(e) => setPromptField("length", e.target.value)}><option>200words</option><option>400 words</option><option>600 words</option></select></Field>
              </div>
              <Field label="Additional Notes"><textarea className={`min-h-[110px] ${textareaClassName}`} value={promptForm.notes} onChange={(e) => setPromptField("notes", e.target.value)} placeholder="Include a practical breathing exercise, keep it beginner-friendly..." /></Field>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#2C2417] px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#F7F3EC] disabled:opacity-50" onClick={handleGenerate} disabled={aiLoading} type="button">{aiLoading ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generating</> : <><Sparkles size={14} />Generate Draft</>}</button>
                <button className="rounded-lg border border-[#cbbca7] px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#6f6254]" onClick={clearDraft} type="button">Clear Draft</button>
              </div>
            </div>
          </Card>
          <Card title="Post Draft">
            <div className="space-y-4">
              <Field label="Title"><input className={inputClassName} value={draft.title} onChange={(e) => setDraftField("title", e.target.value)} placeholder="Give this post a title..." /></Field>
              <Field label="Excerpt"><textarea className={`min-h-[90px] ${textareaClassName}`} value={draft.excerpt} onChange={(e) => setDraftField("excerpt", e.target.value)} placeholder="Short article summary..." /></Field>
              <div className="grid gap-4 md:grid-cols-[0.8fr,1.2fr]">
                <Field label="Category"><input className={inputClassName} value={draft.category} onChange={(e) => setDraftField("category", e.target.value)} placeholder="Meditation" /></Field>
                <Field label="Tags" hint="comma separated"><input className={inputClassName} value={draft.tags} onChange={(e) => setDraftField("tags", e.target.value)} placeholder="pranayama, stress relief, yoga at home" /></Field>
              </div>
              <Field label="Meta Description" hint="under 160 characters"><input className={inputClassName} value={draft.metaDescription} onChange={(e) => setDraftField("metaDescription", e.target.value)} placeholder="Short search description under 160 characters..." /></Field>
              <Field label="Article Body"><textarea className={`min-h-[320px] ${textareaClassName}`} value={draft.body} onChange={(e) => setDraftField("body", e.target.value)} placeholder="Write or generate the full article body here..." /></Field>
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Media" accent="soft">
            <div className="space-y-4">
              <label className={`block rounded-2xl border-2 border-dashed px-5 py-8 text-center ${mediaItems.length ? "border-[#B8724A] bg-[#fff7f2]" : "border-[#d7ccbc] bg-white"}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addMediaFiles(e.dataTransfer.files); }}>
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EDE5D4]"><ImagePlus size={20} color="#B8724A" /></div>
                <p className="text-sm text-[#6f6254]">Drop files or browse to add blog media</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#97887a]">Images can be cropped. Videos can be reordered and managed.</p>
                <button className="mt-4 rounded-lg border border-[#cbbca7] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6f6254]" type="button" onClick={() => addInputRef.current?.click()}>Browse Media</button>
              </label>
              {mediaItems.length > 0 ? <div className="space-y-3">{mediaItems.map((item, index) => (
                <div key={item.id} className={`rounded-2xl border p-3 ${item.isCover ? "border-[#B8724A] bg-[#fff8f2]" : "border-[#d7ccbc] bg-white"}`}>
                  <div className="flex gap-3">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#EDE5D4]">{item.type === "image" ? <img src={item.previewUrl} alt={item.alt || "Blog media preview"} className="h-full w-full object-cover" /> : <video src={item.previewUrl} className="h-full w-full object-cover" muted playsInline />}</div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#EDE5D4] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6f6254]">{item.type === "image" ? "Image" : "Video"}</span>
                            {item.isCover ? <span className="rounded-full bg-[#2C2417] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#F7F3EC]">Cover</span> : null}
                            {item.edited ? <span className="rounded-full bg-[#eef6f0] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#4f7b5d]">Edited</span> : null}
                          </div>
                          <p className="mt-2 truncate text-sm text-[#2C2417]">{item.sourceFile.name}</p>
                          <p className="mt-1 text-xs text-[#7a6b5b]">{Math.round(item.uploadFile.size / 1024)} KB</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button className={`rounded-lg border px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${item.isCover ? "border-[#B8724A] bg-[#fff1e8] text-[#B8724A]" : "border-[#cbbca7] text-[#6f6254]"}`} onClick={() => setCoverItem(item.id)} type="button"><Star size={12} className="mr-1 inline" />Cover</button>
                          <button className="rounded-lg border border-[#cbbca7] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6254]" onClick={() => moveMediaItem(item.id, -1)} disabled={index === 0} type="button"><ArrowUp size={12} className="mr-1 inline" />Up</button>
                          <button className="rounded-lg border border-[#cbbca7] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6254]" onClick={() => moveMediaItem(item.id, 1)} disabled={index === mediaItems.length - 1} type="button"><ArrowDown size={12} className="mr-1 inline" />Down</button>
                          {item.type === "image" ? <button className="rounded-lg border border-[#cbbca7] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6254]" onClick={() => openCropEditor(item)} type="button"><Crop size={12} className="mr-1 inline" />Crop</button> : null}
                          <button className="rounded-lg border border-[#cbbca7] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6254]" onClick={() => requestReplaceMedia(item.id)} type="button"><Upload size={12} className="mr-1 inline" />Replace</button>
                          <button className="rounded-lg border border-[#e0b4ab] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#b34f3a]" onClick={() => removeMediaItem(item.id)} type="button"><Trash2 size={12} className="mr-1 inline" />Remove</button>
                        </div>
                      </div>
                      {item.type === "image" ? <Field label="Alt Text" hint="shown for accessibility"><input className={inputClassName} value={item.alt} onChange={(e) => handleAltChange(item.id, e.target.value)} placeholder="Calm yoga posture in natural light..." /></Field> : <div className="rounded-xl border border-[#e3d9ca] bg-[#fffdf9] px-3 py-3 text-xs leading-6 text-[#7a6b5b]"><Video size={13} className="mr-2 inline" />Videos support cover selection, replace, remove, and reorder in this version.</div>}
                    </div>
                  </div>
                </div>
              ))}</div> : null}
            </div>
          </Card>
          <Card title="Publish" accent="soft">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-4"><p className="text-sm leading-6 text-[#6f6254]">Publishing stays manual even after AI generation. Cover image, alt text, media order, and crop edits are saved with the post.</p></div>
              <Field label="Admin PIN"><input type="password" className={inputClassName} maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="• • • •" autoComplete="current-password" /></Field>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2C2417] px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#F7F3EC] disabled:opacity-50" onClick={handleUpload} disabled={loading} type="button">{loading ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Publishing</> : <><Upload size={14} />Publish Post</>}</button>
            </div>
          </Card>
        </div>
      </div>
      {cropEditor ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2417]/60 p-4"><div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[28px] bg-[#FDFAF5] p-6 shadow-2xl"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="text-[1.7rem] leading-none text-[#2C2417]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Crop Blog Image</h3><p className="mt-2 text-sm leading-6 text-[#6f6254]">Choose the framing that should be uploaded to the blog post. 16:9 works best for the journal layout.</p></div><button className="rounded-full border border-[#d7ccbc] p-2 text-[#6f6254]" onClick={closeCropEditor} type="button"><X size={16} /></button></div><div className="mb-4 flex flex-wrap gap-2">{ASPECT_PRESETS.map((preset) => <button key={preset.key} className={`rounded-full px-3 py-2 text-xs uppercase tracking-[0.12em] ${cropEditor.aspectKey === preset.key ? "bg-[#2C2417] text-[#F7F3EC]" : "border border-[#cbbca7] text-[#6f6254]"}`} onClick={() => handleCropAspectChange(preset.key)} type="button">{preset.label}</button>)}</div><div className="grid gap-5 lg:grid-cols-[1.35fr,0.65fr]"><div className="overflow-hidden rounded-2xl border border-[#e2d7c6] bg-[#fffaf3] p-4"><div className="max-h-[65vh] overflow-auto"><ReactCrop crop={crop} onChange={(nextCrop) => setCrop(nextCrop)} onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)} aspect={ASPECT_PRESETS.find((item) => item.key === cropEditor.aspectKey)?.aspect}><img ref={cropImageRef} src={cropEditor.sourceUrl} alt="Blog crop source" className="max-h-[60vh] w-full object-contain" onLoad={(e) => { const preset = ASPECT_PRESETS.find((item) => item.key === cropEditor.aspectKey); setCrop(createCenteredCrop(e.currentTarget.width, e.currentTarget.height, preset?.aspect)); }} /></ReactCrop></div></div><div className="space-y-4 rounded-2xl border border-[#e2d7c6] bg-white p-5"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8724A]">Crop Notes</p><div className="mt-3 space-y-3 text-sm leading-6 text-[#6f6254]"><p>Use 16:9 for the main journal look and social preview consistency.</p><p>Use 4:3 or 1:1 when the image subject needs tighter framing.</p><p>Original lets you crop freely without locking the ratio.</p></div></div><div className="rounded-xl border border-[#eadfce] bg-[#fffaf3] p-4 text-sm leading-6 text-[#6f6254]">Save applies the crop before Cloudinary upload, so the published image matches the preview here.</div><div className="flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 rounded-lg bg-[#2C2417] px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#F7F3EC]" onClick={saveCropChanges} type="button"><Check size={14} />Save Crop</button><button className="rounded-lg border border-[#cbbca7] px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#6f6254]" onClick={closeCropEditor} type="button">Cancel</button></div></div></div></div></div> : null}
    </div>
  );
};

export default BlogGenerate;
