import React from "react";
import { FoodItem } from "@types";

interface FoodListProps {
  foods: FoodItem[];
  onRemove: (id: string) => void;  // ← updated to accept string
}

const FoodList: React.FC<FoodListProps> = ({ foods, onRemove }) => {
  return (
    <ul style={{ marginTop: 24 }}>
      {(foods.length > 0 ? foods : []).map((food) => (
        <li
          key={food.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f9f9f9",
            padding: "8px",
            borderRadius: "6px",
            marginBottom: "4px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {food.image && (
              <img
                src={food.image}
                alt={food.name}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 8,
                  borderRadius: 4
                }}
              />
            )}
            <span>
              {food.amount} {food.unit} {food.name} — {food.calories} kcal
            </span>
          </div>
          <button
            onClick={() => onRemove(food.id)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FoodList;
