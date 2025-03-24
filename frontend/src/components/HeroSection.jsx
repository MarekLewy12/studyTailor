import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBrain, FaGraduationCap, FaRobot } from "react-icons/fa";

const HeroSection = ({ scrollToFeatures }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: <FaRobot className="text-indigo-300 text-4xl" />,
      text: "Inteligentny asystent wspierający naukę",
    },
    {
      icon: <FaGraduationCap className="text-indigo-300 text-4xl" />,
      text: "Automatyczna synchronizacja z planem ZUT",
    },
    {
      icon: <FaBrain className="text-indigo-300 text-4xl" />,
      text: "Personalizowane podpowiedzi i wskazówki AI",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  };

  return (
    <div className="relative py-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" />

      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-400 animate-gradient" />
      <motion.img
        src="/icon-data-cloud.svg"
        alt="Graduate icon"
        className="
            absolute
            hidden md:block
            left-8 lg:left-24
            top-44
            w-24 lg:w-44
            h-24 lg:h-44
            z-20
          "
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: -8,
          y: [0, -15, 0],
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.4,
          opacity: { delay: 0.7, duration: 0.8 },
          scale: { delay: 0.7, duration: 0.8 },
          rotate: { delay: 0.7, duration: 0.8 },
          y: {
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          },
        }}
      />

      <motion.img
        src="/icon-hourglass.svg"
        alt="Learning icon"
        className="
            absolute
            hidden md:block
            right-8 lg:right-16
            bottom-22 lg:bottom-44
            w-24 lg:w-44
            h-24 lg:h-44
            z-20
          "
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 8,
          y: [0, -15, 0],
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.4,
          opacity: { delay: 0.9, duration: 0.8 },
          scale: { delay: 0.9, duration: 0.8 },
          rotate: { delay: 0.9, duration: 0.8 },
          y: {
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            delay: 2,
          },
        }}
      />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center w-full h-80 mb-16 relative">
            <img
              src="new_logo_big.png"
              alt="Logo aplikacji"
              className="relative z-10"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            <span className="block mb-6">Twoja nauka,</span>
            <span className="bg-gradient-to-r from-indigo-200 to-purple-300 text-transparent bg-clip-text">
              Twój osobisty asystent
            </span>
          </h1>

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
            Wykorzystaj moc sztucznej inteligencji do wsparcia swojej nauki.
            Twoje przedmioty, notatki i materiały w jednym miejscu, z
            inteligentnym wsparciem AI.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link
              to="/auth"
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
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
    </div>
  );
};

export default HeroSection;
