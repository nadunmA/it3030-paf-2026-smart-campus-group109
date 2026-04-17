import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import BookingCard from "../components/BookingCard";
import NotifCard from "../components/NotifCard";
import { MOCK_BOOKINGS } from "../constants/mockData";

export default function OverviewTab({
  user,
  unreadCount,
  notifsLoading,
  notifs,
  setActiveTab,
  markOneRead,
}) {
  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <p
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          Welcome back
        </p>
        <h1
          style={{
            fontSize: "clamp(1.5rem,3vw,2rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            margin: "0 0 10px",
            color: "#1A1D23",
          }}
        >
          {user.name?.split(" ")[0]} 👋
        </h1>
        <Badge type={user.role || "USER"}>{user.role || "USER"}</Badge>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon="📅"
          label="Active Bookings"
          value="2"
          color="#2563EB"
          bgColor="#EFF6FF"
        />
        <StatCard
          icon="🔧"
          label="Open Tickets"
          value="2"
          color="#D97706"
          bgColor="#FFFBEB"
        />
        <StatCard
          icon="🔔"
          label="Unread Notifs"
          value={unreadCount}
          color="#7C3AED"
          bgColor="#F5F3FF"
        />
        <StatCard
          icon="✅"
          label="Resolved"
          value="1"
          color="#059669"
          bgColor="#ECFDF5"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
              Recent Bookings
            </span>
            <span
              onClick={() => setActiveTab("bookings")}
              style={{
                fontSize: 12,
                color: "#2563EB",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View all →
            </span>
          </div>
          {MOCK_BOOKINGS.slice(0, 3).map((b, i) => (
            <BookingCard key={i} {...b} />
          ))}
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
              Recent Notifications
            </span>
            <span
              onClick={() => setActiveTab("notifications")}
              style={{
                fontSize: 12,
                color: "#2563EB",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View all →
            </span>
          </div>
          {notifsLoading ? (
            <div style={{ fontSize: 13, color: "#9CA3AF", padding: "12px 0" }}>
              Loading…
            </div>
          ) : notifs.length === 0 ? (
            <div style={{ fontSize: 13, color: "#9CA3AF", padding: "12px 0" }}>
              No notifications yet.
            </div>
          ) : (
            notifs
              .slice(0, 3)
              .map((n, i) => (
                <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
