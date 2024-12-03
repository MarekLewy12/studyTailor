import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection.jsx";
import MockSchedule from "../components/MockSchedule.jsx";

const HomePage = () => {
  return (
    <div>
      {/* Hero (zdjęcie z przyciskiem)) */}
      <HeroSection />

      {/* Features (funkcje naszej aplikacji) */}
      <FeaturesSection />

      {/* Przykładowy harmonogram */}
      <MockSchedule />
    </div>
  );
};

export default HomePage;
