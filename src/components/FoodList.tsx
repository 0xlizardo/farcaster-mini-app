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
          className="bg-white rounded-lg p-3 shadow flex justify-between items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center flex-1 min-w-0">
            {food.image && (
              <img
                src={food.image}
                alt={food.name}
                className="w-12 h-12 mr-3 rounded-md object-cover flex-shrink-0"
                style={{ minWidth: '48px', minHeight: '48px' }}
              />
            )}
            <span className="text-gray-800 font-medium truncate">
              {food.name} - <span className="text-blue-600 font-semibold">{food.calories} kcal</span>
            </span>
          </div>
          <button
            onClick={() => onRemove(food.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex-shrink-0"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FoodList;
