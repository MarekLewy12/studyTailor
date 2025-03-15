import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import {
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaDownload,
  FaTrash,
  FaLink,
} from "react-icons/fa";

const MaterialsPanel = ({ isOpen, onClose, subject }) => {
  const [materials, setMaterials] = useState([]); // Lista materiałów
  const [isLoading, setIsLoading] = useState(false); // Stan ładowania
  const [uploadForm, setUploadForm] = useState({
    // Stan formularza dodawania materiału
    title: "",
    description: "",
    file: null,
    link: "",
  });

  const [uploadType, setUploadType] = useState("file"); // Typ dodawanego materiału
  const [error, setError] = useState(""); // Błąd
  const [isUploading, setIsUploading] = useState(false); // Stan dodawania materiału

  // Pobieranie materiałów
  const fetchMaterials = async () => {
    if (!subject) return;

    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/subjects/${subject.id}/materials/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (Array.isArray(response.data)) {
        setMaterials(response.data);
      } else {
        console.error("Nieprawidłowa struktura danych", response.data);
        setError("Otrzymano nieprawidłowe dane");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania materiałów", error);
      setError("Nie udało się pobrać materiałów");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadForm({
      ...uploadForm,
      file: e.target.files[0],
    });
  };

  const handleInputChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadType === "file" && !uploadForm.file) {
      setError("Wybierz plik");
      return;
    }

    if (uploadType === "link" && !uploadForm.link) {
      setError("Podaj link");
      return;
    }

    if (!uploadForm.title) {
      setError("Podaj tytuł");
      return;
    }

    setIsUploading(true);
    setError("");

    // przesłanie formularza
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description || "");

      if (uploadType === "file") {
        formData.append("file", uploadForm.file);
      } else {
        formData.append("link", uploadForm.link);
      }

      await axios.post(
        `${API_BASE_URL}/subjects/${subject.id}/materials/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // zresetowanie formularza
      setUploadForm({
        title: "",
        description: "",
        file: null,
        link: "",
      });

      // pobranie materiałów
      fetchMaterials();
    } catch (error) {
      console.error("Błąd podczas dodawania materiału", error);
      setError("Nie udało się dodać materiału");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!confirm("Czy na pewno chcesz usunąć materiał?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/subjects/${subject.id}/materials/${materialId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchMaterials(); // odświeżenie listy materiałów
    } catch (error) {
      console.error("Błąd podczas usuwania materiału", error);
      if (error.response) {
        console.error(
          "Status:",
          error.response.status,
          "Dane:",
          error.response.data,
        );
      }
      setError("Nie udało się usunąć materiału");
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FaFileAlt className="text-gray-400" />;

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

  const handleDownload = async (material) => {
    try {
      console.log("Próba pobrania materiału", material);

      const token = localStorage.getItem("token");

      const downloadUrl = `${API_BASE_URL}/subjects/${subject.id}/materials/${material.id}/download/`;

      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Błąd podczas pobierania materiału", response);
        setError("Nie udało się pobrać materiału");
        return;
      }

      const blob = await response.blob();

      const contentType =
        response.headers.get("content-type") || "application/octet-stream";

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: contentType }),
      );

      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers.get("content-disposition");
      let filename = material.file.split("/").pop();

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Błąd podczas pobierania materiału", error);
      setError("Nie udało się pobrać materiału");
    }
  };

  useEffect(() => {
    if (isOpen && subject) {
      fetchMaterials();
    }
  }, [isOpen, subject]);

  useEffect(() => {
    if (!isOpen) {
      setMaterials([]);
      setError("");
      setUploadForm({
        title: "",
        description: "",
        file: null,
        link: "",
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 250,
              mass: 0.8,
            }}
            className="fixed left-0 top-0 bottom-0 w-full sm:w-96 md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            {/* NAGŁÓWEK */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {subject ? `Materiały: ${subject.name}` : "Materiały"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* ZAWARTOŚĆ */}
            <div className="p-4">
              {error && (
                <div className="bg-red-100 text-red-600 p-2 rounded-lg mb-4">
                  {error}
                </div>
              )}
              {/* FORMULARZ DODAWANIA MATERIAŁU */}

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                  Dodaj nowy materiał
                </h3>

                <div className="flex mb-4">
                  <button
                    className={`flex-1 py-2 ${uploadType === "file" ? "bg-indigo-100 dark:bg-indigo-900/30 font-medium" : "bg-gray-100 dark:bg-gray-600"} rounded-l-lg`}
                    onClick={() => setUploadType("file")}
                  >
                    <FaUpload className="inline mr-2" /> Plik
                  </button>
                  <button
                    className={`flex-1 py-2 ${uploadType === "link" ? "bg-indigo-100 dark:bg-indigo-900/30 font-medium" : "bg-gray-100 dark:bg-gray-600"} rounded-r-lg`}
                    onClick={() => setUploadType("link")}
                  >
                    <FaLink className="inline mr-2" /> Link
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                      Tytuł
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Tytuł materiału"
                    />

                    <div className="mb-3">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1 mt-3 text-gray-700 dark:text-gray-300"
                      >
                        Opis (opcjonalnie)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={uploadForm.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        placeholder="Opis materiału"
                      />
                    </div>

                    {uploadType === "file" ? (
                      <div className="mb-3">
                        <label
                          htmlFor="file"
                          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                        >
                          Plik
                        </label>
                        <input
                          type="file"
                          id="file"
                          name="file"
                          onChange={handleFileChange}
                          className="hidden absolute"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("file").click()
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                          >
                            <FaUpload className="inline" /> Wybierz plik
                          </button>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {uploadForm.file
                              ? uploadForm.file.name
                              : "Nie wybrano żadnego pliku"}
                          </span>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          Dozwolone formaty: PDF, DOC, DOCX, PPT, PPTX, itp.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label
                          htmlFor="link"
                          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                        >
                          Link
                        </label>
                        <input
                          type="text"
                          id="link"
                          name="link"
                          value={uploadForm.link}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          placeholder="https://example.com/material"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-5 w-5 border-2 border-white rounded-full mr-3"></div>
                          Przesyłanie...
                        </div>
                      ) : (
                        "Dodaj materiał"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                Twoje materiały
              </h3>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : materials.length > 0 ? (
                <ul className="space-y-3">
                  {materials.map((material) => (
                    <li
                      key={material.id}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start">
                        <div className="mr-3 text-xl">
                          {material.file ? (
                            getFileIcon(material.file)
                          ) : (
                            <FaLink className="text-indigo-500" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {material.title}
                          </h4>
                          {material.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {material.description}
                            </p>
                          )}
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Dodano:{" "}
                            {new Date(material.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {material.file ? (
                            <button
                              onClick={() => {
                                if (material.file) {
                                  handleDownload(material);
                                } else {
                                  setError(
                                    "Ten materiał nie ma przypisanego pliku",
                                  );
                                }
                              }}
                              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                              title="Pobierz"
                            >
                              <FaDownload />
                            </button>
                          ) : (
                            <a
                              href={material.link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                              title="Otwórz"
                            >
                              <FaLink />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Usuń"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FaFile className="mx-auto text-4xl mb-2 opacity-30" />
                  <p>Brak materiałów dla tego przedmiotu</p>
                  <p className="text-sm mt-1">Dodaj swój pierwszy materiał</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default MaterialsPanel;
