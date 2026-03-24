import Btn from "../common/Btn";
import GoogleIcon from "../common/GoogleIcon";

export default function CtaSection({ onGoTo }) {
  return (
    <section
      id="cta"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "0 max(28px,8vw) 80px",
      }}
    >
      <div
        className="sc-reveal-scale"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg,rgba(10,132,255,.18) 0%,rgba(191,90,242,.12) 50%,rgba(48,209,88,.08) 100%)",
            borderRadius: 32,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 32,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "15%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(10,132,255,.25) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(191,90,242,.18) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px max(40px,8%)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: ".75rem",
                color: "rgba(255,255,255,.5)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Ready to get started?
            </p>
            <h2
              style={{
                fontSize: "clamp(1.6rem,4vw,2.5rem)",
                fontWeight: 700,
                letterSpacing: "-.03em",
                lineHeight: 1.12,
                margin: "0 0 16px",
              }}
            >
              Modernise your campus operations today.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,.45)",
                fontSize: ".94rem",
                lineHeight: 1.65,
                maxWidth: 420,
                margin: 0,
              }}
            >
              Thousands of students and staff already use SmartCampus to
              streamline bookings, reporting, and campus management.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <Btn
              variant="white"
              size="lg"
              onClick={() => {
                window.location.href = "/oauth2/authorization/google";
              }}
            >
              <GoogleIcon />
              Sign in with Google
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => onGoTo("features")}>
              Explore features
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
