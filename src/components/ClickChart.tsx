"use client";

import {
  LineChart,
  Line,
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
            <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#7878a0" }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#7878a0" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "#0f0f1a",
            border: "1px solid #2e2e50",
            borderRadius: 10,
            fontSize: 13,
            color: "#e4e4f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
          itemStyle={{ color: "#7c6af7" }}
          labelStyle={{ color: "#7878a0", marginBottom: 4 }}
          cursor={{ stroke: "rgba(124,106,247,0.3)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#7c6af7"
          strokeWidth={2.5}
          fill="url(#clickGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#7c6af7", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
