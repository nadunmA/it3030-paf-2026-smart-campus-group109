import { useState } from "react";
import Btn from "../../../components/ui/Btn";

export default function BookingFilter({ onApply, defaultStatus = "", defaultDate = "" }) {
  const [status, setStatus] = useState(defaultStatus);
  const [date, setDate] = useState(defaultDate);

  const apply = () => onApply?.({ status: status || undefined, date: date || undefined });

  const clear = () => {
    setStatus("");
    setDate("");
    onApply?.({ status: undefined, date: undefined });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.16)",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <option value="" style={{ color: "#000" }}>All Statuses</option>
        <option value="PENDING" style={{ color: "#000" }}>PENDING</option>
        <option value="APPROVED" style={{ color: "#000" }}>APPROVED</option>
        <option value="REJECTED" style={{ color: "#000" }}>REJECTED</option>
        <option value="CANCELLED" style={{ color: "#000" }}>CANCELLED</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.16)",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 12px",
        }}
      />

      <Btn size="sm" onClick={apply}>Apply</Btn>
      <Btn size="sm" variant="ghost" onClick={clear}>Clear</Btn>
    </div>
  );
}
