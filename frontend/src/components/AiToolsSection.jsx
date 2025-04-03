import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRobot, FaBrain, FaCalendarAlt } from "react-icons/fa";

const AiToolsSection = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Sztuczna Inteligencja dla{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
              Wszystkich
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto">
            Dostęp do zaawansowanych narzędzi AI bez rejestracji i weryfikacji
            uczelni
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-colors duration-300"
          >
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaRobot className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Asystent AI</h3>
            <p className="text-indigo-100 mb-6">
              Zadawaj pytania na dowolny temat i otrzymuj natychmiastowe,
              inteligentne odpowiedzi od naszego zaawansowanego asystenta
              opartego na modelach językowych najnowszej generacji.
            </p>
            <Link
              to="/public-tools"
              className="inline-flex items-center text-amber-300 hover:text-amber-100 transition-colors font-medium"
            >
              Wypróbuj teraz <span className="ml-2">→</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-colors duration-300"
          >
            <div className="bg-gradient-to-br from-amber-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaBrain className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Generacja Materiałów</h3>
            <p className="text-indigo-100 mb-6">
              Twórz spersonalizowane fiszki, zestawy pytań i notatki na
              podstawie dowolnego tematu.
            </p>
            <span className="inline-flex items-center text-amber-300 opacity-75 font-medium">
              Dostępne wkrótce <span className="ml-2">→</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-colors duration-300"
          >
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaCalendarAlt className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Planer Nauki</h3>
            <p className="text-indigo-100 mb-6">
              Stwórz spersonalizowany harmonogram nauki dopasowany do Twoich
              potrzeb. Określ swoje cele, dostępny czas i preferencje, a
              algorytm zoptymalizuje plan dla maksymalnej efektywności.
            </p>
            <span className="inline-flex items-center text-amber-300 opacity-75 font-medium">
              Dostępne wkrótce <span className="ml-2">→</span>
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 sm:p-12 max-w-5xl mx-auto shadow-2xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h3 className="text-3xl font-bold mb-4">
                Korzystaj bez ograniczeń
              </h3>
              <p className="text-lg text-indigo-100 mb-6">
                Pełny dostęp dla studentów ZUT, podstawowe funkcje AI dla
                wszystkich. Dołącz już teraz i odblokuj pełen potencjał nauki
                wspomaganej sztuczną inteligencją.
              </p>
              <Link
                to="/public-tools"
                className="inline-block bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors duration-300"
              >
                Przejdź do narzędzi
              </Link>
            </div>
            <div className="flex-shrink-0 bg-white/10 backdrop-blur p-5 rounded-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-indigo-500 text-white text-xs py-1 px-3 rounded-full">
                  Dostępne bez rejestracji
                </span>
                <span className="text-indigo-200">vs</span>
                <span className="bg-amber-500 text-white text-xs py-1 px-3 rounded-full">
                  Tylko dla studentów
                </span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></span>
                  <span>Asystent AI z limitem zapytań</span>
                </li>
                <li className="flex items-center opacity-60">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-2"></span>
                  <span>Synchronizacja z planem zajęć</span>
                </li>
                <li className="flex items-center opacity-60">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-2"></span>
                  <span>Zarządzanie materiałami</span>
                </li>
                <li className="flex items-center opacity-60">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-2"></span>
                  <span>Śledzenie postępów nauki</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

AiToolsSection.displayName = "AiToolsSection";

export default AiToolsSection;
