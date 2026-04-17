import { useEffect, useState } from "react";

export const C = {
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

const BADGE_MAP = {
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

export function Badge({ type, children }) {
  const s = BADGE_MAP[type] || BADGE_MAP.CLOSED;
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

export function NavItem({ icon, label, active, onClick, badge }) {
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

export function StatCard({ icon, label, value, color, bg, delay = 0 }) {
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
