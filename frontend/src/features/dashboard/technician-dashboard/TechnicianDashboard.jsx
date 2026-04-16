import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../../lib/api";

/* ─────────────────────────────────────────
   BADGE
───────────────────────────────────────── */
function Badge({ type, children }) {
  const map = {
    OPEN: { bg: "#EFF6FF", color: "#2563EB", bd: "#BFDBFE" },
    IN_PROGRESS: { bg: "#FFFBEB", color: "#D97706", bd: "#FDE68A" },
    RESOLVED: { bg: "#ECFDF5", color: "#059669", bd: "#A7F3D0" },
    CLOSED: { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" },
    REJECTED: { bg: "#FEF2F2", color: "#DC2626", bd: "#FECACA" },
    HIGH: { bg: "#FEF2F2", color: "#DC2626", bd: "#FECACA" },
    MEDIUM: { bg: "#FFFBEB", color: "#D97706", bd: "#FDE68A" },
    LOW: { bg: "#ECFDF5", color: "#059669", bd: "#A7F3D0" },
    TECHNICIAN: { bg: "#F5F3FF", color: "#7C3AED", bd: "#DDD6FE" },
  };
  const s = map[type] || map["CLOSED"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.bd}`,
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          display: "inline-block",
        }}
      />
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────
   NAV ITEM
───────────────────────────────────────── */
function NavItem({ icon, label, active, onClick, badge }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 9,
        cursor: "pointer",
        background: active ? "#F5F3FF" : hov ? "#F8FAFC" : "transparent",
        border: active ? "1px solid #DDD6FE" : "1px solid transparent",
        color: active ? "#7C3AED" : hov ? "#1A1D23" : "#6B7280",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        transition: "all .15s",
      }}
    >
      <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span
          style={{
            background: "#7C3AED",
            color: "#fff",
            fontSize: 10,
            padding: "1px 7px",
            borderRadius: 99,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
      {active && !badge && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#7C3AED",
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({ icon, label, value, color, bg, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8EBF0",
        borderRadius: 14,
        padding: "16px 18px",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: "opacity .5s ease, transform .5s ease",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: ".07em",
          fontWeight: 700,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-.04em",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STATUS UPDATE MODAL
───────────────────────────────────────── */
function UpdateModal({ ticket, onClose, onSave }) {
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

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  // Data state
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ticketFilter, setTicketFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Loading/error state
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [error, setError] = useState("");

  const rawUser = sessionStorage.getItem("user") || "null";
  const user = useMemo(() => {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);

  const isTechnician = (user?.role || "").toUpperCase() === "TECHNICIAN";

  useEffect(() => {
    if (!isTechnician) {
      navigate("/");
      return;
    }
    loadData();
    setTimeout(() => setLoaded(true), 100);
  }, [isTechnician, navigate]);

  const loadData = async () => {
    await Promise.all([loadTickets(), loadNotifications()]);
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await apiGet("/tickets/assigned");
      setTickets(Array.isArray(res) ? res : res?.tickets || []);
    } catch (e) {
      console.error("Tickets fetch failed:", e);
      // Keep empty — don't break the UI
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadNotifications = async () => {
    setNotifsLoading(true);
    try {
      const res = await apiGet("/notifications/my");
      setNotifications(Array.isArray(res) ? res : res?.notifications || []);
    } catch (e) {
      console.error("Notifs fetch failed:", e);
    } finally {
      setNotifsLoading(false);
    }
  };

  const handleUpdateTicket = async (ticketId, payload) => {
    try {
      const updated = await apiPatch(`/tickets/${ticketId}/status`, payload);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, ...updated } : t)),
      );
    } catch (e) {
      console.error("Update failed:", e);
      setError("Failed to update ticket.");
    }
  };

  const markAllRead = async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setError("Failed to mark notifications as read.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!isTechnician) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredTickets =
    ticketFilter === "All"
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const NAV = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "tickets", icon: "🔧", label: "Assigned Tickets" },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      badge: unreadCount,
    },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  /* shared styles */
  const C = {
    bg: "#F5F7FA",
    surface: "#fff",
    border: "#E8EBF0",
    text: "#1A1D23",
    muted: "#6B7280",
    hint: "#9CA3AF",
    purple: "#7C3AED",
    purpleBg: "#F5F3FF",
    purpleBd: "#DDD6FE",
  };
  const pageTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pageSub = { fontSize: 13, color: C.muted, marginBottom: 22 };
  const filterPillBase = {
    padding: "5px 13px",
    borderRadius: 99,
    fontSize: 11,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all .15s",
    border: `1px solid ${C.border}`,
    background: C.surface,
    color: C.muted,
  };
  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    color: C.hint,
    letterSpacing: ".07em",
    textTransform: "uppercase",
    margin: "16px 0 10px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
        opacity: loaded ? 1 : 0,
        transition: "opacity .5s ease",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 224,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          zIndex: 50,
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-.03em",
            cursor: "pointer",
            paddingLeft: 6,
            color: C.text,
            marginBottom: 4,
          }}
        >
          Smart<span style={{ color: C.purple }}>Campus</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: C.hint,
            paddingLeft: 6,
            marginBottom: 22,
            letterSpacing: ".05em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Technician Portal
        </div>

        <nav
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              badge={item.badge}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 11px",
              borderRadius: 9,
              background: "#F8FAFC",
              border: `1px solid ${C.border}`,
              marginBottom: 7,
            }}
          >
            <img
              src={
                user?.picture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "tech"}`
              }
              alt="avatar"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: `2px solid ${C.purpleBd}`,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "Technician"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.hint,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 11px",
              borderRadius: 9,
              cursor: "pointer",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main
        style={{
          marginLeft: 224,
          flex: 1,
          padding: "28px max(24px,3vw)",
          minHeight: "100vh",
        }}
      >
        {/* Error banner */}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 10,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 13,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {error}
            <span
              onClick={() => setError("")}
              style={{ cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >
              ×
            </span>
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 26 }}>
              <div
                style={{
                  fontSize: 11,
                  color: C.hint,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Technician Portal
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-.04em",
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                Welcome back, {user?.name?.split(" ")[0] || "Tech"} 👋
              </div>
              <Badge type="TECHNICIAN">TECHNICIAN</Badge>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <StatCard
                icon="🔧"
                label="Assigned"
                value={tickets.length}
                color={C.purple}
                bg={C.purpleBg}
                delay={80}
              />
              <StatCard
                icon="🔓"
                label="Open"
                value={openCount}
                color="#2563EB"
                bg="#EFF6FF"
                delay={160}
              />
              <StatCard
                icon="⚙️"
                label="In Progress"
                value={inProgCount}
                color="#D97706"
                bg="#FFFBEB"
                delay={240}
              />
              <StatCard
                icon="✅"
                label="Resolved"
                value={resolvedCount}
                color="#059669"
                bg="#ECFDF5"
                delay={320}
              />
            </div>

            {/* Quick actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {/* Assigned tickets */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 13,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}
                  >
                    Assigned Tickets
                  </span>
                  <span
                    onClick={() => setActiveTab("tickets")}
                    style={{
                      fontSize: 12,
                      color: C.purple,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View all →
                  </span>
                </div>
                {ticketsLoading ? (
                  <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
                ) : tickets.length === 0 ? (
                  <div
                    style={{ fontSize: 13, color: C.hint, padding: "12px 0" }}
                  >
                    No tickets assigned yet.
                  </div>
                ) : (
                  tickets.slice(0, 3).map((t, i) => (
                    <div
                      key={t.id || i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: 9,
                        marginBottom: 5,
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                      onClick={() => setSelectedTicket(t)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F8FAFC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = C.surface)
                      }
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                            marginBottom: 2,
                          }}
                        >
                          {t.title}
                        </div>
                        <div style={{ fontSize: 11, color: C.hint }}>
                          {t.category || t.location || ""}
                        </div>
                      </div>
                      <Badge type={t.priority}>{t.priority}</Badge>
                    </div>
                  ))
                )}
              </div>

              {/* Recent notifications */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 13,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}
                  >
                    Notifications
                  </span>
                  <span
                    onClick={() => setActiveTab("notifications")}
                    style={{
                      fontSize: 12,
                      color: C.purple,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View all →
                  </span>
                </div>
                {notifsLoading ? (
                  <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
                ) : notifications.length === 0 ? (
                  <div
                    style={{ fontSize: 13, color: C.hint, padding: "12px 0" }}
                  >
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 3).map((n, i) => (
                    <div
                      key={n.id || i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "10px 12px",
                        background: n.read ? C.surface : C.purpleBg,
                        border: `1px solid ${n.read ? C.border : C.purpleBd}`,
                        borderRadius: 9,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: n.read ? C.hint : C.purple,
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.text,
                            marginBottom: 2,
                          }}
                        >
                          {n.title || "Notification"}
                        </div>
                        <div style={{ fontSize: 11, color: C.hint }}>
                          {n.message || ""}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ASSIGNED TICKETS ── */}
        {activeTab === "tickets" && (
          <div>
            <div style={pageTitle}>Assigned Tickets</div>
            <div style={pageSub}>
              View and update your assigned maintenance tickets
            </div>

            {/* Filter pills */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
                <div
                  key={f}
                  onClick={() => setTicketFilter(f)}
                  style={
                    ticketFilter === f
                      ? {
                          ...filterPillBase,
                          background: C.purple,
                          borderColor: C.purple,
                          color: "#fff",
                        }
                      : filterPillBase
                  }
                >
                  {f.replace("_", " ")}
                </div>
              ))}
            </div>

            {ticketsLoading ? (
              <div style={{ fontSize: 13, color: C.hint, padding: "20px 0" }}>
                Loading tickets...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  color: C.hint,
                  fontSize: 13,
                }}
              >
                No{" "}
                {ticketFilter !== "All"
                  ? ticketFilter.replace("_", " ").toLowerCase()
                  : ""}{" "}
                tickets assigned to you.
              </div>
            ) : (
              filteredTickets.map((t, i) => (
                <div
                  key={t.id || i}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#CBD5E1";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                          marginBottom: 4,
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          lineHeight: 1.5,
                        }}
                      >
                        {t.description || "No description provided."}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <Badge type={t.priority}>{t.priority || "—"}</Badge>
                      <Badge type={t.status}>
                        {(t.status || "").replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Metadata row */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    {t.category && (
                      <span style={{ fontSize: 11, color: C.hint }}>
                        📂 {t.category}
                      </span>
                    )}
                    {(t.location || t.resourceName) && (
                      <span style={{ fontSize: 11, color: C.hint }}>
                        📍 {t.location || t.resourceName}
                      </span>
                    )}
                    {t.reportedBy && (
                      <span style={{ fontSize: 11, color: C.hint }}>
                        👤 {t.reportedBy}
                      </span>
                    )}
                    {t.createdAt && (
                      <span style={{ fontSize: 11, color: C.hint }}>
                        🕐 {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Resolution note if exists */}
                  {t.resolutionNote && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#059669",
                        background: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        borderRadius: 8,
                        padding: "8px 12px",
                        marginBottom: 12,
                      }}
                    >
                      <strong>Resolution note:</strong> {t.resolutionNote}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedTicket(t)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 99,
                      background: C.purpleBg,
                      border: `1px solid ${C.purpleBd}`,
                      color: C.purple,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.purple;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.purpleBg;
                      e.currentTarget.style.color = C.purple;
                    }}
                  >
                    Update Status
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 22,
              }}
            >
              <div>
                <div style={pageTitle}>Notifications</div>
                <div style={{ fontSize: 13, color: C.muted }}>
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 99,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    color: C.muted,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#94A3B8";
                    e.currentTarget.style.color = C.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.muted;
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifsLoading ? (
              <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  color: C.hint,
                  fontSize: 13,
                }}
              >
                No notifications yet.
              </div>
            ) : (
              <>
                {notifications.some((n) => !n.read) && (
                  <>
                    <div style={sectionLabel}>Unread</div>
                    {notifications
                      .filter((n) => !n.read)
                      .map((n, i) => (
                        <div
                          key={n.id || i}
                          style={{
                            display: "flex",
                            gap: 10,
                            padding: "12px 14px",
                            background: C.purpleBg,
                            border: `1px solid ${C.purpleBd}`,
                            borderRadius: 10,
                            marginBottom: 7,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: C.purple,
                              flexShrink: 0,
                              marginTop: 4,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: C.text,
                                marginBottom: 2,
                              }}
                            >
                              {n.title || "Notification"}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: C.muted,
                                lineHeight: 1.5,
                              }}
                            >
                              {n.message || ""}
                            </div>
                          </div>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: C.purple,
                              flexShrink: 0,
                              marginTop: 5,
                            }}
                          />
                        </div>
                      ))}
                  </>
                )}
                <div style={sectionLabel}>Earlier</div>
                {notifications
                  .filter((n) => n.read)
                  .map((n, i) => (
                    <div
                      key={n.id || i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "12px 14px",
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: 10,
                        marginBottom: 7,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: C.hint,
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                            marginBottom: 2,
                          }}
                        >
                          {n.title || "Notification"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.muted,
                            lineHeight: 1.5,
                          }}
                        >
                          {n.message || ""}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
            }}
          >
            <div style={{ width: "100%", maxWidth: 700, marginBottom: 24 }}>
              <div style={pageTitle}>Profile</div>
              <div style={{ fontSize: 13, color: C.muted }}>
                Your account details
              </div>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 700,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "28px 32px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    user?.picture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "tech"}`
                  }
                  alt="avatar"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: `4px solid ${C.purpleBd}`,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    right: 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#059669",
                    border: "2.5px solid #fff",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: C.text,
                    letterSpacing: "-.03em",
                    marginBottom: 3,
                  }}
                >
                  {user?.name || "Technician"}
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
                  {user?.email || ""}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge type="TECHNICIAN">TECHNICIAN</Badge>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#F0FDF4",
                      color: "#15803D",
                      border: "1px solid #BBF7D0",
                      borderRadius: 99,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#059669",
                        display: "inline-block",
                      }}
                    />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 700,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              {[
                { label: "Full Name", value: user?.name, icon: "👤" },
                { label: "Email", value: user?.email, icon: "✉️" },
                { label: "Role", value: "TECHNICIAN", icon: "🔑" },
                { label: "Auth Method", value: "Google OAuth 2.0", icon: "🔒" },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 13,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#F8FAFC",
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.hint,
                        fontWeight: 700,
                        letterSpacing: ".05em",
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {f.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.value || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 700,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                { label: "Assigned", value: tickets.length, color: C.purple },
                { label: "In Progress", value: inProgCount, color: "#D97706" },
                { label: "Resolved", value: resolvedCount, color: "#059669" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 13,
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: s.color,
                      letterSpacing: "-.04em",
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.hint,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", maxWidth: 700 }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 12,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#FEE2E2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FEF2F2")
                }
              >
                Sign out of SmartCampus
              </button>
            </div>
          </div>
        )}
      </main>

      {/* UPDATE MODAL */}
      {selectedTicket && (
        <UpdateModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSave={handleUpdateTicket}
        />
      )}
    </div>
  );
}
