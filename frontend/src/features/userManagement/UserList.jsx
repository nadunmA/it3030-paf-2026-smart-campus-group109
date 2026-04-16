import { useState } from "react";

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

const BADGE_STYLES = {
  APPROVED: { bg: C.greenBg, color: C.green, bd: C.greenBd },
  PENDING: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
  REJECTED: { bg: C.redBg, color: C.red, bd: C.redBd },
  CANCELLED: { bg: "#F1F5F9", color: "#64748B", bd: "#E2E8F0" },
  ACTIVE: { bg: C.greenBg, color: C.green, bd: C.greenBd },
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

const initials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

export default function UserList({
  users,
  onRoleChange,
  onToggleActive,
  busyId,
  error,
}) {
  const [userSearch, setUserSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.text,
          marginBottom: 6,
        }}
      >
        User Management
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
        View and manage registered users
      </div>

      {error && (
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
          {error}
        </div>
      )}

      <input
        placeholder="Search users by name or email..."
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "8px 14px",
          borderRadius: 9,
          border: `1px solid ${C.border}`,
          background: C.surface,
          fontSize: 13,
          color: C.text,
          outline: "none",
          fontFamily: "inherit",
          marginBottom: 14,
        }}
      />

      <Table
        cols={[
          "User",
          "Email",
          "Role",
          "Status",
          "Bookings",
          "Tickets",
          "Joined",
          "Actions",
        ]}
        rows={filtered.map((u) => [
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2563EB,#7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {u.initials || initials(u.name)}
            </div>
            <span style={{ fontWeight: 600 }}>{u.name}</span>
          </div>,

          <span style={{ color: C.muted }}>{u.email}</span>,

          <select
            value={u.role || "USER"}
            disabled={busyId === u.id}
            onChange={(e) => onRoleChange(u.id, e.target.value)}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              background: C.surface,
              color: C.text,
              fontSize: 12,
              padding: "5px 8px",
              fontFamily: "inherit",
              cursor: busyId === u.id ? "not-allowed" : "pointer",
            }}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
          </select>,

          u.active === false ? (
            <Badge type="CANCELLED">SUSPENDED</Badge>
          ) : (
            <Badge type="ACTIVE">ACTIVE</Badge>
          ),

          u.bookings || "—",
          u.tickets || "—",

          <span style={{ fontSize: 12, color: C.hint }}>{u.joined}</span>,

          <button
            disabled={busyId === u.id}
            onClick={() => onToggleActive(u)}
            style={{
              border:
                u.active === false
                  ? `1px solid ${C.greenBd}`
                  : `1px solid ${C.redBd}`,
              borderRadius: 8,
              background: u.active === false ? C.greenBg : C.redBg,
              color: u.active === false ? C.green : C.red,
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 10px",
              fontFamily: "inherit",
              cursor: busyId === u.id ? "not-allowed" : "pointer",
              opacity: busyId === u.id ? 0.65 : 1,
            }}
          >
            {u.active === false ? "Activate" : "Suspend"}
          </button>,
        ])}
      />
    </div>
  );
}
