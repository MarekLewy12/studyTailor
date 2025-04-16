import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaDownload,
  FaFilter,
  FaGraduationCap,
  FaRobot,
  FaSyncAlt,
  FaRegBookmark,
  FaBookmark,
  FaChartPie,
  FaCheckCircle,
  FaCalendarAlt,
  FaSearch,
  FaList,
  FaChalkboardTeacher,
  FaFlask,
  FaLaptopCode,
} from "react-icons/fa";
import axios from "axios";
import MaterialsPanel from "../components/MaterialsPanel.jsx";
import AIChatPanel from "../components/AIChatPanel.jsx";
import PageTitle from "../components/PageTitle.jsx";

const MySubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'lecture', 'lab', 'exercise'
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'mastered', 'notMastered'
  const [searchTerm, setSearchTerm] = useState("");
  const [showMaterialsCount, setShowMaterialsCount] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [materialsVisible, setMaterialsVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [selectedAiSubject, setSelectedAiSubject] = useState(null);

  // Statystyki
  const [statistics, setStatistics] = useState({
    totalSubjects: 0,
    masteredSubjects: 0,
    lectures: 0,
    labs: 0,
    exercises: 0,
    totalMaterials: 0,
  });

  const openAiChatPanel = (subject) => {
    setSelectedAiSubject(subject);
    setAiChatVisible(true);
  };

  const closeAiChatPanel = () => {
    setAiChatVisible(false);
  };

  const openMaterialsPanel = (subject) => {
    setSelectedSubject(subject);
    setMaterialsVisible(true);
  };

  const closeMaterialsPanel = () => {
    setMaterialsVisible(false);
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsRefreshing(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const response = await axios.get(`/subjects/?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        setSubjects(response.data.data);
        updateStatistics(response.data.data);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania przedmiotów:", err);
      setError("Nie udało się pobrać przedmiotów");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateStatistics = (subjectData) => {
    const lectures = subjectData.filter(
        (s) => s.lesson_form.toLowerCase() === "wykład",
    ).length;
    const labs = subjectData.filter(
        (s) => s.lesson_form.toLowerCase() === "laboratorium",
    ).length;
    const exercises = subjectData.filter(
        (s) => s.lesson_form.toLowerCase() === "audytoryjne",
    ).length;
    const mastered = subjectData.filter((s) => s.is_mastered).length;
    const totalMaterials = subjectData.reduce(
        (sum, subject) => sum + (subject.materials_count || 0),
        0,
    );

    setStatistics({
      totalSubjects: subjectData.length,
      masteredSubjects: mastered,
      lectures,
      labs,
      exercises,
      totalMaterials,
    });
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const getFilteredSubjects = () => {
    let filtered = [...subjects];

    // Filtrowanie po formie zajęć
    if (activeFilter !== "all") {
      filtered = filtered.filter(
          (subject) => subject.lesson_form.toLowerCase() === activeFilter,
      );
    }

    // Filtrowanie po zakładce (wszystkie, przyswojone, nieprzyswojone)
    if (activeTab === "mastered") {
      filtered = filtered.filter((subject) => subject.is_mastered);
    } else if (activeTab === "notMastered") {
      filtered = filtered.filter((subject) => !subject.is_mastered);
    }

    // Wyszukiwanie
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((subject) =>
          subject.name.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  const groupSubjectsByName = (subjects) => {
    const groupedSubjects = {};

    for (const subject of subjects) {
      if (!groupedSubjects[subject.name]) {
        groupedSubjects[subject.name] = [];
      }

      groupedSubjects[subject.name].push(subject);
    }
    return groupedSubjects;
  };

  const toggleMasteredStatus = async (subjectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
          `/subjects/${subjectId}/mastered/`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
      );

      // Aktualizacja stanu lokalnie
      const updatedSubjects = subjects.map((subject) =>
          subject.id === subjectId
              ? { ...subject, is_mastered: !subject.is_mastered }
              : subject,
      );

      setSubjects(updatedSubjects);
      updateStatistics(updatedSubjects);
    } catch (error) {
      console.error("Błąd podczas aktualizacji statusu przedmiotu:", error);
    }
  };

  const filteredSubjects = getFilteredSubjects();
  const groupedSubjects = groupSubjectsByName(filteredSubjects);

  // Funkcja pomocnicza dla wyświetlania ikon dla różnych form zajęć
  const getFormIcon = (form) => {
    const formLower = form.toLowerCase();
    if (formLower === "wykład") {
      return <FaChalkboardTeacher className="text-white" />;
    } else if (formLower === "laboratorium") {
      return <FaFlask className="text-white" />;
    } else if (formLower === "audytoryjne") {
      return <FaLaptopCode className="text-white" />;
    }
    return <FaBook className="text-white" />;
  };

  // Funkcja pomocnicza dla kolorów tła kart przedmiotów
  const getSubjectCardGradient = (form) => {
    const formLower = form.toLowerCase();

    if (formLower === "wykład") {
      return "bg-red-700/50 dark:bg-red-900/60";
    } else if (formLower === "laboratorium") {
      return "bg-green-700/50 dark:bg-green-900/60";
    } else if (formLower === "audytoryjne") {
      return "bg-blue-700/50 dark:bg-blue-900/60";
    } else if (formLower === "lektorat") {
      return "bg-purple-700/50 dark:bg-purple-900/60";
    }

    return "bg-indigo-700/50 dark:bg-indigo-900/60";
  };

  return (
      <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
        <AIChatPanel
            isOpen={aiChatVisible}
            onClose={closeAiChatPanel}
            subject={selectedAiSubject}
        />

        <MaterialsPanel
            isOpen={materialsVisible}
            onClose={closeMaterialsPanel}
            subject={selectedSubject}
        />

        <div className="container mx-auto px-2 sm:px-4">
          <PageTitle title="Twoje przedmioty" showUsername={true} />

          {/* Zakładki nawigacyjne */}
          <div className="mb-8 flex flex-wrap justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md w-full max-w-2xl flex flex-wrap justify-center">
              <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 m-1 rounded-md transition-all flex-1 min-w-24 ${
                      activeTab === "all"
                          ? "bg-indigo-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                <FaList className="inline mr-2" />
                <span className="whitespace-nowrap">Wszystkie</span>
              </button>
              <button
                  onClick={() => setActiveTab("mastered")}
                  className={`px-4 py-2 m-1 rounded-md transition-all flex-1 min-w-24 ${
                      activeTab === "mastered"
                          ? "bg-green-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                <FaCheckCircle className="inline mr-2" />
                <span className="whitespace-nowrap">Przyswojone</span>
              </button>
              <button
                  onClick={() => setActiveTab("notMastered")}
                  className={`px-4 py-2 m-1 rounded-md transition-all flex-1 min-w-24 ${
                      activeTab === "notMastered"
                          ? "bg-indigo-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                <FaBook className="inline mr-2" />
                <span className="whitespace-nowrap">Do nauki</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Panel boczny z filtrami i statystykami dla większych ekranów */}
            <div className="lg:block hidden lg:col-span-1 space-y-4 md:space-y-6">
              {/* Wyszukiwanie */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full p-3 ps-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Szukaj przedmiotu..."
                  />
                </div>
              </div>

              {/* Filtry */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <FaFilter className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Filtry
                  </h2>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <button
                      onClick={() => setActiveFilter("all")}
                      className={`w-[80%] text-center py-2 px-3 rounded-lg ${
                          activeFilter === "all"
                              ? "bg-indigo-500 text-white"
                              : "bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-gray-200"
                      } hover:bg-indigo-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md`}
                  >
                    Wszystkie formy
                  </button>
                  <button
                      onClick={() => setActiveFilter("wykład")}
                      className={`w-[80%] text-center py-2 px-3 rounded-lg ${
                          activeFilter === "wykład"
                              ? "bg-red-500 text-white"
                              : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-gray-200"
                      } hover:bg-red-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md flex items-center justify-center`}
                  >
                    <FaChalkboardTeacher className="mr-2" /> Wykłady
                  </button>
                  <button
                      onClick={() => setActiveFilter("laboratorium")}
                      className={`w-[80%] text-center py-2 px-3 rounded-lg ${
                          activeFilter === "laboratorium"
                              ? "bg-green-500 text-white"
                              : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-gray-200"
                      } hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md flex items-center justify-center`}
                  >
                    <FaFlask className="mr-2" /> Laboratoria
                  </button>
                  <button
                      onClick={() => setActiveFilter("audytoryjne")}
                      className={`w-[80%] text-center py-2 px-3 rounded-lg ${
                          activeFilter === "audytoryjne"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-gray-200"
                      } hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md flex items-center justify-center`}
                  >
                    <FaLaptopCode className="mr-2" /> Ćwiczenia
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between px-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Liczba materiałów
                  </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={showMaterialsCount}
                          onChange={() =>
                              setShowMaterialsCount(!showMaterialsCount)
                          }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Statystyki */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center mb-4">
                  <FaChartPie className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Statystyki
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Wszystkie przedmioty
                  </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {statistics.totalSubjects}
                  </span>
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Przyswojone
                  </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                    {statistics.masteredSubjects}
                  </span>
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Wykłady
                  </span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                    {statistics.lectures}
                  </span>
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Laboratoria
                  </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                    {statistics.labs}
                  </span>
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Ćwiczenia
                  </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                    {statistics.exercises}
                  </span>
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Materiały
                  </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                    {statistics.totalMaterials}
                  </span>
                  </div>
                </div>
              </div>

              {/* Przycisk odświeżania */}
              <button
                  onClick={fetchSubjects}
                  disabled={isRefreshing}
                  className="w-full flex items-center justify-center py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-300 shadow-md"
              >
                {isRefreshing ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                    <FaSyncAlt className="mr-2" />
                )}
                Odśwież dane
              </button>
            </div>

            {/* Panel boczny mobilny - widoczny tylko na małych ekranach */}
            <div className="lg:hidden col-span-1 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full p-3 ps-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Szukaj przedmiotu..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                      onClick={() => setActiveFilter("all")}
                      className={`text-center py-2 px-3 rounded-lg text-sm ${
                          activeFilter === "all"
                              ? "bg-indigo-500 text-white"
                              : "bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-gray-200"
                      }`}
                  >
                    Wszystkie
                  </button>
                  <button
                      onClick={() => setActiveFilter("wykład")}
                      className={`text-center py-2 px-3 rounded-lg text-sm ${
                          activeFilter === "wykład"
                              ? "bg-red-500 text-white"
                              : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-gray-200"
                      }`}
                  >
                    <FaChalkboardTeacher className="inline mr-1" /> Wykłady
                  </button>
                  <button
                      onClick={() => setActiveFilter("laboratorium")}
                      className={`text-center py-2 px-3 rounded-lg text-sm ${
                          activeFilter === "laboratorium"
                              ? "bg-green-500 text-white"
                              : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-gray-200"
                      }`}
                  >
                    <FaFlask className="inline mr-1" /> Laboratoria
                  </button>
                  <button
                      onClick={() => setActiveFilter("audytoryjne")}
                      className={`text-center py-2 px-3 rounded-lg text-sm ${
                          activeFilter === "audytoryjne"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-gray-200"
                      }`}
                  >
                    <FaLaptopCode className="inline mr-1" /> Ćwiczenia
                  </button>
                </div>

                <div className="flex justify-between">
                  <button
                      onClick={fetchSubjects}
                      disabled={isRefreshing}
                      className="flex-1 mr-2 flex items-center justify-center py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-300 shadow-md text-sm"
                  >
                    {isRefreshing ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                    ) : (
                        <FaSyncAlt className="mr-1" />
                    )}
                    Odśwież
                  </button>
                  <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-700 dark:text-gray-300 mr-2">
                    Materiały
                  </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={showMaterialsCount}
                          onChange={() =>
                              setShowMaterialsCount(!showMaterialsCount)
                          }
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Główna sekcja z przedmiotami */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <FaGraduationCap className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  {activeTab === "all"
                      ? activeFilter === "all"
                          ? "Wszystkie przedmioty"
                          : activeFilter === "wykład"
                              ? "Wykłady"
                              : activeFilter === "laboratorium"
                                  ? "Laboratoria"
                                  : "Ćwiczenia"
                      : activeTab === "mastered"
                          ? "Przyswojone przedmioty"
                          : "Przedmioty do nauki"}
                </h2>
                <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ilość wykrytych przedmiotów:{" "}
                  {Object.keys(groupedSubjects).length}
                </span>
                </div>
              </div>

              {/* Panel statystyk */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    Wszystkie
                  </span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-indigo-800 dark:text-indigo-300">
                    {statistics.totalSubjects}
                  </div>
                </div>

                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="text-red-600 dark:text-red-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    Wykłady
                  </span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-red-800 dark:text-red-300">
                    {statistics.lectures}
                  </div>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FaFlask className="text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    Laboratoria
                  </span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-green-800 dark:text-green-300">
                    {statistics.labs}
                  </div>
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FaLaptopCode className="text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    Ćwiczenia
                  </span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-blue-800 dark:text-blue-300">
                    {statistics.exercises}
                  </div>
                </div>
              </div>

              {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
              ) : error ? (
                  <div className="text-center text-red-500 py-10 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p>{error}</p>
                    <button
                        onClick={fetchSubjects}
                        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                    >
                      Spróbuj ponownie
                    </button>
                  </div>
              ) : Object.keys(groupedSubjects).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {Object.entries(groupedSubjects).map(
                        ([subjectName, subjectGroup]) => {
                          const totalMaterials = subjectGroup.reduce(
                              (sum, subject) => sum + (subject.materials_count || 0),
                              0,
                          );
                          const isMastered = subjectGroup.some(
                              (subject) => subject.is_mastered,
                          );
                          const mainSubject = subjectGroup[0];

                          return (
                              <div
                                  key={subjectName}
                                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${getSubjectCardGradient(mainSubject.lesson_form)} flex flex-col h-full`}
                              >
                                <div className="relative">
                                  <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() =>
                                            toggleMasteredStatus(mainSubject.id)
                                        }
                                        className="text-white hover:text-yellow-200 transition-colors"
                                        title={
                                          isMastered
                                              ? "Przyswojone"
                                              : "Oznacz jako przyswojone"
                                        }
                                    >
                                      {isMastered ? (
                                          <FaBookmark className="text-yellow-300" />
                                      ) : (
                                          <FaRegBookmark />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                  <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">
                                      {subjectName}
                                    </h3>
                                  </div>

                                  <div className="flex items-center text-white/80 mt-4">
                                    <FaBook className="mr-2 flex-shrink-0" />
                                    <p className="text-sm sm:text-base">
                                      Dostępne formy zajęć:
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.from(
                                        new Set(
                                            subjectGroup.map(
                                                (subject) => subject.lesson_form,
                                            ),
                                        ),
                                    ).map((form) => (
                                        <span
                                            key={form}
                                            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm flex items-center ${
                                                form.toLowerCase() === "wykład"
                                                    ? "bg-red-600 text-white"
                                                    : form.toLowerCase() === "laboratorium"
                                                        ? "bg-green-600 text-white"
                                                        : form.toLowerCase() === "lektorat"
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-blue-600 text-white"
                                            }`}
                                        >
                                {getFormIcon(form)}
                                          <span className="ml-1 truncate">{form}</span>
                              </span>
                                    ))}
                                  </div>

                                  {showMaterialsCount && (
                                      <div className="flex items-center mt-4 sm:mt-6">
                                        <div className="flex items-center">
                                          <FaDownload className="mr-2 text-white/80 flex-shrink-0" />
                                          <span className="text-white/90 text-sm sm:text-base">
                                  {totalMaterials}{" "}
                                            {totalMaterials === 1
                                                ? "materiał"
                                                : totalMaterials < 5 && totalMaterials !== 0
                                                    ? "materiały"
                                                    : "materiałów"}
                                </span>
                                        </div>
                                      </div>
                                  )}

                                  <div className="flex justify-between mt-auto pt-4 sm:pt-6">
                                    <button
                                        onClick={() =>
                                            openMaterialsPanel(subjectGroup[0])
                                        }
                                        className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors flex items-center shadow-md text-xs sm:text-sm"
                                    >
                                      <FaBook className="mr-1 sm:mr-2 flex-shrink-0" />{" "}
                                      Materiały
                                    </button>
                                    <button
                                        onClick={() => openAiChatPanel(subjectGroup[0])}
                                        className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-100 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors flex items-center shadow-md text-xs sm:text-sm"
                                    >
                                      <FaRobot className="mr-1 sm:mr-2 flex-shrink-0" />{" "}
                                      AI
                                    </button>
                                  </div>
                                </div>
                              </div>
                          );
                        },
                    )}
                  </div>
              ) : (
                  <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <FaBook className="mx-auto text-5xl mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nie znaleziono przedmiotów
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      {searchTerm
                          ? "Nie znaleziono przedmiotów pasujących do podanych kryteriów wyszukiwania."
                          : "Nie masz jeszcze żadnych przedmiotów lub nie pasują one do wybranych filtrów."}
                    </p>
                    <button
                        onClick={() => {
                          setSearchTerm("");
                          setActiveFilter("all");
                          setActiveTab("all");
                        }}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                    >
                      Resetuj filtry
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default MySubjectsPage;
