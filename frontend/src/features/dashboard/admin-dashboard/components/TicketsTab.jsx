import { Badge, C, FilterPills, Table } from "./AdminUi";

export default function TicketsTab({
  ticketFilter,
  setTicketFilter,
  filteredTickets,
}) {
  const pgTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pgSub = { fontSize: 13, color: C.muted, marginBottom: 24 };

  return (
    <div>
      <div style={pgTitle}>Incident Tickets</div>
      <div style={pgSub}>Assign technicians and manage issue resolution</div>
      <FilterPills
        options={["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]}
        active={ticketFilter}
        onChange={setTicketFilter}
        activeColor={C.orange}
      />
      <Table
        cols={[
          "Title",
          "Reporter",
          "Priority",
          "Status",
          "Assigned To",
          "Updated",
        ]}
        rows={filteredTickets.map((t) => [
          <span style={{ fontWeight: 600 }}>{t.title}</span>,
          t.reporter,
          <Badge type={t.priority || "MEDIUM"}>{t.priority || "MEDIUM"}</Badge>,
          <Badge type={t.status || "OPEN"}>
            {(t.status || "OPEN").replace("_", " ")}
          </Badge>,
          t.assigned || (
            <span style={{ fontSize: 12, color: C.hint }}>Unassigned</span>
          ),
          <span style={{ fontSize: 12, color: C.hint }}>{t.updated}</span>,
        ])}
      />
    </div>
  );
}
