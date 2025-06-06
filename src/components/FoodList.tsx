import React from "react";
import { FoodItem } from "@types";

interface FoodListProps {
  foods: FoodItem[];
  onRemove: (id: number) => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onRemove }) => {
  if (foods.length === 0) {
    return <p>No foods added yet.</p>;
  }

  return (
    <ul>
      {foods.map((food) => (
        <li key={food.id}>
          <span>
            {food.name} — {food.calories} kcal
          </span>
          <button onClick={() => onRemove(food.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default FoodList;
