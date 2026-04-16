import { useState, useEffect } from "react";
import GoogleIcon from "../components/Googleicon";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8080";

export default function GoogleLoginModal({ isOpen, onClose }) {
  const [hov, setHov] = useState(false);

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

  if (!isOpen) return null;

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
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            Use your SLIIT Google account to continue
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={() => {
            // Hit backend directly so OAuth always starts from Spring Security,
            // even if local proxy settings or hostnames differ.
            window.location.href = `${API_ORIGIN}/oauth2/authorization/google`;
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
            padding: "16px 24px",
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

        {/* Footer note */}
        <div style={{ marginTop: 28, textAlign: "center" }}>
          <p
            style={{
              fontSize: ".76rem",
              color: "rgba(255,255,255,.3)",
              lineHeight: 1.7,
            }}
          >
            By continuing, you agree to our{" "}
            <span style={{ color: "rgba(100,180,255,.8)", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "rgba(100,180,255,.8)", cursor: "pointer" }}>
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
