// src/App.tsx
<<<<<<< HEAD

=======
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
import React, { useState, useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
<<<<<<< HEAD
import logo from "@assets/logo.png";
import { GoalOption, ActivityItem, FoodItem } from "@types";
import ActivityEntry from "@components/ActivityEntry";
import ActivityList from "@components/ActivityList";
=======
import ActivityEntry from "@components/ActivityEntry";
import ActivityList from "@components/ActivityList";
import logo from "@assets/logo.png";
import { GoalOption } from "@types";
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82

const STORAGE_KEYS = {
  currentWeight: "farfit-currentWeight",
  targetWeight: "farfit-targetWeight",
<<<<<<< HEAD
  goal: "farfit-goal",
  activities: "farfit-activities",
  foods: "farfit-foods"
};

const App: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<GoalOption | null>(null);
  const [activeTab, setActiveTab] = useState<"calories" | "activities" | "settings">("calories");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [nextFoodId, setNextFoodId] = useState(1);

  // handshake
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready({ disableNativeGestures: true });
      } catch {}
    })();
  }, []);

  // Load saved data only once on mount
=======
  goal: "farfit-goal"
};

const App: React.FC = () => {
  const [fid, setFid] = useState<string | null>(null);

  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<GoalOption | null>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "calories" | "activities" | "settings"
  >("calories");

  /* Grab the user FID once the frame is ready */
  useEffect(() => {
    (async () => {
      await sdk.actions.ready();
      const ctx = await sdk.context;
      const userFid = (ctx as any).fid ?? (ctx as any).me?.fid;
      if (userFid) setFid(String(userFid));
    })();
  }, []);

  /* Load saved settings */
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
  useEffect(() => {
    const cw = localStorage.getItem(STORAGE_KEYS.currentWeight);
    const tw = localStorage.getItem(STORAGE_KEYS.targetWeight);
    const gl = localStorage.getItem(STORAGE_KEYS.goal);
<<<<<<< HEAD
    const savedActivities = localStorage.getItem(STORAGE_KEYS.activities);
    const savedFoods = localStorage.getItem(STORAGE_KEYS.foods);

    if (cw && tw && gl) {
      setCurrentWeight(parseFloat(cw));
      setTargetWeight(parseFloat(tw));
      setGoal(gl as GoalOption);
    }

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch {}
    }

    if (savedFoods) {
      try {
        const parsed: FoodItem[] = JSON.parse(savedFoods);
        setFoods(parsed);
        const max = parsed.reduce((m, f) => Math.max(m, f.id), 0);
        setNextFoodId(max + 1);
      } catch {}
    }
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
    }
  }, [activities]);

  // Save foods to localStorage
  useEffect(() => {
    if (foods.length > 0) {
      localStorage.setItem(STORAGE_KEYS.foods, JSON.stringify(foods));
    }
  }, [foods]);

  const isFormSubmitted =
    currentWeight !== null && targetWeight !== null && goal !== null;

  const handleFormSubmit = (cw: number, tw: number, g: GoalOption) => {
    setCurrentWeight(cw);
    setTargetWeight(tw);
    setGoal(g);
    localStorage.setItem(STORAGE_KEYS.currentWeight, cw.toString());
    localStorage.setItem(STORAGE_KEYS.targetWeight, tw.toString());
    localStorage.setItem(STORAGE_KEYS.goal, g);
    setActiveTab("calories");
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
    if (window.confirm("Clear day's data?")) {
      localStorage.removeItem(STORAGE_KEYS.activities);
      localStorage.removeItem(STORAGE_KEYS.foods);
      setActivities([]);
      setFoods([]);
      setNextFoodId(1);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={logo} alt="FarFit Logo" style={{ maxWidth: "120px" }} />
      </header>

      {!isFormSubmitted ? (
=======
    if (cw && tw && gl) {
      setCurrentWeight(Number(cw));
      setTargetWeight(Number(tw));
      setGoal(gl as GoalOption);
      setFormSubmitted(true);
    }
  }, []);

  /* Handler from WeightForm */
  const handleFormSubmit = (
    cw: number,
    tw: number,
    g: GoalOption
  ) => {
    setCurrentWeight(cw);
    setTargetWeight(tw);
    setGoal(g);
    localStorage.setItem(STORAGE_KEYS.currentWeight, String(cw));
    localStorage.setItem(STORAGE_KEYS.targetWeight, String(tw));
    localStorage.setItem(STORAGE_KEYS.goal, g);
    setFormSubmitted(true);
    setActiveTab("calories");
  };

  /* Replace Settings tab UI */
  const SettingsCard = () => (
    <div style={{ textAlign: "center" }}>
      <h4>Your Current Goal</h4>
      <p>Current weight: <strong>{currentWeight} kg</strong></p>
      <p>Target weight: <strong>{targetWeight} kg</strong></p>
      <p>Goal: <strong>{goal}</strong></p>
      <button
        onClick={() => {
          // user wants to edit weights again
          setFormSubmitted(false);
        }}
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Edit goals
      </button>
    </div>
  );

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <img src={logo} alt="FarFit Logo" style={{ maxWidth: 120 }} />
      </header>

      {!formSubmitted ? (
        /* initial form */
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
        <WeightForm onSubmit={handleFormSubmit} />
      ) : (
        <>
          {/* Tabs */}
<<<<<<< HEAD
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <button
              onClick={() => setActiveTab("calories")}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: activeTab === "calories" ? "#0d6efd" : "#e9ecef",
                color: activeTab === "calories" ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px 0 0 4px"
              }}
            >
              Calories
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: activeTab === "activities" ? "#0d6efd" : "#e9ecef",
                color: activeTab === "activities" ? "#fff" : "#000",
                border: "none"
              }}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: activeTab === "settings" ? "#0d6efd" : "#e9ecef",
                color: activeTab === "settings" ? "#fff" : "#000",
                border: "none",
                borderRadius: "0 4px 4px 0"
              }}
            >
              Settings
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
              <div style={{ marginTop: "16px", textAlign: "center" }}>
