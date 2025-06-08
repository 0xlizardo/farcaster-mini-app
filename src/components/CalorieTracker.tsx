import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FoodItem,
  GoalOption,
  CategoryOption
} from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";
import WaterTracker from "@components/WaterTracker";

const SPOONACULAR_API_KEYS = [
  "5b0557bc79364a0fbe2e14c8fa75166c",
  "11081c04d9824515b8bd7bdd02969a83",
  "b67569d6a09949b2992db0607624b59e",
  "76070b44bb124975973aa67f9cf594a5",
  "23fee0fb7c08487fb4f429a1ee52e557",
  "3bc92fe23c3d4e11b6ac2441c3c555d6",
  "16435a56ebcd47d885c25449a0d8700c"
];

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
  const [apiKeyIndex, setApiKeyIndex] = useState(0);

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
    const currentKey = SPOONACULAR_API_KEYS[apiKeyIndex];
    try {
      const search = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search`,
        {
          params: {
            query: name,
            number: 1,
            apiKey: currentKey
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
            apiKey: currentKey
          }
        }
      );
      const nutrientList = info.data.nutrition?.nutrients || [];
      const calObj = nutrientList.find(
        (n: any) => n.name.toLowerCase() === "calories"
      );
      const caloriesForGiven = calObj ? calObj.amount : 0;

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
    } catch (err: any) {
      if (err.response && (err.response.status === 402 || err.response.status === 429)) {
        const nextIndex = (apiKeyIndex + 1) % SPOONACULAR_API_KEYS.length;
        setApiKeyIndex(nextIndex);
        alert("API Key exhausted. Switched to next key.");
      } else {
        console.error(err);
        alert("Error fetching nutrition info. Try again.");
      }
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

      <WaterTracker />
    </div>
  );
};

export default CalorieTracker;
