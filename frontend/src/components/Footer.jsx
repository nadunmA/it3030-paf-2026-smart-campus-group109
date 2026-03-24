import { useState } from "react";

function SocialBtn({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        cursor: "pointer",
        background: hov ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,.5)",
        fontSize: ".74rem",
        transition: "all .2s",
      }}
    >
      {children}
    </div>
  );
}

const FOOTER_COLS = [
  {
    head: "Platform",
    links: ["Facilities", "Bookings", "Tickets", "Notifications", "Dashboard"],
  },
  {
    head: "Resources",
    links: [
      "API Docs",
      "GitHub Repo",
      "Postman Collection",
      "Architecture",
      "Changelog",
    ],
  },
  {
    head: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Use",
      "Cookie Policy",
      "Academic Integrity",
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "56px max(28px,8vw) 36px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          marginBottom: 48,
        }}
      >
        <div className="sc-reveal-left">
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-.02em",
              marginBottom: 12,
            }}
          >
            Smart<span style={{ color: "#0A84FF" }}>Campus</span>
          </div>
          <p
            style={{
              fontSize: ".79rem",
              color: "rgba(255,255,255,.33)",
              lineHeight: 1.72,
              maxWidth: 240,
              marginBottom: 20,
            }}
          >
            A unified operations platform for modern universities. Built for
            IT3030 — PAF Assignment 2026, Faculty of Computing, SLIIT.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["GH", "SW"].map((s) => (
              <SocialBtn key={s}>{s}</SocialBtn>
            ))}
          </div>
        </div>

        {FOOTER_COLS.map((col, i) => (
          <div
            key={col.head}
            className="sc-reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div
              style={{
                fontSize: ".72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,.42)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {col.head}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <a key={l} href="#" className="foot-link">
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.06)",
          paddingTop: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.2)" }}>
          © 2026 SmartCampus · IT3030 PAF Assignment · Faculty of Computing,
          SLIIT
        </span>
        <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.16)" }}>
          Built with Spring Boot + React
        </span>
      </div>
    </footer>
  );
}
