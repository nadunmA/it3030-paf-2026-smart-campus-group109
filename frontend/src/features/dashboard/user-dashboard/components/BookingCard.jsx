import { useState } from "react";
import Badge from "./Badge";

export default function BookingCard({ title, resource, date, status }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#fff",
        border: `1px solid ${hov ? "#CBD5E1" : "#E8EBF0"}`,
        borderRadius: 10,
        marginBottom: 8,
        cursor: "pointer",
        boxShadow: hov ? "0 2px 8px rgba(0,0,0,.05)" : "none",
        transition: "all .15s",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1A1D23",
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
          {resource} · {date}
        </div>
      </div>
      <Badge type={status}>{status}</Badge>
    </div>
  );
}
