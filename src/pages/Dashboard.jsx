import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("agri_user"));

  return (
    <div className="content-section">
      <h2>Welcome, {user?.name || "User"} 👋</h2>
      <p>This is your dashboard.</p>
    </div>
  );
}
