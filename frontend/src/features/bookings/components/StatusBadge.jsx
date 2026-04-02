const STATUS_COLORS = {
  PENDING: { bg: "rgba(255,159,10,.18)", border: "rgba(255,159,10,.5)", text: "#FFB340" },
  APPROVED: { bg: "rgba(48,209,88,.16)", border: "rgba(48,209,88,.5)", text: "#5BDE84" },
  REJECTED: { bg: "rgba(255,55,95,.16)", border: "rgba(255,55,95,.5)", text: "#FF6D8E" },
  CANCELLED: { bg: "rgba(120,120,128,.2)", border: "rgba(120,120,128,.45)", text: "#D1D1D6" },
};

export default function StatusBadge({ status }) {
  const token = STATUS_COLORS[status] || STATUS_COLORS.CANCELLED;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: ".72rem",
        fontWeight: 600,
        letterSpacing: ".01em",
        color: token.text,
        background: token.bg,
        border: `1px solid ${token.border}`,
        minWidth: 92,
      }}
    >
      {status}
    </span>
  );
}
