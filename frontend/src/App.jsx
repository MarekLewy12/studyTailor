import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage.jsx";
import MySchedulesPage from "./pages/MySchedulesPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";


const AppContent = () => {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="page">
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/my-schedules" element={<MySchedulesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/my-schedules"
              element={<div>Moje harmonogramy</div>}
            />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
