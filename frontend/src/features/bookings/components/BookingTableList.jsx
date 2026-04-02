import StatusBadge from "./StatusBadge";
import Btn from "../../../components/ui/Btn";

export default function BookingTableList({
  bookings,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  actionLoadingId = "",
}) {
  if (!bookings?.length) {
    return (
      <div
        style={{
          padding: "20px 18px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.04)",
          color: "rgba(255,255,255,.72)",
        }}
      >
        No bookings found.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          minWidth: 900,
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,.03)",
        }}
      >
        <thead>
          <tr style={{ background: "rgba(255,255,255,.06)" }}>
            {["Resource", "Date", "Start", "End", "Purpose", "Attendees", "Status", "Owner", "Actions"].map((head) => (
              <th
                key={head}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  fontSize: ".77rem",
                  color: "rgba(255,255,255,.7)",
                  fontWeight: 600,
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <td style={cellStyle}>{booking.resourceId}</td>
              <td style={cellStyle}>{booking.bookingDate}</td>
              <td style={cellStyle}>{booking.startTime}</td>
              <td style={cellStyle}>{booking.endTime}</td>
              <td style={cellStyle}>{booking.purpose}</td>
              <td style={cellStyle}>{booking.expectedAttendees}</td>
              <td style={cellStyle}><StatusBadge status={booking.status} /></td>
              <td style={cellStyle}>{booking.userId}</td>
              <td style={cellStyle}>
                {showActions ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {onApprove && booking.status === "PENDING" && (
                      <Btn size="sm" onClick={() => onApprove(booking)}>
                        {actionLoadingId === booking.id ? "Processing..." : "Approve"}
                      </Btn>
                    )}
                    {onReject && booking.status === "PENDING" && (
                      <Btn size="sm" variant="ghost" onClick={() => onReject(booking)}>
                        {actionLoadingId === booking.id ? "Processing..." : "Reject"}
                      </Btn>
                    )}
                    {onCancel && ["PENDING", "APPROVED"].includes(booking.status) && (
                      <Btn size="sm" variant="white" onClick={() => onCancel(booking)}>
                        {actionLoadingId === booking.id ? "Processing..." : "Cancel"}
                      </Btn>
                    )}
                  </div>
                ) : (
                  <span style={{ color: "rgba(255,255,255,.45)", fontSize: ".74rem" }}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  padding: "12px 14px",
  fontSize: ".82rem",
  color: "#fff",
  borderTop: "1px solid rgba(255,255,255,.08)",
  verticalAlign: "top",
};
