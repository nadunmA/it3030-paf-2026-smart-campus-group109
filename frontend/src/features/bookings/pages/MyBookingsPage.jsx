import { useState } from "react";
import { Link } from "react-router-dom";
import BookingFilter from "../components/BookingFilter";
import BookingTableList from "../components/BookingTableList";
import useBookings from "../hooks/useBookings";
import { bookingApi } from "../services/bookingApi";

export default function MyBookingsPage() {
  const [filters, setFilters] = useState({});
  const { bookings, loading, error, load } = useBookings(() => bookingApi.getMine());

  const applyFilters = async (nextFilters) => {
    setFilters(nextFilters);
    await load();
  };

  const filtered = bookings.filter((booking) => {
    if (filters.status && booking.status !== filters.status) return false;
    if (filters.date && booking.bookingDate !== filters.date) return false;
    return true;
  });

  const cancelBooking = async (booking) => {
    await bookingApi.cancel(booking.id);
    await load();
  };

  return (
    <main style={pageStyle}>
      <TopNav />
      <section style={cardStyle}>
        <h1 style={titleStyle}>My Bookings</h1>
        <p style={subTitleStyle}>Track and manage your requests.</p>

        <BookingFilter onApply={applyFilters} />

        {loading && <p style={hintStyle}>Loading bookings...</p>}
        {error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && (
          <BookingTableList bookings={filtered} showActions onCancel={cancelBooking} />
        )}
      </section>
    </main>
  );
}

function TopNav() {
  return (
    <div style={topNavStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/bookings/create" style={linkStyle}>Create Booking</Link>
      <Link to="/bookings/admin" style={linkStyle}>Admin Dashboard</Link>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at 80% 0%, rgba(100,210,255,.16), transparent 34%), #050608",
  color: "#fff",
  padding: "28px max(20px, 4vw)",
};

const cardStyle = {
  maxWidth: 1220,
  margin: "22px auto 0",
  padding: "24px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.04)",
  backdropFilter: "blur(20px)",
};

const topNavStyle = {
  display: "flex",
  gap: 14,
  justifyContent: "center",
  flexWrap: "wrap",
};

const linkStyle = {
  color: "#64D2FF",
  textDecoration: "none",
  fontSize: ".86rem",
};

const titleStyle = { margin: 0, fontSize: "1.4rem", letterSpacing: "-.01em" };
const subTitleStyle = { margin: "8px 0 20px", color: "rgba(255,255,255,.72)", fontSize: ".9rem" };
const hintStyle = { color: "rgba(255,255,255,.65)", fontSize: ".86rem" };
const errorStyle = { color: "#FF6D8E", fontSize: ".86rem" };
