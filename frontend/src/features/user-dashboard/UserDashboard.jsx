import { useMemo } from "react";

export default function UserDashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  if (!user) {
    window.location.replace("/");
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: 24,
      }}
    >
      <h1 style={{ marginBottom: 16 }}>User Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <img
          src={user.picture || "https://via.placeholder.com/80"}
          alt="profile"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid #0A84FF",
          }}
        />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {user.name || "User"}
          </div>
          <div style={{ opacity: 0.7 }}>{user.email}</div>
          <div style={{ marginTop: 6, color: "#30D158", fontWeight: 600 }}>
            {user.role}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        {[
          "My Bookings",
          "Incident Tickets",
          "Notifications",
          "Profile Settings",
        ].map((x) => (
          <div
            key={x}
            style={{
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>{x}</h3>
            <p style={{ opacity: 0.7, marginTop: 8, fontSize: 14 }}>
              Coming soon...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
