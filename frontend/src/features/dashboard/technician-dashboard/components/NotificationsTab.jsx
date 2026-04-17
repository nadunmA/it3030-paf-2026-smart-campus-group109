import { C } from "./TechnicianUi";

export default function NotificationsTab({
  unreadCount,
  markAllRead,
  notifsLoading,
  notifications,
}) {
  const pageTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    color: C.hint,
    letterSpacing: ".07em",
    textTransform: "uppercase",
    margin: "16px 0 10px",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <div style={pageTitle}>Notifications</div>
          <div style={{ fontSize: 13, color: C.muted }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: "8px 16px",
              borderRadius: 99,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.muted,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#94A3B8";
              e.currentTarget.style.color = C.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.muted;
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {notifsLoading ? (
        <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            color: C.hint,
            fontSize: 13,
          }}
        >
          No notifications yet.
        </div>
      ) : (
        <>
          {notifications.some((n) => !n.read) && (
            <>
              <div style={sectionLabel}>Unread</div>
              {notifications
                .filter((n) => !n.read)
                .map((n, i) => (
                  <div
                    key={n.id || i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "12px 14px",
                      background: C.purpleBg,
                      border: `1px solid ${C.purpleBd}`,
                      borderRadius: 10,
                      marginBottom: 7,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: C.purple,
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.text,
                          marginBottom: 2,
                        }}
                      >
                        {n.title || "Notification"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          lineHeight: 1.5,
                        }}
                      >
                        {n.message || ""}
                      </div>
                    </div>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.purple,
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                  </div>
                ))}
            </>
          )}

          <div style={sectionLabel}>Earlier</div>
          {notifications
            .filter((n) => n.read)
            .map((n, i) => (
              <div
                key={n.id || i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 14px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.hint,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 2,
                    }}
                  >
                    {n.title || "Notification"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    {n.message || ""}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
