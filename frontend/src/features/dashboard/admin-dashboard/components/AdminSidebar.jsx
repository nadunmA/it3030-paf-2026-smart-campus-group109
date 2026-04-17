import { BackToHomeButton, C, NavItem } from "./AdminUi";

const initials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

export default function AdminSidebar({
  user,
  nav,
  activeTab,
  onTabChange,
  onHome,
  onLogout,
}) {
  return (
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
        onClick={onHome}
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
        {nav.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            badge={item.badge}
            onClick={() => onTabChange(item.id)}
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
              {user?.name}
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
              {user?.email}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 7 }}>
          <BackToHomeButton onClick={onHome} />
        </div>

        <button
          onClick={onLogout}
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
  );
}
