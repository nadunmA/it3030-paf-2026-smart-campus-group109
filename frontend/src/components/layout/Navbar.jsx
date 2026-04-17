import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Btn from "/src/components/ui/Btn";
import { apiGet, apiPatch } from "../../lib/api";

const getDashboardPath = (role) => {
  const normalizedRole = (role || "USER").toUpperCase();
  if (normalizedRole === "ADMIN") return "/admin/dashboard";
  if (normalizedRole === "TECHNICIAN") return "/technician/dashboard";
  return "/dashboard";
};

const getProfilePath = () => "/profile";

const getPlatformItems = (role) => {
  const normalizedRole = (role || "USER").toUpperCase();
  const dashboardPath = getDashboardPath(normalizedRole);

  return [
    {
      icon: "🏛️",
      color: "#0A84FF",
      title: "Facilities",
      desc: "Browse all bookable resources",
      path: "/resources",
    },
    {
      icon: "📅",
      color: "#30D158",
      title: "Bookings",
      desc:
        normalizedRole === "ADMIN"
          ? "Review booking approvals"
          : "Manage your reservations",
      path: normalizedRole === "ADMIN" ? "/bookings/admin" : "/bookings/me",
    },
    {
      icon: "🔧",
      color: "#FF9F0A",
      title: "Incident Tickets",
      desc:
        normalizedRole === "TECHNICIAN"
          ? "Manage assigned work"
          : "Report and track issues",
      path: dashboardPath,
    },
    {
      icon: "🔔",
      color: "#BF5AF2",
      title: "Notifications",
      desc: "Stay updated instantly",
      path: "/notifications",
    },
    {
      icon: "🔐",
      color: "#FF375F",
      title: "OAuth Login",
      desc: "Secure Google sign-in",
      path: "/",
    },
  ];
};

