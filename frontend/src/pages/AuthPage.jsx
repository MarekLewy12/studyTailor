import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config.js";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    albumNumber: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        navigate("/my-schedules");
      } else {
        setIsLoginView(true);
      }
    } catch (error) {
      console.error(error);
      alert(isLoginView ? "Błędne dane logowania" : "Błąd rejestracji");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Panel lewy - informacyjny */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-8 flex flex-col justify-center items-center text-white">
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src="/study_logo_orange_no_text.png"
            alt="Logo"
            className="w-32 h-32 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            {isLoginView ? "Witaj z powrotem!" : "Dołącz do nas!"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg mb-8 text-center"
          >
            {isLoginView
              ? "Zaloguj się, aby kontynuować swoją podróż edukacyjną"
              : "Zarejestruj się i rozpocznij swoją przygodę z inteligentnym planowaniem nauki"}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsLoginView(true)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                isLoginView
                  ? "bg-white text-orange-500 font-semibold"
                  : "bg-transparent border-2 border-white text-white"
              }`}
            >
              Logowanie
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                !isLoginView
                  ? "bg-white text-orange-500 font-semibold"
                  : "bg-transparent border-2 border-white text-white"
              }`}
            >
              Rejestracja
            </button>
          </div>
        </div>

        {/* Panel prawy - formularz */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.form
              key={isLoginView ? "login" : "register"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2">
                  Login
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-colors duration-300"
                  placeholder="Wprowadź login"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2">
                  Hasło
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-colors duration-300"
                  placeholder="Wprowadź hasło"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2">
                  Numer albumu
                </label>
                <input
                  type="text"
                  name="albumNumber"
                  value={formData.albumNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-colors duration-300"
                  placeholder="Wprowadź numer albumu"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                {isLoginView ? "Zaloguj się" : "Zarejestruj się"}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
