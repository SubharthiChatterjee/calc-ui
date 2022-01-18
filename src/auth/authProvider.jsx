import React from "react";
import useAxios from "axios-hooks";
import { Navigate, useLocation } from "react-router-dom";
import { API_POINTS } from "../hooks/useApi";

const LS_KEYS = {
  token: "_h",
  user: "_x",
};
const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [, registerUser] = useAxios({...API_POINTS.REGISTER});
  const enter = async (userName, callback) => {
    try {
      const response = await registerUser({ data: { user: userName } });
      localStorage.setItem(LS_KEYS.token, response?.data?.token);
      localStorage.setItem(LS_KEYS.user, userName);
      setUser({ userName });
      callback({ status: true });
    } catch (error) {
      callback({ status: false });
    }
  };
  const logout = () => {
    localStorage.clear();
  };

  const existUser = localStorage.getItem(LS_KEYS.user);
  const value = { user: user ?? { userName: existUser }, enter, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const token = localStorage.getItem(LS_KEYS.token);
  if (!auth.user || !token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
