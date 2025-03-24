import React, { useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const faqs = [
    {
      question: "W jaki sposób założyć konto?",
      answer:
        "Aby założyć konto, wystarczy kliknąć przycisk 'Zaloguj się' w prawym górnym rogu strony. Następnie należy wypełnić formularz rejestracyjny i potwierdzić adres e-mail.",
    },
    {
      question: "Czy aplikacja jest darmowa?",
      answer:
        "Tak, aplikacja jest całkowicie darmowa i dostępna dla każdego studenta ZUT.",
    },
    {
      question: "Jakie są korzyści z korzystania z aplikacji?",
      answer:
        "Korzystanie z aplikacji pozwala na ułatwienie procesu nauki, poprzez umożliwienie organizacji materiałów w jednym miejscu, uczenie się z pomocą AI oraz śledzenie postępów w nauce.",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-10 px-4"
    >
      <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl border border-orange-100 dark:border-orange-900">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-blue-400 text-transparent bg-clip-text text-center">
          FAQ
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </h3>
                  <span className="transform transition-transform duration-300">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-4 text-gray-600 dark:text-gray-300 bg-orange-50/50 dark:bg-gray-700/50 rounded-b-lg">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FAQSection;
