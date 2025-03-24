import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaLaptopCode,
  FaRegCalendarCheck,
  FaRobot,
} from "react-icons/fa";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
        {React.cloneElement(icon, { className: "text-white text-2xl" })}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3 dark:text-gray-400">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-500">{description}</p>
    </motion.div>
  );
};

const StatisticCard = ({ value, label, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="text-center p-6 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300"
    >
      <div className="text-4xl font-bold text-indigo-500 mb-2">{value}</div>
      <div className="text-black dark:text-white">{label}</div>
    </motion.div>
  );
};

const FeaturesSection = forwardRef((props, ref) => {
  const features = [
    {
      icon: <FaRobot />,
      title: "Asystent AI",
      description:
        "Zadawaj pytania i otrzymuj odpowiedzi dostosowane do konkretnego przedmiotu",
    },
    {
      icon: <FaRegCalendarCheck />,
      title: "Śledzenie postępów",
      description:
        "Monitoruj swoje postępy w nauce i oznaczaj przyswojone materiały",
    },
    {
      icon: <FaBookOpen />,
      title: "Baza materiałów",
      description:
        "Przechowuj wszystkie materiały naukowe w jednym miejscu z łatwym dostępem",
    },
    {
      icon: <FaLaptopCode />,
      title: "Integracja z planem ZUT",
      description:
        "Automatyczne pobieranie i synchronizacja z Twoim planem zajęć",
    },
  ];

  const statistics = [
    { value: "24/7", label: "Wsparcie w nauce" },
    { value: "AI", label: "Inteligentny tutor" },
    { value: "100%", label: "Personalizacji" },
  ];

  return (
    <div className="py-20 px-4">
      <div className="container mx-auto">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
          >
            Dlaczego warto korzystać ze StudyTailor?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto"
          >
            Odkryj, jak nasz inteligentny asystent może wspomóc Twoją naukę i
            pomóc w zrozumieniu trudnych zagadnień
          </motion.p>
        </div>

        {/* Siatka z funkcjami */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 ">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {statistics.map((stat, index) => (
            <StatisticCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-400 mb-4">
            Gotowy, aby zacząć?
          </h3>
          <p className="text-gray-600 dark:text-white mb-8">
            Dołącz do społeczności studentów, którzy już korzystają z
            inteligentnego wsparcia w nauce
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Rozpocznij za darmo
          </button>
        </motion.div>
      </div>
    </div>
  );
});

export default FeaturesSection;
