import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing login...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");
    const role = params.get("role");

    if (token) {
      // Store JWT token in sessionStorage (more secure than localStorage)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name, email, picture, role }),
      );

      setTimeout(() => {
        setStatus("Login successful! Redirecting...");
      }, 0);

      // Clean URL and redirect to home
      window.history.replaceState({}, document.title, "/");
      setTimeout(() => navigate("/"), 800);
    } else {
      setTimeout(() => {
        setStatus("Login failed. Redirecting...");
      }, 0);

      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,.1)",
          borderTop: "3px solid #0A84FF",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".95rem" }}>
        {status}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
