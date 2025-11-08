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

  // fetch suggestions with small debounce
  useEffect(() => {
    if (foodInput.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      const apiKeys = import.meta.env.VITE_SPOONACULAR_API_KEYS?.split(",") || [];
      if (!apiKeys.length) {
        setSuggestions([]);
        setIsLoadingSuggest(false);
        return;
      }
      setIsLoadingSuggest(true);
      try {
        const { data } = await axios.get(
          "https://api.spoonacular.com/food/ingredients/search",
          {
            params: {
              query: foodInput.trim(),
              number: 6,
              apiKey: apiKeys[0]
            }
          }
        );
        const names = (data.results || []).map((r: { name: string }) => r.name);
        setSuggestions(names);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion fetch error", err);
        setSuggestions([]);
        setShowSuggestions(false);
        // Don't show error for suggestions, just log it
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.warn("API key authentication failed");
          } else if (err.response?.status === 402 || err.response?.status === 429) {
            console.warn("API rate limit reached");
          }
        }
      } finally {
        setIsLoadingSuggest(false);
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
    
    // Enhanced validation
    if (!name) {
      alert("Please enter a valid food name.");
      return;
    }

    if (name.length < 2) {
      alert("Food name must be at least 2 characters long.");
      return;
    }

    if (name.length > 100) {
      alert("Food name is too long. Please use a shorter name.");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be positive.");
      return;
    }

    if (amount > 10000) {
      alert("Amount seems too large. Please check your input.");
      return;
    }

    // Sanitize input
    const sanitizedName = name.replace(/[<>]/g, '');
    
    onAdd(sanitizedName, amount, unit, category, mealType);
    setFoodInput("");
    setAmount(1);
    setUnit("gram");
    setCategory("solid");
    setMealType("breakfast");
    setShowSuggestions(false);
  };

  const SPOONACULAR_API_KEYS = import.meta.env.VITE_SPOONACULAR_API_KEYS?.split(",") || [];
  const hasApiKey = SPOONACULAR_API_KEYS.length > 0;

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {!hasApiKey && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium mb-1">
                ⚠️ API Key Not Configured
              </p>
              <p className="text-xs text-yellow-700">
                To search for foods, create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in the project root with:<br/>
                <code className="bg-yellow-100 px-1 rounded">VITE_SPOONACULAR_API_KEYS=your_api_key_here</code>
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Get your free API key from: <a href="https://spoonacular.com/food-api" target="_blank" rel="noopener noreferrer" className="underline">spoonacular.com/food-api</a>
              </p>
            </div>
          </div>
        </div>
      )}
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
