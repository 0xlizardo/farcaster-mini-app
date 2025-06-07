// src/components/CalorieTracker.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FoodItem, GoalOption } from "@types";
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
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [remainingCalories, setRemainingCalories] = useState<number>(0);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [nextFoodId, setNextFoodId] = useState<number>(1);

  // 1. Calculate dailyCalories whenever weight/goal changes
  useEffect(() => {
    const maintenance = currentWeight * 30;
    let calculated = goal === "lose"
      ? maintenance - 500
      : goal === "gain"
      ? maintenance + 500
      : maintenance;
    const safe = calculated < 1200 ? 1200 : calculated;
    setDailyCalories(safe);
  }, [currentWeight, goal]);

  // 2. Load saved foods from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: FoodItem[] = JSON.parse(saved);
        setFoods(parsed);
        const maxId = parsed.reduce((max, f) => Math.max(max, f.id), 0);
        setNextFoodId(maxId + 1);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // 3. Persist foods and recalc remaining whenever foods or dailyCalories change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    const consumed = foods.reduce((sum, f) => sum + f.calories, 0);
    setRemainingCalories(dailyCalories - consumed);
  }, [foods, dailyCalories]);

  // 4. Add a new food entry
  const addFood = async (foodName: string, amount: number, unit: string) => {
    try {
      const searchResp = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search`,
        { params: { query: foodName, number: 1, apiKey: SPOONACULAR_API_KEY } }
      );
      const result = searchResp.data.results?.[0];
      if (!result) {
        alert(`No results for "${foodName}".`);
        return;
      }
      const { id: ingredientId, name: ingredientName } = result;

      const infoResp = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${ingredientId}/information`,
        { params: { amount, unit, apiKey: SPOONACULAR_API_KEY } }
      );
      const nutrients = infoResp.data.nutrition?.nutrients || [];
      const calObj = nutrients.find(
        (n: any) => n.name.toLowerCase() === "calories"
      );
      const caloriesForGiven = calObj ? calObj.amount : 0;

      const newFood: FoodItem = {
        id: nextFoodId,
        name: ingredientName,
        calories: caloriesForGiven,
        amount,
        unit
      };

      setFoods((prev) => [...prev, newFood]);
      setNextFoodId((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition info. Try again.");
    }
  };

  // 5. Remove an entry by id
  const removeFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  // 6. Reset the entire day's log
  const resetDay = () => {
    if (window.confirm("Are you sure you want to clear today's log?")) {
      localStorage.removeItem(STORAGE_KEY);
      setFoods([]);
      setNextFoodId(1);
    }
  };

  return (
    <div>
      <h2>Your Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining Calories: {remainingCalories.toFixed(0)} kcal</h3>

      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={removeFood} />

      <button
        onClick={resetDay}
        style={{
          marginTop: "20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Reset Day
      </button>
    </div>
  );
};

export default CalorieTracker;
