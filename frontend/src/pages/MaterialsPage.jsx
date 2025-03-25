import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaLink,
  FaTrash,
  FaBook,
  FaChartPie,
  FaSort,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFile,
} from "react-icons/fa";
import PageTitle from "../components/PageTitle";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [groupedMaterials, setGroupedMaterials] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_count: 0,
    total_count_files: 0,
    total_count_links: 0,
    total_size_readable: "0B",
  });

  // Filtry
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, files, links
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, name_asc, name_desc
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Pobieranie materiałów
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const response = await axios.get("/materials/get_all_materials/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMaterials(response.data.data);
      setStats(response.data.stats);
    } catch (err) {
      console.error("Błąd podczas pobierania materiałów:", err);
      setError("Nie udało się pobrać materiałów. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  // Grupowanie materiałów według przedmiotów
  useEffect(() => {
    if (materials.length > 0) {
      const subjectsMap = {};

      materials.forEach((material) => {
        const subjectName = material.subject_name;

        if (!subjectsMap[subjectName]) {
          subjectsMap[subjectName] = [];
        }

        subjectsMap[subjectName].push(material);
      });

      setGroupedMaterials(subjectsMap);
    }
  }, [materials]);

  // Efekt dla filtrowania materiałów
  useEffect(() => {
    if (materials.length > 0) {
      let result = [...materials];

      // Filtrowanie według typu
      if (filterType === "files") {
        result = result.filter((m) => m.file && m.file !== "");
      } else if (filterType === "links") {
        result = result.filter((m) => m.link && m.link !== "");
      }

      // Filtrowanie według przedmiotu
      if (selectedSubject !== "all") {
        result = result.filter((m) => m.subject_name === selectedSubject);
      }

      // Wyszukiwanie
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (m) =>
            m.title.toLowerCase().includes(term) ||
            (m.description && m.description.toLowerCase().includes(term)),
        );
      }

      // Sortowanie
      result.sort((a, b) => {
        switch (sortBy) {
          case "date_asc":
            return new Date(a.created_at) - new Date(b.created_at);
          case "name_asc":
            return a.title.localeCompare(b.title);
          case "name_desc":
            return b.title.localeCompare(a.title);
          case "date_desc":
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });

      setFilteredMaterials(result);
    } else {
      setFilteredMaterials([]);
    }
  }, [materials, filterType, selectedSubject, searchTerm, sortBy]);

  // Pobieranie danych przy montowaniu komponentu
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Obsługa usuwania materiału
  const handleDelete = async (materialId, subjectId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten materiał?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/subjects/${subjectId}/materials/${materialId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Aktualizacja listy materiałów
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    } catch (err) {
      console.error("Błąd podczas usuwania materiału:", err);
      alert("Nie udało się usunąć materiału. Spróbuj ponownie później.");
    }
  };

  // Obsługa pobierania pliku
  const handleDownload = async (material) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `/subjects/${material.subject_id}/materials/${material.id}/download/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      // Tworzenie URL do pobrania
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", material.file.split("/").pop()); // nazwa pliku
      document.body.appendChild(link);
      link.click(); // Symulacja kliknięcia
      link.remove();
    } catch (err) {
      console.error("Błąd podczas pobierania pliku:", err);
      alert("Nie udało się pobrać pliku. Spróbuj ponownie później.");
    }
  };

  // Funkcja pomocnicza do renderowania ikony pliku
  const getFileIcon = (filename) => {
    if (!filename) return <FaFile className="text-gray-400" />;

    const extension = filename.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="text-orange-500" />;
      default:
        return <FaFile className="text-gray-400" />;
    }
  };

  // Uzyskanie listy unikalnych przedmiotów dla filtra
  const subjects = React.useMemo(() => {
    const uniqueSubjects = [...new Set(materials.map((m) => m.subject_name))];
    return uniqueSubjects.sort();
  }, [materials]);

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <PageTitle title="Twoje materiały" />

        {/* Statystyki i filtry */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Statystyki */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-1"
          >
            <div className="flex items-center mb-4">
              <FaChartPie className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Statystyki
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Wszystkie materiały
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.total_count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Pliki</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.total_count_files}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Linki</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.total_count_links}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Łączny rozmiar
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.total_size_readable}
                </span>
              </div>
            </div>

            <button
              onClick={fetchMaterials}
              className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : null}
              Odśwież dane
            </button>
          </motion.div>

          {/* Filtry i wyszukiwanie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-3"
          >
            <div className="flex items-center mb-4">
              <FaFilter className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Filtry i wyszukiwanie
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Wyszukiwarka */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full p-3 ps-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Szukaj materiałów..."
                  />
                </div>
              </div>

              {/* Filtr typu */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="all">Wszystkie typy</option>
                  <option value="files">Tylko pliki</option>
                  <option value="links">Tylko linki</option>
                </select>
              </div>

              {/* Filtr przedmiotu */}
              <div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="all">Wszystkie przedmioty</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sortowanie */}
              <div className="lg:col-span-2">
                <div className="flex items-center">
                  <FaSort className="text-gray-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 mr-2">
                    Sortuj:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortBy("date_desc")}
                      className={`px-3 py-1 rounded-md ${
                        sortBy === "date_desc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Najnowsze
                    </button>
                    <button
                      onClick={() => setSortBy("date_asc")}
                      className={`px-3 py-1 rounded-md ${
                        sortBy === "date_asc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Najstarsze
                    </button>
                    <button
                      onClick={() => setSortBy("name_asc")}
                      className={`px-3 py-1 rounded-md ${
                        sortBy === "name_asc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      A-Z
                    </button>
                    <button
                      onClick={() => setSortBy("name_desc")}
                      className={`px-3 py-1 rounded-md ${
                        sortBy === "name_desc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Z-A
                    </button>
                  </div>
                </div>
              </div>

              {/* Wyświetlanie liczby wyników */}
              <div className="lg:col-span-2 flex items-center justify-end">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Wyświetlanie {filteredMaterials.length} z {materials.length}{" "}
                  materiałów
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Lista materiałów */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <FaBook className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Wszystkie materiały
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded">
              <p>{error}</p>
              <button
                onClick={fetchMaterials}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-20">
              <FaBook className="text-5xl mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Brak materiałów
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchTerm || filterType !== "all" || selectedSubject !== "all"
                  ? "Nie znaleziono materiałów spełniających kryteria wyszukiwania."
                  : "Nie masz jeszcze żadnych materiałów. Dodaj materiały do swoich przedmiotów."}
              </p>
              <Link
                to="/my-subjects"
                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Przejdź do przedmiotów
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {selectedSubject !== "all" ? (
                <div className="space-y-4">
                  {filteredMaterials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      handleDelete={handleDelete}
                      handleDownload={handleDownload}
                      getFileIcon={getFileIcon}
                    />
                  ))}
                </div>
              ) : (
                Object.entries(groupedMaterials).map(
                  ([subjectName, subjectMaterials]) => {
                    // Filtruj materiały dla tego przedmiotu
                    const filteredSubjectMaterials = filteredMaterials.filter(
                      (m) => m.subject_name === subjectName,
                    );

                    // Jeśli nie ma materiałów po filtrowaniu, nie pokazuj sekcji
                    if (filteredSubjectMaterials.length === 0) {
                      return null;
                    }

                    return (
                      <motion.div
                        key={subjectName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          {subjectName}
                        </h3>
                        <div className="space-y-4">
                          {filteredSubjectMaterials.map((material) => (
                            <MaterialCard
                              key={material.id}
                              material={material}
                              handleDelete={handleDelete}
                              handleDownload={handleDownload}
                              getFileIcon={getFileIcon}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  },
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Karta materiału
const MaterialCard = ({
  material,
  handleDelete,
  handleDownload,
  getFileIcon,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="text-xl mr-3 mt-1">
            {material.file ? (
              getFileIcon(material.file)
            ) : material.link ? (
              <FaLink className="text-indigo-500" />
            ) : (
              <FaFile className="text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              {material.title}
            </h4>
            {material.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {material.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Dodano: {new Date(material.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {material.file ? (
            <button
              onClick={() => handleDownload(material)}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
              title="Pobierz"
            >
              <FaDownload />
            </button>
          ) : material.link ? (
            <a
              href={material.link}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
              title="Otwórz"
            >
              <FaLink />
            </a>
          ) : null}
          <button
            onClick={() => handleDelete(material.id, material.subject_id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            title="Usuń"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MaterialsPage;
