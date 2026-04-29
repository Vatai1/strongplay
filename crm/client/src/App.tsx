import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import { isAuthenticated, api, setToken, clearToken } from "./api";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      api.auth.me()
        .then(() => setAuthed(true))
        .catch(() => {
          clearToken();
          setAuthed(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const res = await api.auth.login(username, password);
    setToken(res.token);
    setAuthed(true);
  };

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#00ff41" }}>Загрузка...</div>;
  }

  if (!authed) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
