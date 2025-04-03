import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRobot, FaUserGraduate } from "react-icons/fa";

const AiAssistantDemo = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Asystent AI w akcji
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Zobacz, jak nasz asystent odpowiada na pytania i pomaga w efektywnej
            nauce
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-bold">Asystent Nauki</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-white" />
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg max-w-[80%]">
                <p className="text-gray-800 dark:text-gray-200">
                  Witaj! Jestem asystentem StudyTailor. W czym mogę Ci pomóc?
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 justify-end">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg max-w-[80%]">
                <p className="text-gray-800 dark:text-gray-200">
                  Możesz wyjaśnić mi działanie protokołu DHCP?
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <FaUserGraduate className="text-white" />
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-white" />
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg max-w-[80%]">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>DHCP (Dynamic Host Configuration Protocol)</strong> to
                  protokół komunikacyjny umożliwiający automatyczne
                  przydzielanie adresów IP urządzeniom w sieci. Działa w
                  architekturze klient-serwer i składa się z czterech kluczowych
                  etapów:
                </p>
                <ol className="mt-2 ml-5 list-decimal space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>DHCP Discover</strong> - klient wysyła
                    rozgłoszeniowy pakiet w poszukiwaniu serwera DHCP
                  </li>
                  <li>
                    <strong>DHCP Offer</strong> - serwer odpowiada ofertą
                    konfiguracji zawierającą adres IP
                  </li>
                  <li>
                    <strong>DHCP Request</strong> - klient wybiera i potwierdza
                    akceptację oferty
                  </li>
                  <li>
                    <strong>DHCP Acknowledge</strong> - serwer zatwierdza
                    przyznanie adresu i przesyła pełną konfigurację
                  </li>
                </ol>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Dzięki DHCP administratorzy mogą centralnie zarządzać
                  adresacją IP, co eliminuje konflikty adresów i upraszcza
                  konfigurację nowych urządzeń w sieci.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-center">
            <Link
              to="/public-tools"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Wypróbuj samodzielnie
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiAssistantDemo;
