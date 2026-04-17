import { C, NavItem } from "./TechnicianUi";

export default function TechnicianSidebar({
  user,
  navItems,
  activeTab,
  setActiveTab,
  navigate,
  onLogout,
}) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 224,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        zIndex: 50,
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
          marginBottom: 4,
        }}
      >
        Smart<span style={{ color: C.purple }}>Campus</span>
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
        Technician Portal
      </div>

      <nav
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {navItems.map((item) => (
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
          <img
            src={
              user?.picture ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "tech"}`
            }
            alt="avatar"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: `2px solid ${C.purpleBd}`,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
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
              {user?.name || "Technician"}
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
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 11px",
            borderRadius: 9,
            cursor: "pointer",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}
