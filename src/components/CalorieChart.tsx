import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ActivityItem } from "@types";

interface CalorieChartProps {
  dailyCalories: number;
  consumed: number;
  burned: number;
}

const CalorieChart: React.FC<CalorieChartProps> = ({
  dailyCalories,
  consumed,
  burned,
}) => {
  const remaining = Math.max(0, dailyCalories - consumed + burned);

  const data = [
    { name: "Consumed", value: consumed, color: "#ff6b6b" },
    { name: "Burned", value: burned, color: "#4ecdc4" },
    { name: "Remaining", value: remaining, color: "#45b7d1" },
  ];

  return (
    <div className="w-full h-48 mb-4 bg-transparent">
      <h3 className="text-center mb-3 text-base text-gray-600">
        Daily Calories Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(0)} kcal`, ""]}
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "8px 12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-gray-600 text-xs mx-2">
                {value}: {entry.payload.value.toFixed(0)} kcal
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CalorieChart; 