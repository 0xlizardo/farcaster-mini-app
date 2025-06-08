// src/components/CalorieTracker.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FoodItem, GoalOption, CategoryOption } from "@types";
import WeightForm from "@components/WeightForm";
import FoodList from "@components/FoodList";
import WaterTracker from "@components/WaterTracker";

interface CalorieTrackerProps {
  fid: string;
  currentWeight: number;
  targetWeight: number;
  goal: GoalOption;
}

const SPOONACULAR_API_KEYS = [
  "5b0557bc79364a0fbe2e14c8fa75166c",
  "11081c04d9824515b8bd7bdd02969a83",
  "b67569d6a09949b2992db0607624b59e",
  "76070b44bb124975973aa67f9cf594a5",
  "23fee0fb7c08487fb4f429a1ee52e557",
  "3bc92fe23c3d4e11b6ac2441c3c555d6",
  "16435a56ebcd47d885c25449a0d8700c"
];

const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  fid,
  currentWeight,
  goal
}) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [apiKeyIndex, setApiKeyIndex] = useState(0);

  // Calculate dailyCalories...
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

  // Load foods from our API
  useEffect(() => {
    fetch(`/api/foods?fid=${fid}`)
      .then((r) => r.json())
      .then((docs: any[]) =>
        setFoods(
          docs.map((d) => ({
            id: d._id,
            name: d.name,
            calories: d.calories,
            amount: d.amount,
            unit: d.unit,
            category: d.category,
            image: d.image
          }))
        )
      )
      .catch(console.error);
  }, [fid]);

  // Recalc remaining
  useEffect(() => {
    const consumed = foods.reduce((sum, f) => sum + f.calories, 0);
    setRemaining(dailyCalories - consumed);
  }, [foods, dailyCalories]);

  // Add new food (search + save via API)
  const addFood = async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption
  ) => {
    const key = SPOONACULAR_API_KEYS[apiKeyIndex];
    try {
      // search & info (same as before)...
      const hit = { name, image: "" }; // default hit object; replace with actual search result if available
      // build newFood object (without id)
      const imageUrl = hit.image
        ? `https://spoonacular.com/cdn/ingredients_100x100/${hit.image}`
        : undefined;

      const payload = {
        fid,
        name: hit.name,
        calories: Math.round(amt), // using amt as a placeholder for calories, update calculation as needed
        amount: amt,
        unit,
        category,
        image: imageUrl
      };

      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const created = await res.json();
      setFoods((prev) => [
        {
          id: created._id,
          name: created.name,
          calories: created.calories,
          amount: created.amount,
          unit: created.unit,
          category: created.category,
          image: created.image
        },
        ...prev
      ]);
    } catch (err: any) {
      if (err.response && [402, 429].includes(err.response.status)) {
        setApiKeyIndex((i) => (i + 1) % SPOONACULAR_API_KEYS.length);
        alert("API Key exhausted—switched to next key");
      } else {
        alert("Error fetching nutrition info");
      }
    }
  };

  // Remove a food
  const removeFood = async (id: string) => {
    await fetch(`/api/foods?fid=${fid}&id=${id}`, { method: "DELETE" });
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      <h2>Daily Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining: {remaining.toFixed(0)} kcal</h3>

      <WeightForm onSubmit={(currentWeight, targetWeight, goal) => {
        // Implementation for weight form submission
      }} />
      <FoodList foods={foods} onRemove={removeFood} />

      {/* WaterTracker now lives here too */}
      <WaterTracker fid={fid} />
    </div>
  );
};

export default CalorieTracker;
