import { useState } from "react";

export const C = {
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

export function Badge({ type, children }) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.CANCELLED;
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

export function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
  delta,
  deltaColor,
}) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "16px 18px",
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

export function BackToHomeButton({ onClick, label = "Back to Home" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 11px",
        borderRadius: 9,
        cursor: "pointer",
        background: C.surface,
        border: `1px solid ${C.border}`,
        color: C.text,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "inherit",
        transition: "all .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F8FAFC";
        e.currentTarget.style.borderColor = "#CBD5E1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.surface;
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      <span>🏠</span>
      {label}
    </button>
  );
}

export function Panel({ title, action, onAction, children }) {
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

export function FilterPills({ options, active, onChange, activeColor }) {
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

export function Table({ cols, rows }) {
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
