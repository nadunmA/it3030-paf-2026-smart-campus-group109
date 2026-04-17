export default function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8EBF0",
        borderRadius: 14,
        padding: "18px 20px",
        transition: "opacity .5s ease, transform .5s ease",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: ".07em",
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-.03em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
