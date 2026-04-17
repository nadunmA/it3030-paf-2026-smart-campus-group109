import Badge from "./Badge";

export default function ProfileSummaryCard({ user }) {
  const fields = [
    { label: "Full Name", value: user?.name || "-", icon: "👤" },
    { label: "Email", value: user?.email || "-", icon: "✉️" },
    { label: "Role", value: user?.role || "USER", icon: "🔑" },
    { label: "Auth Method", value: "Google OAuth 2.0", icon: "🔒" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 680, marginBottom: 16 }}>
      {/* Hero row */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E8ECF0",
          borderRadius: 16,
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 10,
        }}
      >
        <img
          src={
            user?.picture ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`
          }
          alt="avatar"
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #BFDBFE",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 2,
            }}
          >
            {user?.name || "User"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email || "-"}
          </div>
          <Badge type={user?.role || "USER"}>{user?.role || "USER"}</Badge>
        </div>
      </div>

      {/* Account detail fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 16px",
              background: "#fff",
              border: "1px solid #E8ECF0",
              borderRadius: 12,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {field.icon}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#9CA3AF",
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  wordBreak: "break-all",
                  lineHeight: 1.4,
                }}
              >
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
