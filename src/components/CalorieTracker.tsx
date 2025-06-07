// src/components/CalorieTracker.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FoodItem,
  ActivityItem,
  GoalOption,
  CategoryOption
} from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";
import ActivityEntry from "@components/ActivityEntry";
import ActivityList from "@components/ActivityList";

const SPOONACULAR_API_KEY = "87856d33a46b4d97aef088f2f5b58c48";
const STORAGE_KEY_FOODS = "farfit-foods";
const STORAGE_KEY_ACTS = "farfit-acts";

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
  const [acts, setActs] = useState<ActivityItem[]>([]);
  const [nextFoodId, setNextFoodId] = useState(1);

  // calculate daily goal
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

  // load saved foods & activities
  useEffect(() => {
    const f = localStorage.getItem(STORAGE_KEY_FOODS);
    const a = localStorage.getItem(STORAGE_KEY_ACTS);
    if (f) {
      try {
        const parsed: FoodItem[] = JSON.parse(f);
        setFoods(parsed);
        const max = parsed.reduce((m, f) => Math.max(m, f.id), 0);
        setNextFoodId(max + 1);
      } catch {}
    }
    if (a) {
      try {
        setActs(JSON.parse(a));
      } catch {}
    }
  }, []);

  // persist & recalc remaining
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FOODS, JSON.stringify(foods));
    localStorage.setItem(STORAGE_KEY_ACTS, JSON.stringify(acts));
    const consumed = foods.reduce((sum, f) => sum + f.calories, 0);
    const burned = acts.reduce((sum, a) => sum + a.caloriesBurned, 0);
    setRemaining(dailyCalories - consumed + burned);
  }, [foods, acts, dailyCalories]);

  // add a food entry, now with category
  const addFood = async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption
  ) => {
    try {
      // search ingredient
      const search = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search`,
        {
          params: {
            query: name,
            number: 1,
            apiKey: SPOONACULAR_API_KEY
          }
        }
      );
      const hit = search.data.results?.[0];
      if (!hit) {
        alert(`No results for "${name}".`);
        return;
      }

      // fetch nutrition info
      const info = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${hit.id}/information`,
        {
          params: {
            amount: amt,
            unit,
            apiKey: SPOONACULAR_API_KEY
          }
        }
      );
      const nutrientList = info.data.nutrition?.nutrients || [];
      const calObj = nutrientList.find(
        (n: any) => n.name.toLowerCase() === "calories"
      );
      const caloriesForGiven = calObj ? calObj.amount : 0;

      // create newFood with id included
      const newFood: FoodItem = {
        id: nextFoodId,
        name: hit.name,
        calories: Math.round(caloriesForGiven),
        amount: amt,
        unit,
        category
      };

      setFoods((prev) => [...prev, newFood]);
      setNextFoodId((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition info. Try again.");
    }
  };

  const addActivity = (act: ActivityItem) => {
    setActs((prev) => [...prev, act]);
  };

  const removeFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };
  const removeActivity = (id: number) => {
    setActs((prev) => prev.filter((a) => a.id !== id));
  };

  const resetDay = () => {
    if (window.confirm("Clear day’s data?")) {
      localStorage.removeItem(STORAGE_KEY_FOODS);
      localStorage.removeItem(STORAGE_KEY_ACTS);
      setFoods([]);
      setActs([]);
      setNextFoodId(1);
    }
  };

  return (
    <div>
      <h2>Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining: {remaining.toFixed(0)} kcal</h3>

      {/* Foods */}
      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={removeFood} />

      {/* Activities */}
      <h4 style={{ marginTop: 24 }}>Log Activity</h4>
      <ActivityEntry weightKg={currentWeight} onAdd={addActivity} />
      <ActivityList activities={acts} onRemove={removeActivity} />

      {/* Reset */}
      <button
        onClick={resetDay}
        style={{
          marginTop: 20,
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
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
