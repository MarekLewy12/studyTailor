import React, { useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../config.js";

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [albumNumber, setAlbumNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/register/`, {
        username: login,
        password: password,
        album_number: albumNumber,
      });
      console.log(response.data); // Tutaj będą tokeny

      // Zapisanie do localstorage
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      navigate("/login", {
        state: {
          message:
            "Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid =
    login && password && albumNumber.length === 5 && !isNaN(albumNumber);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center items-center p-6 rounded-lg shadow-md border-2 border-amber-500">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Witamy w StudyTailor
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              Zarejestruj się, aby uzyskać dostęp do wszystkich funkcji naszej
              aplikacji.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Automatyzacja harmonogramów</li>
              <li>Dostęp do utworzonych harmonogramów</li>
              <li>Przyjazny interfejs</li>
              <li>I inne!</li>
            </ul>
            <img
              src="/study_logo_orange_no_text.png"
              alt="Logo aplikacji"
              className="mt-6 h-32 w-auto"
            />
          </div>
          <div>
            <AnimatedSection>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
                  Zarejestruj się
                </h1>
                <h2 className="mt-4 text-lg text-gray-600">
                  Zarejestruj swoje konto i zacznij planować naukę już teraz!
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="login"
                  >
                    Login
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="login"
                    type="login"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Hasło
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-700"
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="albumNumber"
                  >
                    Numer albumu
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="albumNumber"
                    type="text"
                    placeholder="Numer albumu"
                    value={albumNumber}
                    onChange={(e) => setAlbumNumber(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className={`
                    text-white font-semibold py-2 px-6 rounded-lg transition duration-300
                    ${
                      isFormValid
                        ? "bg-orange-600 hover:bg-orange-800"
                        : "bg-orange-600 opacity-50 cursor-not-allowed"
                    }
                  `}
                    disabled={!isFormValid}
                  >
                    Zarejestruj się
                  </button>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </div>
      {/* TODO: Atrybucja */}
      <img
        src="/college_icon.png"
        alt="Ikona college"
        className="absolute bottom-0 left-0 h-32 w-32 m-4 tranform rotate-12"
      />
    </div>
  );
};

export default RegisterPage;
