import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginModal from "../components/GoogleLoginModal";

export default function AuthenticationPage() {
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "40px",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-.03em",
              marginBottom: 10,
            }}
          >
            Smart<span style={{ color: "#667eea" }}>Campus</span>
          </div>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 4px" }}>
            Welcome to Smart Campus Operations Hub
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
            Manage bookings, tickets, and resources efficiently
          </p>
        </div>

        {/* Login Form */}
        <div style={{ marginBottom: 32 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="your.email@university.edu"
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 14,
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "all .15s",
              outline: "none",
              backgroundColor: "#F9FAFB",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.backgroundColor = "#fff";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, .1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.backgroundColor = "#F9FAFB";
              e.target.style.boxShadow = "none";
            }}
          />
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              marginTop: 6,
              margin: "6px 0 0",
            }}
          >
            Sign in with your university email to continue
          </p>
        </div>

        {/* OR Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={() => setShowGoogleModal(true)}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 600,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all .15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F9FAFB";
            e.currentTarget.style.borderColor = "#D1D5DB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          <span style={{ fontSize: 18 }}>🔐</span>
          Sign in with Google
        </button>

        {/* Features Grid */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 12,
            }}
          >
            Features
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                background: "#F3F4F6",
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 600, color: "#1F2937" }}>📅</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                Manage bookings
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: "#F3F4F6",
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 600, color: "#1F2937" }}>🔧</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                Track tickets
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: "#F3F4F6",
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 600, color: "#1F2937" }}>🔔</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                Get notified
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: "#F3F4F6",
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 600, color: "#1F2937" }}>🏢</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                View resources
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid #E5E7EB",
            textAlign: "center",
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          <p style={{ margin: 0 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p style={{ margin: "8px 0 0" }}>
            Questions?{" "}
            <a
              href="mailto:support@university.edu"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Google Login Modal */}
      {showGoogleModal && (
        <GoogleLoginModal onClose={() => setShowGoogleModal(false)} />
      )}
    </div>
  );
}
