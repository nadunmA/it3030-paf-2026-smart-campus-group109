import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   All random data generated ONCE at module
   level — outside any component/hook.
   This satisfies react-hooks/purity rules.
───────────────────────────────────────── */

const COLORS = ["#0A84FF", "#BF5AF2", "#30D158", "#FF9F0A", "#64D2FF"];

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: (Math.random() * 4 + 2).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
}));

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  dur: (Math.random() * 20 + 15).toFixed(0),
  delay: (Math.random() * 10).toFixed(1),
}));

const AURORA_RINGS = [
  {
    size: 700,
    color: "rgba(10,132,255,.06)",
    top: "10%",
    left: "20%",
    dur: "20s",
    delay: "0s",
  },
  {
    size: 550,
    color: "rgba(191,90,242,.05)",
    top: "50%",
    right: "10%",
    dur: "25s",
    delay: "-8s",
  },
  {
    size: 800,
    color: "rgba(48,209,88,.04)",
    bottom: "5%",
    left: "40%",
    dur: "30s",
    delay: "-15s",
  },
  {
    size: 400,
    color: "rgba(255,159,10,.05)",
    top: "30%",
    left: "60%",
    dur: "18s",
    delay: "-5s",
  },
];

const BLOBS = [
  {
    top: "-20%",
    left: "-5%",
    w: 750,
    c: "rgba(10,132,255,.14)",
    a: "blob1 12s ease-in-out infinite",
  },
  {
    top: "15%",
    right: "-10%",
    w: 650,
    c: "rgba(191,90,242,.11)",
    a: "blob2 15s ease-in-out infinite",
  },
  {
    bottom: "-5%",
    left: "20%",
    w: 600,
    c: "rgba(48,209,88,.08)",
    a: "blob1 19s ease-in-out infinite reverse",
  },
  {
    top: "45%",
    left: "-8%",
    w: 480,
    c: "rgba(255,159,10,.06)",
    a: "blob2 22s ease-in-out infinite",
  },
  {
    top: "60%",
    right: "5%",
    w: 420,
    c: "rgba(10,132,255,.07)",
    a: "blob1 17s ease-in-out infinite reverse",
  },
];

/* ─── Components ─── */

function StarField() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.4,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `drift ${p.dur}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function AuroraRings() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {AURORA_RINGS.map((r, i) => (
        <div
          key={i}
          className="aurora-ring"
          style={{
            width: r.size,
            height: r.size,
            top: r.top,
            left: r.left,
            right: r.right,
            bottom: r.bottom,
            background: `radial-gradient(circle, ${r.color} 0%, transparent 65%)`,
            "--dur": r.dur,
            "--delay": r.delay,
          }}
        />
      ))}
    </div>
  );
}

function AmbientBlobs() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...b,
            height: b.w,
            borderRadius: "50%",
            background: `radial-gradient(circle,${b.c} 0%,transparent 70%)`,
            animation: b.a,
          }}
        />
      ))}
    </div>
  );
}

function MouseGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return;
      ref.current.style.left = `${e.clientX}px`;
      ref.current.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(10,132,255,.06) 0%, transparent 70%)",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
        zIndex: 0,
        transition: "left .12s ease, top .12s ease",
      }}
    />
  );
}

/* ─── Main export ─── */
export default function AnimatedBackground() {
  return (
    <>
      <div className="grid-overlay" />
      <div className="scanline" />
      <StarField />
      <AuroraRings />
      <FloatingParticles />
      <AmbientBlobs />
      <MouseGlow />
    </>
  );
}
