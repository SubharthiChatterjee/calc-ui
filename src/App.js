import React from "react";
import Calc from "./pages/calc";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import { AuthProvider } from "./auth/authProvider";
import { configure } from "axios-hooks";
import Axios from "axios";
import { NotFound } from "./pages/notFound/";
import { RequireAuth } from "./auth/authProvider";
import { Header } from "./components/header/index.jsx";
import "./styles.css";
import "react-notifications/lib/notifications.css";

const axios = Axios.create({
  baseURL: "https://gjv6tv2ze2.execute-api.us-east-1.amazonaws.com/dev",
});

configure({
  axios,
  cache: false,
  defaultOptions: {
    ssr: false,
    useCache: false,
    manual: true,
    autoCancel: false,
  },
});

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Header />
              <Calc />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
