import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Instant Short Links",
    desc: "Generate a unique slug in one click, or define your own custom branded path.",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    desc: "Watch clicks roll in live. See totals, timestamps, referrers, and device info.",
  },
  {
    icon: "📈",
    title: "Click Rate Trends",
    desc: "Week-over-week comparison with green / red indicators so you know if you're growing.",
  },
  {
    icon: "🔐",
    title: "Private & Secure",
    desc: "Your links and data belong to you. Auth-protected dashboard — no exposure.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Nav */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(7,7,13,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={logoMark}>B</div>
              <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>BrewLink</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/login" style={ghostBtn}>Sign in</Link>
              <Link href="/signup" style={primaryBtn}>Get started free →</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "6rem 1.5rem 5rem", textAlign: "center", position: "relative" }}>
        {/* Glow backdrop */}
        <div style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background: "radial-gradient(ellipse, rgba(124,106,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={container}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 14px",
            borderRadius: 20,
            background: "rgba(124,106,247,0.1)",
            border: "1px solid rgba(124,106,247,0.25)",
            color: "#a598ff",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: "1.75rem",
            letterSpacing: "0.02em",
          }}>
            ✦ NOW IN BETA — FREE TO USE
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            marginBottom: "1.25rem",
            maxWidth: 700,
            margin: "0 auto 1.25rem",
          }}>
            Short links with{" "}
            <span style={{ color: "var(--accent)" }}>powerful analytics</span>
          </h1>

          <p style={{
            fontSize: 18,
            color: "var(--text-muted)",
            maxWidth: 520,
            margin: "0 auto 2.5rem",
            lineHeight: 1.65,
          }}>
            Create branded links for your portfolio, content, or business — then watch
            the clicks come in with beautiful real-time analytics.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{
              ...primaryBtn,
              fontSize: 16,
              padding: "13px 28px",
              borderRadius: 12,
            }}>
              Start for free — no card needed
            </Link>
            <Link href="/login" style={{
              ...ghostBtn,
              fontSize: 16,
              padding: "13px 24px",
              borderRadius: 12,
              border: "1px solid var(--border-bright)",
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "3rem 1.5rem 5rem" }}>
        <div style={container}>
          <h2 style={{
            textAlign: "center",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "3rem",
            color: "var(--text)",
          }}>
            Everything you need to grow
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}>
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "1.5rem",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics preview mockup */}
      <section style={{ padding: "1rem 1.5rem 6rem" }}>
        <div style={{ ...container, maxWidth: 800 }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-bright)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          }}>
            {/* Mock browser bar */}
            <div style={{
              background: "var(--bg-elevated)",
              borderBottom: "1px solid var(--border)",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <div style={{
                marginLeft: 12,
                flex: 1,
                height: 24,
                borderRadius: 6,
                background: "var(--bg)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                fontSize: 11,
                color: "var(--text-faint)",
              }}>
                brewlink.app/dashboard
              </div>
            </div>

            {/* Mock dashboard content */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                {[
                  { label: "Total Links", val: "12", trend: null },
                  { label: "Clicks (7 days)", val: "847", trend: "+34%", pos: true },
                  { label: "Prev. 7 days", val: "631", trend: null },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "0.9rem",
                  }}>
                    {s.trend && (
                      <div style={{
                        display: "inline-block",
                        padding: "2px 7px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        background: s.pos ? "var(--green-bg)" : "var(--red-bg)",
                        color: s.pos ? "var(--green)" : "var(--red)",
                        marginBottom: 8,
                      }}>
                        ▲ {s.trend}
                      </div>
                    )}
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em" }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini fake chart */}
              <div style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "1rem",
                height: 80,
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
              }}>
                {[20, 35, 28, 50, 40, 65, 58, 72, 48, 80, 70, 90, 75, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: "3px 3px 0 0",
                      background: `rgba(124,106,247,${0.3 + (i / 14) * 0.7})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "4rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={container}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Ready to brew your first link?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 28 }}>
            Free forever for the basics. No credit card required.
          </p>
          <Link href="/signup" style={{ ...primaryBtn, fontSize: 16, padding: "13px 28px", borderRadius: 12 }}>
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem",
        textAlign: "center",
        fontSize: 13,
        color: "var(--text-faint)",
      }}>
        © {new Date().getFullYear()} BrewLink. Built to help you grow.
      </footer>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  width: "100%",
};

const logoMark: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "var(--accent)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 800,
  color: "white",
  boxShadow: "0 0 16px var(--accent-glow)",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 18px",
  borderRadius: 9,
  background: "var(--accent)",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  boxShadow: "0 4px 20px var(--accent-glow)",
  border: "none",
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: 9,
  background: "transparent",
  color: "var(--text-muted)",
  fontWeight: 500,
  fontSize: 14,
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
};
