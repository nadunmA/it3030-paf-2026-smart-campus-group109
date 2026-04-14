import { useState, useRef, useEffect } from "react";
import Btn from "/src/components/ui/Btn";
import { useNavigate } from "react-router-dom";

const PLATFORM_ITEMS = [
  {
    icon: "🏛️",
    color: "#0A84FF",
    title: "Facilities",
    desc: "Browse all bookable resources",
  },
  {
    icon: "📅",
    color: "#30D158",
    title: "Bookings",
    desc: "Manage your reservations",
  },
  {
    icon: "🔧",
    color: "#FF9F0A",
    title: "Incident Tickets",
    desc: "Report and track issues",
  },
  {
    icon: "🔔",
    color: "#BF5AF2",
    title: "Notifications",
    desc: "Stay updated instantly",
  },
  {
    icon: "🔐",
    color: "#FF375F",
    title: "OAuth Login",
    desc: "Secure Google sign-in",
  },
  {
    icon: "📊",
    color: "#64D2FF",
    title: "Admin Dashboard",
    desc: "Full campus oversight",
  },
];

function PlatformMega({ onClose }) {
  return (
    <div
      onMouseLeave={onClose}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
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
        {PLATFORM_ITEMS.map((item) => (
          <a key={item.title} href="#" className="mega-item">
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
          </a>
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
        >
          View all →
        </span>
      </div>
    </div>
  );
}

function NotifPanel({ onClose }) {
  const notifs = [
    { dot: "#0A84FF", text: "Booking Lab B204 approved ✅", time: "2 min ago" },
    {
      dot: "#FF9F0A",
      text: "Ticket #TK-042 is In Progress",
      time: "1 hour ago",
    },
    {
      dot: "#FF375F",
      text: "Booking Meeting Room 3 rejected",
      time: "Yesterday",
    },
  ];

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
          onClick={onClose}
        >
          Mark all read
        </span>
      </div>

      {notifs.map((n, i) => (
        <div
          key={i}
          style={{
            padding: "11px 16px",
            borderBottom:
              i < notifs.length - 1
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
              background: n.dot,
              flexShrink: 0,
              marginTop: 5,
            }}
          />
          <div>
            <div style={{ fontSize: ".79rem", color: "#fff", marginBottom: 3 }}>
              {n.text}
            </div>
            <div style={{ fontSize: ".71rem", color: "rgba(255,255,255,.35)" }}>
              {n.time}
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          textAlign: "center",
        }}
      >
        <span
          style={{ fontSize: ".74rem", color: "#0A84FF", cursor: "pointer" }}
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
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const handleItemClick = (item) => {
    setOpen(false);

    if (item.label === "Profile") {
      if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else if (item.label === "Notifications") {
      navigate("/notifications");
    } else if (item.label === "Settings") {
      navigate("/settings");
    }
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
    { icon: "🏛️", label: "Browse Facilities" },
    { icon: "📅", label: "My Bookings", sub: "2 pending" },
    { icon: "🔧", label: "My Tickets" },
    { icon: "🔔", label: "Notifications", count: 3 },
    { icon: "👤", label: "Profile", path: "/dashboard" },
    { icon: "⚙️", label: "Settings" },
  ];

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "-";
  const displayRole = user?.role || "USER";
  const initials = (displayName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* Notifications Icon */}
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
            3
          </span>
        </div>
        {notif && <NotifPanel onClose={() => setNotif(false)} />}
      </div>

      {/* User Profile Avatar & Dropdown */}
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
            {/* User Info Section */}
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

            {/* Menu Items */}
            {items.map((item) => (
              <div
                key={item.label}
                className="drop-item"
                onClick={() => handleItemClick(item)}
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: ".95rem" }}>{item.icon}</span>
                {item.label}
                {item.sub && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: ".7rem",
                      color: "rgba(255,255,255,.3)",
                    }}
                  >
                    {item.sub}
                  </span>
                )}
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
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,.08)" : "transparent"}`,
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
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div
            onMouseEnter={() => setMegaOpen(true)}
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
          {megaOpen && <PlatformMega onClose={() => setMegaOpen(false)} />}
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
