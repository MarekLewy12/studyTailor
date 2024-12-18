import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection.jsx";
import MockSchedule from "../components/MockSchedule.jsx";
import FAQSection from "../components/FAQSection.jsx";

const HomePage = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Hero (zdjęcie z przyciskiem)) */}
      <HeroSection scrollToFeatures={scrollToFeatures} />

      {/* Features (funkcje naszej aplikacji) */}
      <FeaturesSection ref={featuresRef} />

      {/* FAQ (często zadawane pytania) */}
      <FAQSection />

      {/* Przykładowy harmonogram */}
      <MockSchedule />
    </div>
  );
};

export default HomePage;
