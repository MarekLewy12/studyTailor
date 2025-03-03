import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection.jsx";
import AIAssistantDemo from "../components/AIAssistantDemo.jsx";
import FAQSection from "../components/FAQSection.jsx";
import AboutProjectSection from "../components/AboutProjectSection.jsx";

const HomePage = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      const yOffset = -80;
      const element = featuresRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero (zdjęcie z przyciskiem) */}
      <HeroSection scrollToFeatures={scrollToFeatures} />

      {/* Features (funkcje naszej aplikacji) */}
      <div id="features" ref={featuresRef}>
        <FeaturesSection />
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* O projekcie */}
          <AboutProjectSection />

          {/* FAQ */}
          <FAQSection />
        </div>
      </div>

      {/* Demo AI Assistant */}
      <AIAssistantDemo />
    </div>
  );
};

export default HomePage;
