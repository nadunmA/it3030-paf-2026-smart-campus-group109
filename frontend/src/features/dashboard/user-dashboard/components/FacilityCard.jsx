import { useState } from "react";
import Badge from "./Badge";

export default function FacilityCard({
  name,
  type,
  location,
  capacity,
  availability,
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1D23" }}>
          {name}
        </div>
        <Badge type={availability}>{availability || "UNKNOWN"}</Badge>
      </div>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
        {type || "Facility"}
      </div>
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
        {location || "Unknown location"} · Capacity {capacity ?? "N/A"}
      </div>
    </div>
  );
}
