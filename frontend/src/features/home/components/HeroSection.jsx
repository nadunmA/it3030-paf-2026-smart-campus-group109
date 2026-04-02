import Btn from "../../../components/ui/Btn";
import GoogleIcon from "../../auth/components/Googleicon";

export default function HeroSection({ onLoginOpen, onGoTo }) {
  const ticker = [
    "Facilities Booking",
    "Incident Reporting",
    "Admin Approvals",
    "Real-time Notifications",
    "OAuth 2.0 Login",
    "Role-based Access",
    "Conflict Detection",
    "Technician Tracking",
  ];

  return (
    <>
      {/* Hero */}
      <section
        id="hero"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "130px max(28px,8vw) 80px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(10,132,255,.15)",
            border: "1px solid rgba(10,132,255,.35)",
            borderRadius: 980,
            padding: "5px 15px",
            marginBottom: 28,
            fontSize: ".74rem",
            color: "rgba(255,255,255,.8)",
            letterSpacing: ".04em",
            animation: "fadeUp .8s ease .1s both",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0A84FF",
              animation: "pulse 2s infinite",
              display: "inline-block",
            }}
          />
          Now in production — IT3030 · Semester 1, 2026
        </div>

        <h1
          style={{
            fontSize: "clamp(2.8rem,7vw,5.5rem)",
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-.04em",
            margin: "0 0 22px",
            maxWidth: 820,
            animation: "fadeUp .8s ease .2s both",
          }}
        >
          The smarter way to <span className="shimmer-text">run campus</span>{" "}
          operations.
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "rgba(255,255,255,.55)",
            maxWidth: 500,
            margin: "0 auto 40px",
            lineHeight: 1.65,
            animation: "fadeUp .8s ease .35s both",
          }}
        >
          Book resources, report incidents, and manage your university's
          facilities — all from one beautifully unified platform.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeUp .8s ease .5s both",
          }}
        >
          <Btn variant="primary" size="lg" onClick={onLoginOpen}>
            Get started free
          </Btn>
          <Btn variant="ghost" size="lg" onClick={() => onGoTo("features")}>
            Learn more
          </Btn>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 44,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp .8s ease .68s both",
          }}
        >
          {[
            "No double-bookings",
            "Role-based access",
            "Real-time notifications",
          ].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 980,
                padding: "7px 16px",
                fontSize: ".77rem",
                color: "rgba(255,255,255,.7)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ color: "#30D158" }}>✓</span>
              {t}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 34,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,.45)",
            fontSize: ".65rem",
            letterSpacing: ".13em",
            animation: "fadeUp 1s ease 1.3s both",
          }}
        >
          <div
            style={{
              width: 1,
              height: 36,
              background:
                "linear-gradient(to bottom,rgba(255,255,255,.55),transparent)",
            }}
          />
          SCROLL
        </div>
      </section>

      {/* Ticker */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          padding: "18px 0",
          borderTop: "1px solid rgba(255,255,255,.06)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "rgba(255,255,255,.02)",
        }}
      >
        <div className="ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 28px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#0A84FF",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: ".82rem",
                  color: "rgba(255,255,255,.38)",
                  letterSpacing: ".04em",
                }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
