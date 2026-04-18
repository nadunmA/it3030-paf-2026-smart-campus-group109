import FacilityCard from "../components/FacilityCard";

export default function ResourcesTab({
  fetchResources,
  navigate,
  hallFilter,
  setHallFilter,
  hallsError,
  hallsLoading,
  filteredHalls,
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

  const filterPillActive = {
    ...filterPillBase,
    background: "#2563EB",
    borderColor: "#2563EB",
    color: "#fff",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          gap: 12,
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
            Resources & Facilities
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
            Browse available resources, labs, and campus facilities
          </div>
        </div>
        <button
          onClick={fetchResources}
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
          Refresh
        </button>
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}
      >
        {["ALL", "AVAILABLE", "MAINTENANCE", "UNAVAILABLE"].map((f) => (
          <div
            key={f}
            onClick={() => setHallFilter(f)}
            style={hallFilter === f ? filterPillActive : filterPillBase}
          >
            {f === "ALL" ? "All" : f}
          </div>
        ))}
      </div>

      {hallsError && (
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
          {hallsError}
        </div>
      )}

      {hallsLoading ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          Loading facilities...
        </div>
      ) : filteredHalls.length === 0 ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          No facilities found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 10,
          }}
        >
          {filteredHalls.map((h) => (
            <FacilityCard
              key={h.id}
              name={h.name}
              type={h.resourceTypeName}
              location={h.location}
              capacity={h.capacity}
              availability={h.availability}
              onClick={() => navigate(`/resources/${h.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
