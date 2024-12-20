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

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="page"
          timeout={300} // animacja przejścia na inną stronę trwa 0.3s (można zmienić tutaj czas)
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePage />} />
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
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
