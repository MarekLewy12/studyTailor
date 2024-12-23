import React, { useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [albumNumber, setAlbumNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/...", {
        username: login,
        password: password,
        album_number: albumNumber,
      });
      console.log(response.data); // Tutaj będą tokeny

      // TODO 1: Zapisuj tokeny w localStorage
      // TODO 2: Przekieruj użytkownika na stronę logowania i wyświetl mu komunikat o sukcesie
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid =
    login && password && albumNumber.length === 5 && !isNaN(albumNumber);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto py-10 px-4 max-w-md">
        <AnimatedSection>
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Logo aplikacji"
              className="mx-auto h-32 w-auto mb-4"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
              Witaj w studyTailor
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
                className="block text-blue-700 text-sm font-bold mb-2"
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
