// src/components/JoinModal.js
import React, { useEffect, useState, useRef } from "react";
import MathCaptcha from "./MathCaptcha";
import { useNavigate } from "react-router-dom";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh",
  "West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep","Delhi","Puducherry","Ladakh","Jammu and Kashmir","Other"
];

export default function JoinModal({ open, onClose, role = "farmer" }) {
  const navigate = useNavigate();
  const modalRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", region: "" });
  const [keepSigned, setKeepSigned] = useState(false);
  const [captchaOK, setCaptchaOK] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({ name: "", email: "", region: "" });
      setKeepSigned(false);
      setCaptchaOK(false);
      setSaved(false);
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address.";
    if (!form.region) e.region = "Please choose your state / UT.";
    if (!captchaOK) e.captcha = "Please solve the captcha.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const first = Object.keys(v)[0];
      const el = modalRef.current?.querySelector(`[name="${first}"]`);
      if (el) el.focus();
      return;
    }

    // Save registration record (persistent list)
    const key = "agri_bridge_registrations_v1";
    const regs = JSON.parse(localStorage.getItem(key) || "[]");
    const record = {
      id: Date.now(),
      role,
      name: form.name.trim(),
      email: form.email.trim(),
      region: form.region,
      createdAt: new Date().toISOString(),
    };
    regs.push(record);
    localStorage.setItem(key, JSON.stringify(regs));

    // Create session
    const session = { name: form.name.trim(), email: form.email.trim(), type: role };
    if (keepSigned) localStorage.setItem("agri_user", JSON.stringify(session));
    else sessionStorage.setItem("agri_user", JSON.stringify(session));

    // notify same-tab listeners (Navbar)
    window.dispatchEvent(new Event("agri_user_changed"));

    setSaved(true);

    // redirect user to their dashboard after a short delay
    setTimeout(() => {
      onClose?.();
      if (role === "farmer") navigate("/farmer-dashboard");
      else if (role === "expert") navigate("/expert-dashboard");
      else navigate("/dashboard");
    }, 700);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} ref={modalRef}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h3>{saved ? "Thanks!" : `Join as ${role === "farmer" ? "Farmer" : "Expert"}`}</h3>

        {saved ? (
          <div className="modal-saved">
            Registration saved. Signed in {keepSigned ? "persistently" : "for this session"}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form" noValidate>
            <label>
              Full name
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                aria-invalid={!!errors.name}
              />
            </label>
            {errors.name && <div className="form-error">{errors.name}</div>}

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
            </label>
            {errors.email && <div className="form-error">{errors.email}</div>}

            <label>
              Region / Location
              <select
                name="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="">Select your state / UT</option>
                {INDIA_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                <option value="Other">Other</option>
              </select>
            </label>
            {errors.region && <div className="form-error">{errors.region}</div>}

            <MathCaptcha onChange={(ok) => { setCaptchaOK(ok); if (ok) setErrors(prev => ({ ...prev, captcha: undefined })); }} />
            {errors.captcha && <div className="form-error">{errors.captcha}</div>}

            <label style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={keepSigned}
                onChange={(e) => setKeepSigned(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Keep me signed in (remember me)
              </span>
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="submit" className="filled-btn">Submit & Sign in</button>
              <button type="button" className="outline-btn" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
