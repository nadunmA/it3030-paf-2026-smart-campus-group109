import { useEffect, useRef, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState("Processing login...");
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

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
    const name = params.get("name") || hashParams.get("name");
    const email = params.get("email") || hashParams.get("email");
    const picture = params.get("picture") || hashParams.get("picture");
    const role = (
      params.get("role") ||
      hashParams.get("role") ||
      "USER"
    ).toUpperCase();
    const oauthError = params.get("error") || hashParams.get("error");
    const oauthMessage = params.get("message") || hashParams.get("message");
    const existingToken = sessionStorage.getItem("token");
    const effectiveToken = token && token.trim() !== "" ? token : existingToken;

    if (effectiveToken && effectiveToken.trim() !== "") {
      handledRef.current = true;
      sessionStorage.setItem("token", effectiveToken);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name, email, picture, role }),
      );
      window.history.replaceState({}, document.title, "/auth/callback");

      setTimeout(() => {
        setStatus("Login successful! Redirecting...");
        setTimeout(() => {
          if (role === "ADMIN") {
            window.location.replace("/admin/dashboard");
          } else if (role === "TECHNICIAN") {
            window.location.replace("/technician/dashboard");
          } else {
            window.location.replace("/dashboard");
          }
        }, 700);
      }, 0);
    } else {
      handledRef.current = true;
      const normalizedError = (oauthError || "").toLowerCase();
      const friendlyMessage =
        oauthMessage ||
        (normalizedError === "account_suspended"
          ? "Your account is suspended. Please contact an administrator."
          : null);
      setTimeout(() => {
        setStatus(
          friendlyMessage
            ? `${friendlyMessage} Redirecting...`
            : oauthError
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
