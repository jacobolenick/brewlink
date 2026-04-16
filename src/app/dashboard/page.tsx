import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDateTime, getClickRate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [links, totalClicksCurrent, totalClicksPrevious, recentClicks] =
    await Promise.all([
      prisma.link.findMany({
        where: { userId },
        include: {
          _count: { select: { clicks: true } },
          clicks: {
            where: { clickedAt: { gte: sevenDaysAgo } },
            select: { clickedAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.click.count({
        where: {
          link: { userId },
          clickedAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.click.count({
        where: {
          link: { userId },
          clickedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      prisma.click.findMany({
        where: { link: { userId } },
        orderBy: { clickedAt: "desc" },
        take: 6,
        include: { link: { select: { slug: true, title: true } } },
      }),
    ]);

  const totalLinks = await prisma.link.count({ where: { userId } });

  return { links, totalClicksCurrent, totalClicksPrevious, recentClicks, totalLinks };
}

export default async function DashboardPage() {
  const session = await auth();
  const { links, totalClicksCurrent, totalClicksPrevious, recentClicks, totalLinks } =
    await getDashboardData(session?.user?.id ?? "");

  const clickRate = getClickRate(totalClicksCurrent, totalClicksPrevious);
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Hey, {firstName} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Here&apos;s what&apos;s happening with your links this week.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard
          label="Total Links"
          value={totalLinks}
          icon="🔗"
        />
        <StatCard
          label="Clicks (7 days)"
          value={totalClicksCurrent}
          icon="👆"
          trend={clickRate}
        />
        <StatCard
          label="Prev. 7 days"
          value={totalClicksPrevious}
          icon="📅"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent links */}
        <div style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardTitle}>Recent Links</span>
            <Link href="/dashboard/links" style={seeAllStyle}>See all →</Link>
          </div>
          {links.length === 0 ? (
            <EmptyState
              text="No links yet"
              hint="Create your first link to start tracking"
              action="/dashboard/links"
              actionLabel="Create link"
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {links.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </div>
          )}
        </div>

        {/* Recent clicks */}
        <div style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardTitle}>Recent Activity</span>
          </div>
          {recentClicks.length === 0 ? (
            <EmptyState text="No clicks yet" hint="Share your links to start seeing activity" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentClicks.map((click) => (
                <div key={click.id} style={activityRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={clickDot} />
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                        /{click.link.slug}
                        {click.link.title && (
                          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                            {" "}· {click.link.title}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>
                        {formatDateTime(click.clickedAt)}
                      </div>
                    </div>
                  </div>
                  {click.referer && (
                    <span style={refererBadge}>
                      {new URL(click.referer).hostname.replace("www.", "")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: number;
  icon: string;
  trend?: { rate: number; positive: boolean; neutral: boolean };
}) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {trend && !trend.neutral && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: trend.positive ? "var(--green-bg)" : "var(--red-bg)",
              border: `1px solid ${trend.positive ? "var(--green-border)" : "var(--red-border)"}`,
              color: trend.positive ? "var(--green)" : "var(--red)",
            }}
          >
            {trend.positive ? "▲" : "▼"} {trend.rate}%
          </div>
        )}
        {trend?.neutral && (
          <div
            style={{
              padding: "3px 8px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: "var(--bg-elevated)",
              color: "var(--text-faint)",
            }}
          >
            — 0%
          </div>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function LinkRow({ link }: { link: { id: string; slug: string; title: string | null; originalUrl: string; _count: { clicks: number }; clicks: { clickedAt: Date }[] } }) {
  return (
    <Link
      href={`/dashboard/links/${link.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
      className="hover-row"
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginBottom: 2 }}>
          /{link.slug}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
          {link.title || link.originalUrl}
        </div>
      </div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text)",
        background: "var(--bg-elevated)",
        padding: "3px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {link._count.clicks} {link._count.clicks === 1 ? "click" : "clicks"}
      </div>
    </Link>
  );
}

function EmptyState({ text, hint, action, actionLabel }: { text: string; hint: string; action?: string; actionLabel?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{text}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: action ? 16 : 0 }}>{hint}</div>
      {action && actionLabel && (
        <Link
          href={action}
          style={{
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: 8,
            background: "var(--accent)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 16px var(--accent-glow)",
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "1.25rem",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const cardTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--text)",
};

const seeAllStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--accent)",
  textDecoration: "none",
  fontWeight: 500,
};

const activityRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 4px",
  borderBottom: "1px solid var(--border)",
};

const clickDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "var(--accent)",
  flexShrink: 0,
  boxShadow: "0 0 6px var(--accent-glow)",
};

const refererBadge: React.CSSProperties = {
  fontSize: 11,
  color: "var(--text-faint)",
  background: "var(--bg-elevated)",
  padding: "2px 6px",
  borderRadius: 4,
  maxWidth: 100,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
