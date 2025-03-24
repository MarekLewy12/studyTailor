import React, { createContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext.jsx";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const { addNotification } = useNotification();

  // Sprawdź token przy pierwszym ładowaniu
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");

      if (token) {
        setIsAuthenticated(true);
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    addNotification("Pomyślnie zalogowano!", "success");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    addNotification("Pomyślnie wylogowano!", "info");
  };

  const setUserInfo = (name) => {
    setUsername(name);
    localStorage.setItem("username", name);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, logout, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
