import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg: "#F5F7FA", surface: "#fff", border: "#E8EBF0",
  text: "#1A1D23", muted: "#6B7280", hint: "#9CA3AF",
  blue: "#2563EB", blueBg: "#EFF6FF", blueBd: "#BFDBFE",
  orange: "#D97706", orangeBg: "#FFFBEB",
  red: "#DC2626", redBg: "#FEF2F2",
  green: "#059669",
};

const CATEGORIES = ["ELECTRICAL", "PLUMBING", "HVAC", "IT_EQUIPMENT", "STRUCTURAL", "CLEANING", "SAFETY", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

function Input({ label, name, value, onChange, type = "text", placeholder, required, as }) {
  const base = {
    width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13,
    border: "1px solid #D1D5DB", background: "#fff", color: C.text,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .15s",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 5 }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      {as === "select" ? (
        <select name={name} value={value} onChange={onChange} style={base} required={required}>
          <option value="">Select…</option>
          {(name === "category" ? CATEGORIES : PRIORITIES).map(v => (
            <option key={v} value={v}>{v.replace("_", " ")}</option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
          rows={4} style={{ ...base, resize: "vertical" }} required={required} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} style={base} required={required} />
      )}
    </div>
  );
}

export default function TicketFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = useMemo(() => sessionStorage.getItem("token"), []);
  const user = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  const [form, setForm] = useState({
    location: "", category: "", description: "", priority: "MEDIUM",
    preferredContact: "", resourceId: "",
  });
  const [images, setImages] = useState([]); // { file, preview }
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (images.length + valid.length > 3) {
      setError("Maximum 3 images allowed."); return;
    }
    setError("");
    const newEntries = valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newEntries].slice(0, 3));
  };

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location || !form.category || !form.description || !form.priority || !form.preferredContact) {
      setError("Please fill in all required fields."); return;
    }
    setSubmitting(true);
    setError("");

    try {
      // 1. Create ticket
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          location: form.location,
          category: form.category,
          description: form.description,
          priority: form.priority,
          preferredContact: form.preferredContact,
          resourceId: form.resourceId || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create ticket");
      }

      const ticket = await res.json();

      // 2. Upload attachments if any
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach(({ file }) => fd.append("files", file));
        await fetch(`/api/tickets/${ticket.id}/attachments`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      navigate("/dashboard", { state: { tab: "tickets", message: "Ticket created successfully!" } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) { navigate("/"); return null; }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted, padding: 0 }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Report New Incident</span>
      </div>

      <div style={{ maxWidth: 620, margin: "32px auto", padding: "0 20px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Incident / Maintenance Ticket</h2>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
            Report a facility or equipment issue for your campus location.
          </p>

          {error && (
            <div style={{ background: C.redBg, border: `1px solid #FECACA`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input label="Location / Room" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Lab B204, LH-01" required />
            <Input label="Resource ID (optional)" name="resourceId" value={form.resourceId} onChange={handleChange}
              placeholder="e.g. PRJ-04 (leave blank if not applicable)" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Category" name="category" value={form.category} onChange={handleChange} required as="select" />
              <Input label="Priority" name="priority" value={form.priority} onChange={handleChange} required as="select" />
            </div>

            <Input label="Description" name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the issue in detail (min 10 characters)…" required as="textarea" />

            <Input label="Preferred Contact" name="preferredContact" value={form.preferredContact} onChange={handleChange}
              placeholder="e.g. john@example.com or +94771234567" required />

            {/* Image Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 5 }}>
                Attachments <span style={{ color: C.hint }}>(optional · max 3 images)</span>
              </label>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? C.blue : "#D1D5DB"}`,
                  borderRadius: 10, padding: "20px 16px", textAlign: "center",
                  cursor: images.length >= 3 ? "not-allowed" : "pointer",
                  background: dragOver ? C.blueBg : "#FAFAFA",
                  transition: "all .15s",
                  opacity: images.length >= 3 ? 0.5 : 1,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
                <div style={{ fontSize: 13, color: C.muted }}>
                  {images.length >= 3 ? "Maximum 3 images reached" : "Drag & drop images here or click to browse"}
                </div>
                <div style={{ fontSize: 11, color: C.hint, marginTop: 4 }}>JPEG, PNG, GIF, WebP · max 5MB each</div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                onChange={(e) => addFiles(e.target.files)} disabled={images.length >= 3} />

              {/* Previews */}
              {images.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={img.preview} alt={`preview-${i}`}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }} />
                      <button type="button" onClick={() => removeImage(i)}
                        style={{
                          position: "absolute", top: -6, right: -6, width: 20, height: 20,
                          borderRadius: "50%", background: C.red, color: "#fff",
                          border: "none", cursor: "pointer", fontSize: 11, lineHeight: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority hint */}
            <div style={{ background: C.orangeBg, border: `1px solid #FDE68A`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: C.orange }}>
              <strong>Priority Guide:</strong> LOW = minor inconvenience · MEDIUM = affects work · HIGH = safety/critical issue
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => navigate(-1)}
                style={{ flex: 1, padding: "11px 0", borderRadius: 99, background: "none", border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer", color: C.muted }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                style={{ flex: 2, padding: "11px 0", borderRadius: 99, background: submitting ? "#93C5FD" : C.blue, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer" }}>
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
