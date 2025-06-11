import React from "react";
import { FoodItem } from "@types";

interface FoodListProps {
  foods: FoodItem[];
  onRemove: (id: number) => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onRemove }) => {
  if (foods.length === 0) {
    return (
      <div className="text-center p-5 bg-gray-100 rounded-lg mt-4">
        <p className="text-gray-500 m-0">No food logged yet.</p>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {foods.map((food) => (
        <li
          key={food.id}
          className="bg-white rounded-lg p-3 shadow flex justify-between items-center"
        >
          <div className="flex items-center">
            {food.image && (
              <img
                src={food.image}
                alt={food.name}
                className="w-10 h-10 mr-2 rounded-md"
              />
            )}
            <span>
              {food.name} - {food.calories} kcal
            </span>
          </div>
          <button
            onClick={() => onRemove(food.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FoodList;
