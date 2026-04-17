import TicketCard from "../components/TicketCard";

export default function TicketsTab({
  ticketFilter,
  setTicketFilter,
  filteredTickets,
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
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-.03em",
          color: "#1A1D23",
          marginBottom: 6,
        }}
      >
        Incident Tickets
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
        Report and track maintenance issues
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}
      >
        {["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
          <div
            key={f}
            onClick={() => setTicketFilter(f)}
            style={
              ticketFilter === f
                ? {
                    ...filterPillBase,
                    background: "#D97706",
                    borderColor: "#D97706",
                    color: "#fff",
                  }
                : filterPillBase
            }
          >
            {f.replace("_", " ")}
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          No tickets found.
        </div>
      ) : (
        filteredTickets.map((t, i) => <TicketCard key={i} {...t} />)
      )}

      <button
        style={{
          padding: "10px 22px",
          borderRadius: 99,
          background: "#D97706",
          color: "#fff",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          marginTop: 16,
        }}
      >
        + Report New Issue
      </button>
    </div>
  );
}
