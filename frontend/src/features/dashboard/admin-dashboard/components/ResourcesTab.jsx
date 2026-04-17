import { Badge, C, FilterPills, Table } from "./AdminUi";

export default function ResourcesTab({
  navigate,
  resourceFilter,
  setResourceFilter,
  filteredResources,
  btnPrimary,
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div style={pgTitle}>Resource Catalogue</div>
        <button
          type="button"
          onClick={() => navigate("/resources")}
          style={btnPrimary}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}
        >
          + Add Resource
        </button>
      </div>
      <div style={pgSub}>Manage facilities, labs, rooms and equipment</div>

      <FilterPills
        options={["All", "Room", "Lab", "Equipment", "Hall"]}
        active={resourceFilter}
        onChange={setResourceFilter}
      />

      <Table
        cols={["Name", "Type", "Location", "Capacity", "Status", "Action"]}
        rows={filteredResources.map((r) => [
          <span style={{ fontWeight: 600 }}>{r.name}</span>,
          r.type,
          r.location,
          r.capacity,
          <Badge type={r.status || "ACTIVE"}>
            {(r.status || "ACTIVE").replace("_", " ")}
          </Badge>,
          <span
            onClick={() => navigate(`/resources/${r.id}`)}
            style={{
              fontSize: 12,
              color: C.blue,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Edit
          </span>,
        ])}
      />
    </div>
  );
}
