import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../../lib/api";

const CATEGORIES = ["ELECTRICAL", "PLUMBING", "HVAC", "IT_EQUIPMENT", "STRUCTURAL", "CLEANING", "SAFETY", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const input = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  fontSize: 14,
  color: "#1A1D23",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    resourceName: "",
    category: "OTHER",
    priority: "MEDIUM",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiPost("/tickets", form);
      navigate("/dashboard", { state: { tab: "tickets" } });
    } catch (err) {
      setError(err.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 580,
        background: "#fff",
        borderRadius: 20,
        padding: "36px 36px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 24px rgba(0,0,0,.06)",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6B7280", fontSize: 13, fontFamily: "inherit",
            marginBottom: 20, padding: 0, display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.03em", color: "#1A1D23", marginBottom: 6 }}>
          Report New Issue
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28 }}>
          Submit a maintenance or incident report for campus facilities.
        </p>

        {error && (
          <div style={{
            marginBottom: 18, padding: "10px 14px", borderRadius: 10,
            background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Issue Title *</label>
          <input
            style={{ ...input, marginBottom: 18 }}
            placeholder="e.g. AC not working in Lab B204"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            maxLength={200}
            required
          />

          <label style={labelStyle}>Description *</label>
          <textarea
            style={{ ...input, marginBottom: 18, resize: "vertical", minHeight: 100 }}
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            maxLength={2000}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                style={input}
                placeholder="e.g. Building A, Floor 2"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Resource / Room</label>
              <input
                style={input}
                placeholder="e.g. Lab B204"
                value={form.resourceName}
                onChange={(e) => set("resourceName", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                style={{ ...input }}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {PRIORITIES.map((p) => (
                  <div
                    key={p}
                    onClick={() => set("priority", p)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 99,
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                      background: form.priority === p ? priorityColor(p) : "#F1F5F9",
                      color: form.priority === p ? "#fff" : "#64748B",
                      border: `1px solid ${form.priority === p ? priorityColor(p) : "#E2E8F0"}`,
                      transition: "all .15s",
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              background: submitting ? "#93C5FD" : "#D97706",
              color: "#fff",
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background .15s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#9CA3AF",
  textTransform: "uppercase",
  letterSpacing: ".05em",
  marginBottom: 6,
};

function priorityColor(p) {
  const map = { LOW: "#10B981", MEDIUM: "#F59E0B", HIGH: "#EF4444", CRITICAL: "#7C3AED" };
  return map[p] || "#6B7280";
}
