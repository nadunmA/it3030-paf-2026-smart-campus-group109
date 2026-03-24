import Counter from "../common/Counter";

const STATS = [
  { target: 200, suffix: "+", label: "Bookable resources", delay: 0 },
  { target: 1500, suffix: "+", label: "Active users", delay: 0.1 },
  { target: 98, suffix: "%", label: "Uptime guarantee", delay: 0.2 },
  { target: 5, suffix: "", label: "Core modules", delay: 0.3 },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "80px max(28px,8vw) 110px",
        marginTop: 120,
      }}
    >
      <div
        className="sc-reveal"
        style={{
          background: "rgba(255,255,255,.055)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 24,
          padding: "44px 32px",
          backdropFilter: "blur(28px) saturate(180%)",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          boxShadow:
            "0 8px 40px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.04) inset",
        }}
      >
        {STATS.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <Counter {...s} />
            <div
              style={{
                fontSize: ".8rem",
                color: "rgba(255,255,255,.4)",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
