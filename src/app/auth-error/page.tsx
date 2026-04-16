"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Link2, AlertTriangle } from "lucide-react";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  Configuration: "The server is missing a required configuration value (AUTH_SECRET). Contact the site administrator.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link has expired or has already been used.",
  Default: "An unexpected authentication error occurred.",
};

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const message = errorMessages[error] ?? errorMessages.Default;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>
            <Link2 size={16} strokeWidth={2.5} color="white" />
          </div>
          <span style={styles.logoText}>BrewLink</span>
        </div>

        <div style={styles.iconWrap}>
          <AlertTriangle size={28} color="var(--red)" />
        </div>

        <h1 style={styles.title}>Authentication error</h1>
        <p style={styles.message}>{message}</p>

        <Link href="/login" style={styles.btn}>Back to sign in</Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    background: "var(--bg)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "2.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: "1.75rem",
    justifyContent: "center",
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: 700,
    fontSize: 18,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  iconWrap: {
    marginBottom: "1rem",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: 10,
    letterSpacing: "-0.02em",
  },
  message: {
    fontSize: 14,
    color: "var(--text-muted)",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  btn: {
    display: "inline-block",
    padding: "10px 24px",
    borderRadius: 10,
    background: "var(--accent)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
};
