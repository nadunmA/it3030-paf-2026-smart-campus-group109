import { useInView } from "../../hooks/useInView";

const FEATURES = [
  {
    icon: "🏛️",
    color: "#0A84FF",
    title: "Facilities Catalogue",
    desc: "Browse lecture halls, labs, meeting rooms, and equipment with real-time availability.",
    delay: 0.05,
  },
  {
    icon: "📅",
    color: "#30D158",
    title: "Smart Booking",
    desc: "Instant resource requests with automatic conflict detection and admin approval workflow.",
    delay: 0.1,
  },
  {
    icon: "🔧",
    color: "#FF9F0A",
    title: "Incident Tickets",
    desc: "Report faults with photo evidence. Track technician progress from open to resolved.",
    delay: 0.15,
  },
  {
    icon: "🔔",
    color: "#BF5AF2",
    title: "Live Notifications",
    desc: "Instant alerts for booking approvals, rejections, and all ticket status changes.",
    delay: 0.2,
  },
];

function FeatureCard({ icon, color, title, desc, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="feat-card"
      style={{
        background: "rgba(255,255,255,.055)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 20,
        padding: "1.6rem",
        backdropFilter: "blur(28px) saturate(180%)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.04) inset",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(44px)",
        transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}s, transform .75s cubic-bezier(.16,1,.3,1) ${delay}s, background .35s, border-color .35s`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          marginBottom: "1rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: ".95rem",
          fontWeight: 600,
          marginBottom: 8,
          letterSpacing: "-.01em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: ".79rem",
          color: "rgba(255,255,255,.42)",
          lineHeight: 1.65,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "0 max(28px,8vw) 80px",
      }}
    >
      <div
        className="sc-reveal"
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <p
          style={{
            fontSize: ".72rem",
            color: "#0A84FF",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Platform features
        </p>
        <h2
          style={{
            fontSize: "clamp(1.8rem,4vw,2.9rem)",
            fontWeight: 700,
            letterSpacing: "-.03em",
            lineHeight: 1.1,
          }}
        >
          Everything your campus needs.
          <br />
          <span style={{ color: "rgba(255,255,255,.28)" }}>In one place.</span>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
          gap: 16,
        }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
