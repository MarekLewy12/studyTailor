import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config.js";
import ClipLoader from "react-spinners/ClipLoader";
import { FaUserGraduate, FaLock, FaIdCard, FaArrowRight } from "react-icons/fa";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isValidatingAlbum, setIsValidatingAlbum] = useState(false);
  const [albumWarning, setAlbumWarning] = useState(null);
  const [albumConfirmed, setAlbumConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    albumNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateAlbumNumber = useCallback(async () => {
    if (!formData.albumNumber || formData.albumNumber.length !== 5) return;

    setIsValidatingAlbum(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-album-number/`,
        {
          album_number: formData.albumNumber,
        },
      );

      if (!response.data.valid) {
        setAlbumWarning(
          response.data.message || "Ten numer albumu jest nieprawidłowy",
        );
        setAlbumConfirmed(false);
      } else {
        setAlbumWarning(null);
        setAlbumConfirmed(true);
      }
    } catch (error) {
      setAlbumWarning("Nie udało się zweryfikować albumu");
      setAlbumConfirmed(false);
    } finally {
      setIsValidatingAlbum(false);
    }
  }, [formData.albumNumber]);

  useEffect(() => {
    if (!isLoginView && formData.albumNumber) {
      const timer = setTimeout(() => {
        validateAlbumNumber();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData.albumNumber, isLoginView, validateAlbumNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginView && albumWarning && !albumConfirmed) {
      setError("Potwierdź, że chcesz użyć tego numeru albumu.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const endpoint = isLoginView ? "/login/" : "/register/";

      const requestData = isLoginView
        ? {
            username: formData.username,
            password: formData.password,
          }
        : {
            username: formData.username,
            password: formData.password,
            album_number: formData.albumNumber,
          };

      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        requestData,
      );

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      if (isLoginView) {
        login();
        navigate("/dashboard");
      } else {
        setIsLoginView(true);
      }
    } catch (error) {
      console.error(error);
      setError(
        isLoginView
          ? "Nie udało się zalogować. Sprawdź dane i spróbuj ponownie."
          : "Nie udało się utworzyć konta. Spróbuj ponownie później.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lewa strona - graficzny panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden py-20"
      >
        <div className="relative h-full flex flex-col justify-center items-center p-8 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <img
              src="/study_logo_orange_no_text.png"
              alt="Logo"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {isLoginView ? "Witaj z powrotem!" : "Dołącz do nas!"}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl text-white/80 max-w-md mb-12"
          >
            {isLoginView
              ? "Zaloguj się, aby korzystać z inteligentnego asystenta nauki i wszystkich funkcji StudyTailor."
              : "Utwórz konto i korzystaj z naszego asystenta AI do planowania nauki na ZUT."}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-auto"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsLoginView(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 min-w-[140px] ${
                  isLoginView
                    ? "bg-white text-indigo-700 shadow-lg"
                    : "bg-transparent text-white border border-white/50 hover:bg-white/10"
                }`}
              >
                Logowanie
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 min-w-[140px] ${
                  !isLoginView
                    ? "bg-white text-indigo-700 shadow-lg"
                    : "bg-transparent text-white border border-white/50 hover:bg-white/10"
                }`}
              >
                Rejestracja
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Prawa strona - formularz */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <div className="w-full max-w-md px-6 py-8 sm:px-8 sm:py-12">
          <motion.div
            key={isLoginView ? "login" : "register"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
              {isLoginView ? "Zaloguj się" : "Utwórz konto"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 flex items-center">
                  <FaUserGraduate className="mr-2" />
                  Login
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-colors duration-300"
                  placeholder="Wprowadź login"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 flex items-center">
                  <FaLock className="mr-2" />
                  Hasło
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-colors duration-300"
                  placeholder="Wprowadź hasło"
                  required
                />
              </div>

              {!isLoginView && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 flex items-center">
                    <FaIdCard className="mr-2" />
                    Numer albumu
                  </label>
                  <input
                    type="text"
                    name="albumNumber"
                    value={formData.albumNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border ${albumWarning ? "border-orange-500" : "border-gray-300 dark:border-gray-700"} focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-colors duration-300`}
                    placeholder="Wprowadź numer albumu"
                    required
                  />

                  {isValidatingAlbum && (
                    <div className="mt-1 text-sm text-gray-500">
                      Weryfikacja numeru albumu...
                    </div>
                  )}

                  {albumWarning && (
                    <div className="mt-2 p-3 rounded-md bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 text-orange-800 dark:text-orange-200 shadow-sm">
                      <p>{albumWarning}</p>
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          id="confirmAlbum"
                          checked={albumConfirmed}
                          onChange={() => setAlbumConfirmed(!albumConfirmed)}
                          className="mr-2"
                        />
                        <label htmlFor="confirmAlbum" className="text-sm">
                          Rozumiem i chcę kontynuować rejestrację
                        </label>
                      </div>
                    </div>
                  )}

                  {!albumWarning && albumConfirmed && (
                    <div className="mt-2 p-3 rounded-md bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-800 dark:text-green-200 shadow-sm">
                      Numer albumu zweryfikowany poprawnie.
                    </div>
                  )}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={
                  isLoading || (!isLoginView && albumWarning && !albumConfirmed)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-md flex items-center justify-center ${
                  !isLoginView && !albumConfirmed
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  <>
                    {isLoginView ? "Zaloguj się" : "Utwórz konto"}
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
