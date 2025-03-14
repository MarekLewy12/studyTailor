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
      setMaterials(response.data);
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
  };

  return <div>TODO</div>;
};
export default MaterialsPanel;
