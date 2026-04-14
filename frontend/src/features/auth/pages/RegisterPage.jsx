import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", adminSecret: "" });
  const [showAdminField, setShowAdminField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          adminSecret: form.adminSecret || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email,
        picture: data.picture,
        role: data.role,
      }));
      navigate(data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.14)",
    borderRadius: 14,
    padding: "14px 18px",
    color: "#fff",
    fontSize: ".95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: ".82rem",
    color: "rgba(255,255,255,.5)",
    marginBottom: 6,
    letterSpacing: ".02em",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        position: "relative",
        padding: "24px 16px",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(10,132,255,.12) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          borderRadius: 28,
          padding: "52px 44px",
          background: "rgba(255,255,255,.07)",
          backdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255,255,255,.14)",
          boxShadow: "0 40px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05) inset",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(10,132,255,.6),transparent)",
            borderRadius: "28px 28px 0 0",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg,#0A84FF,#0060df)",
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 8px 24px rgba(10,132,255,.35)",
            }}
          >
            🏛️
          </div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-.03em",
              marginBottom: 8,
            }}
          >
            Create Account
          </h1>
          <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,.45)", lineHeight: 1.5 }}>
            Join SmartCampus to report and track issues
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div
              style={{
                background: "rgba(255,59,48,.13)",
                border: "1px solid rgba(255,59,48,.3)",
                borderRadius: 12,
                padding: "11px 16px",
                color: "#ff7070",
                fontSize: ".84rem",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={set("name")}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.14)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.14)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set("password")}
              required
              minLength={8}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.14)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={set("confirm")}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.14)")}
            />
          </div>

          {/* Admin access toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdminField((v) => !v)}
              style={{
                background: "none",
                border: "none",
                color: showAdminField ? "rgba(100,180,255,.7)" : "rgba(255,255,255,.3)",
                fontSize: ".78rem",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0",
                letterSpacing: ".01em",
              }}
            >
              {showAdminField ? "▾" : "▸"} Register as Admin
            </button>
            {showAdminField && (
              <input
                type="password"
                placeholder="Admin secret code"
                value={form.adminSecret}
                onChange={set("adminSecret")}
                style={{ ...inputStyle, marginTop: 8 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(191,90,242,.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.14)")}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(10,132,255,.5)"
                : "linear-gradient(135deg,#0A84FF,#0060df)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "15px 24px",
              fontSize: "1rem",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4,
              transition: "all .2s",
              letterSpacing: "-.01em",
              boxShadow: loading ? "none" : "0 8px 24px rgba(10,132,255,.35)",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.1)" }} />
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: ".78rem" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.1)" }} />
        </div>

        {/* Google option */}
        <button
          onClick={() => { window.location.href = "/oauth2/authorization/google"; }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#fff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 14,
            padding: "13px 24px",
            fontSize: ".93rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all .2s",
            boxShadow: "0 4px 16px rgba(0,0,0,.25)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f0f0"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google instead
        </button>

        {/* Sign in link */}
        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: ".85rem",
            color: "rgba(255,255,255,.35)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            onClick={() => {}}
            style={{ color: "rgba(100,180,255,.8)", fontWeight: 500, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
