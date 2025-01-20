import React, { useState, useContext } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [nav, setNav] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    { name: "Strona główna", dest: "/" },
    { name: "Logowanie", dest: "/login", auth: false },
    { name: "Stwórz harmonogram", dest: "/create", auth: true },
    { name: "Moje harmonogramy", dest: "/my-schedules", auth: true },
  ];

  return (
    <div className="fixed w-full navbar-bg text-white shadow-md z-40">
      <div className="flex items-center justify-between p-5 h-16">
        {/* Logo */}
        {/*<Link to="/" className="flex items-center">*/}
        {/*  <img src="/logo.png" alt="Logo aplikacji" className="h-16 w-auto" />*/}
        {/*</Link>*/}

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center justify-end space-x-8 w-full">
          {navItems
            .filter(
              (item) =>
                item.auth === undefined || item.auth === isAuthenticated,
            )
            .map((item, index) => (
              <li key={index}>
                <Link
                  to={item.dest}
                  className="hover:text-orange-300 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="
              inline-block
              text-lg
              px-3
              py-1
              rounded-full
              bg-gradient-to-r
              from-orange-400
              to-orange-600
              transition
              duration-300
              shadow-md
              hover:shadow-lg
              transform
              hover:scale-110
            "
              >
                Wylogowanie
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/register"
                className="
              inline-block
              text-lg
              px-3
              py-1
              rounded-full
              bg-gradient-to-r
              from-orange-400
              to-orange-600
              transition
              duration-300
              shadow-md
              hover:shadow-lg
              transform
              hover:scale-110
            "
              >
                Rejestracja
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <div
          onClick={handleNav}
          className="md:hidden cursor-pointer hover:text-orange-300 transition duration-300"
        >
          {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`${
          nav ? "left-0" : "-left-full"
        } fixed top-0 bg-orange-950 text-white w-1/2 h-full transition-all duration-300 md:hidden`}
      >
        <div className="flex justify-between items-center border-b border-orange-700 p-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Nasze logo"
              // className="h-12 w-auto mr-3"
              width={60} // szerokość logo w trybie mobilnym
              height={60} // wysokość logo w trybie mobilnym
            />
          </Link>
          <AiOutlineClose
            size={25}
            onClick={handleNav}
            className="cursor-pointer hover:text-orange-300 transition duration-300"
          />
        </div>
        {navItems.map((item, index) => (
          <li key={index} className="border-b border-orange-700">
            <Link
              to={item.dest}
              onClick={handleNav}
              className="block p-4 hover:bg-orange-700 transition-colors duration-300"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
