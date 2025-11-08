

// src/App.tsx

import React, { useState, useEffect } from "react";
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
import logo from "@assets/logo.png";
import { GoalOption, ActivityItem, FoodItem } from "@types";
import ActivityEntry from "@components/ActivityEntry";
import ActivityList from "@components/ActivityList";

// Mock SDK for development - will be replaced with real SDK in Farcaster environment
const mockSdk = {
  actions: {
    ready: async (_options?: { disableNativeGestures?: boolean }) => Promise.resolve()
  }
};

// Try to import Farcaster SDK, fallback to mock if not available
// Using a function to get SDK to handle async import properly
const getSdk = async () => {
  try {
    // This will only work in Farcaster environment
    const module = await import("@farcaster/frame-sdk");
    return module.sdk;
  } catch (error) {
    console.warn("Farcaster SDK not available, using mock SDK for development");
    return mockSdk;
  }
};

// Initialize SDK - will be set in useEffect
let sdk = mockSdk;

const STORAGE_KEYS = {
  currentWeight: "farfit-currentWeight",
  targetWeight: "farfit-targetWeight",
  goal: "farfit-goal",
  activities: "farfit-activities",
  foods: "farfit-foods"
};

const validateStorageData = (data: string | null, key: string): unknown => {
  try {
    if (!data) return null;
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return null;
  }
};

const App: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<GoalOption | null>(null);
  const [activeTab, setActiveTab] = useState<"calories" | "activities" | "settings">("calories");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [nextFoodId, setNextFoodId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // handshake and SDK initialization
  useEffect(() => {
    (async () => {
      try {
        sdk = await getSdk();
        await sdk.actions.ready({ disableNativeGestures: true });
      } catch (error) {
        console.warn("Failed to initialize Farcaster SDK:", error);
      }
    })();
  }, []);

  // Load saved data only once on mount
  useEffect(() => {
    try {
      const cw = validateStorageData(localStorage.getItem(STORAGE_KEYS.currentWeight), 'currentWeight');
      const tw = validateStorageData(localStorage.getItem(STORAGE_KEYS.targetWeight), 'targetWeight');
      const gl = validateStorageData(localStorage.getItem(STORAGE_KEYS.goal), 'goal');
      const savedActivities = validateStorageData(localStorage.getItem(STORAGE_KEYS.activities), 'activities');
      const savedFoods = validateStorageData(localStorage.getItem(STORAGE_KEYS.foods), 'foods');

      if (cw && tw && gl) {
        setCurrentWeight(Number(cw));
        setTargetWeight(Number(tw));
        setGoal(gl as GoalOption);
      }

      if (savedActivities && Array.isArray(savedActivities)) {
        setActivities(savedActivities);
      }

      if (savedFoods && Array.isArray(savedFoods)) {
        setFoods(savedFoods);
        const max = savedFoods.reduce((m, f) => Math.max(m, f.id), 0);
        setNextFoodId(max + 1);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setError('Failed to load saved data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
      setError('Failed to save activities. Please try again.');
    }
  }, [activities]);

  // Save foods to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.foods, JSON.stringify(foods));
    } catch (error) {
      console.error('Error saving foods to localStorage:', error);
      setError('Failed to save foods. Please try again.');
    }
  }, [foods]);

  const isFormSubmitted =
    currentWeight !== null && targetWeight !== null && goal !== null;

  const handleFormSubmit = (cw: number, tw: number, g: GoalOption) => {
    try {
      setCurrentWeight(cw);
      setTargetWeight(tw);
      setGoal(g);
      localStorage.setItem(STORAGE_KEYS.currentWeight, cw.toString());
      localStorage.setItem(STORAGE_KEYS.targetWeight, tw.toString());
      localStorage.setItem(STORAGE_KEYS.goal, g);
      setActiveTab("calories");
    } catch (error) {
      console.error('Error saving form data:', error);
      setError('Failed to save your information. Please try again.');
    }
  };

  const handleAddActivity = (activity: ActivityItem) => {
    setActivities(prev => [...prev, activity]);
  };

  const handleRemoveActivity = (id: number) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const handleAddFood = (food: FoodItem) => {
    setFoods(prev => [...prev, food]);
    setNextFoodId(prev => prev + 1);
  };

  const handleRemoveFood = (id: number) => {
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  const resetDay = () => {
    if (window.confirm("Are you sure you want to clear today's data? This action cannot be undone.")) {
      try {
        localStorage.removeItem(STORAGE_KEYS.activities);
        localStorage.removeItem(STORAGE_KEYS.foods);
        localStorage.removeItem("farfit-water-cups"); // Also reset water tracker
        setActivities([]);
        setFoods([]);
        setNextFoodId(1);
        setError(null); // Clear any existing errors
      } catch (error) {
        console.error('Error resetting day:', error);
        setError('Failed to reset data. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <p>Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 px-2 py-1 bg-red-700 text-white rounded-md cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <header className="text-center mb-8">
        <img src={logo} alt="FarFit Logo" className="max-w-[140px] mx-auto mb-2 drop-shadow-lg" />
        <h1 className="text-2xl font-bold text-gray-800 mt-2">FarFit</h1>
        <p className="text-sm text-gray-500">Your Daily Calorie Tracker</p>
      </header>

      {!isFormSubmitted ? (
        <WeightForm onSubmit={handleFormSubmit} />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-lg inline-flex mx-auto">
            <button
              onClick={() => setActiveTab("calories")}
              className={`px-6 py-2.5 cursor-pointer rounded-md font-semibold transition-all duration-200 ${
                activeTab === "calories"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              🍽️ Calories
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-6 py-2.5 cursor-pointer rounded-md font-semibold transition-all duration-200 ${
                activeTab === "activities"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              🏃 Activities
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-2.5 cursor-pointer rounded-md font-semibold transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Content */}
          {activeTab === "calories" && (
            <>
              <CalorieTracker
                currentWeight={currentWeight!}
                targetWeight={targetWeight!}
                goal={goal!}
                activities={activities}
                foods={foods}
                nextFoodId={nextFoodId}
                onAddFood={handleAddFood}
                onRemoveFood={handleRemoveFood}
                onResetDay={resetDay}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab("activities")}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Track Activity
                </button>
              </div>
            </>
          )}

          {activeTab === "activities" && (
            <>
              <ActivityEntry 
                weightKg={currentWeight || 0} 
                onAdd={handleAddActivity} 
              />
              <ActivityList
                activities={activities}
                onRemove={handleRemoveActivity}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab("calories")}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Back to Calories
                </button>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <div className="text-center">
              <h3 className="text-xl font-bold">Settings</h3>
              <button
                onClick={resetDay}
                className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer mt-4"
              >
                Reset Day's Data
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
