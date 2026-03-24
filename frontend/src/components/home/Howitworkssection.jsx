const STEPS = [
  {
    num: "01",
    icon: "🔐",
    color: "#0A84FF",
    dir: "sc-reveal-left",
    delay: 0.0,
    title: "Sign in",
    desc: "Login with your SLIIT Google account securely via OAuth 2.0",
  },
  {
    num: "02",
    icon: "🏛️",
    color: "#BF5AF2",
    dir: "sc-reveal-left",
    delay: 0.1,
    title: "Browse resources",
    desc: "Find available rooms, labs, or equipment using smart filters",
  },
  {
    num: "03",
    icon: "📅",
    color: "#30D158",
    dir: "sc-reveal-right",
    delay: 0.1,
    title: "Request booking",
    desc: "Submit a booking request. Admin reviews and approves or rejects",
  },
  {
    num: "04",
    icon: "🔔",
    color: "#FF9F0A",
    dir: "sc-reveal-right",
    delay: 0.0,
    title: "Get notified",
    desc: "Receive instant updates on approvals, rejections, and tickets",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="howitworks"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "20px max(28px,8vw) 100px",
        marginTop: 40,
      }}
    >
      <div
        className="sc-reveal"
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <p
          style={{
            fontSize: ".72rem",
            color: "#BF5AF2",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Workflow
        </p>
        <h2
          style={{
            fontSize: "clamp(1.8rem,4vw,2.9rem)",
            fontWeight: 700,
            letterSpacing: "-.03em",
            lineHeight: 1.1,
          }}
        >
          How it works
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 12,
        }}
      >
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className={`step-card ${s.dir}`}
            style={{
              background: "rgba(255,255,255,.055)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 20,
              padding: "2rem 1.6rem",
              textAlign: "center",
              transitionDelay: `${s.delay}s`,
              backdropFilter: "blur(28px) saturate(180%)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.04) inset",
            }}
          >
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: `${s.color}50`,
                marginBottom: 10,
                letterSpacing: "-.02em",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: 14,
                display: "inline-block",
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${i * 0.45}s`,
              }}
            >
              {s.icon}
            </div>
            <div
              style={{ fontSize: ".9rem", fontWeight: 600, marginBottom: 8 }}
            >
              {s.title}
            </div>
            <div
              style={{
                fontSize: ".78rem",
                color: "rgba(255,255,255,.4)",
                lineHeight: 1.62,
              }}
            >
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
