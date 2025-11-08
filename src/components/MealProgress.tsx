import React from "react";
import { MealProgress as MealProgressType } from "@types";

interface MealProgressProps {
  progress: MealProgressType;
}

const getMealEmoji = (type: string) => {
  switch (type) {
    case "breakfast":
      return "🍳";
    case "lunch":
      return "🍱";
    case "dinner":
      return "🍽️";
    case "snack":
      return "🍎";
    default:
      return "🍴";
  }
};

const getMealName = (type: string) => {
  switch (type) {
    case "breakfast":
      return "Breakfast";
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Dinner";
    case "snack":
      return "Snack";
    default:
      return type;
  }
};

const getMealColor = (type: string) => {
  switch (type) {
    case "breakfast":
      return "bg-orange-200";
    case "lunch":
      return "bg-blue-200";
    case "dinner":
      return "bg-purple-200";
    case "snack":
      return "bg-green-200";
    default:
      return "bg-gray-100";
  }
};

const MealProgress: React.FC<MealProgressProps> = ({ progress }) => {
  const { mealType, target, consumed, remaining } = progress;
  const percentage = target > 0 ? (consumed / target) * 100 : 0;

  return (
    <div
      className={`rounded-2xl p-3 shadow-lg w-full h-40 flex flex-col justify-between ${getMealColor(
        mealType
      )} hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center mb-2">
        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mr-3 shadow-md flex-shrink-0">
          <span className="text-3xl">{getMealEmoji(mealType)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="m-0 text-base font-bold text-gray-800 truncate">
            {getMealName(mealType)}
          </h3>
          <p className="m-0 text-xs text-gray-600">
            Target: {target} cal
          </p>
        </div>
      </div>

      <div className="mb-2">
        <div className="w-full h-4 bg-white bg-opacity-80 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentage > 100 ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-inner">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Consumed</div>
          <div className="text-base font-bold text-gray-800">
            {consumed}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">
            {remaining >= 0 ? "Remaining" : "Excess"}
          </div>
          <div
            className={`text-base font-bold ${
              remaining < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {Math.abs(remaining)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealProgress; 