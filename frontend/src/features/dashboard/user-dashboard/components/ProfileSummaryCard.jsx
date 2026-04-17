import Badge from "./Badge";

export default function ProfileSummaryCard({ user }) {
  const fields = [
    { label: "Full Name", value: user?.name || "-", icon: "👤" },
    { label: "Email", value: user?.email || "-", icon: "✉️" },
    { label: "Role", value: user?.role || "USER", icon: "🔑" },
    { label: "Auth Method", value: "Google OAuth 2.0", icon: "🔒" },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 740,
        background: "#fff",
        border: "1px solid #E8EBF0",
        borderRadius: 14,
        marginBottom: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 10,
          background: "#F8FAFC",
          border: "1px solid #E8EBF0",
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
            width: 54,
            height: 54,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #BFDBFE",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#1A1D23",
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))",
          gap: 10,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: "#FAFBFC",
              border: "1px solid #F1F5F9",
              borderRadius: 12,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {field.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#9CA3AF",
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
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
    </div>
  );
}
