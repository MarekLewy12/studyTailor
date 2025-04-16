import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaChartPie,
  FaClock,
  FaEyeSlash,
  FaFilter,
  FaRobot,
  FaSyncAlt,
  FaUserCog,
  FaBell,
  FaStar,
  FaGraduationCap,
  FaTrophy,
  FaCog,
  FaLightbulb,
} from "react-icons/fa";
import PageTitle from "../components/PageTitle.jsx";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showLectures, setShowLectures] = useState(() => {
    const saved = localStorage.getItem("showLectures");
    return saved !== null ? saved === "true" : true;
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const [showOnlyTomorrow, setShowOnlyTomorrow] = useState(false);

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
      const response = await axios.get(`/subjects/${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        `/subjects/${subjectId}/mastered/`,
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

    if (showOnlyTomorrow) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const subjectDate = new Date(subject.start_datetime);

      return subjectDate >= tomorrow && subjectDate < dayAfterTomorrow;
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

  // Statystyki do sekcji "Przegląd nauki"
  const statistics = {
    totalSubjects: subjects.length,
    masteredSubjects: subjects.filter((s) => s.is_mastered).length,
    upcomingClassesCount: filteredSubjects.length,
    nextClass:
      filteredSubjects.length > 0
        ? `${filteredSubjects[0].name} (${new Date(filteredSubjects[0].start_datetime).toLocaleDateString()})`
        : "Brak zaplanowanych zajęć",
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <PageTitle title="Twój Dashboard" showUsername={true} />

        {/* Nawigacja zakładek */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-shadow transition-border duration-300">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === "upcoming"
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              Nadchodzące zajęcia
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === "overview"
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaChartPie className="inline mr-2" />
              Przegląd nauki
            </button>
          </div>
        </div>

        {activeTab === "upcoming" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-4 border-indigo-200 dark:border-indigo-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <FaCheckCircle className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                    Twój postęp
                  </h2>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm dark:text-gray-300">
                    Przyswoiłeś {subjects.filter((s) => s.is_mastered).length} z{" "}
                    {subjects.length} przedmiotów
                  </p>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {progress}%
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-shadow transition-border duration-300"
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

                  {/* Dodatkowe filtry */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Pokaż tylko jutrzejsze zajęcia
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showOnlyTomorrow}
                        onChange={() => setShowOnlyTomorrow(!showOnlyTomorrow)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Ukryj przyswojone
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700"
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
                  className="block text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 text-sm font-medium"
                >
                  Otwórz asystenta
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700"
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
                    className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center justify-center"
                  >
                    <FaUserCog className="mr-2" />
                    Profil użytkownika
                  </Link>
                  <Link
                    to="/account/settings"
                    className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center justify-center"
                  >
                    <FaCog className="mr-2" />
                    Ustawienia
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-3 border-4 border-indigo-200 dark:border-indigo-800"
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
                    className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                        <FaCalendarAlt className="mr-2 text-indigo-500" />
                        {formatDate(date)}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {groupedSubjects[date].map((subject) => (
                          <motion.div
                            key={subject.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-lg bg-gradient-to-br shadow-md hover:shadow-lg transition-all duration-300 border ${
                              subject.is_mastered
                                ? "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 border-green-500"
                                : "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40 border-indigo-500"
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
                                <p
                                  className={`text-gray-600 dark:text-gray-400 ${
                                    subject.lesson_form.toLowerCase() ===
                                    "wykład"
                                      ? "text-red-500 dark:text-red-400"
                                      : subject.lesson_form.toLowerCase() ===
                                          "laboratorium"
                                        ? "text-green-500 dark:text-green-400"
                                        : "text-blue-500 dark:text-blue-400"
                                  }`}
                                >
                                  {subject.lesson_form}
                                </p>
                                <div className="flex items-center mt-1">
                                  <FaClock className="text-gray-500 dark:text-gray-400 mr-1" />
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
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleToggleMastered(subject.id)
                                  }
                                  className={`p-2 rounded-full ${
                                    subject.is_mastered
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  } transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    subject.is_mastered
                                      ? "focus:ring-green-500"
                                      : "focus:ring-gray-500"
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
                                  className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                                  title="Ignoruj przedmiot"
                                >
                                  <FaEyeSlash />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FaCalendarAlt className="mx-auto text-4xl mb-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg">
                    Brak nadchodzących zajęć. W wybranym okresie nie ma
                    zaplanowanych zajęć lub jeszcze nie zostały opublikowane.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <FaSyncAlt className="inline mr-2" />
                    Odśwież plan zajęć
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Zakładka Przegląd nauki */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statystyki */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-4 border-indigo-200 dark:border-indigo-800"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <FaChartPie className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                Statystyki nauki
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-blue-500 text-xl mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Wszystkie przedmioty
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {statistics.totalSubjects}
                  </span>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <FaCheck className="text-green-500 text-xl mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Przyswojone
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {statistics.masteredSubjects}
                  </span>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-purple-500 text-xl mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Nadchodzące zajęcia
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {statistics.upcomingClassesCount}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center mb-2">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Wskazówka
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Regularnie oznaczaj przyswojone przedmioty, aby śledzić swoje
                  postępy. Możesz też korzystać z asystenta AI, aby lepiej
                  zrozumieć trudne zagadnienia.
                </p>
              </div>
            </motion.div>

            {/* Najbliższe zajęcia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <FaClock className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                Najbliższe zajęcia
              </h2>

              {filteredSubjects.length > 0 ? (
                <div className="space-y-4">
                  {filteredSubjects.slice(0, 3).map((subject) => (
                    <div
                      key={subject.id}
                      className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-between border border-indigo-100 dark:border-indigo-800 hover:shadow-md transition-all"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          {subject.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(subject.start_datetime).toLocaleDateString(
                            "pl-PL",
                          )}{" "}
                          •{" "}
                          {new Date(subject.start_datetime).toLocaleTimeString(
                            "pl-PL",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      {subject.is_mastered ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Przyswojone
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleMastered(subject.id)}
                          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors duration-300"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <FaCalendarAlt className="mx-auto text-4xl mb-2 opacity-30" />
                  <p>Brak nadchodzących zajęć</p>
                </div>
              )}

              <button className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                <FaCalendarAlt className="mr-2" />
                Zobacz wszystkie
              </button>
            </motion.div>

            {/* Osiągnięcia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <FaTrophy className="mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
                Osiągnięcia
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg text-center ${progress >= 25 ? "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-900/40 border border-yellow-300 dark:border-yellow-800" : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"}`}
                >
                  <FaStar
                    className={`mx-auto text-2xl mb-2 ${progress >= 25 ? "text-yellow-500" : "text-gray-400"}`}
                  />
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    25% przyswojonej wiedzy
                  </p>
                  {progress >= 25 ? (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      Zdobyte!
                    </span>
                  ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min((progress / 25) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg text-center ${progress >= 50 ? "bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-900/40 border border-indigo-300 dark:border-indigo-800" : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"}`}
                >
                  <FaStar
                    className={`mx-auto text-2xl mb-2 ${progress >= 50 ? "text-indigo-500" : "text-gray-400"}`}
                  />
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    50% przyswojonej wiedzy
                  </p>
                  {progress >= 50 ? (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400">
                      Zdobyte!
                    </span>
                  ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2">
                      <div
                        className="bg-indigo-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min((progress / 50) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg text-center ${progress >= 75 ? "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-900/40 border border-purple-300 dark:border-purple-800" : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"}`}
                >
                  <FaStar
                    className={`mx-auto text-2xl mb-2 ${progress >= 75 ? "text-purple-500" : "text-gray-400"}`}
                  />
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    75% przyswojonej wiedzy
                  </p>
                  {progress >= 75 ? (
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Zdobyte!
                    </span>
                  ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2">
                      <div
                        className="bg-purple-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min((progress / 75) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg text-center ${progress >= 100 ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-900/40 border border-green-300 dark:border-green-800" : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"}`}
                >
                  <FaStar
                    className={`mx-auto text-2xl mb-2 ${progress >= 100 ? "text-green-500" : "text-gray-400"}`}
                  />
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    100% przyswojonej wiedzy
                  </p>
                  {progress >= 100 ? (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Zdobyte!
                    </span>
                  ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
