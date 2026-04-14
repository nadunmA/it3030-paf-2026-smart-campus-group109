import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── Badge ── */
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

/* ── StatCard ── */
function StatCard({ icon, label, value, color, bgColor, delay }) {
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
        padding: "18px 20px",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
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

/* ── BookingCard ── */
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

/* ── TicketCard ── */
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

/* ── NotifCard ── */
function NotifCard({ type, text, time, read }) {
  const dotColors = {
    booking: "#2563EB",
    ticket: "#D97706",
    comment: "#7C3AED",
  };
  const dot = dotColors[type] || "#94A3B8";
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 14px",
        background: read ? "#fff" : "#EFF6FF",
        border: `1px solid ${read ? "#E8EBF0" : "#BFDBFE"}`,
        borderRadius: 10,
        marginBottom: 7,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
          marginTop: 4,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            color: "#1A1D23",
            marginBottom: 3,
            lineHeight: 1.5,
          }}
        >
          {text}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{time}</div>
      </div>
      {!read && (
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

/* ── MOCK DATA ── */
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

const MOCK_NOTIFS = [
  {
    type: "booking",
    text: "Your booking for Meeting Room A3 has been approved ✅",
    time: "2 min ago",
    read: false,
  },
  {
    type: "ticket",
    text: "Ticket #TK-042 status changed to In Progress",
    time: "1 hour ago",
    read: false,
  },
  {
    type: "comment",
    text: "Admin added a comment on your ticket #TK-039",
    time: "3 hours ago",
    read: false,
  },
  {
    type: "booking",
    text: "Your booking for Lecture Hall LH-01 was rejected",
    time: "Yesterday",
    read: true,
  },
  {
    type: "ticket",
    text: "Ticket #TK-038 has been resolved ✅",
    time: "2 days ago",
    read: true,
  },
];

/* ══ MAIN DASHBOARD ══ */
export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [bookingFilter, setBookingFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("All");

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    setTimeout(() => setLoaded(true), 100);
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const filteredBookings =
    bookingFilter === "All"
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === bookingFilter);

  const filteredTickets =
    ticketFilter === "All"
      ? MOCK_TICKETS
      : MOCK_TICKETS.filter((t) => t.status === ticketFilter);

  const NAV = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "bookings", icon: "📅", label: "My Bookings" },
    { id: "tickets", icon: "🔧", label: "My Tickets" },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      badge: unreadCount,
    },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  /* ── shared styles ── */
  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    letterSpacing: ".07em",
    textTransform: "uppercase",
    margin: "16px 0 10px",
  };
  const pageTitle = {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-.03em",
    color: "#1A1D23",
    marginBottom: 6,
  };
  const pageSub = { fontSize: 13, color: "#6B7280", marginBottom: 24 };
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
        {/* Logo */}
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

        {/* Nav */}
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

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E8EBF0", paddingTop: 14 }}>
          {/* User card */}
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

          {/* Back to home */}
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

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 13px",
              borderRadius: 9,
              cursor: "pointer",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 13,
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

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          marginLeft: 236,
          flex: 1,
          padding: "36px max(28px,3vw)",
          minHeight: "100vh",
        }}
      >
        {/* ── OVERVIEW ── */}
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

            {/* Stat cards */}
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

            {/* Recent activity */}
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
                    Notifications
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
                {notifs.slice(0, 3).map((n, i) => (
                  <NotifCard key={i} {...n} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
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

        {/* ── TICKETS ── */}
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

        {/* ── NOTIFICATIONS ── */}
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
                  {unreadCount > 0
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

            {notifs.some((n) => !n.read) && (
              <>
                <div style={sectionLabel}>Unread</div>
                {notifs
                  .filter((n) => !n.read)
                  .map((n, i) => (
                    <NotifCard key={i} {...n} />
                  ))}
              </>
            )}

            <div style={sectionLabel}>Earlier</div>
            {notifs
              .filter((n) => n.read)
              .map((n, i) => (
                <NotifCard key={i} {...n} />
              ))}
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
            {/* Page heading */}
            <div style={{ width: "100%", maxWidth: 740, marginBottom: 24 }}>
              <div style={pageTitle}>Profile</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                Your account details and activity summary
              </div>
            </div>

            {/* Hero card */}
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

            {/* Info grid — 2 columns */}
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

            {/* Activity stats */}
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

            {/* Sign out 
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                onClick={handleLogout}
                style={{
                  display: "inline-block", // 🔥 key change
                  padding: "7px 16px",
                  borderRadius: 999,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: 13,
                  fontWeight: 600,
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
                Log out
              </button>
            </div>*/}
          </div>
        )}
      </main>
    </div>
  );
}
