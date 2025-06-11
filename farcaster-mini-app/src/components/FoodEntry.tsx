// src/components/FoodEntry.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CategoryOption } from "@types";

interface FoodEntryProps {
  onAdd: (
    foodName: string,
    amount: number,
    unit: string,
    category: CategoryOption
  ) => void;
}

const SPOONACULAR_API_KEY = "87856d33a46b4d97aef088f2f5b58c48";

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
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch",     label: "Lunch"     },
  { value: "dinner",    label: "Dinner"    },
  { value: "snack",     label: "Snack"     }
];

const FoodEntry: React.FC<FoodEntryProps> = ({ onAdd }) => {
  const [foodInput, setFoodInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("gram");
  const [category, setCategory] = useState<CategoryOption>("breakfast");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // fetch live search suggestions
  useEffect(() => {
    if (foodInput.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const resp = await axios.get(
          `https://api.spoonacular.com/food/ingredients/search`,
          {
            params: {
              query: foodInput,
              number: 5,
              apiKey: SPOONACULAR_API_KEY
            }
          }
        );
        setSuggestions(resp.data.results.map((r: any) => r.name));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [foodInput]);

  // close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (name: string) => {
    setFoodInput(name);
    setShowSuggestions(false);
  };

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
    onAdd(name, amount, unit, category);
    setFoodInput("");
    setAmount(1);
    setUnit("gram");
    setCategory("breakfast");
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <label htmlFor="foodName">Food Name:</label>
        <input
          id="foodName"
          type="text"
          value={foodInput}
          onChange={(e) => setFoodInput(e.target.value)}
          placeholder="Type to search..."
          autoComplete="off"
          required
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              maxHeight: 150,
              overflowY: "auto",
              listStyle: "none",
              margin: 0,
              padding: 0,
              zIndex: 10
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s}
                onClick={() => handleSelect(s)}
                onMouseDown={(e) => e.preventDefault()}
                style={{ padding: 8, cursor: "pointer" }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="unit">Unit:</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {unitOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryOption)}
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" style={{ marginTop: 16 }}>
        Add
      </button>
    </form>
  );
};

export default FoodEntry;
