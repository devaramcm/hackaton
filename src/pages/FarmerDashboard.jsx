// src/pages/FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const POSTS_KEY = "agri_posts_v1";

function readPosts() {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writePosts(items) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(items));
}

export default function FarmerDashboard() {
  const user = JSON.parse(localStorage.getItem("agri_user") || "{}");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all / open / resolved

  useEffect(() => {
    setPosts(readPosts().filter(p => p.authorType === "farmer" && p.authorEmail === user.email));
  }, [user.email]);

  const reload = () => {
    setPosts(readPosts().filter(p => p.authorType === "farmer" && p.authorEmail === user.email));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please add a title");
    const all = readPosts();
    if (editingId) {
      const idx = all.findIndex(p => p.id === editingId);
      if (idx !== -1) {
        all[idx] = { ...all[idx], title: title.trim(), description: description.trim(), updatedAt: new Date().toISOString() };
        writePosts(all);
        setEditingId(null);
      }
    } else {
      const item = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
        authorType: "farmer",
        authorName: user.name || "Farmer",
        authorEmail: user.email || "",
        resolved: false,
        responses: []
      };
      all.unshift(item);
      writePosts(all);
    }
    setTitle("");
    setDescription("");
    reload();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this post?")) return;
    const all = readPosts().filter(p => p.id !== id);
    writePosts(all);
    reload();
  };

  // filtered view
  const visible = posts.filter(p => {
    if (filter === "all") return true;
    if (filter === "open") return !p.resolved;
    if (filter === "resolved") return p.resolved;
    return true;
  });

  // stats
  const total = posts.length;
  const open = posts.filter(p => !p.resolved).length;
  const resolved = posts.filter(p => p.resolved).length;

  return (
    <div className="dashboard-page">
      <div className="dash-hero">
        <div>
          <h2>Farmer Dashboard</h2>
          <div className="muted">Welcome back, {user?.name || "Farmer"}.</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{total}</div>
            <div className="stat-label">Your Posts</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{open}</div>
            <div className="stat-label">Open</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <section className="card create-card">
        <h3>{editingId ? "Edit post" : "Create a new post"}</h3>
        <form onSubmit={handleCreate} className="stack-form">
          <input
            placeholder="Short title (e.g. Pest infestation in tomato)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe the issue, location, crop, and what you've tried."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <div className="form-actions">
            <button type="submit" className="filled-btn">{editingId ? "Save" : "Create"}</button>
            {editingId && <button type="button" className="outline-btn" onClick={() => { setEditingId(null); setTitle(""); setDescription(""); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="card list-card">
        <div className="list-header">
          <h3>Your Posts</h3>
          <div className="list-controls">
            <label>
              Filter:
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
            <button className="outline-btn" onClick={reload}>Refresh</button>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="muted">No posts yet — create one above.</div>
        ) : (
          <ul className="post-list">
            {visible.map(p => (
              <li key={p.id} className={`post-item ${p.resolved ? "resolved" : ""}`}>
                <div className="post-main">
                  <div className="post-title">{p.title}</div>
                  <div className="post-meta muted">Posted: {new Date(p.createdAt).toLocaleString()}</div>
                  <div className="post-body">{p.description}</div>

                  {p.responses && p.responses.length > 0 && (
                    <div className="responses">
                      <strong>Responses:</strong>
                      {p.responses.map((r, i) => (
                        <div key={i} className="response">
                          <div className="response-meta muted">{r.by} • {new Date(r.at).toLocaleString()}</div>
                          <div>{r.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button className="outline-btn" onClick={() => startEdit(p)}>Edit</button>
                  <button className="outline-btn" onClick={() => remove(p.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
