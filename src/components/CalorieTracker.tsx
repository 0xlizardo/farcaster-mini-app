import React, { useEffect, useState } from "react";
import axios from "axios";
import { FoodItem, GoalOption } from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";

const SPOONACULAR_API_KEY = "87856d33a46b4d97aef088f2f5b58c48";

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

  useEffect(() => {
    const maintenance = currentWeight * 30;
    let calculated: number;

    if (goal === "lose") {
      calculated = maintenance - 500;
    } else if (goal === "gain") {
      calculated = maintenance + 500;
    } else {
      calculated = maintenance;
    }

    const safeCalories = calculated < 1200 ? 1200 : calculated;
    setDailyCalories(safeCalories);
    setRemainingCalories(safeCalories);
  }, [currentWeight, goal]);

  const addFood = async (foodName: string) => {
    try {
      const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(
        foodName
      )}&apiKey=${SPOONACULAR_API_KEY}`;

      const searchResp = await axios.get(searchUrl);
      const results = searchResp.data.results;

      if (!results || results.length === 0) {
        alert(`No results found for "${foodName}". Try another term.`);
        return;
      }

      const ingredientId: number = results[0].id;
      const ingredientName: string = results[0].name;

      const infoUrl = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${SPOONACULAR_API_KEY}`;
      const infoResp = await axios.get(infoUrl);
      const nutrition = infoResp.data.nutrition;

      const caloriesObj = nutrition.nutrients.find(
        (n: any) => n.name.toLowerCase() === "calories"
      );
      const caloriesForOneUnit: number = caloriesObj ? caloriesObj.amount : 0;

      const newFood: FoodItem = {
        id: nextFoodId,
        name: ingredientName,
        calories: caloriesForOneUnit
      };

      setFoods((prev) => [...prev, newFood]);
      setNextFoodId((prev) => prev + 1);
      setRemainingCalories((prev) => prev - caloriesForOneUnit);
    } catch (error) {
      console.error("Error fetching from Spoonacular:", error);
      alert("There was an error fetching nutrition info. Please try again.");
    }
  };

  const removeFood = (id: number) => {
    const toRemove = foods.find((f) => f.id === id);
    if (!toRemove) return;
    setRemainingCalories((prev) => prev + toRemove.calories);
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      <h2>Your Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining Calories: {remainingCalories.toFixed(0)} kcal</h3>

      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={removeFood} />
    </div>
  );
};

export default CalorieTracker;
