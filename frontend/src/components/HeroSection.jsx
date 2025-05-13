import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBookOpen, FaBrain, FaGraduationCap, FaRobot } from "react-icons/fa";

const HeroSection = ({ scrollToFeatures }) => {
  const [role, setRole] = useState(null);

  const panels = {
    student: [
      {
        icon: <FaGraduationCap />,
        title: "Plan zajęć ZUT",
        blurb: "Automatyczna synchronizacja.",
      },
      {
        icon: <FaBookOpen />,
        title: "Materiały przedmiotów",
        blurb: "Szybkie udostępnianie w chmurze.",
      },
      {
        icon: <FaRobot />,
        title: "Asystent AI",
        blurb: "Wyjaśnia zagadnienia z wykładów.",
      },
    ],
    learner: [
      {
        icon: <FaRobot />,
        title: "Uniwersalny Chat",
        blurb: "Pytaj o dowolny temat.",
      },
      {
        icon: <FaBookOpen />,
        title: "Fiszkoteka",
        blurb: "SRS do powtarzania pojęć.",
      },
      {
        icon: <FaGraduationCap />,
        title: "Ścieżki nauki",
        blurb: "Propozycje kursów i zadań.",
      },
    ],
  };

  return (
    <section className="relative overflow-hidden py-24">
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
        {/* Lewa kolumna */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl text-gray-800 dark:text-white mb-6">
            Nauka z wykorzystaniem AI
            <p className="text-indigo-400">dostosowana do Ciebie</p>
          </h1>
          <p>Ucz się efektywniej używając mocy sztucznej inteligencji</p>
        </div>

        {/* Prawa kolumna */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          {!role && (
            <motion.img
              key="studyTailor-logo"
              src="new_logo_big.png"
              alt="StudyTailor Logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="select-none pointer-events-none"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
