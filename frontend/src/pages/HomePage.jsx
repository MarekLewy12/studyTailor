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

  return (
    <div>
      <HeroSection />
    </div>
  );
};

export default HomePage;
