import { useState } from "react";

export default function UpdateModal({ ticket, onClose, onSave }) {
  const [status, setStatus] = useState(ticket.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  const handleSave = async () => {
    setSaving(true);
    await onSave(ticket.id, { status, resolutionNote: note });
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "28px 28px",
          width: "100%",
          maxWidth: 440,
          border: "1px solid #E8EBF0",
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#1A1D23",
            marginBottom: 4,
          }}
        >
          Update Ticket
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>
          {ticket.title}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: ".05em",
              marginBottom: 8,
            }}
          >
            Status
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {statuses.map((s) => (
              <div
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all .15s",
                  background: status === s ? "#7C3AED" : "#F5F3FF",
                  color: status === s ? "#fff" : "#7C3AED",
                  border: `1px solid ${status === s ? "#7C3AED" : "#DDD6FE"}`,
                }}
              >
                {s.replace("_", " ")}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: ".05em",
              marginBottom: 8,
            }}
          >
            Resolution Note
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what was done or what is needed..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #E8EBF0",
              fontSize: 13,
              color: "#1A1D23",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1px solid #E8EBF0",
              background: "#fff",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: saving ? "#A78BFA" : "#7C3AED",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background .15s",
            }}
          >
            {saving ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
