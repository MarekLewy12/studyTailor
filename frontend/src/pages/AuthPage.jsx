import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaRegCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaUserGraduate,
  FaRobot,
  FaBook,
  FaChartLine,
} from "react-icons/fa";
import { useNotification } from "../context/NotificationContext.jsx";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isValidatingAlbum, setIsValidatingAlbum] = useState(false);
  const [albumWarning, setAlbumWarning] = useState(null);
  const [albumConfirmed, setAlbumConfirmed] = useState(false);
  const [emailCorrect, setEmailCorrect] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlbumTooltip, setShowAlbumTooltip] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    albumNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const { addNotification } = useNotification();
  const location = useLocation();

  // karty informacyjne
  const featureCards = [
    {
      icon: (
        <FaCalendarAlt className="text-blue-500 dark:text-blue-400 text-3xl" />
      ),
      title: "Synchronizacja planu zajęć",
      description:
        "Automatyczna synchronizacja z planem zajęć na uczelni. Wszystkie twoje zajęcia w jednym miejscu.",
    },
    {
      icon: (
        <FaUserGraduate className="text-green-500 dark:text-green-400 text-3xl" />
      ),
      title: "Śledzenie postępów",
      description:
        "Monitoruj swoje postępy w nauce i oznaczaj przyswojone materiały. Bądź na bieżąco ze swoimi osiągnięciami.",
    },
    {
      icon: (
        <FaRobot className="text-purple-500 dark:text-purple-400 text-3xl" />
      ),
      title: "Asystent AI",
      description:
        "Inteligentny asystent oparty na sztucznej inteligencji, który pomoże Ci zrozumieć trudne zagadnienia i odpowie na pytania.",
    },
    {
      icon: <FaBook className="text-amber-500 dark:text-amber-400 text-3xl" />,
      title: "Zarządzanie materiałami",
      description:
        "Wszystkie twoje materiały edukacyjne w jednym miejscu. Dodawaj pliki, linki i notatki do każdego przedmiotu.",
    },
    {
      icon: <FaChartLine className="text-red-500 dark:text-red-400 text-3xl" />,
      title: "Personalizowany plan nauki",
      description:
        "Twórz spersonalizowane plany nauki dostosowane do swojego harmonogramu i stylu uczenia się.",
    },
    {
      icon: (
        <FaInfoCircle className="text-indigo-500 dark:text-indigo-400 text-3xl" />
      ),
      title: "Statystyki i analityka",
      description:
        "Śledzenie postępów w czasie rzeczywistym z wizualizacją danych, które pomogą Ci zoptymalizować proces nauki.",
    },
  ];

  const validateAlbumNumber = useCallback(async () => {
    if (!formData.albumNumber || formData.albumNumber.length !== 5) return;

    setIsValidatingAlbum(true);
    try {
      const response = await axios.post(`/verify-album-number/`, {
        album_number: formData.albumNumber,
      });

      const { valid, exists } = response.data;

      if (!valid) {
        // Numer albumu jest niepoprawny
        setAlbumWarning(
          response.data.message || "Ten numer albumu jest nieprawidłowy",
        );
        setAlbumConfirmed(false);
      } else if (exists) {
        // Numer albumu jest poprawny, ale użytkownik już istnieje
        setAlbumWarning(
          "Użytkownik o tym numerze albumu już istnieje. Czy chcesz się zalogować?",
        );
        setAlbumConfirmed(false);
      } else {
        // Numer albumu jest poprawny i unikalny
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

  const validateEmailAddress = useCallback(() => {
    if (!formData.email || !formData.email.includes("@")) return;

    setIsValidatingEmail(true);

    if (formData.email.endsWith("@zut.edu.pl")) {
      setEmailCorrect(true);
    } else {
      setEmailCorrect(false);
    }
    setIsValidatingEmail(false);
  }, [formData.email]);

  useEffect(() => {
    if (!isLoginView && formData.email) {
      const timer = setTimeout(() => {
        validateEmailAddress();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData.email, isLoginView, validateEmailAddress]);

  useEffect(() => {
    if (!isLoginView && formData.albumNumber) {
      const timer = setTimeout(() => {
        validateAlbumNumber();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData.albumNumber, isLoginView, validateAlbumNumber]);

  useEffect(() => {
    if (!formData.email.includes("zut.edu.pl")) return;

    const beforeAt = formData.email.split("@")[0];

    const match = beforeAt.match(/[a-zA-Z]{2}(\d{5})/);

    if (match && match[1]) {
      const albumNumber = match[1];
      setFormData((prev) => ({
        ...prev,
        albumNumber: albumNumber,
      }));
    }
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginView && albumWarning && !albumConfirmed) {
      setError("Potwierdź, że chcesz użyć tego numeru albumu.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

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
            email: formData.email, // Email jest wymagany!
          };

      const response = await axios.post(endpoint, requestData);

      if (isLoginView) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        setUserInfo(formData.username);
        login();
        navigate("/dashboard");
      } else {
        // Zamiast przechodzić do logowania, pokazujemy komunikat o wysłaniu emaila
        setSuccessMessage(
          `Na adres ${formData.email} wysłaliśmy link aktywacyjny. Proszę sprawdzić pocztę i kliknąć link, aby aktywować konto.`,
        );
        // Nie przełączamy automatycznie na widok logowania -> zamiast tego dajemy użytkownikowi możliwość przejścia
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

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("activation_status");

    if (status) {
      if (status === "success") {
        addNotification(
          "Konto zostało aktywowane pomyślnie. Możesz się teraz zalogować.",
          "success",
        );
      } else if (status === "invalid") {
        addNotification(
          "Link aktywacyjny jest nieprawidłowy lub wygasł. Proszę spróbować ponownie.",
          "error",
        );
      } else if (status === "already_active") {
        addNotification(
          "Konto zostało już wcześniej aktywowane. Możesz się na spokojnie zalogować.",
          "info",
        );
      }
    }
  }, [addNotification, location.search]);

  // karty funkcji
  const FeatureCard = ({ icon, title, description, delay }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Fala dekoracyjna na dole */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z"
            fill="rgba(37, 99, 235, 0.1)"
            className="dark:fill-blue-900/20"
          ></path>
        </svg>
      </div>

      <div className="container z-10 mx-auto px-4 py-10 flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-center">
        {/* Lewa kolumna - formularz */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-5/12 max-w-xl lg:pt-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoginView ? "login" : "register"}
              initial={{ opacity: 0, x: isLoginView ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLoginView ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border-4 border-indigo-200 dark:border-indigo-800"
            >
              {/* Logo i nagłówek */}
              <div className="text-center mb-8">
                <img
                  src="/new_logo_big.png"
                  alt="StudyTailor Logo"
                  className="h-28 w-auto mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {isLoginView ? "Logowanie" : "Rejestracja"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {isLoginView
                    ? "Zaloguj się, aby korzystać z platformy StudyTailor"
                    : "Utwórz konto, aby rozpocząć swoją przygodę z AI"}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-600 dark:text-green-400 text-sm flex items-start">
                  <FaEnvelope className="mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    {successMessage}
                    <button
                      onClick={toggleView}
                      className="block mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      Przejdź do logowania
                    </button>
                  </div>
                </div>
              )}

              {!successMessage && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Pole dla loginu/username */}
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">
                      {isLoginView ? "Login" : "Wybierz login"}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Login"
                      required
                    />
                  </div>

                  {/* Pole dla email - przy rejestracji */}
                  {!isLoginView && (
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1 flex items-center">
                        Email uczelniany
                        <div className="relative ml-2">
                          <FaInfoCircle
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            onMouseEnter={() => setShowEmailTooltip(true)}
                            onMouseLeave={() => setShowEmailTooltip(false)}
                          />
                          <div
                            className={`absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md transition-opacity z-10 ${
                              showEmailTooltip
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            }`}
                          >
                            email powinien kończyć się na @zut.edu.pl
                          </div>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                          placeholder="[inicjały]@zut.edu.pl"
                          required
                        />
                        {isValidatingEmail && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaSpinner className="animate-spin text-blue-500 dark:text-blue-400" />
                          </div>
                        )}
                        {emailCorrect && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaRegCheckCircle className="text-green-500 dark:text-green-400" />
                          </div>
                        )}
                        {formData.email &&
                          formData.email.includes("@") &&
                          (formData.email.endsWith(".pl") ||
                            formData.email.endsWith(".com")) &&
                          !emailCorrect &&
                          !isValidatingEmail && (
                            <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                              <p>
                                Podaj poprawny adres email uczelni (np.
                                nazwa@zut.edu.pl)
                              </p>
                            </div>
                          )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Wymagane do weryfikacji i aktywacji konta
                      </p>
                    </div>
                  )}

                  {/* Pole dla numeru albumu - tylko przy rejestracji */}
                  {!isLoginView && (
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1 flex items-center">
                        Numer albumu
                        <div className="relative ml-2">
                          <FaInfoCircle
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            onMouseEnter={() => setShowAlbumTooltip(true)}
                            onMouseLeave={() => setShowAlbumTooltip(false)}
                          />
                          <div
                            className={`absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md transition-opacity z-10 ${
                              showAlbumTooltip
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            }`}
                          >
                            5-cyfrowy numer albumu studenta ZUT, uzupełniany
                            automatycznie na podstawie adresu email.
                          </div>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="albumNumber"
                          value={formData.albumNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white ${
                            albumWarning
                              ? "border-orange-400 dark:border-orange-500"
                              : albumConfirmed
                                ? "border-green-500 dark:border-green-400"
                                : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="5-cyfrowy numer albumu"
                          maxLength={5}
                          required
                        />
                        {isValidatingAlbum && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaSpinner className="animate-spin text-blue-500 dark:text-blue-400" />
                          </div>
                        )}
                        {albumConfirmed && !albumWarning && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaRegCheckCircle className="text-green-500 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      {albumWarning &&
                        albumWarning.includes("już istnieje") && (
                          <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                            <p>{albumWarning}</p>
                            <button
                              type="button"
                              onClick={toggleView}
                              className="mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                              Zaloguj się
                            </button>
                          </div>
                        )}

                      {albumWarning &&
                        !albumWarning.includes("już istnieje") && (
                          <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                            <p>{albumWarning}</p>
                            <button
                              type="button"
                              onClick={() => setAlbumConfirmed(true)}
                              className="mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Użyj mimo ostrzeżenia
                            </button>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Pole dla hasła */}
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">
                      Hasło
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="Hasło"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Przypomnienie hasła - tylko przy logowaniu */}
                  {isLoginView && (
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Nie pamiętasz hasła?
                      </a>
                    </div>
                  )}

                  {/* Przycisk logowania/rejestracji */}
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      (!isLoginView && albumWarning && !albumConfirmed)
                    }
                    className={`w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                      isLoading ||
                      (!isLoginView && albumWarning && !albumConfirmed)
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin mx-auto" />
                    ) : isLoginView ? (
                      "Zaloguj się"
                    ) : (
                      "Zarejestruj się"
                    )}
                  </button>
                </form>
              )}

              {/* Link do przełączania między logowaniem a rejestracją */}
              {!successMessage && (
                <div className="mt-6 text-center text-sm">
                  {isLoginView ? (
                    <p className="text-gray-600 dark:text-gray-300">
                      Nie masz jeszcze konta?{" "}
                      <button
                        onClick={toggleView}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Zarejestruj się
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      Masz już konto?{" "}
                      <button
                        onClick={toggleView}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Zaloguj się
                      </button>
                    </p>
                  )}
                </div>
              )}

              {/* Informacje o aplikacji */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  StudyTailor © {new Date().getFullYear()} - Twój osobisty
                  asystent nauki.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Prawa kolumna - karty funkcjonalności */}
        <div className="w-full lg:w-6/12 max-w-xl flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Odkryj możliwości StudyTailor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCards.map((card, index) => (
              <FeatureCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
