import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config.js";
import { FaUserGraduate, FaLock, FaIdCard } from "react-icons/fa";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    albumNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isLoginView ? "/login/" : "/register/";
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        username: formData.username,
        password: formData.password,
        album_number: formData.albumNumber,
      });

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
    <div className="min-h-screen pt-24 pb-10 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Panel lewy z animowanym tłem */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800"></div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIj48L3JlY3Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')]"></div>
              </div>
              <div className="relative flex flex-col justify-center items-center py-20 px-8 h-full">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src="/study_logo_orange_no_text.png"
                  alt="Logo"
                  className="w-32 h-32 mb-12"
                />
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl font-bold mb-6 text-center text-white"
                >
                  {isLoginView ? "Witaj z powrotem!" : "Dołącz do nas!"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg mb-8 text-center text-white/80 max-w-md"
                >
                  {isLoginView
                    ? "Zaloguj się, aby korzystać z asystenta nauki i wszystkich funkcji StudyTailor."
                    : "Utwórz konto i rozpocznij swoją edukacyjną podróż ze wsparciem sztucznej inteligencji."}
                </motion.p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsLoginView(true)}
                    className={`px-6 py-3 rounded-full transition-all duration-300 ${
                      isLoginView
                        ? "bg-white text-purple-700 font-semibold shadow-lg"
                        : "bg-transparent text-white border-2 border-white/30 hover:border-white/80"
                    }`}
                  >
                    Logowanie
                  </button>
                  <button
                    onClick={() => setIsLoginView(false)}
                    className={`px-6 py-3 rounded-full transition-all duration-300 ${
                      !isLoginView
                        ? "bg-white text-purple-700 font-semibold shadow-lg"
                        : "bg-transparent text-white border-2 border-white/30 hover:border-white/80"
                    }`}
                  >
                    Rejestracja
                  </button>
                </div>
              </div>
            </div>

            {/* Panel prawy - formularz */}
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoginView ? "login" : "register"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-center"
                >
                  <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
                    {isLoginView ? "Zaloguj się do konta" : "Utwórz nowe konto"}
                  </h3>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        <FaUserGraduate className="mr-2" />
                        Login
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-colors duration-300"
                        placeholder="Wprowadź login"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        <FaLock className="mr-2" />
                        Hasło
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-colors duration-300"
                        placeholder="Wprowadź hasło"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        <FaIdCard className="mr-2" />
                        Numer albumu
                      </label>
                      <input
                        type="text"
                        name="albumNumber"
                        value={formData.albumNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-colors duration-300"
                        placeholder="Wprowadź numer albumu"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex justify-center items-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : null}
                      {isLoginView ? "Zaloguj się" : "Utwórz konto"}
                    </motion.button>
                  </form>

                  <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLoginView
                      ? "Nie masz jeszcze konta?"
                      : "Masz już konto?"}{" "}
                    <button
                      onClick={() => setIsLoginView(!isLoginView)}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      {isLoginView ? "Zarejestruj się" : "Zaloguj się"}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
