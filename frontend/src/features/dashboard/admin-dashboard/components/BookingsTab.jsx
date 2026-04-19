import { Badge, C, FilterPills, Table } from "./AdminUi";

export default function BookingsTab({
  loadError,
  bookingFilter,
  setBookingFilter,
  filteredBookings,
  btnPrimary,
  onApproveBooking,
  onRejectBooking,
  bookingActionBusyId,
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
      <div style={pgTitle}>Booking Management</div>
      <div style={pgSub}>Review, approve or reject booking requests</div>
      {loadError && (
        <div
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: C.red,
            background: C.redBg,
            border: `1px solid ${C.redBd}`,
            borderRadius: 8,
            padding: "8px 10px",
          }}
        >
          {loadError}
        </div>
      )}

      <FilterPills
        options={["All", "PENDING", "APPROVED", "REJECTED", "CANCELLED"]}
        active={bookingFilter}
        onChange={setBookingFilter}
      />

      <Table
        cols={[
          "User",
          "Resource",
          "Date & Time",
          "Purpose",
          "Status",
          "Action",
        ]}
        rows={filteredBookings.map((b) => [
          b.user,
          b.resource,
          b.date,
          b.purpose,
          <Badge type={b.status}>{b.status}</Badge>,
          b.status === "PENDING" ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                style={{
                  ...btnPrimary,
                  background: C.green,
                  padding: "5px 14px",
                  fontSize: 11,
                }}
                disabled={bookingActionBusyId === b.id}
                onClick={() => onApproveBooking?.(b)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#047857")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = C.green)
                }
              >
                {bookingActionBusyId === b.id ? "Processing..." : "Approve"}
              </button>
              <button
                type="button"
                style={{
                  ...btnPrimary,
                  background: C.red,
                  padding: "5px 14px",
                  fontSize: 11,
                }}
                disabled={bookingActionBusyId === b.id}
                onClick={() => onRejectBooking?.(b)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#B91C1C")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}
              >
                {bookingActionBusyId === b.id ? "Processing..." : "Reject"}
              </button>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: C.hint }}>—</span>
          ),
        ])}
      />
    </div>
  );
}
