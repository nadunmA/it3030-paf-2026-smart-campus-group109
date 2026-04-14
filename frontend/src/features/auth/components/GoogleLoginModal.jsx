import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "./GoogleIcon";

export default function GoogleLoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", h);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmailMode(false);
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email,
        picture: data.picture,
        role: data.role,
      }));
      onClose();
      if (data.role === "ADMIN") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#fff",
    fontSize: ".9rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.7)",
        backdropFilter: "blur(18px) saturate(160%)",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: 420,
          maxWidth: "92vw",
          borderRadius: 28,
          padding: "52px 44px 44px",
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06) inset",
          animation: "slideUp .3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(10,132,255,.22) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.15)",
            color: "rgba(255,255,255,.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.2)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.1)";
            e.currentTarget.style.color = "rgba(255,255,255,.6)";
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2
            style={{
              fontSize: "1.55rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-.03em",
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Sign in to SmartCampus
          </h2>
          <p
            style={{
              fontSize: ".88rem",
              color: "rgba(255,255,255,.5)",
              lineHeight: 1.5,
            }}
          >
            {emailMode
              ? "Enter your credentials to continue"
              : "Use your SLIIT Google account to continue"}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={() => {
            window.location.href = "/oauth2/authorization/google";
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: hov ? "#f0f0f0" : "#fff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 16,
            padding: "14px 24px",
            fontSize: ".97rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all .2s",
            transform: hov ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hov
              ? "0 12px 32px rgba(0,0,0,.35)"
              : "0 4px 16px rgba(0,0,0,.25)",
            letterSpacing: "-.01em",
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
          <span style={{ color: "rgba(255,255,255,.35)", fontSize: ".78rem", letterSpacing: ".05em" }}>
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
        </div>

        {/* Email/Password form */}
        {emailMode ? (
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {error && (
              <div
                style={{
                  background: "rgba(255,59,48,.15)",
                  border: "1px solid rgba(255,59,48,.35)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#ff6b6b",
                  fontSize: ".82rem",
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.15)")}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(10,132,255,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.15)")}
            />
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
                borderRadius: 14,
                padding: "14px 24px",
                fontSize: ".97rem",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s",
                letterSpacing: "-.01em",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setEmailMode(false); setError(""); }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,.4)",
                fontSize: ".82rem",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "4px 0",
              }}
            >
              ← Back
            </button>
          </form>
        ) : (
          <button
            onClick={() => setEmailMode(true)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,.07)",
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: 16,
              padding: "14px 24px",
              color: "rgba(255,255,255,.8)",
              fontSize: ".97rem",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all .2s",
              letterSpacing: "-.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.12)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.07)";
              e.currentTarget.style.color = "rgba(255,255,255,.8)";
            }}
          >
            Sign in with Email
          </button>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.35)", marginBottom: 10 }}>
            Don&apos;t have an account?{" "}
            <span
              onClick={() => { onClose(); navigate("/register"); }}
              style={{ color: "rgba(100,180,255,.8)", cursor: "pointer", fontWeight: 500 }}
            >
              Create one
            </span>
          </p>
          <p
            style={{
              fontSize: ".76rem",
              color: "rgba(255,255,255,.25)",
              lineHeight: 1.7,
            }}
          >
            By continuing, you agree to our{" "}
            <span style={{ color: "rgba(100,180,255,.6)", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "rgba(100,180,255,.6)", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(10,132,255,.5),transparent)",
            borderRadius: "0 0 28px 28px",
          }}
        />
      </div>
    </div>
  );
}
