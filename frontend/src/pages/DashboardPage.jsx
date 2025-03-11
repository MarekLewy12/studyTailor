import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBook,
  FaRobot,
  FaCheckCircle,
  FaEyeSlash,
  FaDownload,
  FaCheck,
  FaFilter,
  FaUserCog,
  FaSyncAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { API_BASE_URL } from "../config.js";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showLectures, setShowLectures] = useState(() => {
    const saved = localStorage.getItem("showLectures");
    return saved !== null ? saved === "true" : true;
  });
  const [lastUpdate, setLastUpdate] = useState(null); // ostatnia aktualizacja planu
  const [isRefreshing, setIsRefreshing] = useState(false); // aktualizacja w trakcie
  const [shouldRefresh, setShouldRefresh] = useState(true); // czy odświeżać dane

  const fetchSubjects = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Brak tokenu autoryzacji");
        setIsLoading(false);
        return;
      }

      const params = forceRefresh ? "?refresh=true" : "";
      const response = await axios.get(`${API_BASE_URL}/subjects/${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Cała odpowiedź:", response);
      console.log("Dane odpowiedzi:", response.data);
      console.log("Wartość last_update:", response.data.last_update);
      console.log("Typ last_update:", typeof response.data.last_update);

      if (response.data.data) {
        setSubjects(response.data.data);
        setLastUpdate(response.data.last_update);

        if (response.data.data.length > 0) {
          const mastered = response.data.data.filter(
            (subject) => subject.is_mastered,
          );
          setProgress(
            Math.round((mastered.length / response.data.data.length) * 100),
          );
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Błąd podczas pobierania przedmiotów:", error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubjects(true).finally(() => {
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted && shouldRefresh) {
      fetchSubjects();
      setShouldRefresh(false);
    }

    return () => {
      isMounted = false;
    };
  }, [shouldRefresh]);

  const handleToggleIgnore = async (subjectId) => {
    console.log(`Przełączenie ignorowania dla przedmiotu ${subjectId}`);
  };

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

  // Filtrowanie wykładów
  const filteredSubjects = subjects.filter((subject) => {
    if (!showLectures && subject.lesson_form.toLowerCase() === "wykład") {
      return false;
    }
    return true;
  });

  // Grupowanie przedmiotów według dat
  const groupedSubjects = filteredSubjects.reduce((groups, subject) => {
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
          className="text-6xl font-bold text-gray-800 dark:text-blue-300 mb-6 text-center mt-4"
        >
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <FaCheckCircle className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                  Twój postęp
                </h2>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm dark:text-gray-300">
                Przyswoiłeś {subjects.filter((s) => s.is_mastered).length} z{" "}
                {subjects.length} przedmiotów
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <FaFilter className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                  Filtry zajęć
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Pokaż wykłady
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showLectures}
                      onChange={() => {
                        const newValue = !showLectures;
                        setShowLectures(newValue);
                        localStorage.setItem(
                          "showLectures",
                          newValue.toString(),
                        );
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* TODO: Dodać więcej filtrów */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center mb-4">
                <FaRobot className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Asystent nauki
                </h2>
              </div>
              <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                Potrzebujesz pomocy? Zadaj pytanie naszemu asystentowi AI!
              </p>
              <Link
                to="/assistant"
                className="block text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 text-sm"
              >
                Otwórz asystenta
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center mb-4">
                <FaUserCog className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Zarządzanie kontem
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  to="/account/profile"
                  className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                >
                  Profil użytkownika
                </Link>
                <Link
                  to="/account/settings"
                  className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                >
                  Ustawienia
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-3"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <FaBook className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                Najbliższe zajęcia
              </h2>
              <div className="flex items-center">
                {lastUpdate && (
                  <span className="text-sm text-gray-500 dark:text-gray-300 mr-2">
                    Ostatnia aktualizacja:{" "}
                    {(() => {
                      try {
                        return new Date(lastUpdate).toLocaleString("pl-PL");
                      } catch (e) {
                        console.error("Błąd formatu daty:", e);
                        return "niedostępna";
                      }
                    })()}
                  </span>
                )}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700"
                  title="Odśwież plan zajęć"
                >
                  {isRefreshing ? (
                    <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <FaSyncAlt />
                  )}
                </button>
              </div>
            </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

                              <button
                                onClick={() => handleToggleIgnore(subject.id)}
                                className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`}
                                title="Ignoruj przedmiot"
                              >
                                <FaEyeSlash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p>
                  Brak nadchodzących zajęć. W wybranym okresie nie ma
                  zaplanowanych zajęć lub jeszcze nie zostały opublikowane.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
