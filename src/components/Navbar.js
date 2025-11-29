// src/components/Navbar.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onNavigate, onJoin }) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const readSession = useCallback(() => {
    // prefer sessionStorage (session-only) then localStorage (persistent)
    const s = sessionStorage.getItem("agri_user") || localStorage.getItem("agri_user");
    return s ? JSON.parse(s) : null;
  }, []);

  // keep user state in sync:
  useEffect(() => {
    setUser(readSession());
  }, [location.pathname, readSession]);

  // respond to storage events (other tabs) and our custom event (same tab)
  useEffect(() => {
    const onStorage = () => setUser(readSession());
    window.addEventListener("storage", onStorage);
    window.addEventListener("agri_user_changed", onStorage); // custom same-tab event
    // also refresh when tab becomes visible (useful if user signed in elsewhere)
    const onVisibility = () => { if (!document.hidden) setUser(readSession()); };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("agri_user_changed", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [readSession]);

  // Highlight sections on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["home", "about", "impact"];
      let current = "home";
      for (const s of sections) {
        const el = document.getElementById(s);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = s;
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (e, section) => {
    e?.preventDefault();
    onNavigate?.(section);
    navigate(`/#${section}`, { replace: true });
    setActive(section);
  };

  const handleLogout = () => {
    // clear both storages to be safe
    sessionStorage.removeItem("agri_user");
    localStorage.removeItem("agri_user");
    // also clear token if you use one
    sessionStorage.removeItem("agri_user_token");
    localStorage.removeItem("agri_user_token");

    // notify other parts of the app (same tab)
    window.dispatchEvent(new Event("agri_user_changed"));

    setUser(null);
    navigate("/login");
  };

  const goToDashboard = () => {
    if (!user) return navigate("/login");

    if (user.type === "farmer") navigate("/farmer-dashboard");
    else if (user.type === "expert") navigate("/expert-dashboard");
    else navigate("/dashboard");
  };

  return (
    <nav className={`navbar ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        🌾 AgriBridge
      </div>

      <div className="nav-links">
        <a href="#home" onClick={(e) => handleScroll(e, "home")} className={active === "home" ? "active" : ""}>Home</a>
        <a href="#about" onClick={(e) => handleScroll(e, "about")} className={active === "about" ? "active" : ""}>About</a>
        <a href="#impact" onClick={(e) => handleScroll(e, "impact")} className={active === "impact" ? "active" : ""}>Impact</a>
      </div>

      <div className="nav-buttons">
        {!user && (
          <>
            <button className="outline-btn" onClick={() => onJoin?.("farmer")}>Join as Farmer</button>
            <button className="outline-btn" onClick={() => onJoin?.("expert")}>Join as Expert</button>
            <button className="filled-btn" onClick={() => navigate("/login")}>Login</button>
          </>
        )}

        {user && (
          <>
            <button className="outline-btn" onClick={goToDashboard} aria-label="Open dashboard">
              {user.name}
              <span style={{
                marginLeft: 8,
                fontSize: 12,
                padding: "3px 6px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginTop: 1
              }}>
                {user.type || "user"}
              </span>
            </button>

            <button
              className="filled-btn"
              onClick={handleLogout}
              style={{ background: "#e63946", border: "none" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
