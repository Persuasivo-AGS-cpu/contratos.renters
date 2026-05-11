"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDay {
  fecha: string;
  contratos: number;
}

export function ContratosChart({ data }: { data: ChartDay[] }) {
  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Sin datos aún. Los contratos pagados aparecerán aquí.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            color: "#f8fafc",
          }}
          cursor={{ fill: "#f1f5f9" }}
          formatter={(val) => [`${val ?? 0} contrato${Number(val) !== 1 ? "s" : ""}`, ""]}
        />
        <Bar dataKey="contratos" fill="#1a56ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
