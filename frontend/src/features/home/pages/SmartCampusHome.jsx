import { useState, useEffect } from "react";
import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { useActiveSection } from "../../../hooks/useActiveSection";
import Navbar from "../../../components/layout/Navbar";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeatureSection";
import HowItWorksSection from "../components/Howitworkssection";
import CtaSection from "../components/CtaSection";
import Footer from "../../../components/layout/Footer";
import GoogleLoginModal from "../../auth/components/GoogleLoginModal";
import AnimatedBackground from "../../../components/ui/AnimatedBackground";

const SECTION_IDS = ["hero", "stats", "features", "howitworks", "cta"];

export default function SmartCampusHome() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [loggedIn, setLoggedIn] = useState(() => {
    const token = sessionStorage.getItem("token");
    return !!token;
  });

  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("token");
    const rawUser = sessionStorage.getItem("user");

    if (token && rawUser) {
      try {
        return JSON.parse(rawUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loginOpen, setLoginOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  useScrollReveal();

  // scroll stuff
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setLoggedIn(false);
  };

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

        <AnimatedBackground />

        <Navbar
          scrolled={scrolled}
          loggedIn={loggedIn}
          user={user}
          onLogout={handleLogout}
          onLoginOpen={() => setLoginOpen(true)}
          activeSection={activeSection}
          onGoTo={goTo}
        />

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
