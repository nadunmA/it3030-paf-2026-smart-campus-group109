export default function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
  ...props
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 20px",
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "all .15s",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: { background: "#0A84FF", color: "#fff" },
    secondary: { background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" },
    danger: { background: "#EF4444", color: "#fff" },
    ghost: { background: "transparent", color: "#6B7280", border: "1px solid #E2E8F0" },
    success: { background: "#10B981", color: "#fff" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
