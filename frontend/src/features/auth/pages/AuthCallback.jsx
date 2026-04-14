import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState("Processing login...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const token =
      params.get("token") ||
      params.get("access_token") ||
      params.get("jwt") ||
      hashParams.get("token") ||
      hashParams.get("access_token") ||
      hashParams.get("jwt");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");
    const role = (params.get("role") || "USER").toUpperCase();
    const oauthError = params.get("error") || hashParams.get("error");

    if (token && token.trim() !== "") {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name, email, picture, role }),
      );

      setTimeout(() => {
        setStatus("Login successful! Redirecting...");
        setTimeout(() => {
          if (role === "ADMIN") {
            window.location.replace("/admin/dashboard");
          } else {
            window.location.replace("/dashboard");
          }
        }, 700);
      }, 0);
    } else {
      setTimeout(() => {
        setStatus(
          oauthError
            ? `Login failed (${oauthError}). Redirecting...`
            : "Login failed. Redirecting...",
        );
        setTimeout(() => window.location.replace("/"), 1500);
      }, 0);
    }
  }, []);

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
      }}
    >
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
      <p style={{ color: "rgba(255,255,255,.6)" }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
