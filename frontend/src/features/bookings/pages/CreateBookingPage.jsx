import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import BookingToast from "../components/BookingToast";
import { bookingApi } from "../services/bookingApi";

export default function CreateBookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      await bookingApi.create(payload);
      setSuccess("Booking request submitted and is now pending approval.");
      setToast({ type: "success", message: "Booking created successfully." });
    } catch (err) {
      setError(err.message || "Failed to create booking.");
      setToast({ type: "error", message: err.message || "Booking creation failed." });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={pageStyle}>
      <TopNav />
      <section style={cardStyle}>
        <h1 style={titleStyle}>Create Booking</h1>
        <p style={subTitleStyle}>Submit a new booking request for a campus resource.</p>

        {success && <div style={successStyle}>{success}</div>}
        {error && <div style={errorStyle}>{error}</div>}

        <BookingForm onSubmit={handleSubmit} submitting={submitting} />
      </section>
      <BookingToast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

function TopNav() {
  return (
    <div style={topNavStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/bookings/me" style={linkStyle}>My Bookings</Link>
      <Link to="/bookings/admin" style={linkStyle}>Admin Dashboard</Link>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at 20% 10%, rgba(10,132,255,.2), transparent 32%), #050608",
  color: "#fff",
  padding: "28px max(20px, 4vw)",
};

const cardStyle = {
  maxWidth: 980,
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
const successStyle = { marginBottom: 12, padding: "10px 12px", borderRadius: 10, color: "#5BDE84", border: "1px solid rgba(48,209,88,.4)", background: "rgba(48,209,88,.12)" };
const errorStyle = { marginBottom: 12, padding: "10px 12px", borderRadius: 10, color: "#FF6D8E", border: "1px solid rgba(255,55,95,.4)", background: "rgba(255,55,95,.12)" };
