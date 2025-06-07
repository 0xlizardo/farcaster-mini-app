// src/components/CalorieTracker.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FoodItem, GoalOption, CategoryOption } from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";

const SPOONACULAR_API_KEY = "87856d33a46b4d97aef088f2f5b58c48";
const STORAGE_KEY = "farfit-foods";

interface CalorieTrackerProps {
  currentWeight: number;
  targetWeight: number;
  goal: GoalOption;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  currentWeight,
  targetWeight,
  goal
}) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [nextId, setNextId] = useState(1);

  // calc daily goal
  useEffect(() => {
    const maintenance = currentWeight * 30;
    const calc =
      goal === "lose"
        ? maintenance - 500
        : goal === "gain"
        ? maintenance + 500
        : maintenance;
    setDailyCalories(calc < 1200 ? 1200 : calc);
  }, [currentWeight, goal]);

  // load saved
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: FoodItem[] = JSON.parse(raw);
        setFoods(parsed);
        const max = parsed.reduce((m, f) => Math.max(m, f.id), 0);
        setNextId(max + 1);
      } catch {}
    }
  }, []);

  // persist + recalc
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    const used = foods.reduce((sum, f) => sum + f.calories, 0);
    setRemaining(dailyCalories - used);
  }, [foods, dailyCalories]);

  // add entry
  const addFood = async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption
  ) => {
    try {
      const search = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search`,
        { params: { query: name, number: 1, apiKey: SPOONACULAR_API_KEY } }
      );
      const hit = search.data.results[0];
      if (!hit) {
        alert(`No results for "${name}".`);
        return;
      }
      const info = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${hit.id}/information`,
        { params: { amount: amt, unit, apiKey: SPOONACULAR_API_KEY } }
      );
      const nut = info.data.nutrition.nutrients;
      const cal = nut.find((n: any) => n.name === "Calories")?.amount || 0;

      const item: FoodItem = {
        id: nextId,
        name: hit.name,
        calories: cal,
        amount: amt,
        unit,
        category
      };
      setFoods((prev) => [...prev, item]);
      setNextId((id) => id + 1);
    } catch {
      alert("Error fetching info.");
    }
  };

  const removeFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  // reset
  const resetDay = () => {
    if (confirm("Clear today's entries?")) {
      localStorage.removeItem(STORAGE_KEY);
      setFoods([]);
      setNextId(1);
    }
  };

  return (
    <div>
      <h2>Your Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining Calories: {remaining.toFixed(0)} kcal</h3>

      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={removeFood} />

      <button
        onClick={resetDay}
        style={{
          marginTop: 20,
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Reset Day
      </button>
    </div>
  );
};

export default CalorieTracker;
