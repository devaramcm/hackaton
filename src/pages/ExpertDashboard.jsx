// src/pages/ExpertDashboard.jsx
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

export default function ExpertDashboard() {
  const user = JSON.parse(localStorage.getItem("agri_user") || "{}");
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setPosts(readPosts().filter(p => p.authorType === "farmer"));
  }, []);

  const reload = () => setPosts(readPosts().filter(p => p.authorType === "farmer"));

  const open = (p) => {
    setSelected(p);
    setReply("");
  };

  const submitReply = () => {
    if (!selected || !reply.trim()) return alert("Please write a response.");
    const all = readPosts();
    const idx = all.findIndex(x => x.id === selected.id);
    if (idx === -1) return alert("Post not found.");
    const r = {
      id: uuidv4(),
      by: user.name || "Expert",
      byEmail: user.email || "",
      text: reply.trim(),
      at: new Date().toISOString()
    };
    all[idx].responses = all[idx].responses || [];
    all[idx].responses.push(r);
    all[idx].resolved = true; // optional: mark resolved when expert replies
    all[idx].updatedAt = new Date().toISOString();
    writePosts(all);
    reload();
    setSelected(null);
    setReply("");
  };

  const markResolved = (id) => {
    const all = readPosts();
    const idx = all.findIndex(x => x.id === id);
    if (idx === -1) return;
    all[idx].resolved = true;
    all[idx].updatedAt = new Date().toISOString();
    writePosts(all);
    reload();
  };

  return (
    <div className="dashboard-page">
      <div className="dash-hero">
        <div>
          <h2>Expert Dashboard</h2>
          <div className="muted">Hello, {user?.name || "Expert"} — review farmer posts below.</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{posts.length}</div>
            <div className="stat-label">Open Cases</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{posts.filter(p => p.resolved).length}</div>
            <div className="stat-label">Resolved</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{posts.reduce((s,p) => s + (p.responses?.length||0), 0)}</div>
            <div className="stat-label">Total Responses</div>
          </div>
        </div>
      </div>

      <section className="card list-card">
        <div className="list-header">
          <h3>Farmer Posts</h3>
          <div className="list-controls">
            <button className="outline-btn" onClick={reload}>Refresh</button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="muted">No farmer posts yet.</div>
        ) : (
          <ul className="post-list">
            {posts.map(p => (
              <li key={p.id} className={`post-item ${p.resolved ? "resolved" : ""}`}>
                <div className="post-main">
                  <div className="post-title">{p.title}</div>
                  <div className="post-meta muted">{p.authorName} • {new Date(p.createdAt).toLocaleString()}</div>
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
                  <button className="outline-btn" onClick={() => open(p)}>Reply</button>
                  <button className="outline-btn" onClick={() => markResolved(p.id)}>Mark Resolved</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected && (
        <section className="card reply-card">
          <h3>Reply to: {selected.title}</h3>
          <textarea placeholder="Write your expert advice..." rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
          <div style={{marginTop:10, display:"flex", gap:8}}>
            <button className="filled-btn" onClick={submitReply}>Send Reply & Resolve</button>
            <button className="outline-btn" onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </section>
      )}
    </div>
  );
}
