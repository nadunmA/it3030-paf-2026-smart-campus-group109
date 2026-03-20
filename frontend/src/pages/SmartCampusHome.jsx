import { useState, useEffect, useRef } from "react";
import "../index.css";

/* ─── HOOKS ─── */
function useInView(threshold = 0.13) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".sc-reveal, .sc-reveal-left, .sc-reveal-right, .sc-reveal-scale",
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sc-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* ─── GOOGLE ICON ─── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path
      fill="#4285F4"
      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
    />
    <path
      fill="#34A853"
      d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2c-7.7 0-14.4 4.4-17.7 10.7z"
      opacity=".9"
    />
    <path
      fill="#FBBC05"
      d="M24 46c5.9 0 10.9-2 14.5-5.4l-6.7-5.5C29.8 36.9 27 38 24 38c-6.1 0-11.3-4.1-13.1-9.7l-7.1 5.5C7.4 41.5 15.1 46 24 46z"
      opacity=".9"
    />
    <path
      fill="#EA4335"
      d="M44.5 20H24v8.5h11.8c-.9 2.6-2.6 4.8-4.9 6.4l6.7 5.5C41.8 37.1 45 31 45 24c0-1.3-.2-2.7-.5-4z"
      opacity=".9"
    />
  </svg>
);

/* ─── GOOGLE LOGIN MODAL ─── */
function GoogleLoginModal({ isOpen, onClose }) {
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", h);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.7)",
        backdropFilter: "blur(18px) saturate(160%)",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: 420,
          maxWidth: "92vw",
          borderRadius: 28,
          padding: "52px 44px 44px",
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06) inset",
          animation: "slideUp .3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Glow top */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(10,132,255,.22) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.15)",
            color: "rgba(255,255,255,.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.2)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.1)";
            e.currentTarget.style.color = "rgba(255,255,255,.6)";
          }}
        >
          ✕
        </button>

        {/* Header — no logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2
            style={{
              fontSize: "1.55rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-.03em",
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Sign in to SmartCampus
          </h2>
          <p
            style={{
              fontSize: ".88rem",
              color: "rgba(255,255,255,.5)",
              lineHeight: 1.5,
            }}
          >
            Use your SLIIT Google account to continue
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={() => {
            window.location.href = "/oauth2/authorization/google";
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: hov ? "#f0f0f0" : "#fff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 16,
            padding: "16px 24px",
            fontSize: ".97rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all .2s",
            transform: hov ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hov
              ? "0 12px 32px rgba(0,0,0,.35)"
              : "0 4px 16px rgba(0,0,0,.25)",
            letterSpacing: "-.01em",
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Footer note */}
        <div style={{ marginTop: 28, textAlign: "center" }}>
          <p
            style={{
              fontSize: ".76rem",
              color: "rgba(255,255,255,.3)",
              lineHeight: 1.7,
            }}
          >
            By continuing, you agree to our{" "}
            <span style={{ color: "rgba(100,180,255,.8)", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "rgba(100,180,255,.8)", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(10,132,255,.5),transparent)",
            borderRadius: "0 0 28px 28px",
          }}
        />
      </div>
    </div>
  );
}

/* ─── BTN ─── */
function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
}) {
  const [hov, setHov] = useState(false);
  const sz = { sm: "8px 18px", md: "10px 22px", lg: "14px 34px" }[size];
  const fs = { sm: ".82rem", md: ".87rem", lg: ".97rem" }[size];
  const base = {
    borderRadius: 980,
    padding: sz,
    fontSize: fs,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "-.01em",
    fontFamily: "inherit",
    border: "none",
    transition: "all .25s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transform: hov ? "scale(1.04)" : "scale(1)",
    userSelect: "none",
  };
  const styles = {
    primary: {
      ...base,
      background: hov ? "#0070E0" : "#0A84FF",
      color: "#fff",
    },
    ghost: {
      ...base,
      background: hov ? "rgba(255,255,255,.1)" : "transparent",
      color: "#fff",
      border:
        "1px solid " +
        (hov ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.28)"),
    },
    white: {
      ...base,
      background: hov ? "rgba(255,255,255,.92)" : "#fff",
      color: "#000",
    },
  };
  return (
    <button
      type={type}
      style={styles[variant]}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

/* ─── COUNTER ─── */
function Counter({ target, suffix = "", delay = 0 }) {
  const [ref, visible] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setN(target);
        clearInterval(t);
      } else setN(cur);
    }, 16);
    return () => clearInterval(t);
  }, [visible, target]);
  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 700,
          letterSpacing: "-.035em",
        }}
      >
        {n}
        {suffix}
      </div>
    </div>
  );
}

