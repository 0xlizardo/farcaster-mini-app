// src/components/FoodEntry.tsx

import React, { useState, useRef } from "react";
import { CategoryOption, MealType } from "@types";

interface FoodEntryProps {
  onAdd: (
    foodName: string,
    amount: number,
    unit: string,
    category: CategoryOption,
    mealType: MealType
  ) => void;
}

const unitOptions = [
  { value: "gram", label: "grams (g)" },
  { value: "kilogram", label: "kilograms (kg)" },
  { value: "piece", label: "pieces" },
  { value: "tablespoon", label: "tablespoons (tbsp)" },
  { value: "teaspoon", label: "teaspoons (tsp)" },
  { value: "cup", label: "cups" },
  { value: "milliliter", label: "milliliters (ml)" },
  { value: "ounce", label: "ounces (oz)" }
];

const categoryOptions: { value: CategoryOption; label: string }[] = [
  { value: "solid", label: "Solid Food" },
  { value: "liquid", label: "Beverage" },
  { value: "snack", label: "Snack" },
  { value: "fruit", label: "Fruit" }
];

const mealTypeOptions: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" }
];

const FoodEntry: React.FC<FoodEntryProps> = ({ onAdd }) => {
  const [foodInput, setFoodInput] = useState("");
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("gram");
  const [category, setCategory] = useState<CategoryOption>("solid");
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = foodInput.trim();
    if (!name) {
      alert("Please enter a valid food name.");
      return;
    }
    if (amount <= 0) {
      alert("Amount must be positive.");
      return;
    }
    onAdd(name, amount, unit, category, mealType);
    setFoodInput("");
    setAmount(1);
    setUnit("gram");
    setCategory("solid");
    setMealType("breakfast");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div ref={wrapperRef} className="relative">
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name:</label>
        <input
          id="foodName"
          type="text"
          value={foodInput}
          onChange={(e) => setFoodInput(e.target.value)}
          placeholder="e.g. Apple"
          autoComplete="off"
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit:</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {unitOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Food Type:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryOption)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type:</label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {mealTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
        Add
      </button>
    </form>
  );
};

export default FoodEntry;
