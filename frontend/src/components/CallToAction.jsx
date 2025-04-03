import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 bg-violet-400 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 md:p-16 text-center text-white max-w-5xl mx-auto shadow-xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rozpocznij swoją przygodę z efektywną nauką
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Nie czekaj - dołącz do tysięcy studentów, którzy już przekonali się
            o korzyściach płynących z wykorzystania sztucznej inteligencji w
            procesie nauki.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/auth"
              className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-colors"
            >
              Zarejestruj się jako student
            </Link>
            <Link
              to="/public-tools"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Wypróbuj bez rejestracji
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
