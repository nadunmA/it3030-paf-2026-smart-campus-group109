import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../../lib/api";

/* Badge */
function Badge({ type, children }) {
  const styles = {
    APPROVED: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    PENDING: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    REJECTED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    CANCELLED: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
    OPEN: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    IN_PROGRESS: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    RESOLVED: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    CLOSED: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
    HIGH: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    MEDIUM: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    LOW: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    USER: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    ADMIN: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    TECHNICIAN: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    AVAILABLE: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    UNAVAILABLE: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    MAINTENANCE: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };
  const s = styles[type] || styles["CANCELLED"];
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
        letterSpacing: ".01em",
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

/* StatCard */
function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8EBF0",
        borderRadius: 14,
        padding: "18px 20px",

        transition: "opacity .5s ease, transform .5s ease",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: ".07em",
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-.03em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* NavItem */
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
      {active && !badge && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#2563EB",
          }}
        />
      )}
    </div>
  );
}

/* BookingCard */
function BookingCard({ title, resource, date, status }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        marginBottom: 8,
        cursor: "pointer",
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1A1D23",
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
          {resource} · {date}
        </div>
      </div>
      <Badge type={status}>{status}</Badge>
    </div>
  );
}

/* TicketCard */
function TicketCard({ title, priority, status, updated }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "13px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        marginBottom: 8,
        cursor: "pointer",
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1D23" }}>
          {title}
        </div>
        <Badge type={priority}>{priority}</Badge>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Badge type={status}>{status.replace("_", " ")}</Badge>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
          Updated {updated}
        </span>
      </div>
    </div>
  );
}

/* FacilityCard */
function FacilityCard({ name, type, location, capacity, availability }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1D23" }}>
          {name}
        </div>
        <Badge type={availability}>{availability || "UNKNOWN"}</Badge>
      </div>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
        {type || "Facility"}
      </div>
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
        {location || "Unknown location"} · Capacity {capacity ?? "N/A"}
      </div>
    </div>
  );
}

/* NotifCard */

