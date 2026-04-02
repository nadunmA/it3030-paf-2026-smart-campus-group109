import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingFilter from "../components/BookingFilter";
import BookingTableList from "../components/BookingTableList";
import BookingToast from "../components/BookingToast";
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
  const [viewMode, setViewMode] = useState("PENDING");
  const [filters, setFilters] = useState({ status: "PENDING", date: undefined });
  const [toast, setToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const role = useMemo(() => getRole(), []);
  const isAdmin = role === "ADMIN";

  const { bookings, loading, error, load } = useBookings((params) => {
    const effective = params || filters;
    return bookingApi.getAll({ date: effective.date, status: effective.status });
  });

  const applyFilters = async (nextFilters) => {
    const merged = {
      status: nextFilters.status || undefined,
      date: nextFilters.date || undefined,
    };
    setFilters(merged);
    await load(merged);
  };

  const switchView = async (nextMode) => {
    setViewMode(nextMode);
    const nextFilters = {
      status: nextMode === "PENDING" ? "PENDING" : undefined,
      date: filters.date,
    };
    setFilters(nextFilters);
    await load(nextFilters);
  };

  const approveBooking = async (booking) => {
    const shouldApprove = window.confirm(
      `Approve booking for ${booking.resourceId} on ${booking.bookingDate}?`,
    );
    if (!shouldApprove) return;

    setActionLoadingId(booking.id);
    try {
      await bookingApi.approve(booking.id);
      await load(filters);
      setToast({ type: "success", message: "Booking approved successfully." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to approve booking." });
    } finally {
      setActionLoadingId("");
    }
  };

  const rejectBooking = async (booking) => {
    const shouldReject = window.confirm(
      `Reject booking for ${booking.resourceId} on ${booking.bookingDate}?`,
    );
    if (!shouldReject) return;

    const reason = window.prompt("Optional rejection reason:", "") || "";

    setActionLoadingId(booking.id);
    try {
      await bookingApi.reject(booking.id, reason);
      await load(filters);
      setToast({ type: "success", message: "Booking rejected successfully." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to reject booking." });
    } finally {
      setActionLoadingId("");
    }
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

        <div style={tabRowStyle}>
          <button
            type="button"
            onClick={() => switchView("PENDING")}
            style={tabStyle(viewMode === "PENDING")}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => switchView("ALL")}
            style={tabStyle(viewMode === "ALL")}
          >
            All Bookings
          </button>
        </div>

        <BookingFilter
          onApply={applyFilters}
          defaultStatus={filters.status || ""}
          defaultDate={filters.date || ""}
        />

        {loading && <p style={hintStyle}>Loading requests...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && (
          <BookingTableList
            bookings={bookings}
            showActions
            onApprove={approveBooking}
            onReject={rejectBooking}
            actionLoadingId={actionLoadingId}
          />
        )}

        {!loading && !error && bookings.length === 0 && (
          <p style={hintStyle}>No booking requests found for the selected view.</p>
        )}
      </section>
      <BookingToast toast={toast} onClose={() => setToast(null)} />
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
const tabRowStyle = { display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" };
const tabStyle = (active) => ({
  border: "1px solid rgba(255,255,255,.2)",
  borderRadius: 999,
  background: active ? "rgba(10,132,255,.24)" : "rgba(255,255,255,.06)",
  color: "#fff",
  padding: "7px 12px",
  fontSize: ".8rem",
  cursor: "pointer",
});
