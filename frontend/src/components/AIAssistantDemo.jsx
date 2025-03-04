import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaBookOpen, FaLightbulb, FaCheck } from "react-icons/fa";

const AIAssistantDemo = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-7xl font-bold text-indigo-500">
          Asystent AI do nauki
        </h2>
        <p className="text-gray-600 mt-2">
          Zobacz, jak wygląda nauka z inteligentnym wsparciem
        </p>
      </div>
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Przykład przedmiotu z asystentem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow"
          >
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Sieci komputerowe
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Laboratorium, 14:15 - 15:45
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <FaRobot />
                </div>
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200">
                    W czym mogę Ci dzisiaj pomóc przy sieciach komputerowych?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200">
                    Wytłumacz mi jak działa protokół DHCP?
                  </p>
                </div>
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <FaBookOpen />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <FaRobot />
                </div>
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200">
                    DHCP (Dynamic Host Configuration Protocol) to protokół
                    umożliwiający automatyczną konfigurację urządzeń w sieci.
                    Działa w czterech krokach:
                  </p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>
                      DHCP Discover - klient wysyła broadcast szukając serwera
                      DHCP
                    </li>
                    <li>DHCP Offer - serwer odpowiada ofertą adresu IP</li>
                    <li>DHCP Request - klient akceptuje ofertę</li>
                    <li>
                      DHCP Acknowledge - serwer potwierdza przyznanie adresu
                    </li>
                  </ol>
                  <p className="mt-2 text-gray-800 dark:text-gray-200">
                    Czy chciałbyś, żebym podał więcej szczegółów na temat
                    któregoś z tych kroków?
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
                <FaLightbulb />
                <span>Podpowiedz mi</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                <FaCheck />
                <span>Oznacz jako przyswojone</span>
              </button>
            </div>
          </motion.div>

          {/* Drugi przykład */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow"
          >
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Sztuczna inteligencja
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Laboratorium, 10:15 - 11:45
              </p>
            </div>

            <div className="flex items-center justify-between p-3 mb-4 bg-green-100 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  Przyswojone: Sieci neuronowe
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                21.02.2025
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Materiały do nauki:
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">
                    Algorytmy uczenia maszynowego.pdf
                  </span>
                  <button className="text-blue-500 hover:text-blue-700">
                    Pobierz
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">
                    Moje notatki z wykładu
                  </span>
                  <button className="text-blue-500 hover:text-blue-700">
                    Otwórz
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300">
                <FaRobot />
                <span>Ucz się z AI</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                <FaBookOpen />
                <span>Dodaj materiały</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDemo;
