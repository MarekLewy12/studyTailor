import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {API_BASE_URL} from "../config.js";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [albumNumber, setAlbumNumber] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username,
        password,
        album_number: albumNumber,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      login();
      navigate("/my-schedules");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-10 px-4 max-w-md">
        <AnimatedSection>
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {message}
            </div>
          )}
          <div className="text-center mb-8">
            <img
              src="/study_logo_orange_no_text.png"
              alt="Logo aplikacji"
              className="mx-auto h-32 w-auto mb-4"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
              Logowanie
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Login
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Zaloguj się
              </button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default LoginPage;
