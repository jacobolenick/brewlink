"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDate, getClickRate } from "@/lib/utils";
import CreateLinkModal from "@/components/CreateLinkModal";

interface LinkData {
  id: string;
  slug: string;
  title: string | null;
  originalUrl: string;
  createdAt: string;
  _count: { clicks: number };
  clicks: { clickedAt: string }[];
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    const res = await fetch("/api/links");
    if (res.ok) {
      setLinks(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  async function deleteLink(id: string) {
    if (!confirm("Delete this link and all its analytics?")) return;
    setDeletingId(id);
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1800);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 4 }}>
            My Links
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {links.length} {links.length === 1 ? "link" : "links"} total
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            padding: "9px 18px",
            borderRadius: 10,
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 20px var(--accent-glow)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          + New Link
        </button>
      </div>

      {/* Links list */}
      {loading ? (
        <LoadingSkeleton />
      ) : links.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {links.map((link) => {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            const recentClicks = link.clicks?.filter(
              (c) => new Date(c.clickedAt) >= sevenDaysAgo
            ).length ?? 0;

            const prevClicks = link.clicks?.filter((c) => {
              const d = new Date(c.clickedAt);
              return d >= fourteenDaysAgo && d < sevenDaysAgo;
            }).length ?? 0;

            const trend = getClickRate(recentClicks, prevClicks);

            return (
              <div
                key={link.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              >
                {/* Favicon / icon */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}>
                  🔗
                </div>

                {/* Link info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      {link.title || `/${link.slug}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>
                      {origin}/{link.slug}
                    </span>
                    <span style={{ color: "var(--border-bright)", fontSize: 12 }}>·</span>
                    <span style={{ fontSize: 12, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                      {link.originalUrl}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexShrink: 0 }}>
                  {/* Trend badge */}
                  {!trend.neutral && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: trend.positive ? "var(--green-bg)" : "var(--red-bg)",
                      border: `1px solid ${trend.positive ? "var(--green-border)" : "var(--red-border)"}`,
                      color: trend.positive ? "var(--green)" : "var(--red)",
                    }}>
                      {trend.positive ? "▲" : "▼"} {trend.rate}%
                    </div>
                  )}

                  {/* Total clicks */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
                      {link._count.clicks}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>clicks</div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                      {formatDate(link.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => copyLink(link.slug)}
                    title="Copy link"
                    style={iconBtnStyle(copied === link.slug)}
                  >
                    {copied === link.slug ? "✓" : "⎘"}
                  </button>

                  <Link href={`/dashboard/links/${link.id}`} style={{ textDecoration: "none" }}>
                    <button title="View analytics" style={iconBtnStyle(false)}>
                      📊
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteLink(link.id)}
                    disabled={deletingId === link.id}
                    title="Delete link"
                    style={{
                      ...iconBtnStyle(false),
                      color: "var(--red)",
                    }}
                  >
                    {deletingId === link.id ? "…" : "🗑"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateLinkModal
          onClose={() => setShowCreate(false)}
          onCreate={(newLink) => {
            setLinks((prev) => [{ ...newLink, clicks: [] }, ...prev]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function iconBtnStyle(active: boolean): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: active ? "var(--bg-elevated)" : "transparent",
    color: active ? "var(--green)" : "var(--text-muted)",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  };
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.25rem",
            height: 72,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
        No links yet
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
        Create your first link to start tracking clicks and analytics.
      </p>
      <button
        onClick={onCreate}
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px var(--accent-glow)",
        }}
      >
        Create your first link
      </button>
    </div>
  );
}
