import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FECACA",
};

function NavItem({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 11px",
        borderRadius: 9,
        cursor: "pointer",
        background: active ? C.blueBg : hovered ? "#F8FAFC" : "transparent",
        border: active ? `1px solid ${C.blueBd}` : "1px solid transparent",
        color: active ? C.blue : hovered ? C.text : C.muted,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        transition: "all .15s",
      }}
    >
      <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icon}</span>
      <span>{label}</span>
      {active && (
        <span
          style={{
            marginLeft: "auto",
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

function readUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function ResourceAdminLayout({ children }) {
  const navigate = useNavigate();
  const user = useMemo(() => readUser(), []);

  const initials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
      }}
    >
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

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <NavItem icon="⊞" label="Overview" active={false} onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon="📅" label="Bookings" active={false} onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon="🔧" label="Tickets" active={false} onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon="📦" label="Resources" active={true} onClick={() => navigate("/resources")} />
          <NavItem icon="👥" label="Users" active={false} onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon="📋" label="Activity Log" active={false} onClick={() => navigate("/admin/dashboard")} />
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
              {initials(user?.name)}
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
                {user?.name || "Admin User"}
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
                {user?.email || ""}
              </div>
            </div>
          </div>
          <button
            type="button"
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
            }}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      <main
        style={{
          marginLeft: 220,
          flex: 1,
          padding: "28px max(24px,3vw)",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
