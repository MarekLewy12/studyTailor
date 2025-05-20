import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaBookOpen,
  FaRobot,
  FaChartLine,
} from "react-icons/fa";

// TODO: Dodaj krótki filmik pokazujący jak działa StudyTailor i jego funkcje
const FeaturesSection = forwardRef((props, ref) => {
  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-7xl font-bold mb-4
            pb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400
            dark:from-indigo-400 dark:via-purple-400 dark:to-blue-300
            text-transparent bg-clip-text"
          >
            Doświadcz nauki nowej generacji
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            StudyTailor łączy nowoczesne technologie z naukowymi metodami
            uczenia, aby zapewnić najbardziej efektywne doświadczenie
            edukacyjne.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold mb-6 text-indigo-500 dark:text-white">
              Zintegrowany ekosystem nauki
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              StudyTailor eliminuje potrzebę żonglowania pomiędzy różnymi
              aplikacjami. Wszystkie niezbędne narzędzia do efektywnej nauki
              znajdują się w jednym, spójnym środowisku. Oszczędzasz czas i
              możesz skupić się na tym, co najważniejsze - przyswajaniu wiedzy.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Automatyczna synchronizacja
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pobieranie planu zajęć z systemu uczelni
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaBookOpen />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Zarządzanie materiałami
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wszystkie notatki i zasoby w jednym miejscu
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaRobot />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Inteligentny asystent
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Odpowiedzi na pytania o każdym przedmiocie
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaChartLine />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Śledzenie postępów
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wizualizacja przyswojonych materiałów
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden shadow-xl relative"
          >
            <p>Tutaj pokażemy nagrany filmik</p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
