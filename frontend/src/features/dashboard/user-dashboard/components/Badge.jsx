export default function Badge({ type, children }) {
  const styles = {
    APPROVED: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    PENDING: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    REJECTED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    CANCELLED: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
    OPEN: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    IN_PROGRESS: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    RESOLVED: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    CLOSED: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
    HIGH: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    MEDIUM: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    LOW: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    USER: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    ADMIN: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    TECHNICIAN: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    AVAILABLE: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    UNAVAILABLE: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    MAINTENANCE: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };

  const s = styles[type] || styles.CANCELLED;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".01em",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          display: "inline-block",
        }}
      />
      {children}
    </span>
  );
}
