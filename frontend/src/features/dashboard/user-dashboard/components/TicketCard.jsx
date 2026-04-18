import { useState } from "react";
import Badge from "./Badge";

export default function TicketCard({ title, priority, status, updated }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "13px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        marginBottom: 8,
        cursor: "pointer",
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1D23" }}>
          {title}
        </div>
        <Badge type={priority}>{priority}</Badge>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Badge type={status}>{status.replace("_", " ")}</Badge>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
          Updated {updated}
        </span>
      </div>
    </div>
  );
}
