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
      className={`rounded-2xl p-2 shadow-lg w-full max-w-[150px] h-36 flex flex-col justify-between ${getMealColor(
        mealType
      )}`}
    >
      <div className="flex items-center mb-1">
        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mr-2 shadow-md">
          <span className="text-2xl">{getMealEmoji(mealType)}</span>
        </div>
        <div>
          <h3 className="m-0 text-lg text-gray-800">
            {getMealName(mealType)}
          </h3>
          <p className="m-0 text-sm text-gray-600">
            Target: {target} cal
          </p>
        </div>
      </div>

      <div className="mb-1.5">
        <div className="w-full h-3.5 bg-white bg-opacity-80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentage > 100 ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg shadow-inner">
        <div className="text-center">
          <div className="text-sm text-gray-600">Consumed</div>
          <div className="text-lg font-bold text-gray-800">
            {consumed}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg text-gray-600">
            {remaining >= 0 ? "Remaining" : "Excess"}
          </div>
          <div
            className={`text-lg font-bold ${
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