import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  FoodItem,
  GoalOption,
  CategoryOption,
  ActivityItem,
  MealType,
  MealProgress
} from "@types";
import FoodEntry from "@components/FoodEntry";
import FoodList from "@components/FoodList";
import WaterTracker from "@components/WaterTracker";
import CalorieChart from "@components/CalorieChart";
import MealProgressComponent from "@components/MealProgress";

const SPOONACULAR_API_KEYS = import.meta.env.VITE_SPOONACULAR_API_KEYS?.split(',') || [];

interface CalorieTrackerProps {
  currentWeight: number;
  targetWeight: number; // Reserved for future use
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
  targetWeight: _targetWeight, // Reserved for future use
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
    mealType: MealType,
    retryKeyIndex?: number
  ) => {
    if (!SPOONACULAR_API_KEYS.length) {
      setError("⚠️ No API keys configured. Please create a .env file with VITE_SPOONACULAR_API_KEYS=your_key_here");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const keyIndexToUse = retryKeyIndex !== undefined ? retryKeyIndex : apiKeyIndex;
    const currentKey = SPOONACULAR_API_KEYS[keyIndexToUse];

    if (!currentKey) {
      setError("Invalid API key index.");
      setIsLoading(false);
      return;
    }

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
      if (!hit || !search.data.results || search.data.results.length === 0) {
        setError(`❌ No results found for "${name}". Please try a different food item or check your spelling.`);
        setIsLoading(false);
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
        (n: { name: string; amount: number }) => n.name.toLowerCase() === "calories"
      );
      const caloriesForGiven = calObj ? calObj.amount : 0;

      if (caloriesForGiven === 0) {
        setError("Could not find calorie information for this food item.");
        setIsLoading(false);
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
      setIsLoading(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 402 || err.response.status === 429) {
          if (SPOONACULAR_API_KEYS.length > 1) {
            const nextIndex = (keyIndexToUse + 1) % SPOONACULAR_API_KEYS.length;
            // Prevent infinite loop - only retry if we haven't tried all keys
            if (nextIndex !== apiKeyIndex || retryKeyIndex !== undefined) {
              setApiKeyIndex(nextIndex);
              setError("API key limit reached. Switching to next key...");
              // Retry with next API key after a delay
              setTimeout(() => {
                addFood(name, amt, unit, category, mealType, nextIndex);
              }, 1000);
              return;
            } else {
              setError("API key limit reached. All keys exhausted. Please try again later.");
            }
          } else {
            setError("API key limit reached. Please try again later or add more API keys.");
          }
        } else if (err.response.status === 401 || err.response.status === 403) {
          setError("🔑 API key authentication failed. Please check your API key in .env file.");
        } else if (err.response.status === 404) {
          setError(`❌ Food item "${name}" not found. Please try a different name.`);
        } else {
          const errorMessage = (err.response.data as { message?: string })?.message || 'Failed to fetch nutrition info';
          setError(`⚠️ Error: ${errorMessage}`);
        }
      } else if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
        setError("⏱️ Request timeout. Please check your internet connection and try again.");
      } else if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK') {
        setError("🌐 Network error. Please check your internet connection.");
      } else {
        setError("❌ An unexpected error occurred. Please try again.");
      }
      console.error("Food search error:", err);
      setIsLoading(false);
    }
  }, [apiKeyIndex, nextFoodId, onAddFood, SPOONACULAR_API_KEYS]);

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="m-0 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-700 hover:text-red-900 font-bold text-lg cursor-pointer"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100">
        <h2 className="m-0 mb-2 text-gray-800 text-2xl font-bold">
          Daily Calorie Goal: <span className="text-blue-600">{dailyCalories.toFixed(0)} kcal</span>
        </h2>
        <h3 className={`m-0 text-xl font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {remaining >= 0 ? '✓' : '⚠'} Remaining: {remaining.toFixed(0)} kcal
        </h3>
      </div>

      {activities.length > 0 && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-4 border border-green-200 shadow-sm">
          <p className="m-0 text-green-800 font-semibold text-center">
            🔥 Total calories burned today: <span className="text-green-600 text-lg">{totalCaloriesBurned} kcal</span>
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl text-gray-800 mb-3 text-center">
          Daily Calorie Distribution
        </h3>
        <div className="grid grid-cols-2 gap-4 px-2 max-w-2xl mx-auto">
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

      {isLoading && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4 text-center">
          <p className="m-0">Loading food information...</p>
        </div>
      )}
      <FoodEntry onAdd={addFood} />
      <FoodList foods={foods} onRemove={onRemoveFood} />

      <div className="mt-6 text-center">
        <button
          onClick={onResetDay}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          🔄 Reset Day
        </button>
      </div>

      <WaterTracker />
    </div>
  );
};

export default React.memo(CalorieTracker);
