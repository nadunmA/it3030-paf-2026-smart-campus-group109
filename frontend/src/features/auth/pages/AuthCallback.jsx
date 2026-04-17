import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    sessionStorage.setItem("token", token);

    apiGet("/auth/me")
      .then((data) => {
        const user = data?.user || data;
        if (user) {
          sessionStorage.setItem("user", JSON.stringify(user));
          const role = (user.role || "USER").toUpperCase();
          if (role === "ADMIN") {
            navigate("/admin/dashboard");
          } else if (role === "TECHNICIAN") {
            navigate("/technician/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0F",
        color: "#fff",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,255,255,.15)",
            borderTopColor: "#0A84FF",
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14 }}>
          Signing you in...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