function NotifCard({ notif, onMarkRead }) {
  const [hov, setHov] = useState(false);

  const TYPE_META = {
    BOOKING_APPROVED: { color: "#2563EB", label: "Booking" },
    BOOKING_REJECTED: { color: "#DC2626", label: "Booking" },
    BOOKING_CANCELLED: { color: "#64748B", label: "Booking" },
    TICKET_STATUS_CHANGED: { color: "#D97706", label: "Ticket" },
    TICKET_ASSIGNED: { color: "#D97706", label: "Ticket" },
    NEW_COMMENT: { color: "#7C3AED", label: "Comment" },
    GENERAL: { color: "#9CA3AF", label: "General" },
    // legacy short names (if stored that way)
    booking: { color: "#2563EB", label: "Booking" },
    ticket: { color: "#D97706", label: "Ticket" },
    comment: { color: "#7C3AED", label: "Comment" },
  };

  const meta = TYPE_META[notif.type] || { color: "#9CA3AF", label: "Info" };

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

/* MOCK DATA */
const MOCK_BOOKINGS = [
  {
    title: "Project Meeting",
    resource: "Meeting Room A3",
    date: "Apr 15, 10:00 AM",
    status: "APPROVED",
  },
  {
    title: "Lab Session",
    resource: "Computer Lab B204",
    date: "Apr 16, 2:00 PM",
    status: "PENDING",
  },
  {
    title: "Lecture Hall Booking",
    resource: "Hall LH-01",
    date: "Apr 12, 9:00 AM",
    status: "REJECTED",
  },
  {
    title: "Equipment: Projector",
    resource: "Projector #P04",
    date: "Apr 18, 11:00 AM",
    status: "APPROVED",
  },
];
const MOCK_TICKETS = [
  {
    title: "AC not working in Lab B204",
    priority: "HIGH",
    status: "IN_PROGRESS",
    updated: "2 hrs ago",
  },
  {
    title: "Projector display issue in LH-01",
    priority: "MEDIUM",
    status: "OPEN",
    updated: "1 day ago",
  },
  {
    title: "Door lock broken - Room 304",
    priority: "HIGH",
    status: "RESOLVED",
    updated: "3 days ago",
  },
];

/* notification type mapper */
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

/* MAIN DASHBOARD */
export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "overview");
  const [, setLoaded] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [notifsError, setNotifsError] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [notificationFilter, setNotificationFilter] = useState("ALL");
  const [hallFilter, setHallFilter] = useState("ALL");
  const [liveUser, setLiveUser] = useState(null);
  const [halls, setHalls] = useState([]);
  const [hallsLoading, setHallsLoading] = useState(false);
  const [hallsError, setHallsError] = useState("");
  const sessionUser = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      setHallsLoading(true);
      setHallsError("");
      const res = await apiGet("/resources");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
          ? res.content
          : [];
      setHalls(list);
    } catch (e) {
      console.error("Failed to load facilities", e);
      setHallsError(
        "Facilities are unavailable for this account or could not be loaded.",
      );
      setHalls([]);
    } finally {
      setHallsLoading(false);
    }
  }, []);

  /* ── fetch notifications (reusable) ── */
  const fetchNotifs = useCallback(async () => {
    try {
      setNotifsLoading(true);
      setNotifsError("");
      const res = await apiGet("/notifications/my");
      const list = Array.isArray(res?.notifications) ? res.notifications : [];
      setNotifs(list.map(mapNotif));
    } catch (e) {
      console.error("Failed to load notifications", e);
      setNotifsError("Failed to load notifications.");
    } finally {
      setNotifsLoading(false);
    }
  }, []);

  /* ── on mount: fetch profile + notifications ── */
  useEffect(() => {
    if (!sessionUser) {
      navigate("/");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          const u = data?.user || data;
          if (u?.name || u?.email) {
            setLiveUser(u);
            sessionStorage.setItem("user", JSON.stringify(u));
          }
        })
        .catch(() => {});
    }

    // load notifications
    fetchNotifs();
    setTimeout(() => setLoaded(true), 100);
  }, [sessionUser, navigate, fetchNotifs]);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === "resources" && halls.length === 0 && !hallsLoading) {
      fetchResources();
    }
  }, [activeTab, halls.length, hallsLoading, fetchResources]);

  /* single notification mark-as-read */
  const markOneRead = useCallback(async (id) => {
    try {
      await apiPatch(`/notifications/${id}/read`, {});
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  }, []);

  /* mark all read */
  const markAllRead = useCallback(async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!sessionUser) return null;

  const user = liveUser || sessionUser || {};
  const unreadCount = notifs.filter((n) => !n.read).length;
  const notificationFilters = [
    "ALL",
    "BOOKING",
    "TICKET",
    "COMMENT",
    "GENERAL",
    "UNREAD",
  ];
  const filteredNotifications = notifs.filter((n) => {
    if (notificationFilter === "ALL") return true;
    if (notificationFilter === "UNREAD") return !n.read;
    return (n.type || "GENERAL") === notificationFilter;
  });
  const unreadNotifications = filteredNotifications.filter((n) => !n.read);
  const readNotifications = filteredNotifications.filter((n) => n.read);

  const filteredBookings =
    bookingFilter === "All"
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === bookingFilter);
  const filteredTickets =
    ticketFilter === "All"
      ? MOCK_TICKETS
      : MOCK_TICKETS.filter((t) => t.status === ticketFilter);
  const filteredHalls = halls.filter((h) => {
    if (hallFilter === "ALL") return true;
    return (h.availability || "").toUpperCase() === hallFilter;
  });

  const NAV = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "bookings", icon: "📅", label: "My Bookings" },
    { id: "resources", icon: "🏛", label: "Resources" },
    { id: "tickets", icon: "🔧", label: "My Tickets" },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      badge: unreadCount > 0 ? unreadCount : 0,
    },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

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
  const pageTitle = {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-.03em",
    color: "#1A1D23",
    marginBottom: 6,
  };
  const pageSub = { fontSize: 13, color: "#6B7280", marginBottom: 24 };
  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    letterSpacing: ".07em",
    textTransform: "uppercase",
    margin: "16px 0 10px",
  };
  const btnPrimary = {
    padding: "10px 22px",
    borderRadius: 99,
    background: "#2563EB",
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 16,
    transition: "all .15s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
        color: "#1A1D23",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}
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
              active={activeTab === item.id}
              badge={item.badge}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  setActiveTab(item.id);
                }
              }}
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
              transition: "all .15s",
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
            <span>🏠</span> Back to Home
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
              transition: "all .15s",
              fontFamily: "inherit",
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
          marginLeft: 236,
          flex: 1,
          padding: "36px max(28px,3vw)",
          minHeight: "100vh",
        }}
      >
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 30 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                Welcome back
              </p>
              <h1
                style={{
                  fontSize: "clamp(1.5rem,3vw,2rem)",
                  fontWeight: 800,
                  letterSpacing: "-.04em",
                  margin: "0 0 10px",
                  color: "#1A1D23",
                }}
              >
                {user.name?.split(" ")[0]} 👋
              </h1>
              <Badge type={user.role || "USER"}>{user.role || "USER"}</Badge>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <StatCard
                icon="📅"
                label="Active Bookings"
                value="2"
                color="#2563EB"
                bgColor="#EFF6FF"
                delay={80}
              />
              <StatCard
                icon="🔧"
                label="Open Tickets"
                value="2"
                color="#D97706"
                bgColor="#FFFBEB"
                delay={160}
              />
              <StatCard
                icon="🔔"
                label="Unread Notifs"
                value={unreadCount}
                color="#7C3AED"
                bgColor="#F5F3FF"
                delay={240}
              />
              <StatCard
                icon="✅"
                label="Resolved"
                value="1"
                color="#059669"
                bgColor="#ECFDF5"
                delay={320}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}
                  >
                    Recent Bookings
                  </span>
                  <span
                    onClick={() => setActiveTab("bookings")}
                    style={{
                      fontSize: 12,
                      color: "#2563EB",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View all →
                  </span>
                </div>
                {MOCK_BOOKINGS.slice(0, 3).map((b, i) => (
                  <BookingCard key={i} {...b} />
                ))}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}
                  >
                    Recent Notifications
                  </span>
                  <span
                    onClick={() => setActiveTab("notifications")}
                    style={{
                      fontSize: 12,
                      color: "#2563EB",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View all →
                  </span>
                </div>
                {notifsLoading ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                      padding: "12px 0",
                    }}
                  >
                    Loading…
                  </div>
                ) : notifs.length === 0 ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                      padding: "12px 0",
                    }}
                  >
                    No notifications yet.
                  </div>
                ) : (
                  notifs
                    .slice(0, 3)
                    .map((n, i) => (
                      <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            <div style={pageTitle}>My Bookings</div>
            <div style={pageSub}>
              Manage your facility and equipment bookings
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {["All", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map(
                (f) => (
                  <div
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    style={
                      bookingFilter === f ? filterPillActive : filterPillBase
                    }
                  >
                    {f}
                  </div>
                ),
              )}
            </div>
            {filteredBookings.length === 0 ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                No bookings found.
              </div>
            ) : (
              filteredBookings.map((b, i) => <BookingCard key={i} {...b} />)
            )}
            <button
              style={btnPrimary}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1D4ED8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#2563EB")
              }
            >
              + New Booking
            </button>
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                gap: 12,
              }}
            >
              <div>
                <div style={pageTitle}>Resources & Facilities</div>
                <div style={pageSub}>
                  Browse available resources, labs, and campus facilities
                </div>
              </div>
              <button
                onClick={fetchResources}
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
                  transition: "all .15s",
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
                Refresh
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {["ALL", "AVAILABLE", "MAINTENANCE", "UNAVAILABLE"].map((f) => (
                <div
                  key={f}
                  onClick={() => setHallFilter(f)}
                  style={hallFilter === f ? filterPillActive : filterPillBase}
                >
                  {f === "ALL" ? "All" : f}
                </div>
              ))}
            </div>

            {hallsError && (
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
                {hallsError}
              </div>
            )}

            {hallsLoading ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                Loading facilities...
              </div>
            ) : filteredHalls.length === 0 ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                No facilities found.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 10,
                }}
              >
                {filteredHalls.map((h) => (
                  <FacilityCard
                    key={h.id}
                    name={h.name}
                    type={h.resourceTypeName}
                    location={h.location}
                    capacity={h.capacity}
                    availability={h.availability}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TICKETS */}
        {activeTab === "tickets" && (
          <div>
            <div style={pageTitle}>Incident Tickets</div>
            <div style={pageSub}>Report and track maintenance issues</div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 18,
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
                          background: "#D97706",
                          borderColor: "#D97706",
                          color: "#fff",
                        }
                      : filterPillBase
                  }
                >
                  {f.replace("_", " ")}
                </div>
              ))}
            </div>
            {filteredTickets.length === 0 ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                No tickets found.
              </div>
            ) : (
              filteredTickets.map((t, i) => <TicketCard key={i} {...t} />)
            )}
            <button
              style={{ ...btnPrimary, background: "#D97706" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#B45309")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#D97706")
              }
            >
              + Report New Issue
            </button>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <div style={pageTitle}>Notifications</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {notifsLoading
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
                    transition: "all .15s",
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

            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {notificationFilters.map((f) => (
                <div
                  key={f}
                  onClick={() => setNotificationFilter(f)}
                  style={
                    notificationFilter === f ? filterPillActive : filterPillBase
                  }
                >
                  {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                </div>
              ))}
            </div>

            {notifsError && (
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
                {notifsError}
              </div>
            )}

            {notifsLoading ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                Loading notifications…
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div
                style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}
              >
                No notifications yet.
              </div>
            ) : (
              <>
                {unreadNotifications.length > 0 && (
                  <>
                    <div style={sectionLabel}>Unread</div>
                    {unreadNotifications.map((n, i) => (
                      <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
                    ))}
                  </>
                )}
                {readNotifications.length > 0 && (
                  <>
                    <div style={sectionLabel}>Earlier</div>
                    {readNotifications.map((n, i) => (
                      <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
            }}
          >
            <div style={{ width: "100%", maxWidth: 740, marginBottom: 24 }}>
              <div style={pageTitle}>Profile</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                Your account details and activity summary
              </div>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 740,
                background: "#fff",
                border: "1px solid #E8EBF0",
                borderRadius: 20,
                padding: "28px 32px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 28,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    user.picture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                  }
                  alt="avatar"
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    border: "4px solid #BFDBFE",
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
                    color: "#1A1D23",
                    letterSpacing: "-.03em",
                    marginBottom: 3,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}
                >
                  {user.email}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge type={user.role || "USER"}>
                    {user.role || "USER"}
                  </Badge>
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
                maxWidth: 740,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              {[
                { label: "Full Name", value: user.name, icon: "👤" },
                { label: "Email", value: user.email, icon: "✉️" },
                { label: "Role", value: user.role || "USER", icon: "🔑" },
                { label: "Auth Method", value: "Google OAuth 2.0", icon: "🔒" },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    background: "#fff",
                    border: "1px solid #E8EBF0",
                    borderRadius: 13,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#F8FAFC",
                      border: "1px solid #E8EBF0",
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
                        color: "#9CA3AF",
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
                        color: "#1A1D23",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 740,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                {
                  label: "Total Bookings",
                  value: "4",
                  color: "#2563EB",
                  bg: "#EFF6FF",
                },
                {
                  label: "Open Tickets",
                  value: "2",
                  color: "#D97706",
                  bg: "#FFFBEB",
                },
                {
                  label: "Resolved",
                  value: "1",
                  color: "#059669",
                  bg: "#ECFDF5",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#fff",
                    border: "1px solid #E8EBF0",
                    borderRadius: 13,
                    padding: "18px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
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
                      color: "#9CA3AF",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", maxWidth: 740 }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 24,
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
    </div>
  );
}