/* ─── NAV PIECES ─── */
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

function UserMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
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
    { icon: "👤", label: "Profile" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
          AJ
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
            <div
              style={{
                padding: "10px 12px 9px",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                marginBottom: 4,
              }}
            >
              <div style={{ fontSize: ".85rem", fontWeight: 600 }}>
                Ashan Jayawardena
              </div>
              <div
                style={{
                  fontSize: ".73rem",
                  color: "rgba(255,255,255,.38)",
                  marginTop: 2,
                }}
              >
                ashan@sliit.lk
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
                  USER
                </span>
              </div>
            </div>
            {items.map((item) => (
              <div key={item.label} className="drop-item">
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

/* ─── FEATURE CARD ─── */
function FeatureCard({ icon, color, title, desc, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="feat-card"
      style={{
        background: "rgba(255,255,255,.055)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 20,
        padding: "1.6rem",
        backdropFilter: "blur(28px) saturate(180%)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.04) inset",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(44px)",
        transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}s, transform .75s cubic-bezier(.16,1,.3,1) ${delay}s, background .35s, border-color .35s`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          marginBottom: "1rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: ".95rem",
          fontWeight: 600,
          marginBottom: 8,
          letterSpacing: "-.01em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: ".79rem",
          color: "rgba(255,255,255,.42)",
          lineHeight: 1.65,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

/* ─── SOCIAL BTN ─── */
function SocialBtn({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        cursor: "pointer",
        background: hov ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,.5)",
        fontSize: ".74rem",
        transition: "all .2s",
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const SECTION_IDS = ["hero", "stats", "features", "howitworks", "cta"];

export default function SmartCampusHome() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  useScrollReveal();

  useEffect(() => {
    const h = () => {
      const doc = document.documentElement;
      setScrolled(window.scrollY > 24);
      setProgress(
        (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100,
      );
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const features = [
    {
      icon: "🏛️",
      color: "#0A84FF",
      title: "Facilities Catalogue",
      desc: "Browse lecture halls, labs, meeting rooms, and equipment with real-time availability.",
      delay: 0.05,
    },
    {
      icon: "📅",
      color: "#30D158",
      title: "Smart Booking",
      desc: "Instant resource requests with automatic conflict detection and admin approval workflow.",
      delay: 0.1,
    },
    {
      icon: "🔧",
      color: "#FF9F0A",
      title: "Incident Tickets",
      desc: "Report faults with photo evidence. Track technician progress from open to resolved.",
      delay: 0.15,
    },
    {
      icon: "🔔",
      color: "#BF5AF2",
      title: "Live Notifications",
      desc: "Instant alerts for booking approvals, rejections, and all ticket status changes.",
      delay: 0.2,
    },
  ];

  const steps = [
    {
      num: "01",
      icon: "🔐",
      color: "#0A84FF",
      dir: "sc-reveal-left",
      delay: 0.0,
      title: "Sign in",
      desc: "Login with your SLIIT Google account securely via OAuth 2.0",
    },
    {
      num: "02",
      icon: "🏛️",
      color: "#BF5AF2",
      dir: "sc-reveal-left",
      delay: 0.1,
      title: "Browse resources",
      desc: "Find available rooms, labs, or equipment using smart filters",
    },
    {
      num: "03",
      icon: "📅",
      color: "#30D158",
      dir: "sc-reveal-right",
      delay: 0.1,
      title: "Request booking",
      desc: "Submit a booking request. Admin reviews and approves or rejects",
    },
    {
      num: "04",
      icon: "🔔",
      color: "#FF9F0A",
      dir: "sc-reveal-right",
      delay: 0.0,
      title: "Get notified",
      desc: "Receive instant updates on approvals, rejections, and tickets",
    },
  ];

  const ticker = [
    "Facilities Booking",
    "Incident Reporting",
    "Admin Approvals",
    "Real-time Notifications",
    "OAuth 2.0 Login",
    "Role-based Access",
    "Conflict Detection",
    "Technician Tracking",
  ];

  return (
    <>
      <GoogleLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
          position: "relative",
        }}
      >
        {/* Full-page frosted glass overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "rgba(255,255,255,.018)",
            backdropFilter: "blur(0px)",
          }}
        />

        {/* Glass noise texture overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(10,132,255,.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(191,90,242,.06) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 50% 80%, rgba(48,209,88,.04) 0%, transparent 60%)
          `,
          }}
        />

        {/* Scroll progress */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: 2,
            width: `${progress}%`,
            background: "linear-gradient(90deg,#0A84FF,#BF5AF2)",
            zIndex: 201,
            transition: "width .1s linear",
            borderRadius: "0 2px 2px 0",
            pointerEvents: "none",
          }}
        />

        {/* Section dots */}
        <div
          style={{
            position: "fixed",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {SECTION_IDS.map((id) => (
            <div
              key={id}
              onClick={() => go(id)}
              title={id[0].toUpperCase() + id.slice(1)}
              style={{
                width: activeSection === id ? 5 : 3.5,
                height: activeSection === id ? 22 : 3.5,
                borderRadius: 980,
                background:
                  activeSection === id ? "#0A84FF" : "rgba(255,255,255,.22)",
                cursor: "pointer",
                transition: "all .35s ease",
              }}
            />
          ))}
        </div>

        {/* Ambient blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {[
            {
              top: "-20%",
              left: "-5%",
              w: 750,
              c: "rgba(10,132,255,.15)",
              a: "blob1 12s ease-in-out infinite",
            },
            {
              top: "15%",
              right: "-10%",
              w: 650,
              c: "rgba(191,90,242,.12)",
              a: "blob2 15s ease-in-out infinite",
            },
            {
              bottom: "-5%",
              left: "20%",
              w: 600,
              c: "rgba(48,209,88,.09)",
              a: "blob1 19s ease-in-out infinite reverse",
            },
            {
              top: "45%",
              left: "-8%",
              w: 480,
              c: "rgba(255,159,10,.07)",
              a: "blob2 22s ease-in-out infinite",
            },
            {
              top: "60%",
              right: "5%",
              w: 420,
              c: "rgba(10,132,255,.08)",
              a: "blob1 17s ease-in-out infinite reverse",
            },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...b,
                height: b.w,
                borderRadius: "50%",
                background: `radial-gradient(circle,${b.c} 0%,transparent 70%)`,
                animation: b.a,
              }}
            />
          ))}
        </div>

        {/* ══ NAVBAR ══ */}
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
            onClick={() => go("hero")}
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
                  background: megaOpen
                    ? "rgba(255,255,255,.08)"
                    : "transparent",
                }}
              >
                Platform
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{
                    transform: megaOpen ? "rotate(180deg)" : "none",
                    transition: "transform .25s",
                  }}
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
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
                  onClick={() => go(id)}
                  className="nav-pill"
                  style={{
                    padding: "5px 11px",
                    borderRadius: 8,
                    fontSize: ".83rem",
                    color: isActive ? "#fff" : "rgba(255,255,255,.58)",
                    cursor: "pointer",
                    transition: "all .2s",
                    background: isActive
                      ? "rgba(255,255,255,.07)"
                      : "transparent",
                    position: "relative",
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 14,
                        height: 1.5,
                        background: "#0A84FF",
                        borderRadius: 2,
                      }}
                    />
                  )}
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
              <UserMenu onLogout={() => setLoggedIn(false)} />
            ) : (
              <Btn
                variant="primary"
                size="sm"
                onClick={() => setLoginOpen(true)}
              >
                Log in
              </Btn>
            )}
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section
          id="hero"
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "130px max(28px,8vw) 80px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(10,132,255,.15)",
              border: "1px solid rgba(10,132,255,.35)",
              borderRadius: 980,
              padding: "5px 15px",
              marginBottom: 28,
              fontSize: ".74rem",
              color: "rgba(255,255,255,.8)",
              letterSpacing: ".04em",
              animation: "fadeUp .8s ease .1s both",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0A84FF",
                animation: "pulse 2s infinite",
                display: "inline-block",
              }}
            />
            Now in production — IT3030 · Semester 1, 2026
          </div>

          <h1
            style={{
              fontSize: "clamp(2.8rem,7vw,5.5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-.04em",
              margin: "0 0 22px",
              maxWidth: 820,
              animation: "fadeUp .8s ease .2s both",
            }}
          >
            The smarter way to <span className="shimmer-text">run campus</span>{" "}
            operations.
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,.55)",
              maxWidth: 500,
              margin: "0 auto 40px",
              lineHeight: 1.65,
              animation: "fadeUp .8s ease .35s both",
            }}
          >
            Book resources, report incidents, and manage your university's
            facilities — all from one beautifully unified platform.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fadeUp .8s ease .5s both",
            }}
          >
            <Btn variant="primary" size="lg" onClick={() => setLoginOpen(true)}>
              Get started free
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => go("features")}>
              Learn more
            </Btn>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 44,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "fadeUp .8s ease .68s both",
            }}
          >
            {[
              "No double-bookings",
              "Role-based access",
              "Real-time notifications",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 980,
                  padding: "7px 16px",
                  fontSize: ".77rem",
                  color: "rgba(255,255,255,.7)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ color: "#30D158" }}>✓</span>
                {t}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 34,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,.18)",
              fontSize: ".65rem",
              letterSpacing: ".13em",
              animation: "fadeUp 1s ease 1.3s both",
            }}
          >
            <div
              style={{
                width: 1,
                height: 36,
                background:
                  "linear-gradient(to bottom,rgba(255,255,255,.18),transparent)",
              }}
            />
            SCROLL
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            padding: "18px 0",
            borderTop: "1px solid rgba(255,255,255,.06)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            background: "rgba(255,255,255,.02)",
          }}
        >
          <div className="ticker-track">
            {[...ticker, ...ticker].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 28px",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#0A84FF",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: ".82rem",
                    color: "rgba(255,255,255,.38)",
                    letterSpacing: ".04em",
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ STATS ══ */}
        <section
          id="stats"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "60px max(28px,8vw)",
          }}
        >
          <div
            className="sc-reveal"
            style={{
              background: "rgba(255,255,255,.055)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 24,
              padding: "44px 32px",
              backdropFilter: "blur(28px) saturate(180%)",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 20,
              boxShadow:
                "0 8px 40px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.04) inset",
            }}
          >
            {[
              {
                target: 200,
                suffix: "+",
                label: "Bookable resources",
                delay: 0,
              },
              { target: 1500, suffix: "+", label: "Active users", delay: 0.1 },
              {
                target: 98,
                suffix: "%",
                label: "Uptime guarantee",
                delay: 0.2,
              },
              { target: 5, suffix: "", label: "Core modules", delay: 0.3 },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <Counter {...s} />
                <div
                  style={{
                    fontSize: ".8rem",
                    color: "rgba(255,255,255,.4)",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section
          id="features"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 max(28px,8vw) 80px",
          }}
        >
          <div
            className="sc-reveal"
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <p
              style={{
                fontSize: ".72rem",
                color: "#0A84FF",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Platform features
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem,4vw,2.9rem)",
                fontWeight: 700,
                letterSpacing: "-.03em",
                lineHeight: 1.1,
              }}
            >
              Everything your campus needs.
              <br />
              <span style={{ color: "rgba(255,255,255,.28)" }}>
                In one place.
              </span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
              gap: 16,
            }}
          >
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section
          id="howitworks"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 max(28px,8vw) 80px",
          }}
        >
          <div
            className="sc-reveal"
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <p
              style={{
                fontSize: ".72rem",
                color: "#BF5AF2",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Workflow
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem,4vw,2.9rem)",
                fontWeight: 700,
                letterSpacing: "-.03em",
                lineHeight: 1.1,
              }}
            >
              How it works
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 12,
            }}
          >
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`step-card ${s.dir}`}
                style={{
                  background: "rgba(255,255,255,.055)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 20,
                  padding: "2rem 1.6rem",
                  textAlign: "center",
                  transitionDelay: `${s.delay}s`,
                  backdropFilter: "blur(28px) saturate(180%)",
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.04) inset",
                }}
              >
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: `${s.color}50`,
                    marginBottom: 10,
                    letterSpacing: "-.02em",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: 14,
                    display: "inline-block",
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.45}s`,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: ".9rem",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: ".78rem",
                    color: "rgba(255,255,255,.4)",
                    lineHeight: 1.62,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section
          id="cta"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 max(28px,8vw) 80px",
          }}
        >
          <div
            className="sc-reveal-scale"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 32,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,rgba(10,132,255,.18) 0%,rgba(191,90,242,.12) 50%,rgba(48,209,88,.08) 100%)",
                borderRadius: 32,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 32,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "15%",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(10,132,255,.25) 0%,transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-20%",
                right: "10%",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(191,90,242,.18) 0%,transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: "80px max(40px,8%)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 40,
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: ".75rem",
                    color: "rgba(255,255,255,.5)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  Ready to get started?
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.6rem,4vw,2.5rem)",
                    fontWeight: 700,
                    letterSpacing: "-.03em",
                    lineHeight: 1.12,
                    margin: "0 0 16px",
                  }}
                >
                  Modernise your campus operations today.
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,.45)",
                    fontSize: ".94rem",
                    lineHeight: 1.65,
                    maxWidth: 420,
                    margin: 0,
                  }}
                >
                  Thousands of students and staff already use SmartCampus to
                  streamline bookings, reporting, and campus management.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                <Btn
                  variant="white"
                  size="lg"
                  onClick={() => {
                    window.location.href = "/oauth2/authorization/google";
                  }}
                >
                  <GoogleIcon />
                  Sign in with Google
                </Btn>
                <Btn variant="ghost" size="lg" onClick={() => go("features")}>
                  Explore features
                </Btn>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,.07)",
            padding: "56px max(28px,8vw) 36px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 40,
              marginBottom: 48,
            }}
          >
            <div className="sc-reveal-left">
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                  marginBottom: 12,
                }}
              >
                Smart<span style={{ color: "#0A84FF" }}>Campus</span>
              </div>
              <p
                style={{
                  fontSize: ".79rem",
                  color: "rgba(255,255,255,.33)",
                  lineHeight: 1.72,
                  maxWidth: 240,
                  marginBottom: 20,
                }}
              >
                A unified operations platform for modern universities. Built for
                IT3030 — PAF Assignment 2026, Faculty of Computing, SLIIT.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {["GH", "SW"].map((s) => (
                  <SocialBtn key={s}>{s}</SocialBtn>
                ))}
              </div>
            </div>
            {[
              {
                head: "Platform",
                links: [
                  "Facilities",
                  "Bookings",
                  "Tickets",
                  "Notifications",
                  "Dashboard",
                ],
              },
              {
                head: "Resources",
                links: [
                  "API Docs",
                  "GitHub Repo",
                  "Postman Collection",
                  "Architecture",
                  "Changelog",
                ],
              },
              {
                head: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Use",
                  "Cookie Policy",
                  "Academic Integrity",
                ],
              },
            ].map((col, i) => (
              <div
                key={col.head}
                className="sc-reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  style={{
                    fontSize: ".72rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,.42)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {col.head}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {col.links.map((l) => (
                    <a key={l} href="#" className="foot-link">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.06)",
              paddingTop: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.2)" }}>
              © 2026 SmartCampus · IT3030 PAF Assignment · Faculty of Computing,
              SLIIT
            </span>
            <span
              style={{ fontSize: ".72rem", color: "rgba(255,255,255,.16)" }}
            >
              Built with Spring Boot + React
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
