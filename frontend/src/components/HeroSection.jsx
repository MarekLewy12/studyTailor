import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaBrain,
  FaGraduationCap,
  FaRobot,
  FaArrowDown,
  FaUserGraduate,
} from "react-icons/fa";

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
    <section className="relative overflow-hidden py-32 bg-gradient-to-b from-indigo-300 to-white dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-gray-900 shadow-sm">
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16 relative z-10">
        {/* Lewa kolumna */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h1 className="font-heading text-5xl mb-4">
            Ucz się{" "}
            <strong className="font-bold text-indigo-600">mądrzej</strong>, nie
            ciężej
            <span className="block mt-2 text-indigo-600">
              z AI skrojonym na miarę
            </span>
          </motion.h1>

          <motion.p className="font-body text-lg mb-8 max-w-lg">
            StudyTailor to Twój{" "}
            <span className="font-semibold">osobisty asystent</span> nauki:
            synchronizuje plan, porządkuje materiały i podsuwa odpowiedzi w lot
            – żebyś osiągał <span className="font-bold">więcej</span> w
            <span className="font-bold"> mniej</span> czasu.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/auth"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
              text-white text-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 hover:shadow-xl flex items-center justify-center transform hover:scale-105"
            >
              Rozpocznij za darmo
            </Link>

            <button
              onClick={scrollToFeatures}
              className="px-10 py-4 rounded-xl border-3 border-indigo-500 dark:border-indigo-400
              text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30
              text-lg font-semibold transition-all flex items-center justify-center gap-3 transform hover:scale-105"
            >
              Poznaj funkcje <FaArrowDown className="text-sm animate-bounce" />
            </button>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={() => setRole("student")}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all transform hover:scale-105
                ${
                  role === "student"
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-md"
                    : "bg-indigo-200 dark:bg-cyan-950 hover:bg-indigo-300 dark:hover:bg-cyan-900"
                }`}
            >
              <FaUserGraduate className="text-2xl" />
              <span className="text-lg font-medium">Jestem studentem ZUT</span>
            </button>

            <button
              onClick={() => setRole("learner")}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all transform hover:scale-105
                ${
                  role === "learner"
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-md"
                    : "bg-indigo-200 dark:bg-cyan-950 hover:bg-indigo-300 dark:hover:bg-cyan-900"
                }`}
            >
              <FaBrain className="text-2xl" />
              <span className="text-lg font-medium">Uczę się samodzielnie</span>
            </button>
          </motion.div>
        </div>

        {/* Prawa kolumna */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <AnimatePresence mode="wait">
            {!role && (
              <motion.div
                key="studyTailor-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* błyskające punkty */}
                <div className="absolute inset-0 z-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                      style={{
                        top: `${25 + Math.random() * 50}%`,
                        left: `${25 + Math.random() * 50}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.6,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 3,
                      }}
                    />
                  ))}
                </div>

                <img
                  src="new_logo_big.png"
                  alt="StudyTailor Logo"
                  className="select-none pointer-events-none w-full max-w-2xl relative z-10"
                />
              </motion.div>
            )}

            {role && (
              <motion.div
                key={`${role}-panel`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 gap-6 w-full max-w-lg"
              >
                {panels[role].map((panel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl
                      border border-indigo-100 dark:border-indigo-800 flex items-start gap-6 hover:shadow-2xl"
                  >
                    <div className="text-4xl text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-xl">
                      {panel.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
                        {panel.title}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {panel.blurb}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
