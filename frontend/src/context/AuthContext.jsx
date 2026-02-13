import { useState, useEffect, useContext, createContext } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const response = await axios.post(
          "/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);
  

  const login = (token) => {
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
