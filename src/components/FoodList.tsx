import React from "react";
import { FoodItem } from "@types";

interface FoodListProps {
  foods: FoodItem[];
  onRemove: (id: number) => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onRemove }) => {
  return (
    <ul>
      {foods.map((food) => (
        <li key={food.id}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {food.image && (
              <img
                src={food.image}
                alt={food.name}
                style={{ width: "40px", height: "40px", marginRight: "8px", borderRadius: "4px" }}
              />
            )}
            <span>{food.name} - {food.calories} kcal</span>
          </div>
          <button onClick={() => onRemove(food.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default FoodList;
