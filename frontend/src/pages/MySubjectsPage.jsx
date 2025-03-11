import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaDownload,
  FaFilter,
  FaGraduationCap,
  FaRobot,
  FaSyncAlt,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../config.js";

const MySubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'lecture', 'lab', 'exercise'

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const response = await axios.get(`${API_BASE_URL}/subjects/?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        setSubjects(response.data.data);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania przedmiotów:", err);
      setError("Nie udało się pobrać przedmiotów");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const getFilteredSubjects = () => {
    if (activeFilter === "all") {
      return subjects;
    }

    return subjects.filter(
      (subject) => subject.lesson_form.toLowerCase() === activeFilter,
    );
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

  const filteredSubjects = getFilteredSubjects();
  const groupedSubjects = groupSubjectsByName(filteredSubjects);

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h1 className="text-6xl font-bold text-center text-gray-800 dark:text-blue-300 mb-6 mt-4">
          Przedmioty
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtry */}
          <div className="lg:col-span-1">
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
                  className={`w-[60%] text-center py-2 px-3 rounded-lg ${
                    activeFilter === "all"
                      ? "bg-indigo-500 text-white"
                      : "bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-gray-200"
                  } hover:bg-indigo-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md`}
                >
                  Wszystkie formy
                </button>
                <button
                  onClick={() => setActiveFilter("wykład")}
                  className={`w-[60%] text-center py-2 px-3 rounded-lg ${
                    activeFilter === "wykład"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-gray-200"
                  } hover:bg-red-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md`}
                >
                  Wykłady
                </button>
                <button
                  onClick={() => setActiveFilter("laboratorium")}
                  className={`w-[60%] text-center py-2 px-3 rounded-lg ${
                    activeFilter === "laboratorium"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-gray-200"
                  } hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md`}
                >
                  Laboratoria
                </button>
                <button
                  onClick={() => setActiveFilter("audytoryjne")}
                  className={`w-[60%] text-center py-2 px-3 rounded-lg ${
                    activeFilter === "audytoryjne"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-gray-200"
                  } hover:bg-orange-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md`}
                >
                  Ćwiczenia
                </button>
              </div>
            </div>
          </div>

          {/* Przedmioty */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <FaGraduationCap className="mr-2 text-indigo-600 dark:text-indigo-400" />
                {activeFilter === "all"
                  ? "Wszystkie przedmioty"
                  : activeFilter === "wykład"
                    ? "Wykłady"
                    : activeFilter === "laboratorium"
                      ? "Laboratoria"
                      : "Ćwiczenia"}
              </h2>
              <button
                onClick={fetchSubjects}
                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors duration-300"
                title="Odśwież listę przedmiotów"
                disabled={isLoading}
              >
                <FaSyncAlt className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">
                <p>{error}</p>
                <button
                  onClick={fetchSubjects}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                >
                  Spróbuj ponownie
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedSubjects).map(
                  ([subjectName, subjectGroup]) => {
                    const totalMaterials = subjectGroup.reduce(
                      (sum, subject) => sum + (subject.materials_count || 0),
                      0,
                    );
                    const isMastered = subjectGroup.some(
                      (subject) => subject.is_mastered,
                    );

                    let cardColor =
                      "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800";
                    const mainSubject = subjectGroup[0];

                    if (mainSubject.lesson_form.toLowerCase() === "wykład") {
                      cardColor =
                        "from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30";
                    } else if (
                      mainSubject.lesson_form.toLowerCase() === "laboratorium"
                    ) {
                      cardColor =
                        "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30";
                    } else if (
                      mainSubject.lesson_form.toLowerCase() === "audytoryjne"
                    ) {
                      cardColor =
                        "from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30";
                    }

                    return (
                      <div
                        key={subjectName}
                        className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${cardColor} p-4 ${
                          isMastered ? "border-l-4 border-green-500" : ""
                        } flex flex-col h-full
                          }`}
                      >
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {subjectName}
                          </h3>

                          <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                            <FaBook className="mr-2" />
                            <p>Dostępne formy zajęć:</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {Array.from(
                              new Set(
                                subjectGroup.map(
                                  (subject) => subject.lesson_form,
                                ),
                              ),
                            ).map((form) => (
                              <span
                                key={form}
                                className={`px-2 py-1 rounded-md text-sm mt-4 ${
                                  form.toLowerCase() === "wykład"
                                    ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                                    : form.toLowerCase() === "laboratorium"
                                      ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                                      : "bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200"
                                }`}
                              >
                                {form}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <FaDownload className="mr-2 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {totalMaterials}{" "}
                                {totalMaterials === 1
                                  ? "materiał"
                                  : totalMaterials < 5 && totalMaterials !== 0
                                    ? "materiały"
                                    : "materiałów"}
                              </span>
                            </div>
                            {isMastered && (
                              <span className="px-2 py-1 bg-green-500 text-white rounded-md text-sm">
                                Przyswojone
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between mt-auto pt-4">
                            <Link
                              to={`/subject/${subjectGroup[0].id}/materials`}
                              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                            >
                              <FaBook className="mr-2" /> Materiały
                            </Link>
                            <Link
                              to={`/subject/${subjectGroup[0].id}/assistant`}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                            >
                              <FaRobot className="mr-2" /> AI
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubjectsPage;
