"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>B</div>
          <span style={styles.logoText}>BrewLink</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="••••••••"
              required
              style={styles.input}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--border)")}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Create one free
          </Link>
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
    fontSize: 15,
    fontWeight: 800,
    color: "white",
    boxShadow: "0 0 20px var(--accent-glow)",
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
    boxShadow: "0 4px 24px var(--accent-glow)",
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
