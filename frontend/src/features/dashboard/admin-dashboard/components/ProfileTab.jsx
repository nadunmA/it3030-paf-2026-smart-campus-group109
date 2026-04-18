import { Badge, C } from "./AdminUi";

export default function ProfileTab({
  user,
  bookingCount,
  ticketCount,
  resourceCount,
  activityCount,
  handleLogout,
}) {
  const initials = (user?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = (user?.role || "ADMIN").toUpperCase();

  const statCards = [
    { label: "Bookings", value: bookingCount, color: C.blue },
    { label: "Tickets", value: ticketCount, color: C.orange },
    { label: "Resources", value: resourceCount, color: C.green },
    { label: "Activity", value: activityCount, color: C.purple },
  ];

  const fieldCards = [
    { label: "Full Name", value: user?.name || "Admin", icon: "👤" },
    { label: "Email", value: user?.email || "-", icon: "✉️" },
    { label: "Role", value: role, icon: "🔑" },
    { label: "Auth Method", value: "Google OAuth 2.0", icon: "🔒" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
      }}
    >
      <div style={{ width: "100%", maxWidth: 740, marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-.04em",
            color: C.text,
            marginBottom: 6,
          }}
        >
          Profile
        </div>
        <div style={{ fontSize: 13, color: C.muted }}>
          Your account details and admin activity summary
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 740,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: `4px solid ${C.redBd}`,
              background: "linear-gradient(135deg,#DC2626,#7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-.04em",
              boxShadow: "0 2px 8px rgba(0,0,0,.12)",
            }}
          >
            {initials}
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 3,
              right: 3,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#059669",
              border: "2.5px solid #fff",
              display: "block",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: C.text,
              letterSpacing: "-.03em",
              marginBottom: 3,
            }}
          >
            {user?.name || "Admin"}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
            {user?.email || ""}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge type="ADMIN">ADMIN</Badge>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#F0FDF4",
                color: "#15803D",
                border: "1px solid #BBF7D0",
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
                  background: "#059669",
                  display: "inline-block",
                }}
              />
              Active
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 740,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 13,
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: card.color,
                letterSpacing: "-.04em",
                marginBottom: 4,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.hint,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 740,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {fieldCards.map((field) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 20px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 13,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#F8FAFC",
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {field.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  color: C.hint,
                  fontWeight: 700,
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 740 }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
        >
          Sign out of SmartCampus
        </button>
      </div>
    </div>
  );
}
