import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModelChangeConfirmPopup = ({
  isOpen,
  onCancel,
  onConfirm,
  currentModel,
  newModel,
}) => {
  if (!isOpen) return null; // nie renderuj nic, jeśli popup nie jest otwarty

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-start justify-center pt-20 z-50"
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onCancel}
          ></div>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-80 sm:w-96 md:w-[32rem] lg:w-[40rem] z-10"
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              Zmiana modelu asystenta
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Zmiana modelu z{" "}
              {currentModel === "deepseek" ? "Deepseek" : "GPT-4o"} na{" "}
              {newModel === "deepseek" ? "Deepseek" : "GPT-4o"} spowoduje
              wyczyszczenie historii konwersacji. Czy na pewno chcesz
              kontynuować?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Anuluj
              </button>
              <button
                onClick={onConfirm}
                className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Zmień model
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModelChangeConfirmPopup;
