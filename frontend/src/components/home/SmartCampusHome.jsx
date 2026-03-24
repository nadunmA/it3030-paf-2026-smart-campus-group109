import { useState, useEffect } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useActiveSection } from "../../hooks/useActiveSection";
import Navbar from "../navbar/Navbar";
import HeroSection from "./HeroSection";
import StatsSection from "../home/Statssection";
import FeaturesSection from "../home/FeatureSection";
import HowItWorksSection from "./HowItWorksSection";
import CtaSection from "./CtaSection";
import Footer from "../Footer";
import GoogleLoginModal from "../common/GoogleLoginModal";
import AnimatedBackground from "../common/AnimatedBackground";

const SECTION_IDS = ["hero", "stats", "features", "howitworks", "cta"];

export default function SmartCampusHome() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  useScrollReveal();

  useEffect(() => {
    const h = () => {
      const doc = document.documentElement;
      setScrolled(window.scrollY > 24);
      setProgress(
        (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100,
      );
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <GoogleLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
          position: "relative",
        }}
      >
        {/* Scroll progress bar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: 2,
            width: `${progress}%`,
            background: "linear-gradient(90deg,#0A84FF,#BF5AF2)",
            zIndex: 201,
            transition: "width .1s linear",
            borderRadius: "0 2px 2px 0",
            pointerEvents: "none",
          }}
        />

        {/* Section dots */}
        <div
          style={{
            position: "fixed",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {SECTION_IDS.map((id) => (
            <div
              key={id}
              onClick={() => goTo(id)}
              title={id[0].toUpperCase() + id.slice(1)}
              style={{
                width: activeSection === id ? 5 : 3.5,
                height: activeSection === id ? 22 : 3.5,
                borderRadius: 980,
                background:
                  activeSection === id ? "#0A84FF" : "rgba(255,255,255,.22)",
                cursor: "pointer",
                transition: "all .35s ease",
              }}
            />
          ))}
        </div>

        {/* Ambient blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {[
            {
              top: "-20%",
              left: "-5%",
              w: 750,
              c: "rgba(10,132,255,.15)",
              a: "blob1 12s ease-in-out infinite",
            },
            {
              top: "15%",
              right: "-10%",
              w: 650,
              c: "rgba(191,90,242,.12)",
              a: "blob2 15s ease-in-out infinite",
            },
            {
              bottom: "-5%",
              left: "20%",
              w: 600,
              c: "rgba(48,209,88,.09)",
              a: "blob1 19s ease-in-out infinite reverse",
            },
            {
              top: "45%",
              left: "-8%",
              w: 480,
              c: "rgba(255,159,10,.07)",
              a: "blob2 22s ease-in-out infinite",
            },
            {
              top: "60%",
              right: "5%",
              w: 420,
              c: "rgba(10,132,255,.08)",
              a: "blob1 17s ease-in-out infinite reverse",
            },
          ].map((b, i) => (
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

        {/* Navbar */}
        <Navbar
          scrolled={scrolled}
          loggedIn={loggedIn}
          onLogout={() => setLoggedIn(false)}
          onLoginOpen={() => setLoginOpen(true)}
          activeSection={activeSection}
          onGoTo={goTo}
        />

        {/* Sections */}
        <HeroSection onLoginOpen={() => setLoginOpen(true)} onGoTo={goTo} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection onGoTo={goTo} />
        <Footer />
      </div>
    </>
  );
}
