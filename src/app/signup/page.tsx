"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Link2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>
            <Link2 size={16} strokeWidth={2.5} color="white" />
          </div>
          <span style={styles.logoText}>BrewLink</span>
        </div>

        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Start tracking links for free</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={styles.input}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              style={styles.input}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating account…" : "Create free account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
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
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text)",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text-muted)",
    textAlign: "center",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-muted)",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg-elevated)",
    color: "var(--text)",
    fontSize: 14,
    transition: "border-color 0.15s",
    outline: "none",
  },
  errorBox: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "var(--red-bg)",
    border: "1px solid var(--red-border)",
    color: "var(--red)",
    fontSize: 13,
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    marginTop: 4,
    transition: "all 0.15s",
  },
  switchText: {
    textAlign: "center",
    fontSize: 13,
    color: "var(--text-muted)",
    marginTop: "1.5rem",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
  },
};
