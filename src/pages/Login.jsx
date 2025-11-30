// src/pages/Login.jsx
import React, { useState } from "react";
import MathCaptcha from "../components/MathCaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaOK, setCaptchaOK] = useState(false);
  const [keepSigned, setKeepSigned] = useState(false);

  const demoUsers = [
    { name: "Farmer Demo", email: "farmer@example.com", password: "farmer123", type: "farmer" },
    { name: "Expert Demo", email: "expert@example.com", password: "expert123", type: "expert" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!captchaOK) {
      setError("Please solve the captcha before logging in.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const trimmed = email.trim();
      const user = demoUsers.find(u => u.email === trimmed && u.password === pass);

      if (!user) {
        setLoading(false);
        setError("Invalid credentials. Try farmer@example.com / farmer123 or expert@example.com / expert123");
        return;
      }

      const session = { name: user.name, email: user.email, type: user.type };
      if (keepSigned) localStorage.setItem("agri_user", JSON.stringify(session));
      else sessionStorage.setItem("agri_user", JSON.stringify(session));

      // notify same-tab listeners
      window.dispatchEvent(new Event("agri_user_changed"));

      // small pause to ensure storage flush, then hard redirect
      setTimeout(() => {
        setLoading(false);
        if (user.type === "farmer") window.location.href = "/farmer-dashboard";
        else if (user.type === "expert") window.location.href = "/expert-dashboard";
        else window.location.href = "/";
      }, 80);
    }, 350);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            placeholder="Enter password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            autoComplete="current-password"
          />

          <MathCaptcha onChange={(ok) => setCaptchaOK(ok)} />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <input
              type="checkbox"
              checked={keepSigned}
              onChange={(e) => setKeepSigned(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Keep me signed in (persistent)</span>
          </label>

          {error && <div className="form-error" style={{ marginTop: 10 }}>{error}</div>}

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button type="submit" className="filled-btn login-btn" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>

          <div className="login-note">
            Demo accounts:
            <ul style={{ marginTop: 8 }}>
              <li>Farmer — <b>farmer@example.com</b> / <b>farmer123</b></li>
              <li>Expert — <b>expert@example.com</b> / <b>expert123</b></li>
            </ul>
          </div>
        </form>
      </div>

      <footer className="login-footer">© {new Date().getFullYear()} AgriBridge</footer>
    </div>
  );
}
