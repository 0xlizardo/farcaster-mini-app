import React, { useEffect, useState } from "react";
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
  const [mealDistribution, setMealDistribution] = useState<MealCalorieDistribution>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
    total: 0
  });

  useEffect(() => {
    const maintenance = currentWeight * 30;
    const calc =
      goal === "lose"
        ? maintenance - 500
        : goal === "gain"
        ? maintenance + 500
        : maintenance;
    const totalCalories = calc < 1200 ? 1200 : calc;
    setDailyCalories(totalCalories);

    // تقسیم کالری بین وعده‌ها
    const distribution: MealCalorieDistribution = {
      breakfast: Math.round(totalCalories * 0.3), // 30% صبحانه
      lunch: Math.round(totalCalories * 0.35), // 35% ناهار
      dinner: Math.round(totalCalories * 0.25), // 25% شام
      snack: Math.round(totalCalories * 0.1), // 10% میان وعده
      total: totalCalories
    };
    setMealDistribution(distribution);
  }, [currentWeight, goal]);

  useEffect(() => {
    const consumed = foods.reduce((sum, f) => sum + f.calories, 0);
    const burned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
    setRemaining(dailyCalories - consumed + burned);
  }, [foods, dailyCalories, activities]);

  const getMealProgress = (mealType: MealType): MealProgress => {
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
  };

  const addFood = async (
    name: string,
    amt: number,
    unit: string,
    category: CategoryOption,
    mealType: MealType
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
        mealType,
        image: imageUrl || undefined
      };

      onAddFood(newFood);
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

  return (
    <div>
      <h2>Daily Calorie Goal: {dailyCalories.toFixed(0)} kcal</h2>
      <h3>Remaining: {remaining.toFixed(0)} kcal</h3>
      {activities.length > 0 && (
        <div style={{ 
          backgroundColor: "#e8f5e9",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          <p style={{ margin: 0, color: "#2e7d32" }}>
            🔥 Total calories burned today: {activities.reduce((sum, a) => sum + a.caloriesBurned, 0)} kcal
          </p>
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ 
          fontSize: "20px", 
          color: "#2c3e50", 
          marginBottom: "12px",
          textAlign: "center"
        }}>
          Daily Calorie Distribution
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "8px",
          padding: "0 8px",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <MealProgressComponent progress={getMealProgress("breakfast")} />
          <MealProgressComponent progress={getMealProgress("lunch")} />
          <MealProgressComponent progress={getMealProgress("dinner")} />
          <MealProgressComponent progress={getMealProgress("snack")} />
        </div>
      </div>

      <CalorieChart 
        dailyCalories={dailyCalories}
        consumed={foods.reduce((sum, f) => sum + f.calories, 0)}
        burned={activities.reduce((sum, a) => sum + a.caloriesBurned, 0)}
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

export default CalorieTracker;
