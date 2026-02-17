import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

const ProtectedRoute = ({ children }) => {
  const { token, loadingUser } = useContext(AuthContext);
  if (loadingUser)
    return (
      <div className="py-16 text-center text-sm font-semibold text-slate-600">
        Loading...
      </div>
    );
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e7f6f2_0%,#f6f3ec_55%,#f9efe6_100%)] text-slate-900 font-['Space_Grotesk'] flex flex-col">
          <Header />
          <main className="flex-1 py-10">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
