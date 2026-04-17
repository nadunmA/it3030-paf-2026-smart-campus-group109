import { useState } from "react";
import { Badge, C, FilterPills, Table } from "./AdminUi";

export default function TicketsTab({
  ticketFilter,
  setTicketFilter,
  filteredTickets,
  technicians = [],
  onAssign,
}) {
  const [assigning, setAssigning] = useState({});

  const handleSelect = async (ticketId, value) => {
    if (!value || !onAssign) return;
    const tech = technicians.find((t) => t.id === value);
    if (!tech) return;
    setAssigning((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await onAssign(ticketId, tech.id, tech.name || tech.email);
    } finally {
      setAssigning((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

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
        cols={["Title", "Reporter", "Priority", "Status", "Assign Technician", "Updated"]}
        rows={filteredTickets.map((t) => [
          <span style={{ fontWeight: 600 }}>{t.title}</span>,
          t.reporter,
          <Badge type={t.priority || "MEDIUM"}>{t.priority || "MEDIUM"}</Badge>,
          <Badge type={t.status || "OPEN"}>
            {(t.status || "OPEN").replace("_", " ")}
          </Badge>,
          <select
            disabled={assigning[t.id]}
            value={t.assignedTechnicianId || t.assigned || ""}
            onChange={(e) => handleSelect(t.id, e.target.value)}
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.text,
              cursor: assigning[t.id] ? "wait" : "pointer",
              minWidth: 140,
              fontFamily: "inherit",
            }}
          >
            <option value="">
              {t.assignedTechnicianName || t.assigned || "Unassigned"}
            </option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name || tech.email}
              </option>
            ))}
          </select>,
          <span style={{ fontSize: 12, color: C.hint }}>{t.updated}</span>,
        ])}
      />
    </div>
  );
}
