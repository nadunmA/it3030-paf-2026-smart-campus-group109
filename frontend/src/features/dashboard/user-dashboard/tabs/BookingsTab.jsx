import BookingCard from "../components/BookingCard";

export default function BookingsTab({
  bookingFilter,
  setBookingFilter,
  filteredBookings,
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

  const btnPrimary = {
    padding: "10px 22px",
    borderRadius: 99,
    background: "#2563EB",
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 16,
  };

  return (
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
        My Bookings
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
        Manage your facility and equipment bookings
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}
      >
        {["All", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((f) => (
          <div
            key={f}
            onClick={() => setBookingFilter(f)}
            style={bookingFilter === f ? filterPillActive : filterPillBase}
          >
            {f}
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div style={{ color: "#9CA3AF", fontSize: 13, padding: "20px 0" }}>
          No bookings found.
        </div>
      ) : (
        filteredBookings.map((b, i) => <BookingCard key={i} {...b} />)
      )}

      <button style={btnPrimary}>+ New Booking</button>
    </div>
  );
}
