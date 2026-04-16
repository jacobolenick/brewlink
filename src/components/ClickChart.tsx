"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartData {
  date: string;
  clicks: number;
}

interface ClickChartProps {
  data: ChartData[];
}

export default function ClickChart({ data }: ClickChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-faint)", fontSize: 14 }}>No data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 13,
            color: "#111827",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
          itemStyle={{ color: "#f97316" }}
          labelStyle={{ color: "#6b7280", marginBottom: 4 }}
          cursor={{ stroke: "rgba(249,115,22,0.2)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#clickGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
