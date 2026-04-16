const STYLES = {
  ACTIVE: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  OUT_OF_SERVICE: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  AVAILABLE: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  UNAVAILABLE: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  MAINTENANCE: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
};

function normalize(value) {
  return (value || "").toString().trim().toUpperCase();
}

export default function StatusBadge({ status, availability, children }) {
  const key = normalize(status || availability);
  const style = STYLES[key] || {
    bg: "#F1F5F9",
    color: "#64748B",
    border: "#E2E8F0",
  };
  const label = children || key || "UNKNOWN";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".02em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: style.color,
        }}
      />
      {label.replaceAll("_", " ")}
    </span>
  );
}
