import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import JoinModal from "./components/JoinModal";
import FeaturesGrid from "./components/FeaturesGrid";

import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState("farmer");

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const impactRef = useRef(null);

  const scrollTo = (section) => {
    const map = { home: homeRef, about: aboutRef, impact: impactRef };
    const el = map[section]?.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openJoin = (role) => {
    setModalRole(role);
    setModalOpen(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function DashboardRedirect() {
    const s = localStorage.getItem("agri_user");
    if (!s) return <Navigate to="/login" replace />;
    try {
      const user = JSON.parse(s);
      if (user?.type === "farmer") return <Navigate to="/farmer-dashboard" replace />;
      if (user?.type === "expert") return <Navigate to="/expert-dashboard" replace />;
      return <Navigate to="/" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar
          onNavigate={(section) => scrollTo(section)}
          onJoin={(role) => openJoin(role)}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section id="home" ref={homeRef} className="hero">
                    <div className="hero-text">
                      <span className="badge">Empowering Agriculture Globally</span>
                      <h1>
                        Connecting Farmers, Experts, and Communities for Sustainable
                        Agriculture
                      </h1>
                      <p>
                        AgriBridge is a comprehensive platform that bridges the gap
                        between farmers, agricultural experts, and support networks.
                        Our mission is to democratize access to farming knowledge,
                        create meaningful connections, and drive sustainable
                        agricultural practices worldwide.
                      </p>

                      <div className="hero-buttons">
                        <button className="filled-btn" onClick={() => openJoin("farmer")}>
                          Join as Farmer
                        </button>
                        <button
                          className="outline-btn"
                          onClick={() => openJoin("expert")}
                        >
                          Join as Expert
                        </button>
                      </div>
                    </div>

                    <div className="hero-image">
                      <img
                        src="https://st5.depositphotos.com/81161912/66748/i/450/depositphotos_667481966-stock-photo-cowpea-seeds-farming-happy-indian.jpg"
                        alt="Farming field"
                      />
                    </div>
                  </section>

                  <FeaturesGrid />

                  <section id="about" ref={aboutRef} className="content-section">
                    <h2>About AgriBridge</h2>
                    <p>
                      AgriBridge connects local farmers with agricultural experts and
                      community resources — enabling better decisions, better yields,
                      and improved livelihoods. We focus on practical
                      knowledge-sharing, localized advice, and simple tools that help
                      farmers adapt to changing conditions.
                    </p>
                  </section>

                  <section id="impact" ref={impactRef} className="content-section">
                    <h2>Impact</h2>
                    <p>
                      Our platform helps farmers access knowledge, share local
                      insights, and connect to services. Through curated expert
                      content and peer support, users can solve problems faster and
                      adopt resilient techniques.
                    </p>
                  </section>
                </>
              }
            />

            <Route path="/login" element={<Login />} />

            <Route
              path="/farmer-dashboard"
              element={
                <ProtectedRoute allowedTypes={["farmer"]}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expert-dashboard"
              element={
                <ProtectedRoute allowedTypes={["expert"]}>
                  <ExpertDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={<DashboardRedirect />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <div>© {new Date().getFullYear()} AgriBridge</div>
        </footer>

        <JoinModal
          open={modalOpen}
          role={modalRole}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
