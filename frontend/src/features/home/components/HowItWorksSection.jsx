const STEPS = [
  {
    num: "01",
    icon: "🔐",
    color: "#0A84FF",
    title: "Sign in",
    desc: "Login with your SLIIT Google account securely via OAuth 2.0",
  },
  {
    num: "02",
    icon: "🏛️",
    color: "#BF5AF2",
    title: "Browse resources",
    desc: "Find available rooms, labs, or equipment using smart filters",
  },
  {
    num: "03",
    icon: "📅",
    color: "#30D158",
    title: "Request booking",
    desc: "Submit a booking request. Admin reviews and approves or rejects",
  },
  {
    num: "04",
    icon: "🔔",
    color: "#FF9F0A",
    title: "Get notified",
    desc: "Receive instant updates on approvals, rejections, and tickets",
  },
];

export default function HowItWorksSection() {
  return (
    <>
      <style>{`
        @property --a {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotateBorder {
          to { --a: 360deg; }
        }

        .step-border {
          position: relative;
          border-radius: 22px;
          padding: 2px;
        }

        .step-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 23px;
          background: conic-gradient(from var(--a, 0deg), transparent 0%, transparent 70%, var(--step-color) 85%, transparent 100%);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .step-border::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          border: 1.5px solid rgba(255,255,255,0.1);
          pointer-events: none;
          z-index: 2;
          transition: border-color 0.3s ease;
        }

        .step-outer:hover .step-border::before {
          opacity: 1;
          animation: rotateBorder 1.8s linear infinite;
        }

        .step-outer:hover .step-border::after {
          border-color: transparent;
        }

        .step-inner {
          background: rgba(255,255,255,0.055);
          border-radius: 20px;
          padding: 28px 22px 34px;
          min-height: 220px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease;
          z-index: 1;
        }

        .step-outer:hover .step-inner {
          transform: translateY(-5px);
        }

        .step-icon-wrap {
          width: 58px;
          height: 58px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: rgba(20,20,20,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .step-outer:hover .step-icon-wrap {
          transform: scale(1.1);
        }
      `}</style>

      <section
        id="howitworks"
        style={{
          background: "#0a0a0a",
          color: "#fff",
          padding: "80px 20px 140px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <p
            style={{
              color: "#BF5AF2",
              fontSize: "0.82rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            SIMPLE 4-STEP PROCESS
          </p>
          <h2
            style={{
              fontSize: "clamp(2.6rem, 6.5vw, 3.7rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              marginBottom: 16,
            }}
          >
            How it works
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              maxWidth: "640px",
              margin: "0 auto",
              fontSize: "1.05rem",
            }}
          >
            Booking a resource has never been this easy and secure.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "46px",
            flexWrap: "wrap",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="step-outer"
              style={{
                flex: "1 1 300px",
                maxWidth: "340px",
                position: "relative",
                cursor: "default",
              }}
            >
              <div
                className="step-border"
                style={{ "--step-color": step.color }}
              >
                <div className="step-inner">
                  {/* Colored top bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      borderRadius: "20px 20px 0 0",
                      background: step.color,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="step-icon-wrap"
                    style={{
                      border: `2px solid ${step.color}40`,
                      boxShadow: `0 0 16px ${step.color}20`,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step number */}
                  <div
                    style={{
                      color: step.color,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      marginBottom: 8,
                    }}
                  >
                    STEP {step.num}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      marginBottom: 10,
                      lineHeight: 1.25,
                      color: "#fff",
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.65,
                      fontSize: "0.88rem",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
