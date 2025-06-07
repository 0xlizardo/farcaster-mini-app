// src/components/FoodEntry.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface FoodEntryProps {
  onAdd: (foodName: string, amount: number, unit: string) => void;
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

const FoodEntry: React.FC<FoodEntryProps> = ({ onAdd }) => {
  const [foodInput, setFoodInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<string>("gram");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when user types
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

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    onAdd(name, amount, unit);
    setFoodInput("");
    setAmount(1);
    setUnit("gram");
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <label htmlFor="foodName">Food Name:</label>
        <input
          type="text"
          id="foodName"
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
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 10,
              listStyle: "none",
              margin: 0,
              padding: "4px 0"
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s}
                onClick={() => handleSelect(s)}
                style={{
                  padding: "4px 8px",
                  cursor: "pointer"
                }}
                onMouseDown={(e) => e.preventDefault() /* prevent blur */}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
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
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" style={{ marginTop: "16px" }}>
        Add
      </button>
    </form>
  );
};

export default FoodEntry;
