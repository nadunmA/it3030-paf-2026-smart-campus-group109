import { Badge, C, StatCard } from "./TechnicianUi";

export default function OverviewTab({
  user,
  tickets,
  notifications,
  ticketsLoading,
  notifsLoading,
  openCount,
  inProgCount,
  resolvedCount,
  setActiveTab,
  setSelectedTicket,
}) {
  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            fontSize: 11,
            color: C.hint,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Technician Portal
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-.04em",
            color: C.text,
            marginBottom: 8,
          }}
        >
          Welcome back, {user?.name?.split(" ")[0] || "Tech"} 👋
        </div>
        <Badge type="TECHNICIAN">TECHNICIAN</Badge>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <StatCard
          icon="🔧"
          label="Assigned"
          value={tickets.length}
          color={C.purple}
          bg={C.purpleBg}
          delay={80}
        />
        <StatCard
          icon="🔓"
          label="Open"
          value={openCount}
          color="#2563EB"
          bg="#EFF6FF"
          delay={160}
        />
        <StatCard
          icon="⚙️"
          label="In Progress"
          value={inProgCount}
          color="#D97706"
          bg="#FFFBEB"
          delay={240}
        />
        <StatCard
          icon="✅"
          label="Resolved"
          value={resolvedCount}
          color="#059669"
          bg="#ECFDF5"
          delay={320}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 13,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
              Assigned Tickets
            </span>
            <span
              onClick={() => setActiveTab("tickets")}
              style={{
                fontSize: 12,
                color: C.purple,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View all →
            </span>
          </div>
          {ticketsLoading ? (
            <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
          ) : tickets.length === 0 ? (
            <div style={{ fontSize: 13, color: C.hint, padding: "12px 0" }}>
              No tickets assigned yet.
            </div>
          ) : (
            tickets.slice(0, 3).map((t, i) => (
              <div
                key={t.id || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 9,
                  marginBottom: 5,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onClick={() => setSelectedTicket(t)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = C.surface)
                }
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 2,
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ fontSize: 11, color: C.hint }}>
                    {t.category || t.location || ""}
                  </div>
                </div>
                <Badge type={t.priority}>{t.priority}</Badge>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 13,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
              Notifications
            </span>
            <span
              onClick={() => setActiveTab("notifications")}
              style={{
                fontSize: 12,
                color: C.purple,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View all →
            </span>
          </div>
          {notifsLoading ? (
            <div style={{ fontSize: 13, color: C.hint }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ fontSize: 13, color: C.hint, padding: "12px 0" }}>
              No notifications yet.
            </div>
          ) : (
            notifications.slice(0, 3).map((n, i) => (
              <div
                key={n.id || i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 12px",
                  background: n.read ? C.surface : C.purpleBg,
                  border: `1px solid ${n.read ? C.border : C.purpleBd}`,
                  borderRadius: 9,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: n.read ? C.hint : C.purple,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 2,
                    }}
                  >
                    {n.title || "Notification"}
                  </div>
                  <div style={{ fontSize: 11, color: C.hint }}>
                    {n.message || ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