=======
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            {["calories", "activities", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "calories" | "activities" | "settings")
                }
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius:
                    tab === "calories"
                      ? "4px 0 0 4px"
                      : tab === "settings"
                      ? "0 4px 4px 0"
                      : 0,
                  backgroundColor:
                    activeTab === tab ? "#0d6efd" : "#e9ecef",
                  color: activeTab === tab ? "#fff" : "#000",
                  cursor: "pointer"
                }}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          {activeTab === "calories" && (
            <>
              <CalorieTracker
                fid={fid ?? ""}
                currentWeight={currentWeight!}
                targetWeight={targetWeight!}
                goal={goal!}
              />
              <div style={{ textAlign: "center", marginTop: 16 }}>
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
                <button
                  onClick={() => setActiveTab("activities")}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
<<<<<<< HEAD
                    borderRadius: "4px",
=======
                    borderRadius: 4,
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
                    cursor: "pointer"
                  }}
                >
                  Log an Activity
                </button>
              </div>
            </>
          )}

          {activeTab === "activities" && (
            <div>
<<<<<<< HEAD
              <h4 style={{ marginBottom: "16px" }}>Your Activities</h4>
              <ActivityEntry weightKg={currentWeight!} onAdd={handleAddActivity} />
              <ActivityList activities={activities} onRemove={handleRemoveActivity} />
            </div>
          )}

          {activeTab === "settings" && (
            <WeightForm onSubmit={handleFormSubmit} />
          )}
=======
              <h4 style={{ marginBottom: 16 }}>Your Activities</h4>
              <ActivityEntry weightKg={currentWeight!} onAdd={() => {}} />
              <ActivityList activities={[]} onRemove={() => {}} />
            </div>
          )}

          {activeTab === "settings" && <SettingsCard />}
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
        </>
      )}
    </div>
  );
};

export default App;
