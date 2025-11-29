// src/components/MathCaptcha.jsx
import React, { useEffect, useState } from "react";

export default function MathCaptcha({ onChange }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function reset() {
    const x = random(1, 9);
    const y = random(1, 9);
    setA(x);
    setB(y);
    setAnswer("");
    setError("");
    onChange?.(false);
  }

  function check() {
    const correct = (a + b).toString();
    if (answer.trim() === correct) {
      setError("");
      onChange?.(true);
    } else {
      setError("Incorrect answer");
      onChange?.(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>
          <strong style={{ color: "var(--text)" }}>{a} + {b}</strong> = ?
        </div>

        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onBlur={check}
          placeholder="answer"
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(6,8,10,0.45)",
            color: "var(--text)",
            width: 80,
            textAlign: "center"
          }}
        />

        <button type="button" onClick={reset} className="outline-btn" style={{ height: 36 }}>
          Refresh
        </button>
      </div>

      {error && <div style={{ color: "#ffb4b4", marginTop: 8 }}>{error}</div>}
      <div style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 12 }}>
        Solve the math to prove you are human.
      </div>
    </div>
  );
}
