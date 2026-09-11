"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { CategoryTotal } from "@/lib/expense-types";

const COLORS = [
  "#6D0808",
  "#2D0000",
  "#757D6F",
  "#A86A2A",
  "#C44A4A",
  "#9AA193",
  "#4A1010",
  "#8B4513",
  "#5C6B5A",
  "#B85C38",
];

type CategoryDonutProps = {
  data: CategoryTotal[];
};

/**
 * Donut chart of spending totals by category (Recharts).
 */
export function CategoryDonut({ data }: CategoryDonutProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-fg">
        Add expenses to see category breakdown
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-border bg-surface-elevated/60 p-2 dark:bg-surface/60 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="78%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`₹${Number.isFinite(n) ? n.toFixed(2) : value}`, "Total"];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid color-mix(in srgb, #757d6f 35%, transparent)",
              background: "#EEEAD7",
              color: "#2D0000",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