function PlatformMega({ onClose, userRole }) {
  const navigate = useNavigate();
  const platformItems = getPlatformItems(userRole);

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      style={{
        // Position styles removed as requested
        background: "rgba(14,14,18,.97)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 18,
        padding: 8,
        minWidth: 560,
        zIndex: 300,
        boxShadow: "0 28px 72px rgba(0,0,0,.8)",
        animation: "dropIn .22s ease",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {platformItems.map((item) => (
          <div
            key={item.title}
            onClick={() => handleItemClick(item.path)}
            className="mega-item"
            style={{
              cursor: "pointer",
              display: "flex",
              gap: 12,
              padding: 10,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: `${item.color}22`,
                border: `1px solid ${item.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: ".84rem",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                {item.title}
              </div>
              <div
                style={{ fontSize: ".73rem", color: "rgba(255,255,255,.4)" }}
              >
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: "6px 6px 2px",
          padding: "9px 12px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.3)" }}>
          IT3030 · Smart Campus Hub
        </span>
        <span
          style={{ fontSize: ".72rem", color: "#0A84FF", cursor: "pointer" }}
          onClick={() => {
            onClose();
            navigate("/dashboard", { state: { tab: "notifications" } });
          }}
        >
          View all →
        </span>
      </div>
    </div>
  );
}

function formatRelativeTime(value) {
  if (!value) return "just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour ago`;
  const days = Math.floor(hours / 24);
  return `${days} day ago`;
}

function notifColor(type) {
  switch (type) {
    case "BOOKING_APPROVED":
      return "#30D158";
    case "BOOKING_REJECTED":
      return "#FF375F";
    case "BOOKING_CANCELLED":
      return "#FF9F0A";
    case "NEW_COMMENT":
      return "#BF5AF2";
    default:
      return "#0A84FF";
  }
}

function NotifPanel({ notifications, onMarkAllRead, onViewAll, onNotifClick }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        background: "rgba(18,18,22,.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 16,
        width: 296,
        zIndex: 300,
        boxShadow: "0 20px 56px rgba(0,0,0,.8)",
        animation: "dropIn .2s ease",
      }}
    >
      {/* NotifPanel content */}
      <div
        style={{
          padding: "13px 16px 10px",
          borderBottom: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: ".87rem", fontWeight: 600 }}>
          Notifications
        </span>
        <span
          style={{ fontSize: ".72rem", color: "#0A84FF", cursor: "pointer" }}
          onClick={onMarkAllRead}
        >
          Mark all read
        </span>
      </div>

      <div style={{ maxHeight: 350, overflowY: "auto" }}>
        {notifications.length === 0 && (
          <div
            style={{
              padding: "14px 16px",
              fontSize: ".78rem",
              color: "rgba(255,255,255,.45)",
            }}
          >
            No new notifications.
          </div>
        )}

        {notifications.map((n, i) => (
          <div
            key={n.id || i}
            onClick={() => onNotifClick(n)}
            style={{
              padding: "11px 16px",
              borderBottom:
                i < notifications.length - 1
                  ? "1px solid rgba(255,255,255,.05)"
                  : "none",
              display: "flex",
              gap: 10,
              cursor: "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: notifColor(n.type),
                flexShrink: 0,
                marginTop: 5,
              }}
            />
            <div>
              <div
                style={{ fontSize: ".79rem", color: "#fff", marginBottom: 3 }}
              >
                {n.title || "Notification"}
              </div>
              <div
                style={{ fontSize: ".74rem", color: "rgba(255,255,255,.6)" }}
              >
                {n.message || ""}
              </div>
              <div
                style={{ fontSize: ".71rem", color: "rgba(255,255,255,.35)" }}
              >
                {formatRelativeTime(n.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          textAlign: "center",
        }}
      >
        <span
          style={{ fontSize: ".74rem", color: "#0A84FF", cursor: "pointer" }}
          onClick={onViewAll}
        >
          View all notifications
        </span>
      </div>
    </div>
  );
}

function UserMenu({ onLogout, user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const userRole = (user?.role || "USER").toUpperCase();
  const dashboardPath = getDashboardPath(userRole);
  const profilePath = getProfilePath();

  useEffect(() => {
    if (!user) return;
    let active = true;

    const loadNotifications = async () => {
      try {
        const res = await apiGet("/notifications/my");
        if (!active) return;
        setNotifications(
          Array.isArray(res?.notifications) ? res.notifications : [],
        );
        setUnreadCount(Number(res?.unreadCount || 0));
      } catch (err) {
        console.error("Failed to load navbar notifications", err);
      }
    };

    loadNotifications();
    const intervalId = setInterval(loadNotifications, 30000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [user]);

  const handleNotifClick = () => {
    setNotif(false);
    navigate("/notifications");
  };

  const handleMarkAllRead = async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const handleItemClick = (item) => {
    setOpen(false);

    if (item.path) {
      navigate(item.path);
      return;
    }

    navigate(dashboardPath);
  };

  useEffect(() => {
    const h = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
      if (!notifRef.current?.contains(e.target)) setNotif(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const items = [
    { icon: "🏛️", label: "Browse Facilities", path: "/resources" },
    ...(userRole === "ADMIN"
      ? [
          { icon: "🛡️", label: "Admin Dashboard", path: "/admin/dashboard" },
          {
            icon: "📅",
            label: "Admin Booking Dashboard",
            path: "/bookings/admin",
          },
        ]
      : []),
    ...(userRole === "TECHNICIAN"
      ? [
          {
            icon: "🔧",
            label: "Technician Dashboard",
            path: "/technician/dashboard",
          },
        ]
      : []),
    ...(userRole === "USER"
      ? [
          { icon: "📅", label: "My Bookings", path: "/bookings/me" },
          { icon: "📝", label: "Create Booking", path: "/bookings/create" },
        ]
      : []),
    { icon: "🔧", label: "My Tickets", path: dashboardPath },
    {
      icon: "🔔",
      label: "Notifications",
      path: "/notifications",
      count: unreadCount,
    },
    { icon: "👤", label: "Profile", path: profilePath },
  ];

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "-";
  const displayRole = userRole;
  const initials = (displayName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* Notification Bell & Panel */}
      <div ref={notifRef} style={{ position: "relative" }}>
        <div
          onClick={() => setNotif((o) => !o)}
          style={{ cursor: "pointer", lineHeight: 0, position: "relative" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,.65)"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>

          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -6,
                background: "#FF375F",
                color: "#fff",
                fontSize: ".56rem",
                fontWeight: 700,
                padding: "1px 4px",
                borderRadius: 980,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {notif && (
          <NotifPanel
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onNotifClick={handleNotifClick}
            onViewAll={() => {
              setNotif(false);
              navigate("/notifications");
            }}
          />
        )}
      </div>

      {/* User Menu */}
      <div ref={menuRef} style={{ position: "relative" }}>
        <div
          onClick={() => setOpen((o) => !o)}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#0A84FF,#BF5AF2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: ".72rem",
            fontWeight: 600,
            cursor: "pointer",
            border: "1.5px solid rgba(255,255,255,.22)",
            transition: "transform .2s",
            transform: open ? "scale(1.1)" : "scale(1)",
          }}
        >
          {initials}
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              background: "rgba(18,18,22,.97)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 14,
              padding: 6,
              minWidth: 215,
              zIndex: 300,
              boxShadow: "0 16px 52px rgba(0,0,0,.8)",
              animation: "dropIn .2s ease",
            }}
          >
            {/* User menu content */}
            <div
              style={{
                padding: "10px 12px 9px",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                marginBottom: 4,
              }}
            >
              <div style={{ fontSize: ".85rem", fontWeight: 600 }}>
                {displayName}
              </div>
              <div
                style={{
                  fontSize: ".73rem",
                  color: "rgba(255,255,255,.38)",
                  marginTop: 2,
                }}
              >
                {displayEmail}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 7,
                  background: "rgba(48,209,88,.12)",
                  border: "1px solid rgba(48,209,88,.25)",
                  borderRadius: 980,
                  padding: "2px 9px",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#30D158",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: ".67rem", color: "#30D158" }}>
                  {displayRole}
                </span>
              </div>
            </div>

            {items.map((item) => (
              <div
                key={item.label}
                className="drop-item"
                onClick={() => handleItemClick(item)}
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: ".95rem" }}>{item.icon}</span>{" "}
                {item.label}
                {item.count && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#FF375F",
                      color: "#fff",
                      fontSize: ".62rem",
                      padding: "1px 6px",
                      borderRadius: 980,
                      fontWeight: 700,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            ))}

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,.08)",
                margin: "4px 6px",
              }}
            />

            <div className="drop-item drop-danger" onClick={onLogout}>
              <span style={{ fontSize: ".95rem" }}>🚪</span> Sign out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Navbar({
  scrolled,
  loggedIn,
  user,
  onLogout,
  onLoginOpen,
  activeSection,
  onGoTo,
}) {
  const [megaOpen, setMegaOpen] = useState(false);
  const megaCloseRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(megaCloseRef.current);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 max(28px,5vw)",
        background: scrolled ? "rgba(0,0,0,.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: `1px solid ${
          scrolled ? "rgba(255,255,255,.08)" : "transparent"
        }`,
        transition: "all .4s ease",
      }}
    >
      <div
        onClick={() => onGoTo("hero")}
        style={{
          fontSize: ".96rem",
          fontWeight: 700,
          letterSpacing: "-.02em",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Smart<span style={{ color: "#0A84FF" }}>Campus</span>
      </div>

      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => {
            clearTimeout(megaCloseRef.current);
            setMegaOpen(true);
          }}
          onMouseLeave={() => {
            megaCloseRef.current = setTimeout(() => {
              setMegaOpen(false);
            }, 180);
          }}
        >
          <div
            className="nav-pill"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 11px",
              borderRadius: 8,
              fontSize: ".83rem",
              color: megaOpen ? "#fff" : "rgba(255,255,255,.58)",
              cursor: "pointer",
              transition: "all .2s",
              background: megaOpen ? "rgba(255,255,255,.08)" : "transparent",
            }}
          >
            Platform
          </div>

          {megaOpen && (
            <div
              onMouseEnter={() => clearTimeout(megaCloseRef.current)}
              onMouseLeave={() => {
                megaCloseRef.current = setTimeout(() => {
                  setMegaOpen(false);
                }, 180);
              }}
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 6,
                zIndex: 300,
              }}
            >
              <PlatformMega
                onClose={() => setMegaOpen(false)}
                userRole={user?.role}
              />
            </div>
          )}
        </div>

        {[
          ["About", "stats"],
          ["Features", "features"],
          ["How it works", "howitworks"],
          ["Get started", "cta"],
        ].map(([label, id]) => {
          const isActive = activeSection === id;
          return (
            <div
              key={id}
              onClick={() => onGoTo(id)}
              className="nav-pill"
              style={{
                padding: "5px 11px",
                borderRadius: 8,
                fontSize: ".83rem",
                color: isActive ? "#fff" : "rgba(255,255,255,.58)",
                cursor: "pointer",
                transition: "all .2s",
                background: isActive ? "rgba(255,255,255,.07)" : "transparent",
                position: "relative",
              }}
            >
              {label}
            </div>
          );
        })}

        <div
          onClick={() => onGoTo("bookings")}
          className="nav-pill"
          style={{
            padding: "5px 11px",
            borderRadius: 8,
            fontSize: ".83rem",
            color:
              activeSection === "bookings" ? "#fff" : "rgba(255,255,255,.58)",
            cursor: "pointer",
            transition: "all .2s",
            background:
              activeSection === "bookings"
                ? "rgba(255,255,255,.07)"
                : "transparent",
          }}
        >
          Bookings
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {loggedIn ? (
          <UserMenu onLogout={onLogout} user={user} />
        ) : (
          <Btn variant="primary" size="sm" onClick={onLoginOpen}>
            Log in
          </Btn>
        )}
      </div>
    </nav>
  );
}
