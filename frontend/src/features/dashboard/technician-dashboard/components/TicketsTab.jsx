import { Badge, C } from "./TechnicianUi";

export default function TicketsTab({
  ticketFilter,
  setTicketFilter,
  ticketsLoading,
  filteredTickets,
  setSelectedTicket,
}) {
  const pageTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pageSub = { fontSize: 13, color: C.muted, marginBottom: 22 };
  const filterPillBase = {
    padding: "5px 13px",
    borderRadius: 99,
    fontSize: 11,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all .15s",
    border: `1px solid ${C.border}`,
    background: C.surface,
    color: C.muted,
  };

  return (
    <div>
      <div style={pageTitle}>Assigned Tickets</div>
      <div style={pageSub}>
        View and update your assigned maintenance tickets
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
          <div
            key={f}
            onClick={() => setTicketFilter(f)}
            style={
              ticketFilter === f
                ? {
                    ...filterPillBase,
                    background: C.purple,
                    borderColor: C.purple,
                    color: "#fff",
                  }
                : filterPillBase
            }
          >
            {f.replace("_", " ")}
          </div>
        ))}
      </div>

      {ticketsLoading ? (
        <div style={{ fontSize: 13, color: C.hint, padding: "20px 0" }}>
          Loading tickets...
        </div>
      ) : filteredTickets.length === 0 ? (
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
          No{" "}
          {ticketFilter !== "All"
            ? ticketFilter.replace("_", " ").toLowerCase()
            : ""}{" "}
          tickets assigned to you.
        </div>
      ) : (
        filteredTickets.map((t, i) => (
          <div
            key={t.id || i}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              marginBottom: 10,
              cursor: "pointer",
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                  {t.description || "No description provided."}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Badge type={t.priority}>{t.priority || "—"}</Badge>
                <Badge type={t.status}>
                  {(t.status || "").replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              {t.category && (
                <span style={{ fontSize: 11, color: C.hint }}>
                  📂 {t.category}
                </span>
              )}
              {(t.location || t.resourceName) && (
                <span style={{ fontSize: 11, color: C.hint }}>
                  📍 {t.location || t.resourceName}
                </span>
              )}
              {t.reportedBy && (
                <span style={{ fontSize: 11, color: C.hint }}>
                  👤 {t.reportedBy}
                </span>
              )}
              {t.createdAt && (
                <span style={{ fontSize: 11, color: C.hint }}>
                  🕐 {new Date(t.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {t.resolutionNote && (
              <div
                style={{
                  fontSize: 12,
                  color: "#059669",
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                }}
              >
                <strong>Resolution note:</strong> {t.resolutionNote}
              </div>
            )}

            <button
              onClick={() => setSelectedTicket(t)}
              style={{
                padding: "8px 18px",
                borderRadius: 99,
                background: C.purpleBg,
                border: `1px solid ${C.purpleBd}`,
                color: C.purple,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.purple;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.purpleBg;
                e.currentTarget.style.color = C.purple;
              }}
            >
              Update Status
            </button>
          </div>
        ))
      )}
    </div>
  );
}
