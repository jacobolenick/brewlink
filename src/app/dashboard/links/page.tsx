"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDate, getClickRate } from "@/lib/utils";
import CreateLinkModal from "@/components/CreateLinkModal";
import { Link2, Copy, BarChart2, Trash2, TrendingUp, TrendingDown, Plus, Check } from "lucide-react";

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
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 16px",
            borderRadius: 10,
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Link
        </button>
      </div>

      {/* Links list */}
      {loading ? (
        <LoadingSkeleton />
      ) : links.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
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
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Link2 size={16} color="var(--text-muted)" />
                </div>

                {/* Link info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      {link.title || `/${link.slug}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexShrink: 0 }}>
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
                      {trend.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {trend.rate}%
                    </div>
                  )}

                  {/* Total clicks */}
                  <div style={{ textAlign: "center", minWidth: 48 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
                      {link._count.clicks}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>clicks</div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: "right", minWidth: 72 }}>
                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                      {formatDate(link.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <IconBtn
                    onClick={() => copyLink(link.slug)}
                    title="Copy link"
                    active={copied === link.slug}
                    activeColor="var(--green)"
                  >
                    {copied === link.slug ? <Check size={14} /> : <Copy size={14} />}
                  </IconBtn>

                  <Link href={`/dashboard/links/${link.id}`} style={{ textDecoration: "none" }}>
                    <IconBtn title="View analytics">
                      <BarChart2 size={14} />
                    </IconBtn>
                  </Link>

                  <IconBtn
                    onClick={() => deleteLink(link.id)}
                    disabled={deletingId === link.id}
                    title="Delete link"
                    danger
                  >
                    <Trash2 size={14} />
                  </IconBtn>
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

function IconBtn({
  children,
  onClick,
  title,
  active,
  activeColor,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  activeColor?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: active ? "rgba(22,163,74,0.06)" : danger ? "transparent" : "transparent",
        color: active ? (activeColor ?? "var(--green)") : danger ? "var(--red)" : "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            height: 70,
          }}
        />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <Link2 size={24} color="var(--text-faint)" />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
        No links yet
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
        Create your first link to start tracking clicks and analytics.
      </p>
      <button
        onClick={onCreate}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "10px 20px",
          borderRadius: 10,
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Create your first link
      </button>
    </div>
  );
}
