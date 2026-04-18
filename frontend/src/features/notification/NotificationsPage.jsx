import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../lib/api";

/* ── Badge ── */
function Badge({ type, children }) {
  const styles = {
    APPROVED: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    PENDING: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    REJECTED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    BOOKING: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    TICKET: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    COMMENT: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    GENERAL: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
  };
  const s = styles[type] || styles.GENERAL;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
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

/* ── NavItem ── */
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
        background: active ? "#EFF6FF" : hov ? "#F8FAFC" : "transparent",
        border: active ? "1px solid #BFDBFE" : "1px solid transparent",
        color: active ? "#2563EB" : hov ? "#1A1D23" : "#6B7280",
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
            background: "#2563EB",
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
    </div>
  );
}

/* ── TYPE META ── */
const TYPE_META = {
  BOOKING_APPROVED: {
    color: "#2563EB",
    label: "Booking",
    filterKey: "BOOKING",
  },
  BOOKING_REJECTED: {
    color: "#DC2626",
    label: "Booking",
    filterKey: "BOOKING",
  },
  BOOKING_CANCELLED: {
    color: "#64748B",
    label: "Booking",
    filterKey: "BOOKING",
  },
  TICKET_STATUS_CHANGED: {
    color: "#D97706",
    label: "Ticket",
    filterKey: "TICKET",
  },
  TICKET_ASSIGNED: { color: "#D97706", label: "Ticket", filterKey: "TICKET" },
  NEW_COMMENT: { color: "#7C3AED", label: "Comment", filterKey: "COMMENT" },
  GENERAL: { color: "#9CA3AF", label: "General", filterKey: "GENERAL" },
};

function getMeta(type) {
  return (
    TYPE_META[type] || { color: "#9CA3AF", label: "Info", filterKey: "GENERAL" }
  );
}

function mapNotif(n) {
  return {
    id: n.id,
    type: n.type || "GENERAL",
    text: n.title
      ? `${n.title}${n.message ? " — " + n.message : ""}`
      : n.message || "",
    time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "now",
    read: Boolean(n.read),
  };
}

/* ── NotifCard ── */
function NotifCard({ notif, onMarkRead }) {
  const [hov, setHov] = useState(false);
  const meta = getMeta(notif.type);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => !notif.read && onMarkRead && onMarkRead(notif.id)}
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 14px",
        background: notif.read ? "#fff" : hov ? "#DBEAFE" : "#EFF6FF",
        border: `1px solid ${notif.read ? (hov ? "#CBD5E1" : "#E8EBF0") : "#BFDBFE"}`,
        borderRadius: 10,
        marginBottom: 7,
        cursor: notif.read ? "default" : "pointer",
        transition: "all .15s",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: meta.color,
          flexShrink: 0,
          marginTop: 4,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: meta.color,
              textTransform: "uppercase",
              letterSpacing: ".05em",
            }}
          >
            {meta.label}
          </span>
          {!notif.read && (
            <span
              style={{
                fontSize: 9,
                background: meta.color,
                color: "#fff",
                padding: "1px 6px",
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              NEW
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#1A1D23",
            marginBottom: 3,
            lineHeight: 1.5,
          }}
        >
          {notif.text}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{notif.time}</div>
      </div>
      {!notif.read && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#2563EB",
            flexShrink: 0,
            marginTop: 5,
          }}
        />
      )}
    </div>
  );
}

/* ══ MAIN PAGE ══ */
export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loaded, setLoaded] = useState(false);
  const bootstrappedRef = useRef(false);

  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiGet("/notifications/my");
      const list = Array.isArray(res?.notifications) ? res.notifications : [];
      setNotifs(list.map(mapNotif));
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    if (!sessionUser) {
      navigate("/");
      return;
    }
    fetchNotifs();
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const markOneRead = useCallback(async (id) => {
    try {
      await apiPatch(`/notifications/${id}/read`, {});
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      /* silent */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* silent */
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!sessionUser) return null;

  const user = sessionUser;
  const unreadCount = notifs.filter((n) => !n.read).length;

  /* ── filter logic ── */
  const FILTERS = ["ALL", "BOOKING", "TICKET", "COMMENT", "GENERAL", "UNREAD"];

  const filtered = notifs.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    return getMeta(n.type).filterKey === filter;
  });

  const unread = filtered.filter((n) => !n.read);
  const read = filtered.filter((n) => n.read);

  /* ── shared styles ── */
  const filterPillBase = {
    padding: "5px 14px",
    borderRadius: 99,
    fontSize: 11,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all .15s",
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: "#6B7280",
  };
  const filterPillActive = {
    ...filterPillBase,
    background: "#2563EB",
    borderColor: "#2563EB",
    color: "#fff",
  };
  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    letterSpacing: ".07em",
    textTransform: "uppercase",
    margin: "16px 0 10px",
  };

  const NAV = [
    { id: "overview", icon: "⊞", label: "Overview", path: "/dashboard" },
    { id: "bookings", icon: "📅", label: "My Bookings", path: "/dashboard" },
    { id: "tickets", icon: "🔧", label: "My Tickets", path: "/dashboard" },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      badge: unreadCount,
    },
    { id: "profile", icon: "👤", label: "Profile", path: "/dashboard" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
        color: "#1A1D23",
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
          width: 236,
          zIndex: 50,
          background: "#fff",
          borderRight: "1px solid #E8EBF0",
          display: "flex",
          flexDirection: "column",
          padding: "22px 14px",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-.03em",
            cursor: "pointer",
            marginBottom: 28,
            paddingLeft: 4,
            color: "#1A1D23",
          }}
        >
          Smart<span style={{ color: "#2563EB" }}>Campus</span>
        </div>

        <nav
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={item.id === "notifications"}
              badge={item.badge}
              onClick={() => (item.path ? navigate(item.path) : null)}
            />
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #E8EBF0", paddingTop: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#F8FAFC",
              border: "1px solid #E8EBF0",
              marginBottom: 8,
            }}
          >
            <img
              src={
                user.picture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
              }
              alt="avatar"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid #BFDBFE",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1A1D23",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 9,
              cursor: "pointer",
              background: "transparent",
              border: "1px solid #E8EBF0",
              color: "#6B7280",
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 6,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC";
              e.currentTarget.style.color = "#1A1D23";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            🏠 Back to Home
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 9,
              cursor: "pointer",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
          >
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main
        style={{
          marginLeft: 236,
          flex: 1,
          padding: "36px max(28px,3vw)",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-.03em",
                color: "#1A1D23",
                marginBottom: 6,
              }}
            >
              Notifications
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              {loading
                ? "Loading…"
                : unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                padding: "8px 18px",
                borderRadius: 99,
                background: "#fff",
                border: "1px solid #E2E8F0",
                color: "#6B7280",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#94A3B8";
                e.currentTarget.style.color = "#1A1D23";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#6B7280";
              }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <div
              key={f}
              onClick={() => setFilter(f)}
              style={filter === f ? filterPillActive : filterPillBase}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 12,
              fontSize: 12,
              color: "#DC2626",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
            Loading notifications…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
            No notifications found.
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <>
                <div style={sectionLabel}>Unread</div>
                {unread.map((n) => (
                  <NotifCard key={n.id} notif={n} onMarkRead={markOneRead} />
                ))}
              </>
            )}
            {read.length > 0 && (
              <>
                <div style={sectionLabel}>Earlier</div>
                {read.map((n) => (
                  <NotifCard key={n.id} notif={n} onMarkRead={markOneRead} />
                ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
