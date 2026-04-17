import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginModal from "../../auth/components/GoogleLoginModal";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8080";

export default function SmartCampusHome() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const token = sessionStorage.getItem("token");
  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? (() => { try { return JSON.parse(rawUser); } catch { return null; } })() : null;

  const handleDashboard = () => {
    if (!user) { setModalOpen(true); return; }
    const role = (user.role || "USER").toUpperCase();
    if (role === "ADMIN") navigate("/admin/dashboard");
    else if (role === "TECHNICIAN") navigate("/technician/dashboard");
    else navigate("/dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0A0A0F 0%,#0D1117 50%,#0A0A14 100%)",
      color: "#fff",
      fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,.08)",
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.04em" }}>
          Smart<span style={{ color: "#0A84FF" }}>Campus</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {token && user ? (
            <>
              <button onClick={handleDashboard} style={navBtn("#0A84FF", "#fff")}>
                Dashboard
              </button>
              <button onClick={handleLogout} style={navBtn("transparent", "rgba(255,255,255,.6)", "1px solid rgba(255,255,255,.15)")}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setModalOpen(true)} style={navBtn("#0A84FF", "#fff")}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 99, background: "rgba(10,132,255,.12)",
          border: "1px solid rgba(10,132,255,.25)", color: "#0A84FF", fontSize: 12, fontWeight: 600,
          letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 32,
        }}>
          Group 423 · IT3030 PAF 2026
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 800, letterSpacing: "-.05em", lineHeight: 1.1, marginBottom: 20, maxWidth: 800 }}>
          Intelligent Campus<br />
          <span style={{ color: "#0A84FF" }}>Management</span> Platform
        </h1>

        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7, marginBottom: 48 }}>
          Book resources, report incidents, and manage campus operations — all in one unified platform.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setModalOpen(true)} style={{
            padding: "14px 32px", borderRadius: 14, background: "#0A84FF", color: "#fff",
            border: "none", fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", transition: "all .2s",
          }}>
            Get Started
          </button>
          <button onClick={() => navigate("/resources")} style={{
            padding: "14px 32px", borderRadius: 14, background: "rgba(255,255,255,.06)",
            color: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.12)",
            fontSize: "1rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Browse Resources
          </button>
        </div>

        {/* Feature cards */}
        <div style={{ display: "flex", gap: 20, marginTop: 80, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {[
            { icon: "📅", title: "Resource Booking", desc: "Reserve halls, labs, and equipment with real-time availability" },
            { icon: "🔧", title: "Maintenance Tickets", desc: "Report and track campus maintenance issues instantly" },
            { icon: "🔔", title: "Smart Notifications", desc: "Stay updated with booking approvals and ticket status changes" },
          ].map((f) => (
            <div key={f.title} style={{
              flex: "1 1 220px", maxWidth: 260, background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: "28px 24px", textAlign: "left",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,.25)", fontSize: 12 }}>
        © 2026 SmartCampus · Group 423
      </footer>

      <GoogleLoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function navBtn(bg, color, border = "none") {
  return {
    padding: "8px 20px", borderRadius: 10, background: bg, color, border,
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  };
}
