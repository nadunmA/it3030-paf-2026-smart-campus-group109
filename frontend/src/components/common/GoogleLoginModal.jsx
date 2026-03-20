import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CtaSection from "../components/home/CtaSection";
import Footer from "../components/Footer";
import GoogleLoginModal from "../components/common/GoogleLoginModal";
import { useState } from "react";

export default function SmartCampusHome() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <GoogleLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => setLoggedIn(true)}
      />
      <Navbar
        loggedIn={loggedIn}
        onLogout={() => setLoggedIn(false)}
        onLoginOpen={() => setLoginOpen(true)}
      />
      <HeroSection onLoginOpen={() => setLoginOpen(true)} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection onLoginOpen={() => setLoginOpen(true)} />
      <Footer />
    </>
  );
}
