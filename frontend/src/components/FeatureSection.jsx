import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  FaRegCalendarCheck,
  FaChartLine,
  FaSmileBeam,
  FaDatabase,
  FaClock,
  FaBrain,
  FaLaptopCode,
  FaUserGraduate,
} from "react-icons/fa";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6">
        {React.cloneElement(icon, { className: "text-white text-2xl" })}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
      <div className="text-4xl font-bold text-orange-500 mb-2">{value}</div>
      <div className="text-black dark:text-white">{label}</div>
    </motion.div>
  );
};

// eslint-disable-next-line react/display-name
const FeaturesSection = forwardRef((props, ref) => {
  const features = [
    {
      icon: <FaRegCalendarCheck />,
      title: "Automatyczne harmonogramy",
      description:
        "Twórz spersonalizowane plany nauki w kilka sekund dzięki sztucznej inteligencji",
    },
    {
      icon: <FaClock />,
      title: "Oszczędność czasu",
      description:
        "Zapomnij o ręcznym planowaniu - pozwól AI zrobić to za Ciebie",
    },
    {
      icon: <FaBrain />,
      title: "Inteligentna adaptacja",
      description:
        "System dostosowuje się do Twoich preferencji i stylu uczenia się",
    },
    {
      icon: <FaLaptopCode />,
      title: "Integracja z planem ZUT",
      description:
        "Automatyczne pobieranie i synchronizacja z Twoim planem zajęć",
    },
  ];

  const statistics = [
    { value: "100%", label: "Automatyzacji" },
    { value: "24/7", label: "Dostępność" },
    { value: "♾️", label: "Oszczędność czasu" },
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
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text"
          >
            Dlaczego warto korzystać ze StudyTailor?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Odkryj, jak nasza aplikacja może zrewolucjonizować Twój sposób nauki
            i zarządzania czasem na studiach
          </motion.p>
        </div>

        {/* Siatka z funkcjami */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
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
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Gotowy, aby zacząć?
          </h3>
          <p className="text-gray-600 mb-8">
            Dołącz do społeczności studentów, którzy już odkryli zalety
            inteligentnego planowania
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Rozpocznij za darmo
          </button>
        </motion.div>
      </div>
    </div>
  );
});

export default FeaturesSection;
