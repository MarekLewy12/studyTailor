// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBook,
  FaRobot,
  FaCheckCircle,
  FaPlus,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import { API_BASE_URL } from "../config.js";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Brak tokenu autoryzacji");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/subjects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setSubjects(response.data);

          // Obliczanie postępu
          if (response.data.length > 0) {
            const mastered = response.data.filter(
              (subject) => subject.is_mastered,
            );
            setProgress(
              Math.round((mastered.length / response.data.length) * 100),
            );
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania przedmiotów:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSubjects();

    // Funkcja czyszcząca
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleMastered = async (subjectId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/subjects/${subjectId}/mastered/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Aktualizuj stan lokalnie
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === subjectId
            ? { ...subject, is_mastered: !subject.is_mastered }
            : subject,
        ),
      );

      // Aktualizuj postęp
      const updatedSubjects = subjects.map((subject) =>
        subject.id === subjectId
          ? { ...subject, is_mastered: !subject.is_mastered }
          : subject,
      );
      const mastered = updatedSubjects.filter((subject) => subject.is_mastered);
      setProgress(Math.round((mastered.length / updatedSubjects.length) * 100));
    } catch (error) {
      console.error("Błąd podczas aktualizacji statusu przedmiotu:", error);
    }
  };

  // Grupowanie przedmiotów według dat
  const groupedSubjects = subjects.reduce((groups, subject) => {
    const date = subject.start_datetime.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(subject);
    return groups;
  }, {});

  // Sortowanie dat
  const sortedDates = Object.keys(groupedSubjects).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center mt-4"
        >
          Twój panel nauki
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel postępu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <FaCheckCircle className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
              Twój postęp
            </h2>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-lg dark:text-gray-300">
              Przyswoiłeś {subjects.filter((s) => s.is_mastered).length} z{" "}
              {subjects.length} przedmiotów
            </p>
          </motion.div>

          {/* Najbliższe zajęcia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <FaBook className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
              Najbliższe zajęcia
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : sortedDates.length > 0 ? (
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">
                      {formatDate(date)}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {groupedSubjects[date].map((subject) => (
                        <div
                          key={subject.id}
                          className={`p-4 rounded-lg ${
                            subject.is_mastered
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                              : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4
                                className={`font-bold ${
                                  subject.is_mastered
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {subject.name}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {subject.lesson_form}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {new Date(
                                  subject.start_datetime,
                                ).toLocaleTimeString("pl-PL", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -
                                {new Date(
                                  subject.end_datetime,
                                ).toLocaleTimeString("pl-PL", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleMastered(subject.id)}
                                className={`p-2 rounded-full ${
                                  subject.is_mastered
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                }`}
                                title={
                                  subject.is_mastered
                                    ? "Przyswojone"
                                    : "Oznacz jako przyswojone"
                                }
                              >
                                <FaCheck />
                              </button>
                            </div>
                          </div>

                          {/* Akcje dla przedmiotu */}
                          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                            <Link
                              to={`/subject/${subject.id}/materials`}
                              className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FaDownload className="mr-1" /> Materiały (
                              {subject.materials_count})
                            </Link>
                            <Link
                              to={`/subject/${subject.id}/assistant`}
                              className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FaRobot className="mr-1" /> Ucz się z AI
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p>Brak nadchodzących zajęć.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Asystent i panel użytkownika */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FaRobot className="text-3xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Asystent nauki
              </h2>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Potrzebujesz pomocy? Zadaj pytanie naszemu asystentowi opartemu na
              AI!
            </p>
            <Link
              to="/assistant"
              className="block text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300"
            >
              Otwórz asystenta
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FaBook className="text-3xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Zarządzanie kontem
              </h2>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Zarządzaj swoim kontem oraz aktualizuj ustawienia aplikacji.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/account/profile"
                className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Profil użytkownika
              </Link>
              <Link
                to="/account/settings"
                className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Ustawienia
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
