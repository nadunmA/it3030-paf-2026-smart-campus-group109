import { useState } from "react";

export default function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
}) {
  const [hov, setHov] = useState(false);
  const sz = { sm: "8px 18px", md: "10px 22px", lg: "14px 34px" }[size];
  const fs = { sm: ".82rem", md: ".87rem", lg: ".97rem" }[size];
  const base = {
    borderRadius: 980,
    padding: sz,
    fontSize: fs,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "-.01em",
    fontFamily: "inherit",
    border: "none",
    transition: "all .25s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transform: hov ? "scale(1.04)" : "scale(1)",
    userSelect: "none",
  };
  const styles = {
    primary: {
      ...base,
      background: hov ? "#0070E0" : "#0A84FF",
      color: "#fff",
    },
    ghost: {
      ...base,
      background: hov ? "rgba(255,255,255,.1)" : "transparent",
      color: "#fff",
      border:
        "1px solid " +
        (hov ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.28)"),
    },
    white: {
      ...base,
      background: hov ? "rgba(255,255,255,.92)" : "#fff",
      color: "#000",
    },
  };
  return (
    <button
      type={type}
      style={styles[variant]}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}
