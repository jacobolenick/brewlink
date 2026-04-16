"use client";

import { useState, useEffect, useRef } from "react";

interface CreateLinkModalProps {
  onClose: () => void;
  onCreate: (link: {
    id: string;
    slug: string;
    title: string | null;
    originalUrl: string;
    createdAt: string;
    _count: { clicks: number };
  }) => void;
}

export default function CreateLinkModal({ onClose, onCreate }: CreateLinkModalProps) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url, slug: slug || undefined, title: title || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    const link = await res.json();
    onCreate(link);
  }

  return (
    <div
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Create new link
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Destination URL *</label>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-website.com/portfolio"
              required
              style={inputStyle}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Link title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Portfolio"
              style={inputStyle}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Custom slug (optional)</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{
                position: "absolute",
                left: 12,
                fontSize: 13,
                color: "var(--text-faint)",
                pointerEvents: "none",
                userSelect: "none",
              }}>
                brewlink.app/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                placeholder="my-portfolio"
                style={{ ...inputStyle, paddingLeft: 106 }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
              />
            </div>
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
              Leave empty to auto-generate a unique code
            </span>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--red-bg)",
              border: "1px solid var(--red-border)",
              color: "var(--red)",
              fontSize: 13,
            }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                border: "1px solid var(--border-bright)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "none",
                background: "var(--accent)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 16px var(--accent-glow)",
              }}
            >
              {loading ? "Creating…" : "Create link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  padding: "1rem",
};

const modalStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-bright)",
  borderRadius: 16,
  padding: "1.75rem",
  width: "100%",
  maxWidth: 480,
  boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text-muted)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  color: "var(--text)",
  fontSize: 14,
  transition: "border-color 0.15s",
  outline: "none",
};
