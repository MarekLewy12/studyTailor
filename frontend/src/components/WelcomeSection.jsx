import React from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const WelcomeSection = () => {
  return (
    <div>
      <AnimatedSection>
        <h1 className="text-5xl pt-24 md:text-7xl font-bold mb-6 text-black">
          Witaj w kreatorze
          <br />
          <span className="gradient-text">Harmonogramu ZUT</span>
        </h1>
        <p className="text-xl md:text-3xl mb-8 text-black">
          Z naszą apką łatwo utworzysz spersonalizowany harmonogram nauki!
        </p>
        <Link to="/login">
          <button className="bg-none border-2 border-violet-500 hover:bg-violet-200 text-violet-600 font-bold py-4 px-8 rounded-full text-2xl transition duration-300 transform hover:scale-105">
            Rozpocznij tworzenie!
          </button>
        </Link>
        <p className="text-gray-400">*Wymagana rejestracja</p>
      </AnimatedSection>
    </div>
  );
};

export default WelcomeSection;
