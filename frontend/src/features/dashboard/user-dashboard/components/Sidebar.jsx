import SidebarNavItem from "./SidebarNavItem";

export default function Sidebar({
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
        width: 236,
        zIndex: 50,
        background: "#fff",
        borderRight: "1px solid #E8EBF0",
        display: "flex",
        flexDirection: "column",
        padding: "22px 14px",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "-.03em",
          cursor: "pointer",
          marginBottom: 28,
          paddingLeft: 4,
          color: "#1A1D23",
        }}
      >
        Smart<span style={{ color: "#2563EB" }}>Campus</span>
      </div>

      <nav
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            badge={item.badge}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #E8EBF0", paddingTop: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "#F8FAFC",
            border: "1px solid #E8EBF0",
            marginBottom: 8,
          }}
        >
          <img
            src={
              user.picture ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
            }
            alt="avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid #BFDBFE",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1A1D23",
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
                color: "#9CA3AF",
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
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 9,
            cursor: "pointer",
            background: "transparent",
            border: "1px solid #E8EBF0",
            color: "#6B7280",
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 6,
            fontFamily: "inherit",
          }}
        >
          <span>🏠</span> Back to Home
        </button>

        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 9,
            cursor: "pointer",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}
