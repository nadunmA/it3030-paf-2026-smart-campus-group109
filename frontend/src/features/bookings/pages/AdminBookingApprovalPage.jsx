import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingFilter from "../components/BookingFilter";
import BookingTableList from "../components/BookingTableList";
import useBookings from "../hooks/useBookings";
import { bookingApi } from "../services/bookingApi";

function getRole() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return "USER";
    const user = JSON.parse(raw);
    return user?.role || "USER";
  } catch {
    return "USER";
  }
}

export default function AdminBookingApprovalPage() {
  const [filters, setFilters] = useState({ status: "PENDING" });
  const role = useMemo(() => getRole(), []);
  const isAdmin = role === "ADMIN";

  const { bookings, loading, error, load } = useBookings(() =>
    bookingApi.getAll({ date: filters.date, status: filters.status }),
  );

  const applyFilters = async (nextFilters) => {
    const merged = {
      status: nextFilters.status || undefined,
      date: nextFilters.date || undefined,
    };
    setFilters(merged);
    await load();
  };

  const approveBooking = async (booking) => {
    await bookingApi.approve(booking.id);
    await load();
  };

  const rejectBooking = async (booking) => {
    const reason = window.prompt("Optional rejection reason:", "") || "";
    await bookingApi.reject(booking.id, reason);
    await load();
  };

  if (!isAdmin) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={titleStyle}>Admin Booking Dashboard</h1>
          <p style={errorStyle}>Access denied. ADMIN role required.</p>
          <Link to="/bookings/me" style={linkStyle}>Go to My Bookings</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <TopNav />
      <section style={cardStyle}>
        <h1 style={titleStyle}>Admin Booking Approval Dashboard</h1>
        <p style={subTitleStyle}>Review pending requests and approve or reject.</p>

        <BookingFilter
          onApply={applyFilters}
          defaultStatus={filters.status || ""}
          defaultDate={filters.date || ""}
        />

        {loading && <p style={hintStyle}>Loading requests...</p>}
        {error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && (
          <BookingTableList
            bookings={bookings}
            showActions
            onApprove={approveBooking}
            onReject={rejectBooking}
          />
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
      <Link to="/bookings/me" style={linkStyle}>My Bookings</Link>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at 10% 8%, rgba(191,90,242,.16), transparent 30%), #050608",
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
