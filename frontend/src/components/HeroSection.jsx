import React from "react";
import AnimatedSection from "./AnimatedSection.jsx";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('hero_bg.jpg')`,
      }}
    >
      {/* Logo */}
      <div className="absolute pt-16 top-4 left-4 text-white text-2xl font-bold">
        Nasze logo
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative text-center text-white px-4">
        <AnimatedSection>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="stylized-text">Twoje</span> studia,{" "}
            <span className="stylized-text">Twoje</span> zasady
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Zorganizuj swoje zajęcia, zadania i egzaminy w jednym miejscu dzięki
            naszej aplikacji wykorzystującej sztuczną inteligencję.
          </p>
          <Link
            to="/create"
            className="bg-orange-600 hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            {" "}
            Stwórz harmonogram
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default HeroSection;
