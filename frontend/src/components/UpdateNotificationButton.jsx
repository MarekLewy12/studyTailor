import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaInfoCircle, FaTimes } from "react-icons/fa";

// Informacje o aktualizacjach - w formie bezosobowej
const updateInfo = [
  {
    id: 1,
    date: "2025-04-01",
    title: "Wprowadzenie weryfikacji przez email",
    description:
      "Zmieniono system rejestracji, aby zwiększyć bezpieczeństwo kont użytkowników. Wprowadzono obowiązkową weryfikację adresu email poprzez link aktywacyjny.",
    isImportant: true,
    affectsUsers: true,
  },
  {
    id: 2,
    date: "2025-03-28",
    title: "Ulepszenia interfejsu użytkownika",
    description:
      "Wprowadzono nowy, bardziej przejrzysty interfejs logowania i rejestracji. Poprawiono również responsywność aplikacji na urządzeniach mobilnych.",
    isImportant: false,
    affectsUsers: false,
  },
];

// Modal z informacjami o aktualizacjach
const UpdateModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Przyciemnienie tła */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-1/2 left-1/2 bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl z-50 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
          >
            {/* Nagłówek modala */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <FaInfoCircle className="mr-3 text-blue-500" />
                Aktualizacje i zmiany w aplikacji
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Ważne powiadomienie */}
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-md">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                Ważna informacja!
              </h3>
              <p className="text-yellow-700 dark:text-yellow-200">
                W związku z wprowadzeniem weryfikacji email, konieczne jest
                ponowne utworzenie konta.
              </p>
            </div>

            {/* Lista aktualizacji */}
            <div className="space-y-6">
              {updateInfo.map((update) => (
                <div
                  key={update.id}
                  className={`p-4 rounded-lg border ${
                    update.isImportant
                      ? "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/10"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`font-bold ${
                        update.isImportant
                          ? "text-red-700 dark:text-red-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {update.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {update.description}
                  </p>
                  {update.affectsUsers && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      Ta zmiana wymaga działania ze strony użytkowników.
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md transition-all duration-300"
              >
                Rozumiem
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Przycisk powiadamiający o aktualizacjach
const UpdateNotificationButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(true);

  // Sprawdzanie czy są nowsze aktualizacje niż ostatnio widziane
  useEffect(() => {
    const lastSeenUpdateId = localStorage.getItem("lastSeenUpdateId");
    // Sprawdź czy są nowsze aktualizacje niż ostatnio widziane
    if (
      !lastSeenUpdateId ||
      Math.max(...updateInfo.map((u) => u.id)) > parseInt(lastSeenUpdateId)
    ) {
      setHasNewUpdates(true);
    } else {
      setHasNewUpdates(false);
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setHasNewUpdates(false);
    // Zapisz ID najnowszej aktualizacji
    localStorage.setItem(
      "lastSeenUpdateId",
      Math.max(...updateInfo.map((u) => u.id)).toString(),
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-6 bottom-6 z-30 flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300"
        onClick={handleOpenModal}
      >
        <FaBell className="mr-2" />
        <span className="font-medium">Sprawdź aktualizacje</span>
        {hasNewUpdates && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </motion.button>

      <UpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default UpdateNotificationButton;
