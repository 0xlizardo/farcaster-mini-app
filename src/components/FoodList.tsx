// src/components/FoodList.tsx

import React from "react";
import { FoodItem } from "@types";

interface FoodListProps {
  foods: FoodItem[];
  onRemove: (id: number) => void;
}

const displayNames: Record<string, string> = {
  breakfast: "Breakfast",
  lunch:     "Lunch",
  dinner:    "Dinner",
  snack:     "Snack"
};

const FoodList: React.FC<FoodListProps> = ({ foods, onRemove }) => {
  const categories: (keyof typeof displayNames)[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack"
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {categories.map((cat) => {
        const list = foods.filter((f) => f.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h4>{displayNames[cat]}</h4>
            {list.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {list.map((food) => (
                  <li
                    key={food.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    <span>
                      {food.amount} {food.unit} {food.name} —{" "}
                      {food.calories} kcal
                    </span>
                    <button onClick={() => onRemove(food.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : cat === "snack" ? (
              <p style={{ fontStyle: "italic", color: "#555" }}>
                Recommended snack times: mid-morning (10:00 AM) and mid-afternoon (4:00 PM).
              </p>
            ) : (
              <p>No entries.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FoodList;
