import { useInView } from "../../../hooks/useInView";

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
        position: "relative",
        padding: "2px",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(60px) scale(0.94)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {/* Outer Gradient Border Container */}
      <div
        className="gradient-border"
        style={{
          position: "relative",
          borderRadius: 28,
          background: `linear-gradient(135deg, ${color}40 0%, ${color}15 50%, transparent 100%)`,
          padding: 2,
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${color}60 0%, ${color}30 50%, ${color}10 100%)`;
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${color}40 0%, ${color}15 50%, transparent 100%)`;
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Glass Card Container */}
        <div
          style={{
            position: "relative",
            background: `
              linear-gradient(135deg, 
                rgba(255,255,255,.06) 0%, 
                rgba(255,255,255,.02) 50%,
                rgba(0,0,0,.02) 100%
              )
            `,
            borderRadius: 26,
            padding: "2.2rem 1.9rem",
            backdropFilter: "blur(30px) saturate(150%)",
            boxShadow: `
              0 8px 32px rgba(0,0,0,.4),
              inset 0 1px 0 rgba(255,255,255,.1),
              0 0 0 1px rgba(255,255,255,.05) inset
            `,
            overflow: "hidden",
            transition: "transform 0.3s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {/* Ambient Background Glow */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-20%",
              width: "140%",
              height: "140%",
              background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 50%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />

          {/* Top Shine Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 60,
              background: `linear-gradient(180deg, rgba(255,255,255,.08) 0%, transparent 100%)`,
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />

          {/* Icon Container with Pulse Effect */}
          <div
            style={{
              position: "relative",
              width: "fit-content",
              marginBottom: "1.5rem",
            }}
          >
            {/* Outer Pulse Ring */}
            <div
              className="pulse-ring"
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: "50%",
                border: `2px solid ${color}50`,
                animation: "pulse 3s ease-in-out infinite",
              }}
            />

            {/* Icon Glass Container */}
            <div
              style={{
                position: "relative",
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: `
                  linear-gradient(135deg, 
                    ${color}25 0%, 
                    ${color}12 50%,
                    ${color}08 100%
                  )
                `,
                border: `1.5px solid ${color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.7rem",
                boxShadow: `
                  0 8px 24px ${color}30,
                  inset 0 2px 4px rgba(255,255,255,.15),
                  inset 0 -2px 4px rgba(0,0,0,.15),
                  0 0 20px ${color}20
                `,
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Icon Shine */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, rgba(255,255,255,.2) 0%, transparent 60%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Actual Icon */}
              <div style={{ position: "relative", zIndex: 1 }}>{icon}</div>
            </div>

            {/* Glowing Dot */}
            <div
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                boxShadow: `
                  0 0 12px ${color},
                  0 0 20px ${color}80,
                  inset 0 1px 2px rgba(255,255,255,.5)
                `,
                animation: "glow 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Content Container */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Title */}
            <div
              style={{
                fontSize: "1.08rem",
                fontWeight: 700,
                marginBottom: 12,
                letterSpacing: "-.025em",
                background: `linear-gradient(135deg, #fff 0%, rgba(255,255,255,.75) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: ".84rem",
                color: "rgba(255,255,255,.52)",
                lineHeight: 1.7,
                letterSpacing: ".005em",
              }}
            >
              {desc}
            </div>
          </div>

          {/* Bottom Gradient Accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${color}50 50%, 
                transparent 100%
              )`,
              filter: "blur(3px)",
              opacity: 0.7,
            }}
          />

          {/* Corner Highlights */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              background: `radial-gradient(circle at top right, ${color}10 0%, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.15);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
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
        padding: "50px max(28px,8vw) 145px",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Large Gradient Orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #0A84FF18 0%, transparent 65%)",
            filter: "blur(80px)",
            animation: "float 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "10%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #BF5AF218 0%, transparent 65%)",
            filter: "blur(80px)",
            animation: "float 15s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #30D15812 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float 10s ease-in-out infinite",
          }}
        />

        {/* Curved Lines */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.15,
          }}
        >
          <defs>
            <linearGradient
              id="curveGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#BF5AF2" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="curveGradient2"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#30D158" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF9F0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,200 Q 400,100 800,300 T 1600,200"
            stroke="url(#curveGradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 0,400 Q 500,300 1000,500 T 2000,400"
            stroke="url(#curveGradient2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Section Header */}
      <div
        className="sc-reveal"
        style={{
          textAlign: "center",
          marginBottom: 75,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background:
              "linear-gradient(135deg, rgba(10,132,255,.12) 0%, rgba(10,132,255,.05) 100%)",
            border: "1px solid rgba(10,132,255,.3)",
            borderRadius: 50,
            padding: "8px 20px",
            marginBottom: 20,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0A84FF",
              boxShadow: "0 0 10px #0A84FF",
              animation: "glow 2s ease-in-out infinite",
            }}
          />
          <p
            style={{
              fontSize: ".7rem",
              color: "#0A84FF",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Platform Features
          </p>
        </div>

        {/* Main Heading */}
        <h2
          style={{
            fontSize: "clamp(2rem,4.5vw,3.3rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            lineHeight: 1.15,
            marginBottom: 18,
            background:
              "linear-gradient(135deg, #fff 20%, rgba(255,255,255,.6) 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Everything your campus needs.
        </h2>

        {/* Subheading */}
        <p
          style={{
            fontSize: "clamp(1.05rem,2vw,1.28rem)",
            color: "rgba(255,255,255,.4)",
            fontWeight: 300,
            letterSpacing: "-.005em",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Streamlined facilities management in one unified platform.
        </p>
      </div>

      {/* Features Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 28,
          position: "relative",
          zIndex: 1,
        }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.98);
          }
        }
      `}</style>
    </section>
  );
}
