import Link from "next/link";
import { Zap, BarChart2, TrendingUp, Shield, Link2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Zap size={20} color="var(--accent)" />,
    title: "Instant Short Links",
    desc: "Generate a unique slug in one click, or define your own custom branded path.",
  },
  {
    icon: <BarChart2 size={20} color="var(--accent)" />,
    title: "Real-Time Analytics",
    desc: "Watch clicks roll in live. See totals, timestamps, referrers, and device info.",
  },
  {
    icon: <TrendingUp size={20} color="var(--accent)" />,
    title: "Click Rate Trends",
    desc: "Week-over-week comparison with green and red indicators so you know if you're growing.",
  },
  {
    icon: <Shield size={20} color="var(--accent)" />,
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
        background: "rgba(249,250,251,0.9)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={logoMarkStyle}>
                <Link2 size={15} strokeWidth={2.5} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: "var(--text)" }}>
                BrewLink
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/login" style={ghostBtnStyle}>Sign in</Link>
              <Link href="/signup" style={primaryBtnStyle}>
                Get started free
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "6rem 1.5rem 5rem", textAlign: "center", position: "relative" }}>
        <div style={container}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 14px",
            borderRadius: 20,
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)",
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: "1.75rem",
            letterSpacing: "0.03em",
          }}>
            NOW IN BETA — FREE TO USE
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            marginBottom: "1.25rem",
            maxWidth: 680,
            margin: "0 auto 1.25rem",
            color: "var(--text)",
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
              ...primaryBtnStyle,
              fontSize: 15,
              padding: "12px 24px",
              borderRadius: 11,
            }}>
              Start for free — no card needed
              <ArrowRight size={15} />
            </Link>
            <Link href="/login" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 15,
              padding: "12px 22px",
              borderRadius: 11,
              background: "var(--bg-card)",
              color: "var(--text-muted)",
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid var(--border-bright)",
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "2rem 1.5rem 5rem" }}>
        <div style={container}>
          <h2 style={{
            textAlign: "center",
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
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
            gap: "1rem",
          }}>
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "1.5rem",
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview mockup */}
      <section style={{ padding: "1rem 1.5rem 6rem" }}>
        <div style={{ ...container, maxWidth: 800 }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
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
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fca5a5" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fcd34d" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#86efac" }} />
              <div style={{
                marginLeft: 12,
                flex: 1,
                height: 24,
                borderRadius: 6,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
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
            <div style={{ padding: "1.5rem", background: "var(--bg)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                {[
                  { label: "Total Links", val: "12", trend: null },
                  { label: "Clicks (7 days)", val: "847", trend: "+34%", pos: true },
                  { label: "Prev. 7 days", val: "631", trend: null },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "0.9rem",
                  }}>
                    {s.trend && (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 7px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        background: s.pos ? "var(--green-bg)" : "var(--red-bg)",
                        color: s.pos ? "var(--green)" : "var(--red)",
                        border: `1px solid ${s.pos ? "var(--green-border)" : "var(--red-border)"}`,
                        marginBottom: 8,
                      }}>
                        <TrendingUp size={10} />
                        {s.trend}
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
                background: "var(--bg-card)",
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
                      background: `rgba(249,115,22,${0.15 + (i / 14) * 0.7})`,
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
        background: "var(--bg-card)",
      }}>
        <div style={container}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 10, color: "var(--text)" }}>
            Ready to brew your first link?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 28 }}>
            Free forever for the basics. No credit card required.
          </p>
          <Link href="/signup" style={{
            ...primaryBtnStyle,
            fontSize: 15,
            padding: "12px 24px",
            borderRadius: 11,
          }}>
            Create your account
            <ArrowRight size={15} />
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

const logoMarkStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "var(--accent)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const primaryBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 16px",
  borderRadius: 9,
  background: "var(--accent)",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 9,
  background: "transparent",
  color: "var(--text-muted)",
  fontWeight: 500,
  fontSize: 14,
  textDecoration: "none",
};
