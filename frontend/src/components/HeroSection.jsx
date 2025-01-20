import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaClock, FaBrain } from "react-icons/fa";

const HeroSection = ({ scrollToFeatures }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: <FaGraduationCap className="text-amber-400 text-4xl" />,
      text: "Automatycznie generowane plany nauki"
    },
    {
      icon: <FaClock className="text-amber-400 text-4xl" />,
      text: "Oszczędność czasu na planowaniu"
    },
    {
      icon: <FaBrain className="text-amber-400 text-4xl" />,
      text: "Inteligentne dostosowanie do Twoich potrzeb"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Tło z gradientem */}
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('hero_bg.jpg')`,
              filter: 'brightness(0.3)'
            }}
        />

        {/* Animowany gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-orange-900/80 to-amber-900/80 animate-gradient" />

        {/* Zawartość */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
          >
            <div className="flex justify-center w-full h-48 mb-20">
              <img src="study_logo_orange_no_text.png" alt="Logo aplikacji"/>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              <span className="block mb-6">Twoje studia,</span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
              Twoje zasady
            </span>
            </h1>

            {/* Animowane funkcje */}
            <div className="h-32 m-8">
              <AnimatePresence mode="wait">
                <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center space-y-4"
                >
                  {features[currentFeature].icon}
                  <p className="text-xl md:text-2xl text-white">
                    {features[currentFeature].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Wykorzystaj moc sztucznej inteligencji do tworzenia spersonalizowanych
              planów nauki. Oszczędź czas i skup się na tym, co najważniejsze - swojej edukacji.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              <Link
                  to="/auth"
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Rozpocznij za darmo
              </Link>
              <button
                  onClick={scrollToFeatures}
                  className="px-8 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                Dowiedz się więcej
              </button>
            </div>
          </motion.div>
        </div>

        {/* Dekoracyjne elementy */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
  );
};

export default HeroSection;
