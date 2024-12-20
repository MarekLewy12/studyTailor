import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { name: "Strona główna", dest: "/" },
    { name: "Stwórz harmonogram", dest: "/create" },
    { name: "Moje harmonogramy", dest: "/my-schedules" },
  ];

  return (
    <div className="fixed w-full navbar-bg text-white shadow-md z-40">
      <div className="flex items-center justify-between p-5 h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo aplikacji" className="h-16 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.dest}
                className="text-lg hover:text-orange-300 transition-colors duration-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
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
