import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDateTime, getClickRate } from "@/lib/utils";
import ClickChart from "@/components/ClickChart";

export const dynamic = "force-dynamic";

async function getLinkData(id: string, userId: string) {
  const link = await prisma.link.findFirst({
    where: { id, userId },
    include: {
      clicks: { orderBy: { clickedAt: "desc" } },
      _count: { select: { clicks: true } },
    },
  });
  return link;
}

function buildChartData(clicks: { clickedAt: Date }[], days = 30) {
  const now = new Date();
  const map = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map.set(key, 0);
  }

  for (const click of clicks) {
    const key = new Date(click.clickedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([date, clicks]) => ({ date, clicks }));
}

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const link = await getLinkData(id, session?.user?.id ?? "");

  if (!link) notFound();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const clicksThisWeek = link.clicks.filter(
    (c) => new Date(c.clickedAt) >= sevenDaysAgo
  ).length;
  const clicksLastWeek = link.clicks.filter((c) => {
    const d = new Date(c.clickedAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  }).length;

  const clicksToday = link.clicks.filter((c) => {
    const d = new Date(c.clickedAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const trend = getClickRate(clicksThisWeek, clicksLastWeek);
  const chartData = buildChartData(link.clicks, 30);

  const baseUrl =
    process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const shortUrl = `${baseUrl}/${link.slug}`;

  return (
    <div>
      {/* Back */}
      <Link
        href="/dashboard/links"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: "1.5rem" }}
      >
        ← Back to links
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            {link.title || `/${link.slug}`}
          </h1>
          <TrendBadge trend={trend} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
          >
            {shortUrl}
          </a>
          <span style={{ color: "var(--border-bright)" }}>→</span>
          <span style={{ fontSize: 13, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>
            {link.originalUrl}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <MiniStat label="Total clicks" value={link._count.clicks} color="var(--accent)" />
        <MiniStat label="This week" value={clicksThisWeek} color={trend.positive ? "var(--green)" : "var(--red)"} />
        <MiniStat label="Last week" value={clicksLastWeek} color="var(--text-muted)" />
        <MiniStat label="Today" value={clicksToday} color="var(--amber)" />
      </div>

      {/* Chart */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <span style={cardTitle}>Clicks — last 30 days</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Clicks per day</span>
          </div>
        </div>
        <ClickChart data={chartData} />
      </div>

      {/* Click log */}
      <div style={{ ...cardStyle, marginTop: "1.5rem" }}>
        <div style={cardHeader}>
          <span style={cardTitle}>Click history</span>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
            {link.clicks.length} total
          </span>
        </div>

        {link.clicks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: 14 }}>
            No clicks yet — share your link to start seeing data!
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Timestamp", "IP Address", "Referrer", "User Agent"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "var(--text-faint)",
                        fontWeight: 500,
                        borderBottom: "1px solid var(--border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {link.clicks.map((click, i) => (
                  <tr
                    key={click.id}
                    style={{
                      borderBottom: i < link.clicks.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td style={{ padding: "10px 12px", color: "var(--text)", whiteSpace: "nowrap" }}>
                      {formatDateTime(click.clickedAt)}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>
                      {click.ip || "—"}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {click.referer ? (
                        <a href={click.referer} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                          {click.referer}
                        </a>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text-faint)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>
                      {click.userAgent || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: { rate: number; positive: boolean; neutral: boolean } }) {
  if (trend.neutral) {
    return (
      <span style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: "var(--bg-elevated)",
        color: "var(--text-faint)",
        border: "1px solid var(--border)",
      }}>
        No change
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 12px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      background: trend.positive ? "var(--green-bg)" : "var(--red-bg)",
      border: `1px solid ${trend.positive ? "var(--green-border)" : "var(--red-border)"}`,
      color: trend.positive ? "var(--green)" : "var(--red)",
    }}>
      {trend.positive ? "▲" : "▼"} {trend.rate}% vs last week
    </span>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "1rem",
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{label}</div>
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
