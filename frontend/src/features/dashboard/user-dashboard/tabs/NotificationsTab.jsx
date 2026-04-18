import NotifCard from "../components/NotifCard";

export default function NotificationsTab({
  notifsLoading,
  notifsError,
  unreadCount,
  notificationFilter,
  setNotificationFilter,
  notificationFilters,
  filteredNotifications,
  unreadNotifications,
  readNotifications,
  markAllRead,
  markOneRead,
}) {
  const filterPillBase = {
    padding: "5px 14px",
    borderRadius: 99,
    fontSize: 11,
    cursor: "pointer",
    fontWeight: 500,
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: "#6B7280",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-.03em",
              color: "#1A1D23",
              marginBottom: 6,
            }}
          >
            Notifications
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            {notifsLoading
              ? "Loading…"
              : unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: "8px 18px",
              borderRadius: 99,
              background: "#fff",
              border: "1px solid #E2E8F0",
              color: "#6B7280",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}
      >
        {notificationFilters.map((f) => (
          <div
            key={f}
            onClick={() => setNotificationFilter(f)}
            style={
              notificationFilter === f
                ? {
                    ...filterPillBase,
                    background: "#2563EB",
                    borderColor: "#2563EB",
                    color: "#fff",
                  }
                : filterPillBase
            }
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </div>
        ))}
      </div>

      {notifsError && (
        <div
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: "#DC2626",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            padding: "8px 10px",
          }}
        >
          {notifsError}
        </div>
      )}

      {notifsLoading ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          Loading notifications…
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          No notifications yet.
        </div>
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  margin: "16px 0 10px",
                }}
              >
                Unread
              </div>
              {unreadNotifications.map((n, i) => (
                <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
              ))}
            </>
          )}

          {readNotifications.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  margin: "16px 0 10px",
                }}
              >
                Earlier
              </div>
              {readNotifications.map((n, i) => (
                <NotifCard key={i} notif={n} onMarkRead={markOneRead} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
