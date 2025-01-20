import React from "react";
import AnimatedSection from "./AnimatedSection.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const HeroSection = ({ scrollToFeatures }) => {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Pozwól sztucznej inteligencji Cię wspomóc",
    "Ułatw sobie naukę i organizację",
    "Osiągaj więcej w krótszym czasie",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prevText) => (prevText + 1) % texts.length);
    }, 3000); // 3 sekundy
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('hero_bg.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative text-center text-white px-4">
        <AnimatedSection>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="stylized-text">Twoje</span> studia,{" "}
            <span className="stylized-text">Twoje</span> zasady
          </h1>
          <div className="h-10 flex items-center justify-center overflow-hidden">
            <TransitionGroup component={null}>
              <CSSTransition
                key={currentText}
                timeout={500}
                classNames="fade"
                unmountOnExit
              >
                <p className="text-lg md:text-xl mb-6 text-amber-500">
                  {texts[currentText]}
                </p>
              </CSSTransition>
            </TransitionGroup>
          </div>
          <p className="text-lg md:text-xl mb-6">
            Zorganizuj swoje zajęcia, zadania i egzaminy w jednym miejscu dzięki
            naszej aplikacji wykorzystującej sztuczną inteligencję.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Zarejestruj swoje konto
            </Link>
            <button
              onClick={scrollToFeatures}
              className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Funkcje naszej aplikacji
            </button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default HeroSection;
