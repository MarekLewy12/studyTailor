import React from "react";
import { motion, useInView } from "framer-motion";

const AboutProjectSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-10 px-4"
    >
      <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl border border-orange-100 dark:border-orange-900">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-blue-400 text-transparent bg-clip-text text-center">
          O projekcie
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-700 dark:text-gray-300"
          >
            Nasz projekt ma na celu stworzenie aplikacji, która ułatwi studentom
            planowanie nauki i zarządzanie czasem. Pracujemy nad tym projektem w
            ramach przedmiotu "Inżynierski Projekt Zespołowy".
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-700 dark:text-gray-300"
          >
            Zespół składa się z kilku studentów, którzy współpracują, aby
            dostarczyć funkcjonalne i użyteczne rozwiązanie, które sprawi że
            życie studentów (czyli również nas!) będzie prostsze.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-700 dark:text-gray-300"
          >
            W projekcie wykorzystujemy technologie, takie jak React, Python
            Django oraz SQLite, aby zapewnić wysoką jakość, wydajność i
            skalowalność aplikacji. Naszym celem jest stworzenie narzędzia,
            które będzie nie tylko funkcjonalne, ale także intuicyjne i
            przyjazne dla studentów.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-700 dark:text-gray-300"
          >
            W przyszłości planujemy żeby aplikacja działała dla różnych systemów
            pobierania planu zajęć, również tych ze szkół średnich.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutProjectSection;
