import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const C = {
  bg: "#F5F7FA", surface: "#fff", border: "#E8EBF0",
  text: "#1A1D23", muted: "#6B7280", hint: "#9CA3AF",
  blue: "#2563EB", blueBg: "#EFF6FF", blueBd: "#BFDBFE",
  orange: "#D97706", orangeBg: "#FFFBEB", orangeBd: "#FDE68A",
  red: "#DC2626", redBg: "#FEF2F2", redBd: "#FECACA",
  green: "#059669", greenBg: "#ECFDF5", greenBd: "#A7F3D0",
  purple: "#7C3AED", purpleBg: "#F5F3FF", purpleBd: "#DDD6FE",
};

const BADGE_STYLES = {
  OPEN: { bg: C.blueBg, color: C.blue, bd: C.blueBd },
  IN_PROGRESS: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  RESOLVED: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  CLOSED: { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" },
  REJECTED: { bg: C.redBg, color: C.red, bd: C.redBd },
  HIGH: { bg: C.redBg, color: C.red, bd: C.redBd },
  MEDIUM: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  LOW: { bg: C.greenBg, color: C.green, bd: C.greenBd },
};

function Badge({ type, children }) {
  const s = BADGE_STYLES[type] || { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, border: `1px solid ${s.bd}`, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
      {children}
    </span>
  );
}

const TIMELINE_STEPS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const STEP_ICONS = { OPEN: "📋", IN_PROGRESS: "🔧", RESOLVED: "✅", CLOSED: "🔒", REJECTED: "❌" };

function StatusTimeline({ status }) {
  const rejected = status === "REJECTED";
  const steps = rejected ? ["OPEN", "REJECTED"] : TIMELINE_STEPS;
  const currentIdx = steps.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
      {steps.map((s, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 72 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14,
                background: done ? (s === "REJECTED" ? C.redBg : C.blueBg) : "#F1F5F9",
                border: `2px solid ${done ? (s === "REJECTED" ? C.red : C.blue) : "#D1D5DB"}`,
                boxShadow: active ? `0 0 0 3px ${s === "REJECTED" ? "#FEE2E2" : C.blueBd}` : "none",
              }}>
                {STEP_ICONS[s]}
              </div>
              <span style={{ fontSize: 10, color: done ? C.text : C.hint, fontWeight: done ? 600 : 400, textAlign: "center" }}>
                {s.replace("_", " ")}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < currentIdx ? C.blue : "#E2E8F0", minWidth: 24, margin: "0 2px", marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CommentBubble({ comment, currentUserId, role, onEdit, onDelete }) {
  const isOwn = comment.userId === currentUserId;
  const isAdmin = role === "ADMIN";
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(comment.content);

  const handleSave = () => { onEdit(comment.id, editVal); setEditing(false); };

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: isOwn ? C.blueBg : C.orangeBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, border: `1px solid ${isOwn ? C.blueBd : C.orangeBd}` }}>
        {comment.userName?.[0]?.toUpperCase() || "?"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{comment.userName || "Unknown"}</span>
          <span style={{ fontSize: 11, color: C.hint }}>{new Date(comment.createdAt).toLocaleString()}</span>
          {comment.updatedAt !== comment.createdAt && (
            <span style={{ fontSize: 10, color: C.hint, fontStyle: "italic" }}>(edited)</span>
          )}
        </div>
        {editing ? (
          <div>
            <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={2}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button onClick={handleSave} style={{ padding: "5px 14px", borderRadius: 6, background: C.blue, color: "#fff", border: "none", fontSize: 12, cursor: "pointer" }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: "5px 14px", borderRadius: 6, background: "none", border: `1px solid ${C.border}`, fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#F8FAFC", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: C.text, lineHeight: 1.5 }}>
            {comment.content}
          </div>
        )}
        {(isOwn || isAdmin) && !editing && (
          <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
            {isOwn && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", fontSize: 11, color: C.blue, cursor: "pointer", padding: 0 }}>Edit</button>}
            <button onClick={() => onDelete(comment.id)} style={{ background: "none", border: "none", fontSize: 11, color: C.red, cursor: "pointer", padding: 0 }}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useMemo(() => sessionStorage.getItem("token"), []);
  const user = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  // Admin controls
  const [adminPanel, setAdminPanel] = useState(false);
  const [adminStatus, setAdminStatus] = useState("");
  const [adminTechId, setAdminTechId] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [adminReason, setAdminReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const role = user?.role || "USER";
  const isAdmin = role === "ADMIN";
  const isTechnician = role === "TECHNICIAN";

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Ticket not found");
      setTicket(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!user) { navigate("/"); return; } fetchTicket(); }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/tickets/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: commentText }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      setTicket(await res.json());
      setCommentText("");
    } finally {
      setCommenting(false);
    }
  };

  const handleEditComment = async (cid, content) => {
    const res = await fetch(`/api/tickets/${id}/comments/${cid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (res.ok) setTicket(await res.json());
  };

  const handleDeleteComment = async (cid) => {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/tickets/${id}/comments/${cid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTicket(await res.json());
  };

  const handleAdminUpdate = async () => {
    setUpdating(true);
    try {
      const body = {};
      if (adminStatus) body.status = adminStatus;
      if (adminTechId) body.assignedTechnicianId = adminTechId;
      if (adminNotes) body.resolutionNotes = adminNotes;
      if (adminReason) body.rejectionReason = adminReason;

      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update ticket");
      }
      setTicket(await res.json());
      setAdminPanel(false);
      setAdminStatus(""); setAdminTechId(""); setAdminNotes(""); setAdminReason("");
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: C.muted, fontSize: 14 }}>Loading ticket…</div>;
  if (error) return <div style={{ textAlign: "center", padding: 60, color: C.red, fontSize: 14 }}>{error}</div>;
  if (!ticket) return null;

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString() : "-";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted, padding: 0 }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Ticket Details</span>
        <Badge type={ticket.status}>{ticket.status.replace("_", " ")}</Badge>
        {(isAdmin || isTechnician) && (
          <button onClick={() => setAdminPanel(p => !p)}
            style={{ padding: "7px 14px", borderRadius: 8, background: C.blue, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {adminPanel ? "Close Panel" : "Manage Ticket"}
          </button>
        )}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>

        {/* Admin management panel */}
        {adminPanel && (isAdmin || isTechnician) && (
          <div style={{ background: C.surface, border: `1px solid ${C.orangeBd}`, borderRadius: 13, padding: 20, borderLeft: `4px solid ${C.orange}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.orange }}>Manage Ticket</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Update Status</label>
                <select value={adminStatus} onChange={e => setAdminStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit" }}>
                  <option value="">No change</option>
                  {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(s => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              {isAdmin && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Assign Technician ID</label>
                  <input value={adminTechId} onChange={e => setAdminTechId(e.target.value)} placeholder="Technician user ID"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              )}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Resolution Notes</label>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2}
                placeholder="Add resolution details…"
                style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            {adminStatus === "REJECTED" && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Rejection Reason</label>
                <input value={adminReason} onChange={e => setAdminReason(e.target.value)} placeholder="Reason for rejection"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            )}
            <button onClick={handleAdminUpdate} disabled={updating}
              style={{ padding: "9px 20px", borderRadius: 8, background: updating ? "#93C5FD" : C.blue, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: updating ? "not-allowed" : "pointer" }}>
              {updating ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}

        {/* Status timeline */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: "18px 20px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: C.text }}>Status Timeline</h3>
          <StatusTimeline status={ticket.status} />
        </div>

        {/* Main info */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{ticket.location}</h2>
              <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0" }}>#{ticket.id?.slice(-8)}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge type={ticket.priority}>{ticket.priority}</Badge>
              <Badge type={ticket.status}>{ticket.status.replace("_", " ")}</Badge>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 16 }}>
            {[
              ["Category", ticket.category?.replace("_", " ")],
              ["Reported By", ticket.createdBy?.slice(-8)],
              ["Preferred Contact", ticket.preferredContact],
              ["Assigned To", ticket.assignedTechnicianId ? ticket.assignedTechnicianId.slice(-8) : "Unassigned"],
              ["Created", fmtDate(ticket.createdAt)],
              ["Last Updated", fmtDate(ticket.updatedAt)],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{v || "-"}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Description</div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0, background: "#F8FAFC", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}` }}>
              {ticket.description}
            </p>
          </div>

          {ticket.resolutionNotes && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Resolution Notes</div>
              <p style={{ fontSize: 13, color: C.green, lineHeight: 1.6, margin: 0, background: C.greenBg, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.greenBd}` }}>
                {ticket.resolutionNotes}
              </p>
            </div>
          )}

          {ticket.rejectionReason && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Rejection Reason</div>
              <p style={{ fontSize: 13, color: C.red, lineHeight: 1.6, margin: 0, background: C.redBg, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.redBd}` }}>
                {ticket.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* Attachments */}
        {ticket.attachmentUrls?.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: "18px 20px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Attachments ({ticket.attachmentUrls.length})</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {ticket.attachmentUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img src={url} alt={`attachment-${i + 1}`}
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", transition: "opacity .15s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = ".8"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: "18px 20px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            Comments <span style={{ color: C.hint, fontWeight: 400 }}>({ticket.comments?.length || 0})</span>
          </h3>

          {ticket.comments?.length === 0 && (
            <p style={{ fontSize: 13, color: C.hint, textAlign: "center", padding: "12px 0" }}>No comments yet. Be the first to add one.</p>
          )}

          {ticket.comments?.map((c) => (
            <CommentBubble key={c.id} comment={c} currentUserId={user?.id}
              role={role} onEdit={handleEditComment} onDelete={handleDeleteComment} />
          ))}

          {/* Add comment */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment…" rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginBottom: 10 }} />
            <button onClick={handleAddComment} disabled={commenting || !commentText.trim()}
              style={{ padding: "8px 20px", borderRadius: 99, background: commenting || !commentText.trim() ? "#93C5FD" : C.blue, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: commenting || !commentText.trim() ? "not-allowed" : "pointer" }}>
              {commenting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
