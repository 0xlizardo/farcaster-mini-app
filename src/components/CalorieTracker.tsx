import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FoodItem,
  GoalOption,
  CategoryOption
} from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";

const SPOONACULAR_API_KEY = "87856d33a46b4d97aef088f2f5b58c48";
const STORAGE_KEY_FOODS = "farfit-foods";

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
  const [nextFoodId, setNextFoodId] = useState(1);

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

  useEffect(() => {
    const f = localStorage.getItem(STORAGE_KEY_FOODS);
    if (f) {
      try {
        const parsed: FoodItem[] = JSON.parse(f);
        setFoods(parsed);
        const max = parsed.reduce((m, f) => Math.max(m, f.id), 0);
        setNextFoodId(max + 1);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FOODS, JSON.stringify(foods));
    const consumed = foods.reduce((sum, f) => sum + f.calories, 0);
    setRemaining(dailyCalories - consumed);
  }, [foods, dailyCalories]);

  const addFood = async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption
  ) => {
    try {
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

      // 👇 ساخت URL عکس
      const imageUrl = hit.image
        ? `https://spoonacular.com/cdn/ingredients_100x100/${hit.image}`
        : null;

      const newFood: FoodItem = {
        id: nextFoodId,
        name: hit.name,
        calories: Math.round(caloriesForGiven),
        amount: amt,
        unit,
        category,
        image: imageUrl || undefined
      };

      setFoods((prev) => [...prev, newFood]);
      setNextFoodId((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition info. Try again.");
    }
  };

  const removeFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const resetDay = () => {
    if (window.confirm("Clear day’s data?")) {
      localStorage.removeItem(STORAGE_KEY_FOODS);
      setFoods([]);
      setNextFoodId(1);
    }
  };

  return (
    <div>
      <h2>Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining: {remaining.toFixed(0)} kcal</h3>

      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={removeFood} />

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
