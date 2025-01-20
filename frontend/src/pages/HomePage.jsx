import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection.jsx";
import MockSchedule from "../components/MockSchedule.jsx";
import FAQSection from "../components/FAQSection.jsx";
import AboutProjectSection from "../components/AboutProjectSection.jsx";

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

      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* O projekcie */}
          <AboutProjectSection />

          {/* FAQ */}
          <FAQSection />
        </div>
      </div>

      {/* Przykładowy harmonogram */}
      <MockSchedule />
    </div>
  );
};

export default HomePage;
