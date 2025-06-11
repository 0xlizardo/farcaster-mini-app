// src/components/FoodEntry.tsx

import React, { useState, useRef, useEffect } from "react";
import { CategoryOption, MealType } from "@types";
import axios from "axios";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("gram");
  const [category, setCategory] = useState<CategoryOption>("solid");
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const SPOONACULAR_API_KEYS = import.meta.env.VITE_SPOONACULAR_API_KEYS?.split(",") || [];

  // fetch suggestions with small debounce
  useEffect(() => {
    if (foodInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (!SPOONACULAR_API_KEYS.length) return;
      setIsLoadingSuggest(true);
      try {
        const { data } = await axios.get(
          "https://api.spoonacular.com/food/ingredients/search",
          {
            params: {
              query: foodInput.trim(),
              number: 6,
              apiKey: SPOONACULAR_API_KEYS[0]
            }
          }
        );
        const names = (data.results || []).map((r: any) => r.name);
        setSuggestions(names);
      } catch (err) {
        console.error("Suggestion fetch error", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggest(false);
        setShowSuggestions(true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [foodInput]);

  // close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div ref={wrapperRef} className="relative">
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name:</label>
        <input
          id="foodName"
          type="text"
          value={foodInput}
          onChange={(e) => {
            setFoodInput(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="e.g. Apple"
          autoComplete="off"
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {showSuggestions && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto">
            {isLoadingSuggest && (
              <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>
            )}
            {!isLoadingSuggest && suggestions.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No results</li>
            )}
            {suggestions.map((s) => (
              <li
                key={s}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setFoodInput(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
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
