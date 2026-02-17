import { createContext, useEffect, useState } from "react";
import api from "../lib/api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const loadUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }

    setLoadingUser(true);
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, loadingUser, saveToken, logout, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
