import { useState } from "react";

export default function NotifCard({ notif, onMarkRead }) {
  const [hov, setHov] = useState(false);

  const TYPE_META = {
    BOOKING_APPROVED: { color: "#2563EB", label: "Booking" },
    BOOKING_REJECTED: { color: "#DC2626", label: "Booking" },
    BOOKING_CANCELLED: { color: "#64748B", label: "Booking" },
    TICKET_STATUS_CHANGED: { color: "#D97706", label: "Ticket" },
    TICKET_ASSIGNED: { color: "#D97706", label: "Ticket" },
    NEW_COMMENT: { color: "#7C3AED", label: "Comment" },
    GENERAL: { color: "#9CA3AF", label: "General" },
    booking: { color: "#2563EB", label: "Booking" },
    ticket: { color: "#D97706", label: "Ticket" },
    comment: { color: "#7C3AED", label: "Comment" },
  };

  const meta = TYPE_META[notif.type] || { color: "#9CA3AF", label: "Info" };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => !notif.read && onMarkRead && onMarkRead(notif.id)}
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 14px",
        background: notif.read ? "#fff" : hov ? "#DBEAFE" : "#EFF6FF",
        border: `1px solid ${notif.read ? (hov ? "#CBD5E1" : "#E8EBF0") : "#BFDBFE"}`,
        borderRadius: 10,
        marginBottom: 7,
        cursor: notif.read ? "default" : "pointer",
        transition: "all .15s",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: meta.color,
          flexShrink: 0,
          marginTop: 4,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: meta.color,
              textTransform: "uppercase",
              letterSpacing: ".05em",
            }}
          >
            {meta.label}
          </span>
          {!notif.read && (
            <span
              style={{
                fontSize: 9,
                background: meta.color,
                color: "#fff",
                padding: "1px 6px",
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              NEW
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#1A1D23",
            marginBottom: 3,
            lineHeight: 1.5,
          }}
        >
          {notif.text}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{notif.time}</div>
      </div>
      {!notif.read && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#2563EB",
            flexShrink: 0,
            marginTop: 5,
          }}
        />
      )}
    </div>
  );
}
