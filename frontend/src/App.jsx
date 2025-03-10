import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import MySubjectsPage from "./pages/MySubjectsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    <div className="app">
      <Navbar />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="page" timeout={300}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Chronione ścieżki */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-subjects"
              element={
                <ProtectedRoute>
                  <MySubjectsPage />
                </ProtectedRoute>
              }
            />

            {/* Przekierowanie 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
