import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { db } from "../firebase";

const createCenteredCrop = (width, height) =>
  centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 80,
      },
      1,
      width,
      height
    ),
    width,
    height
  );

const getCroppedBlob = async (image, crop) => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const canvas = document.createElement("canvas");
  const size = 600;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Crop canvas is unavailable.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create cropped image."));
      },
      "image/jpeg",
      0.92
    );
  });
};

const TestimonialAvatarManage = () => {
  const adminPin = import.meta.env.VITE_ADMIN_PIN;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pin, setPin] = useState("");
  const [draft, setDraft] = useState({
    id: null,
    alt: "",
    isActive: true,
    imageUrl: "",
    publicId: null,
    sortOrder: null,
  });
  const [sourcePreview, setSourcePreview] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isReplacingImage, setIsReplacingImage] = useState(false);

  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const resetEditor = () => {
    setDraft({
      id: null,
      alt: "",
      isActive: true,
      imageUrl: "",
      publicId: null,
      sortOrder: null,
    });
    setSourcePreview("");
    setCrop(undefined);
    setCompletedCrop(null);
    setIsReplacingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const ensurePin = () => {
    if (pin !== adminPin) {
      setErrorMsg("Enter the correct admin PIN to manage avatar presets.");
      return false;
    }
    return true;
  };

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "testimonialAvatars"), orderBy("sortOrder", "asc"))
      );
      setAvatars(snap.docs.map((avatarDoc) => ({ id: avatarDoc.id, ...avatarDoc.data() })));
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to load avatar presets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  const handleSelectFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file.");
      return;
    }

    clearMessages();
    setSourcePreview(URL.createObjectURL(file));
    setCrop(undefined);
    setCompletedCrop(null);
    setIsReplacingImage(true);
  };

  const uploadCroppedImage = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "testimonial-avatar.jpg");
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "testimonial-avatars");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return {
      imageUrl: response.data.secure_url,
      publicId: response.data.public_id ?? null,
    };
  };

  const startCreate = () => {
    clearMessages();
    resetEditor();
  };

  const startEdit = (avatar) => {
    clearMessages();
    setDraft({
      id: avatar.id,
      alt: avatar.alt || "",
      isActive: avatar.isActive !== false,
      imageUrl: avatar.imageUrl,
      publicId: avatar.publicId ?? null,
      sortOrder: avatar.sortOrder ?? 0,
    });
    setSourcePreview(avatar.imageUrl);
    setCrop(undefined);
    setCompletedCrop(null);
    setIsReplacingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    clearMessages();
    if (!ensurePin()) return;
    if (!draft.alt.trim()) {
      setErrorMsg("Add an avatar label before saving.");
      return;
    }
    if (!draft.id && !sourcePreview) {
      setErrorMsg("Upload an avatar image before saving.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = draft.imageUrl;
      let publicId = draft.publicId;

      if (!draft.id || isReplacingImage) {
        if (!imageRef.current || !completedCrop?.width || !completedCrop?.height) {
          setErrorMsg("Adjust the crop area before saving.");
          setSaving(false);
          return;
        }

        const croppedBlob = await getCroppedBlob(imageRef.current, completedCrop);
        const uploadedAsset = await uploadCroppedImage(croppedBlob);
        imageUrl = uploadedAsset.imageUrl;
        publicId = uploadedAsset.publicId;
      }

      if (draft.id) {
        await updateDoc(doc(db, "testimonialAvatars", draft.id), {
          alt: draft.alt.trim(),
          isActive: draft.isActive,
          imageUrl,
          publicId,
          sortOrder: draft.sortOrder ?? 0,
          updatedAt: Timestamp.now(),
          pin: adminPin,
        });
        setSuccessMsg("Avatar preset updated.");
      } else {
        const nextSortOrder =
          avatars.length > 0
            ? Math.max(...avatars.map((avatar) => avatar.sortOrder ?? 0)) + 1
            : 0;

        await addDoc(collection(db, "testimonialAvatars"), {
          alt: draft.alt.trim(),
          isActive: draft.isActive,
          imageUrl,
          publicId,
          sortOrder: nextSortOrder,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          pin: adminPin,
        });
        setSuccessMsg("Avatar preset added.");
      }

      await fetchAvatars();
      resetEditor();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to save avatar preset.");
    } finally {
      setSaving(false);
    }
  };

  const moveAvatar = async (avatarId, direction) => {
    clearMessages();
    if (!ensurePin()) return;

    const currentIndex = avatars.findIndex((avatar) => avatar.id === avatarId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= avatars.length) return;

    const currentAvatar = avatars[currentIndex];
    const targetAvatar = avatars[targetIndex];

    try {
      await Promise.all([
        updateDoc(doc(db, "testimonialAvatars", currentAvatar.id), {
          sortOrder: targetAvatar.sortOrder ?? targetIndex,
          updatedAt: Timestamp.now(),
          pin: adminPin,
        }),
        updateDoc(doc(db, "testimonialAvatars", targetAvatar.id), {
          sortOrder: currentAvatar.sortOrder ?? currentIndex,
          updatedAt: Timestamp.now(),
          pin: adminPin,
        }),
      ]);
      setSuccessMsg("Avatar order updated.");
      await fetchAvatars();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to update avatar order.");
    }
  };

  const toggleAvatar = async (avatar) => {
    clearMessages();
    if (!ensurePin()) return;

    try {
      await updateDoc(doc(db, "testimonialAvatars", avatar.id), {
        isActive: !(avatar.isActive !== false),
        updatedAt: Timestamp.now(),
        pin: adminPin,
      });
      setSuccessMsg(
        avatar.isActive !== false ? "Avatar hidden from the form." : "Avatar is live on the form."
      );
      await fetchAvatars();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to update avatar visibility.");
    }
  };

  const deleteAvatar = async (avatarId) => {
    clearMessages();
    if (!ensurePin()) return;

    try {
      await deleteDoc(doc(db, "testimonialAvatars", avatarId));
      if (draft.id === avatarId) resetEditor();
      setSuccessMsg("Avatar preset deleted.");
      await fetchAvatars();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to delete avatar preset.");
    }
  };

  return (
    <div className="rounded-3xl border border-[#E6E0D2] bg-[#FFFDFC] shadow-sm overflow-hidden">
      <style>{`
        .tam-wrap {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        }
        .tam-pane {
          padding: 24px;
        }
        .tam-pane + .tam-pane {
          border-left: 1px solid #EEE7DB;
        }
        .tam-kicker {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B8724A;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .tam-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #2C2417;
          margin: 0 0 8px;
        }
        .tam-subtitle {
          color: #756554;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .tam-alert {
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          margin-bottom: 14px;
        }
        .tam-alert.error {
          background: #FEF2F0;
          border: 1px solid #F4CCC6;
          color: #B04E3A;
        }
        .tam-alert.success {
          background: #F1F8F1;
          border: 1px solid #CFE4CF;
          color: #4E7D56;
        }
        .tam-field-label {
          display: block;
          margin-bottom: 7px;
          color: #8A6F58;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .tam-input, .tam-pin {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #E4DDCF;
          background: #FFFEFB;
          padding: 12px 14px;
          font-size: 14px;
          color: #2C2417;
          outline: none;
        }
        .tam-input:focus, .tam-pin:focus {
          border-color: #B8724A;
          box-shadow: 0 0 0 3px rgba(184,114,74,0.12);
        }
        .tam-pin {
          text-align: center;
          letter-spacing: 0.28em;
          font-size: 18px;
        }
        .tam-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0 18px;
          color: #5E5040;
          font-size: 14px;
        }
        .tam-drop {
          border: 1.5px dashed #D8CDBA;
          border-radius: 18px;
          background: #FCF8F2;
          padding: 18px;
          text-align: center;
          color: #8A7B69;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .tam-drop:hover {
          border-color: #B8724A;
          background: #FFF7ED;
        }
        .tam-preview-shell {
          margin-top: 16px;
          border-radius: 18px;
          border: 1px solid #E8E0D3;
          background: white;
          padding: 16px;
        }
        .tam-crop-wrap .ReactCrop {
          max-height: 340px;
          background: #F8F4ED;
          border-radius: 16px;
          overflow: hidden;
        }
        .tam-crop-wrap img {
          max-width: 100%;
          max-height: 340px;
          display: block;
        }
        .tam-circle-preview {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #756554;
          font-size: 13px;
        }
        .tam-circle-preview img,
        .tam-library-thumb,
        .tam-fallback-thumb {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          object-fit: cover;
          border: 3px solid #EFE4CF;
          background: #F7F1E5;
        }
        .tam-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
          flex-wrap: wrap;
        }
        .tam-btn {
          border: none;
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tam-btn.primary {
          background: #2C2417;
          color: #FFF9F1;
        }
        .tam-btn.secondary {
          background: #F4EDE2;
          color: #735F48;
          border: 1px solid #E4DAC9;
        }
        .tam-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .tam-library-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }
        .tam-library-list {
          display: grid;
          gap: 12px;
          max-height: 720px;
          overflow: auto;
          padding-right: 4px;
        }
        .tam-library-item {
          border: 1px solid #E8DFD0;
          border-radius: 18px;
          background: #FFFFFF;
          padding: 14px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
        }
        .tam-library-title {
          font-size: 14px;
          font-weight: 600;
          color: #2C2417;
          margin-bottom: 4px;
        }
        .tam-library-meta {
          font-size: 12px;
          color: #85715B;
        }
        .tam-chip-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 7px;
        }
        .tam-chip {
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: #F3EEE5;
          color: #715D46;
        }
        .tam-chip.off {
          background: #F8E7E3;
          color: #B04E3A;
        }
        .tam-library-actions {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 8px;
          justify-items: end;
        }
        .tam-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid #E8DED0;
          background: #FFFCF8;
          color: #675844;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .tam-empty {
          border: 1px dashed #DBCDBB;
          border-radius: 18px;
          padding: 24px;
          background: #FCF9F4;
          color: #85715B;
          text-align: center;
          font-size: 14px;
          line-height: 1.6;
        }
        @media (max-width: 1024px) {
          .tam-wrap {
            grid-template-columns: 1fr;
          }
          .tam-pane + .tam-pane {
            border-left: none;
            border-top: 1px solid #EEE7DB;
          }
        }
      `}</style>

      <div className="tam-wrap">
        <div className="tam-pane">
          <div className="tam-kicker">Avatar Library</div>
          <h2 className="tam-title">
            {draft.id ? "Edit avatar preset" : "Create avatar preset"}
          </h2>
          <p className="tam-subtitle">
            Upload a portrait, crop it to a circle-safe square, and decide whether students can use
            it as a default testimonial avatar.
          </p>

          {errorMsg && <div className="tam-alert error">{errorMsg}</div>}
          {successMsg && <div className="tam-alert success">{successMsg}</div>}

          <div style={{ marginBottom: 16 }}>
            <label className="tam-field-label">Avatar label</label>
            <input
              className="tam-input"
              type="text"
              placeholder="Example: Calm smile portrait"
              value={draft.alt}
              onChange={(event) => setDraft((current) => ({ ...current, alt: event.target.value }))}
            />
          </div>

          <label className="tam-toggle">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) =>
                setDraft((current) => ({ ...current, isActive: event.target.checked }))
              }
            />
            Show this avatar on the public testimonial form
          </label>

          <div style={{ marginBottom: 16 }}>
            <label className="tam-field-label">Upload or replace image</label>
            <label className="tam-drop">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => handleSelectFile(event.target.files?.[0])}
              />
              <ImagePlus size={22} style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 600, color: "#574532", marginBottom: 4 }}>
                {draft.id ? "Choose a new image to replace this preset" : "Choose an avatar image"}
              </div>
              <div style={{ fontSize: 12 }}>PNG or JPG works best. Crop will be saved as square.</div>
            </label>
          </div>

          {sourcePreview && (
            <div className="tam-preview-shell">
              <div className="tam-field-label">
                {isReplacingImage || !draft.id ? "Crop & fit" : "Current image preview"}
              </div>

              {isReplacingImage || !draft.id ? (
                <div className="tam-crop-wrap">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                    aspect={1}
                    circularCrop
                    keepSelection
                  >
                    <img
                      ref={imageRef}
                      src={sourcePreview}
                      alt="Avatar crop source"
                      onLoad={(event) => {
                        const { width, height } = event.currentTarget;
                        setCrop(createCenteredCrop(width, height));
                      }}
                    />
                  </ReactCrop>
                </div>
              ) : (
                <div className="tam-circle-preview">
                  <img src={sourcePreview} alt={draft.alt || "Avatar preview"} />
                  <div>
                    This preset already has a Cloudinary image. Upload a replacement only if you want
                    to change the crop or source image.
                  </div>
                </div>
              )}

              {(isReplacingImage || !draft.id) && (
                <div className="tam-circle-preview">
                  <img src={sourcePreview} alt={draft.alt || "Avatar preview"} />
                  <div>Use the crop box to frame the face cleanly inside the circular preview.</div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <label className="tam-field-label">Admin PIN</label>
            <input
              className="tam-pin"
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
          </div>

          <div className="tam-actions">
            <button className="tam-btn primary" type="button" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {draft.id ? "Save avatar" : "Add avatar"}
            </button>
            <button className="tam-btn secondary" type="button" onClick={startCreate}>
              <Check size={15} />
              New preset
            </button>
            {draft.id && (
              <button className="tam-btn secondary" type="button" onClick={resetEditor}>
                <X size={15} />
                Cancel edit
              </button>
            )}
          </div>
        </div>

        <div className="tam-pane">
          <div className="tam-library-head">
            <div>
              <div className="tam-kicker">Saved Presets</div>
              <h3 style={{ margin: 0, fontSize: 20, color: "#2C2417" }}>
                {avatars.length} avatar{avatars.length === 1 ? "" : "s"}
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="tam-empty">
              <Loader2 size={18} className="animate-spin" style={{ marginBottom: 10 }} />
              Loading avatar presets...
            </div>
          ) : avatars.length === 0 ? (
            <div className="tam-empty">
              No avatar presets yet. Add the first one here and it will become available on the
              public testimonial form.
            </div>
          ) : (
            <div className="tam-library-list">
              {avatars.map((avatar, index) => (
                <div className="tam-library-item" key={avatar.id}>
                  {avatar.imageUrl ? (
                    <img
                      className="tam-library-thumb"
                      src={avatar.imageUrl}
                      alt={avatar.alt || `Avatar ${index + 1}`}
                    />
                  ) : (
                    <div className="tam-fallback-thumb" />
                  )}

                  <div>
                    <div className="tam-library-title">{avatar.alt || `Avatar ${index + 1}`}</div>
                    <div className="tam-library-meta">Sort order: {avatar.sortOrder ?? index}</div>
                    <div className="tam-chip-row">
                      <span className={`tam-chip ${avatar.isActive === false ? "off" : ""}`}>
                        {avatar.isActive === false ? "Hidden" : "Live"}
                      </span>
                      <span className="tam-chip">{avatar.publicId ? "Cloudinary" : "Image linked"}</span>
                    </div>
                  </div>

                  <div className="tam-library-actions">
                    <button
                      className="tam-icon-btn"
                      type="button"
                      title="Move up"
                      onClick={() => moveAvatar(avatar.id, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="tam-icon-btn"
                      type="button"
                      title="Move down"
                      onClick={() => moveAvatar(avatar.id, 1)}
                      disabled={index === avatars.length - 1}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      className="tam-icon-btn"
                      type="button"
                      title="Edit"
                      onClick={() => startEdit(avatar)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="tam-icon-btn"
                      type="button"
                      title={avatar.isActive === false ? "Show avatar" : "Hide avatar"}
                      onClick={() => toggleAvatar(avatar)}
                    >
                      {avatar.isActive === false ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      className="tam-icon-btn"
                      type="button"
                      title="Delete avatar"
                      onClick={() => deleteAvatar(avatar.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialAvatarManage;
