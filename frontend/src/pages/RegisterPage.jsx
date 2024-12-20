import React, { useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  // TODO 1: Utwórz stany dla email i hasła
  // TODO 2: Utwórz funkcję handleSubmit, która będzie obsługiwać formularz
  // TODO 3: Dodaj połączenie z backendem w celu utworzenia nowego konta

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700">
              Zarejestruj swoje konto
            </h1>
          </div>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
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
              />
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-700"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Zarejestruj się
              </button>
            </div>
          </form>
        </AnimatedSection>
      </div>
      <img
        src="/college_icon.png"
        alt="Ikona college"
        className="absolute bottom-0 left-0 h-32 w-32 m-4 tranform rotate-12"
      />
    </div>
  );
};

export default RegisterPage;
