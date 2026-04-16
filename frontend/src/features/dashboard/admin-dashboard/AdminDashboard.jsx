import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../../lib/api";
import HallsTab from "../../admin-dashboard/components/HallsTab";
import UserList from "../../userManagement/UserList";

/* ─────────────────────────────────────────
   SHARED TOKENS
───────────────────────────────────────── */
const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  hint: "#9CA3AF",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  blueBd: "#BFDBFE",
  green: "#059669",
  greenBg: "#ECFDF5",
  greenBd: "#A7F3D0",
  orange: "#D97706",
  orangeBg: "#FFFBEB",
  orangeBd: "#FDE68A",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FECACA",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  purpleBd: "#DDD6FE",
};

/* ─────────────────────────────────────────
   BADGE
───────────────────────────────────────── */
const BADGE_STYLES = {
  APPROVED: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  PENDING: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  REJECTED: { bg: C.redBg, color: C.red, bd: C.redBd },
  CANCELLED: { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" },
  OPEN: { bg: C.blueBg, color: C.blue, bd: C.blueBd },
  IN_PROGRESS: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  RESOLVED: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  CLOSED: { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" },
  HIGH: { bg: C.redBg, color: C.red, bd: C.redBd },
  MEDIUM: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  LOW: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  ACTIVE: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  OUT_OF_SERVICE: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  USER: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  ADMIN: { bg: C.redBg, color: C.red, bd: C.redBd },
  TECHNICIAN: { bg: C.purpleBg, color: C.purple, bd: C.purpleBd },
};

function Badge({ type, children }) {
  const s = BADGE_STYLES[type] || BADGE_STYLES["CANCELLED"];
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
        gap: 9,
        padding: "9px 11px",
        borderRadius: 9,
        cursor: "pointer",
        background: active ? C.blueBg : hov ? "#F8FAFC" : "transparent",
        border: active ? `1px solid ${C.blueBd}` : "1px solid transparent",
        color: active ? C.blue : hov ? C.text : C.muted,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        transition: "all .15s",
      }}
    >
      <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span
          style={{
            background: C.orange,
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
            background: C.blue,
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
  delta,
  deltaColor,
  delay,
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
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
          background: bgColor,
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
          color: C.hint,
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
      {delta && (
        <div
          style={{
            fontSize: 11,
            color: deltaColor || C.muted,
            marginTop: 2,
            fontWeight: 500,
          }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PANEL (card wrapper)
───────────────────────────────────────── */
function Panel({ title, action, onAction, children }) {
  return (
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
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          {title}
        </span>
        {action && (
          <span
            onClick={onAction}
            style={{
              fontSize: 12,
              color: C.blue,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   FILTER PILLS
───────────────────────────────────────── */
function FilterPills({ options, active, onChange, activeColor }) {
  return (
    <div
      style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
    >
      {options.map((o) => {
        const isActive = active === o;
        return (
          <div
            key={o}
            onClick={() => onChange(o)}
            style={{
              padding: "5px 13px",
              borderRadius: 99,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 500,
              transition: "all .15s",
              background: isActive ? activeColor || C.blue : C.surface,
              borderColor: isActive ? activeColor || C.blue : C.border,
              border: `1px solid ${isActive ? activeColor || C.blue : C.border}`,
              color: isActive ? "#fff" : C.muted,
            }}
          >
            {o.replace("_", " ")}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   TABLE
───────────────────────────────────────── */
function Table({ cols, rows }) {
  const [hov, setHov] = useState(null);
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        overflow: "hidden",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#FAFBFC" }}>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.hint,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  padding: "11px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  textAlign: "left",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === i ? "#F8FAFC" : "transparent",
                transition: "background .1s",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "11px 16px",
                    borderBottom:
                      i < rows.length - 1 ? `1px solid #F1F5F9` : "none",
                    color: C.text,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userSearch] = useState("");
  const [userActionError, setUserActionError] = useState("");
  const [userActionBusyId, setUserActionBusyId] = useState("");

  const [bookingFilter, setBookingFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");

  const [activeTab, setActiveTab] = useState("overview");

  const rawUser = sessionStorage.getItem("user") || "null";
  const user = useMemo(() => {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [b, t, r, u, a] = await Promise.allSettled([
          apiGet("/admin/bookings"),
          apiGet("/admin/tickets"),
          apiGet("/admin/resources"),
          apiGet("/admin/users"),
          apiGet("/admin/activity"),
        ]);

        const okValue = (result) =>
          result.status === "fulfilled" ? result.value : [];

        const toList = (x) =>
          Array.isArray(x) ? x : Array.isArray(x?.data) ? x.data : [];

        setBookings(toList(okValue(b)));
        setTickets(toList(okValue(t)));
        setResources(toList(okValue(r)));
        setUsers(toList(okValue(u)));
        setActivity(toList(okValue(a)));

        const failed = [b, t, r, u, a].filter((x) => x.status === "rejected");
        if (failed.length > 0) {
          setLoadError(
            `Some admin data failed to load (${failed.length}/5). Check backend and auth token.`,
          );
          failed.forEach((x) => console.error(x.reason));
        }
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, isAdmin]);

  if (!isAdmin) return null;

  if (loading) {
    return <div style={{ padding: 24 }}>Loading admin data...</div>;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;

  const filteredBookings =
    bookingFilter === "All"
      ? bookings
      : bookings.filter((b) => b.status === bookingFilter);
  const filteredTickets =
    ticketFilter === "All"
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);
  const filteredResources =
    resourceFilter === "All"
      ? resources
      : resources.filter((r) => r.type === resourceFilter);

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const updateUserInState = (userId, patch) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
    );
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setUserActionError("");
      setUserActionBusyId(userId);
      const updated = await apiPatch(`/admin/users/${userId}/role`, { role });
      updateUserInState(userId, {
        role: updated?.role || role,
        active:
          typeof updated?.active === "boolean"
            ? updated.active
            : users.find((u) => u.id === userId)?.active,
      });
    } catch (e) {
      console.error(e);
      setUserActionError("Failed to update user role.");
    } finally {
      setUserActionBusyId("");
    }
  };

  const handleToggleActive = async (targetUser) => {
    try {
      setUserActionError("");
      setUserActionBusyId(targetUser.id);
      const nextActive = !targetUser.active;
      const updated = await apiPatch(`/admin/users/${targetUser.id}/active`, {
        active: nextActive,
      });
      updateUserInState(targetUser.id, {
        active:
          typeof updated?.active === "boolean" ? updated.active : nextActive,
        role: updated?.role || targetUser.role,
      });
    } catch (e) {
      console.error(e);
      setUserActionError("Failed to update user status.");
    } finally {
      setUserActionBusyId("");
    }
  };

  const NAV = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "bookings", icon: "📅", label: "Bookings", badge: pendingBookings },
    { id: "tickets", icon: "🔧", label: "Tickets" },
    { id: "halls", icon: "🏛", label: "Halls" },
    { id: "resources", icon: "📦", label: "Resources" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "activity", icon: "📋", label: "Activity Log" },
  ];

  /* shared style objects */
  const pgTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pgSub = { fontSize: 13, color: C.muted, marginBottom: 24 };
  const btnPrimary = {
    padding: "9px 20px",
    borderRadius: 99,
    background: C.blue,
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  };

  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
        opacity: 1,
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
          width: 220,
          zIndex: 50,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
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
            marginBottom: 2,
          }}
        >
          Smart<span style={{ color: C.blue }}>Campus</span>
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
          Admin Portal
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
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#DC2626,#7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(user.name)}
            </div>
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
                {user.name}
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
                {user.email}
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
              background: C.redBg,
              border: `1px solid ${C.redBd}`,
              color: C.red,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.redBg)}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main
        style={{
          marginLeft: 220,
          flex: 1,
          padding: "28px max(24px,3vw)",
          minHeight: "100vh",
        }}
      >
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 24 }}>
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
                Admin Portal
              </div>
              <div style={pgTitle}>Dashboard Overview</div>
              <Badge type="ADMIN">ADMIN</Badge>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <StatCard
                icon="📅"
                label="Total Bookings"
                value={bookings.length}
                color={C.blue}
                bgColor={C.blueBg}
                delta="↑ updated now"
                deltaColor={C.green}
                delay={80}
              />
              <StatCard
                icon="⏳"
                label="Pending Approvals"
                value={pendingBookings}
                color={C.orange}
                bgColor={C.orangeBg}
                delta="Needs attention"
                deltaColor={C.orange}
                delay={160}
              />
              <StatCard
                icon="🔧"
                label="Open Tickets"
                value={tickets.filter((t) => t.status === "OPEN").length}
                color={C.red}
                bgColor={C.redBg}
                delta="3 high priority"
                deltaColor={C.red}
                delay={240}
              />
              <StatCard
                icon="👥"
                label="Active Users"
                value={users.length}
                color={C.green}
                bgColor={C.greenBg}
                delta="+ new this month"
                delay={320}
              />
            </div>

            {/* Quick actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                {
                  icon: "⏳",
                  label: "Pending Bookings",
                  sub: `${pendingBookings} awaiting review`,
                  bg: C.orangeBg,
                  tab: "bookings",
                },
                {
                  icon: "🚨",
                  label: "High Priority Tickets",
                  sub: "3 critical issues",
                  bg: C.redBg,
                  tab: "tickets",
                },
                {
                  icon: "🏛",
                  label: "Manage Halls",
                  sub: "Facilities & Assets",
                  bg: C.purpleBg,
                  tab: "halls",
                },
                {
                  icon: "📦",
                  label: "Manage Resources",
                  sub: "Equipment & inventory",
                  bg: "#F3E8FF",
                  tab: "resources",
                },
              ].map((q) => (
                <div
                  key={q.tab}
                  onClick={() => setActiveTab(q.tab)}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
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
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: q.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {q.icon}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: C.text }}
                    >
                      {q.label}
                    </div>
                    <div style={{ fontSize: 11, color: C.hint, marginTop: 1 }}>
                      {q.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 16,
              }}
            >
              <Panel
                title="Recent Bookings"
                action="View all →"
                onAction={() => setActiveTab("bookings")}
              >
                {bookings.slice(0, 4).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 9,
                      marginBottom: 4,
                      cursor: "pointer",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F8FAFC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.text,
                          marginBottom: 2,
                        }}
                      >
                        {b.purpose}
                      </div>
                      <div style={{ fontSize: 11, color: C.hint }}>
                        {b.resource} · {b.date}
                      </div>
                    </div>
                    <Badge type={b.status || "PENDING"}>
                      {b.status || "PENDING"}
                    </Badge>
                  </div>
                ))}
              </Panel>
              <Panel
                title="Recent Tickets"
                action="View all →"
                onAction={() => setActiveTab("tickets")}
              >
                {tickets.slice(0, 3).map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 9,
                      marginBottom: 4,
                      cursor: "pointer",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F8FAFC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div style={{ flex: 1 }}>
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
                        {(t.priority || "MEDIUM") +
                          " · " +
                          (t.status || "OPEN").replace("_", " ")}
                      </div>
                    </div>
                    <Badge type={t.priority || "MEDIUM"}>
                      {t.priority || "MEDIUM"}
                    </Badge>
                  </div>
                ))}
              </Panel>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {activeTab === "bookings" && (
          <div>
            <div style={pgTitle}>Booking Management</div>
            <div style={pgSub}>Review, approve or reject booking requests</div>
            {loadError && (
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 12,
                  color: C.red,
                  background: C.redBg,
                  border: `1px solid ${C.redBd}`,
                  borderRadius: 8,
                  padding: "8px 10px",
                }}
              >
                {loadError}
              </div>
            )}
            <FilterPills
              options={["All", "PENDING", "APPROVED", "REJECTED", "CANCELLED"]}
              active={bookingFilter}
              onChange={setBookingFilter}
            />
            <Table
              cols={[
                "User",
                "Resource",
                "Date & Time",
                "Purpose",
                "Status",
                "Action",
              ]}
              rows={filteredBookings.map((b) => [
                b.user,
                b.resource,
                b.date,
                b.purpose,
                <Badge type={b.status}>{b.status}</Badge>,
                b.status === "PENDING" ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      style={{
                        ...btnPrimary,
                        background: C.green,
                        padding: "5px 14px",
                        fontSize: 11,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#047857")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = C.green)
                      }
                    >
                      Approve
                    </button>
                    <button
                      style={{
                        ...btnPrimary,
                        background: C.red,
                        padding: "5px 14px",
                        fontSize: 11,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#B91C1C")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = C.red)
                      }
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: C.hint }}>—</span>
                ),
              ])}
            />
          </div>
        )}

        {/* ── TICKETS ── */}
        {activeTab === "tickets" && (
          <div>
            <div style={pgTitle}>Incident Tickets</div>
            <div style={pgSub}>
              Assign technicians and manage issue resolution
            </div>
            <FilterPills
              options={["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]}
              active={ticketFilter}
              onChange={setTicketFilter}
              activeColor={C.orange}
            />
            <Table
              cols={[
                "Title",
                "Reporter",
                "Priority",
                "Status",
                "Assigned To",
                "Updated",
              ]}
              rows={filteredTickets.map((t) => [
                <span style={{ fontWeight: 600 }}>{t.title}</span>,
                t.reporter,
                <Badge type={t.priority || "MEDIUM"}>
                  {t.priority || "MEDIUM"}
                </Badge>,
                <Badge type={t.status || "OPEN"}>
                  {(t.status || "OPEN").replace("_", " ")}
                </Badge>,
                t.assigned || (
                  <span style={{ fontSize: 12, color: C.hint }}>
                    Unassigned
                  </span>
                ),
                <span style={{ fontSize: 12, color: C.hint }}>
                  {t.updated}
                </span>,
              ])}
            />
          </div>
        )}

        {/* ── HALLS ── */}
        {activeTab === "halls" && <HallsTab />}

        {/* ── RESOURCES ── */}
        {activeTab === "resources" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <div style={pgTitle}>Resource Catalogue</div>
              <button
                style={btnPrimary}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = C.blue)
                }
              >
                + Add Resource
              </button>
            </div>
            <div style={{ ...pgSub }}>
              Manage facilities, labs, rooms and equipment
            </div>
            <FilterPills
              options={["All", "Room", "Lab", "Equipment", "Hall"]}
              active={resourceFilter}
              onChange={setResourceFilter}
            />
            <Table
              cols={[
                "Name",
                "Type",
                "Location",
                "Capacity",
                "Status",
                "Action",
              ]}
              rows={filteredResources.map((r) => [
                <span style={{ fontWeight: 600 }}>{r.name}</span>,
                r.type,
                r.location,
                r.capacity,
                <Badge type={r.status || "ACTIVE"}>
                  {(r.status || "ACTIVE").replace("_", " ")}
                </Badge>,
                <span
                  style={{
                    fontSize: 12,
                    color: C.blue,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Edit
                </span>,
              ])}
            />
          </div>
        )}

        {/* ── USER ── */}

        {activeTab === "users" && (
          <UserList
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            onToggleActive={handleToggleActive}
            busyId={userActionBusyId}
            error={userActionError}
          />
        )}

        {/* ── ACTIVITY LOG ── */}
        {activeTab === "activity" && (
          <div>
            <div style={pgTitle}>Activity Log</div>
            <div style={pgSub}>Full audit trail of all system events</div>
            {loadError && (
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 12,
                  color: C.red,
                  background: C.redBg,
                  border: `1px solid ${C.redBd}`,
                  borderRadius: 8,
                  padding: "8px 10px",
                }}
              >
                {loadError}
              </div>
            )}
            {activity.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  marginBottom: 7,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: a.color || C.blue,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, fontSize: 13, color: C.text }}>
                  {a.text || "Activity entry"}
                </span>
                <span style={{ fontSize: 11, color: C.hint, flexShrink: 0 }}>
                  {a.time || "now"}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
