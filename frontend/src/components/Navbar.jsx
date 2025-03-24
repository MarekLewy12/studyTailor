import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaHome, FaList, FaMoon, FaRobot, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    logout();
    navigate("/");
  };

  const navItems = [
    {
      name: isAuthenticated ? "Dashboard" : "Strona główna",
      dest: isAuthenticated ? "/dashboard" : "/",
      icon: <FaHome className="mr-2" />,
    },
    {
      name: "Moje przedmioty",
      dest: "/my-subjects",
      auth: true,
      icon: <FaList className="mr-2" />,
    },
    {
      name: "Asystent nauki",
      dest: "/assistant",
      auth: true,
      icon: <FaRobot className="mr-2" />,
    },
  ];

  return (
    <div className="fixed w-full bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white shadow-md z-40 transition-colors duration-300">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Menu po lewej */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems
              .filter((item) => !item.auth || isAuthenticated)
              .map((item, index) => (
                <Link
                  key={index}
                  to={item.dest}
                  className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* Przyciski po prawej stronie */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-orange-700 transition-colors duration-300"
              aria-label="Przełącz tryb ciemny"
            >
              {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                Wyloguj się
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-orange-100 transition-all duration-300 shadow-lg"
              >
                Zaloguj się
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={handleNav}
              className="md:hidden hover:text-orange-200 transition-colors duration-300"
            >
              {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          nav ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 h-full bg-orange-900 transform transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-orange-800">
          <button
            onClick={handleNav}
            className="hover:text-orange-200 transition-colors duration-300"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <nav className="py-4">
          {navItems
            .filter((item) => !item.auth || isAuthenticated)
            .map((item, index) => (
              <Link
                key={index}
                to={item.dest}
                onClick={() => setNav(false)}
                className="block px-4 py-2 hover:bg-orange-800 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
