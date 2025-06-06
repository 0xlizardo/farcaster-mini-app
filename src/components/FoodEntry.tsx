import React, { useState } from "react";

interface FoodEntryProps {
  onAdd: (foodName: string) => void;
}

const FoodEntry: React.FC<FoodEntryProps> = ({ onAdd }) => {
  const [foodInput, setFoodInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = foodInput.trim();
    if (trimmed.length === 0) {
      alert("Please enter a valid food name.");
      return;
    }
    onAdd(trimmed);
    setFoodInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
      <label htmlFor="foodName">Add Food (e.g., “apple”, “pizza”):</label>
      <input
        type="text"
        id="foodName"
        value={foodInput}
        onChange={(e) => setFoodInput(e.target.value)}
        placeholder="Type a food name"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default FoodEntry;
