import { Badge, C, Panel, StatCard } from "./AdminUi";

export default function OverviewTab({
  bookings,
  tickets,
  users,
  pendingBookings,
  setActiveTab,
  navigate,
}) {
  const pgTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
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
          Admin Portal
        </div>
        <div style={pgTitle}>Dashboard Overview</div>
        <Badge type="ADMIN">ADMIN</Badge>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon="📅"
          label="Total Bookings"
          value={bookings.length}
          color={C.blue}
          bgColor={C.blueBg}
          delta="↑ updated now"
          deltaColor={C.green}
        />
        <StatCard
          icon="⏳"
          label="Pending Approvals"
          value={pendingBookings}
          color={C.orange}
          bgColor={C.orangeBg}
          delta="Needs attention"
          deltaColor={C.orange}
        />
        <StatCard
          icon="🔧"
          label="Open Tickets"
          value={tickets.filter((t) => t.status === "OPEN").length}
          color={C.red}
          bgColor={C.redBg}
          delta="3 high priority"
          deltaColor={C.red}
        />
        <StatCard
          icon="👥"
          label="Active Users"
          value={users.length}
          color={C.green}
          bgColor={C.greenBg}
          delta="+ new this month"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          {
            icon: "⏳",
            label: "Pending Bookings",
            sub: `${pendingBookings} awaiting review`,
            bg: C.orangeBg,
            tab: "bookings",
          },
          {
            icon: "🚨",
            label: "High Priority Tickets",
            sub: "3 critical issues",
            bg: C.redBg,
            tab: "tickets",
          },
          {
            icon: "📦",
            label: "Manage Resources",
            sub: "Equipment & inventory",
            bg: "#F3E8FF",
            tab: "resources",
          },
        ].map((q) => (
          <div
            key={q.tab}
            onClick={() => {
              if (q.tab === "resources") {
                navigate("/resources");
                return;
              }
              setActiveTab(q.tab);
            }}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: q.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {q.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                {q.label}
              </div>
              <div style={{ fontSize: 11, color: C.hint, marginTop: 1 }}>
                {q.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
        }}
      >
        <Panel
          title="Recent Bookings"
          action="View all →"
          onAction={() => setActiveTab("bookings")}
        >
          {bookings.slice(0, 4).map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 9,
                marginBottom: 4,
                cursor: "pointer",
                transition: "background .12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F8FAFC")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 2,
                  }}
                >
                  {b.purpose}
                </div>
                <div style={{ fontSize: 11, color: C.hint }}>
                  {b.resource} · {b.date}
                </div>
              </div>
              <Badge type={b.status || "PENDING"}>
                {b.status || "PENDING"}
              </Badge>
            </div>
          ))}
        </Panel>

        <Panel
          title="Recent Tickets"
          action="View all →"
          onAction={() => setActiveTab("tickets")}
        >
          {tickets.slice(0, 3).map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 9,
                marginBottom: 4,
                cursor: "pointer",
                transition: "background .12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F8FAFC")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ flex: 1 }}>
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
                  {(t.priority || "MEDIUM") +
                    " · " +
                    (t.status || "OPEN").replace("_", " ")}
                </div>
              </div>
              <Badge type={t.priority || "MEDIUM"}>
                {t.priority || "MEDIUM"}
              </Badge>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
