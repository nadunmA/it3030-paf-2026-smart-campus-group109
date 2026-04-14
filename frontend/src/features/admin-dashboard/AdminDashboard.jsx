export default function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  if (!user || user.role !== "ADMIN") {
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
      <h1>Admin Dashboard</h1>
      <p style={{ opacity: 0.75 }}>
        Welcome, {user.name}. Manage facilities, approvals, users, and reports.
      </p>
    </div>
  );
}
