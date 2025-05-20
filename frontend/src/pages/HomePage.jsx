import React, { useState, useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection.jsx";
import AIAssistantDemo from "../components/AIAssistantDemo.jsx";
import FAQSection from "../components/FAQSection.jsx";
import AboutProjectSection from "../components/AboutProjectSection.jsx";
import AiToolsSection from "../components/AiToolsSection.jsx";
import CallToAction from "../components/CallToAction.jsx";
import UpdateNotificationButton from "../components/UpdateNotificationButton.jsx";

const HomePage = () => {
  const [audience, setAudience] = useState(null);

  const featuresRef = useRef(null);
  const aiToolsRef = useRef(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      const yOffset = -80;
      const element = featuresRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToAiTools = () => {
    if (aiToolsRef.current) {
      const yOffset = -80;
      const element = aiToolsRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 min-h-screen">
      {/* Przycisk powiadomień aktualizacji */}
      <div className="fixed bottom-6 right-6 z-50">
        <UpdateNotificationButton />
      </div>

      {/* Sekcja Hero */}
      <HeroSection scrollToFeatures={scrollToFeatures} />

      {/* Sekcja Features */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4">
        <FeaturesSection ref={featuresRef} />
      </div>

      {/* Demo asystenta AI */}
      <AIAssistantDemo />

      {/* Sekcja narzędzi AI */}
      <AiToolsSection ref={aiToolsRef} audience={audience} />
    </div>
  );
};

export default HomePage;
