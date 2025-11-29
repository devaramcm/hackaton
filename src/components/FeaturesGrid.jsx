// src/components/FeaturesGrid.jsx
import React from "react";

/**
 * Lightweight, responsive features grid.
 * Each item: { id, title, subtitle, icon }
 * Icons are inline SVG for zero-deps.
 */

const FEATURES = [
  {
    id: "crop-advisory",
    title: "Crop Advisory",
    subtitle: "Personalized crop recommendations and pest alerts.",
    icon: "leaf"
  },
  {
    id: "weather-alerts",
    title: "Weather Alerts",
    subtitle: "Localized forecasts & action guidance for critical weather.",
    icon: "cloud"
  },
  {
    id: "soil-health",
    title: "Soil Health",
    subtitle: "Simple soil checklists and nutrient tips.",
    icon: "droplet"
  },
  {
    id: "marketplace",
    title: "Marketplace",
    subtitle: "Buy / sell seeds, tools, and inputs from local vendors.",
    icon: "cart"
  },
  {
    id: "expert-chat",
    title: "Expert Chat",
    subtitle: "Connect with agronomists and extension experts.",
    icon: "chat"
  },
  {
    id: "community",
    title: "Community",
    subtitle: "Peer groups to share tips and local insights.",
    icon: "people"
  }
];

function Icon({ name }) {
  // simple switch for SVG icons; add variants as needed
  switch (name) {
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M2 21s5-4 9-4 11-6 11-11C22 3 16 2 12 6 8 10 2 21 2 21z" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M19 18H6a4 4 0 010-8 5 5 0 019-2 4.5 4.5 0 014 4 3.5 3.5 0 01-4 6z" />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M12 2s8 7 8 12a8 8 0 11-16 0C4 9 12 2 12 2z" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M7 4h-2l-1 2h2l3.6 7.59L9.25 17A2 2 0 0011 19h8v-2h-7.4l1.1-2.09L20 6H7z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M21 6h-18v12h4v4l4-4h10z" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.98.05 1.36.84 2.98 2.17 2.98 3.45V19h6v-2.5C24 14.17 19.33 13 16 13z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FeaturesGrid() {
  return (
    <section className="features-section" aria-labelledby="features-heading">
      <div className="container">
        <div className="features-header">
          <h2 id="features-heading">What AgriBridge offers</h2>
          <p className="muted">Practical tools and connections to help farmers make better decisions.</p>
        </div>

        <div className="features-grid" role="list">
          {FEATURES.map((f, idx) => (
            <article
              role="listitem"
              key={f.id}
              className="feature-card"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="feature-icon" aria-hidden="true">
                <Icon name={f.icon} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-sub">{f.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
