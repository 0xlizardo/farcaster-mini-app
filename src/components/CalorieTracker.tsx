import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  FoodItem,
  GoalOption,
  CategoryOption,
  ActivityItem,
  MealType,
  MealCalorieDistribution,
  MealProgress
} from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";
import WaterTracker from "@components/WaterTracker";
import CalorieChart from "@components/CalorieChart";
import MealProgressComponent from "@components/MealProgress";

const SPOONACULAR_API_KEYS = import.meta.env.VITE_SPOONACULAR_API_KEYS?.split(',') || [];

const STORAGE_KEY_FOODS = "farfit-foods";

interface CalorieTrackerProps {
  currentWeight: number;
  targetWeight: number;
  goal: GoalOption;
  activities: ActivityItem[];
  foods: FoodItem[];
  nextFoodId: number;
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (id: number) => void;
  onResetDay: () => void;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  currentWeight,
  targetWeight,
  goal,
  activities,
  foods,
  nextFoodId,
  onAddFood,
  onRemoveFood,
  onResetDay
}) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [apiKeyIndex, setApiKeyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize meal distribution calculation
  const mealDistribution = useMemo(() => {
    const maintenance = currentWeight * 30;
    const calc =
      goal === "lose"
        ? maintenance - 500
        : goal === "gain"
        ? maintenance + 500
        : maintenance;
    const totalCalories = calc < 1200 ? 1200 : calc;

    return {
      breakfast: Math.round(totalCalories * 0.3),
      lunch: Math.round(totalCalories * 0.35),
      dinner: Math.round(totalCalories * 0.25),
      snack: Math.round(totalCalories * 0.1),
      total: totalCalories
    };
  }, [currentWeight, goal]);

  // Memoize total calories consumed
  const totalCaloriesConsumed = useMemo(() => 
    foods.reduce((sum, f) => sum + f.calories, 0),
    [foods]
  );

  // Memoize total calories burned
  const totalCaloriesBurned = useMemo(() => 
    activities.reduce((sum, a) => sum + a.caloriesBurned, 0),
    [activities]
  );

  // Update daily calories when meal distribution changes
  useEffect(() => {
    setDailyCalories(mealDistribution.total);
  }, [mealDistribution]);

  // Update remaining calories when consumed or burned calories change
  useEffect(() => {
    setRemaining(dailyCalories - totalCaloriesConsumed + totalCaloriesBurned);
  }, [dailyCalories, totalCaloriesConsumed, totalCaloriesBurned]);

  // Memoize meal progress calculation
  const getMealProgress = useCallback((mealType: MealType): MealProgress => {
    const target = mealDistribution[mealType];
    const consumed = foods
      .filter(food => food.mealType === mealType)
      .reduce((sum, food) => sum + food.calories, 0);
    const remaining = target - consumed;

    return {
      mealType,
      target,
      consumed,
      remaining
    };
  }, [mealDistribution, foods]);

  // Memoize addFood function
  const addFood = useCallback(async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption,
    mealType: MealType
  ) => {
    if (!SPOONACULAR_API_KEYS.length) {
      setError("No API keys configured. Please add your Spoonacular API keys to the environment variables.");
      return;
    }

    setIsLoading(true);
    setError(null);
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
        setError(`No results found for "${name}". Please try a different food item.`);
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

      if (caloriesForGiven === 0) {
        setError("Could not find calorie information for this food item.");
        return;
      }

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
        mealType,
        image: imageUrl || undefined
      };

      onAddFood(newFood);
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 402 || err.response.status === 429) {
          const nextIndex = (apiKeyIndex + 1) % SPOONACULAR_API_KEYS.length;
          setApiKeyIndex(nextIndex);
          setError("API key limit reached. Switching to next key...");
        } else {
          setError(`Error: ${err.response.data?.message || 'Failed to fetch nutrition info'}`);
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
      console.error("Food search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyIndex, nextFoodId, onAddFood]);

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      <div className="text-center mb-5 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="m-0 mb-2 text-gray-800 text-2xl">
          Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal
        </h2>
        <h3 className="m-0 text-green-600 text-xl">
          Remaining: {remaining.toFixed(0)} kcal
        </h3>
      </div>

      {activities.length > 0 && (
        <div className="bg-green-100 p-3 rounded-lg mb-4">
          <p className="m-0 text-green-800">
            🔥 Total calories burned today: {totalCaloriesBurned} kcal
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl text-gray-800 mb-3 text-center">
          Daily Calorie Distribution
        </h3>
        <div className="grid grid-cols-2 gap-2 px-2 max-w-md mx-auto">
          <MealProgressComponent progress={getMealProgress("breakfast")} />
          <MealProgressComponent progress={getMealProgress("lunch")} />
          <MealProgressComponent progress={getMealProgress("dinner")} />
          <MealProgressComponent progress={getMealProgress("snack")} />
        </div>
      </div>

      <CalorieChart 
        dailyCalories={dailyCalories}
        consumed={totalCaloriesConsumed}
        burned={totalCaloriesBurned}
      />

      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={onRemoveFood} />

      <button
        onClick={onResetDay}
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

export default React.memo(CalorieTracker);
