// src/App.tsx
import React, { useState, useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
import ActivityEntry from "@components/ActivityEntry";
import ActivityList from "@components/ActivityList";
import logo from "@assets/logo.png";
import { GoalOption } from "@types";

const STORAGE_KEYS = {
  currentWeight: "farfit-currentWeight",
  targetWeight: "farfit-targetWeight",
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
  useEffect(() => {
    const cw = localStorage.getItem(STORAGE_KEYS.currentWeight);
    const tw = localStorage.getItem(STORAGE_KEYS.targetWeight);
    const gl = localStorage.getItem(STORAGE_KEYS.goal);
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
        <WeightForm onSubmit={handleFormSubmit} />
      ) : (
        <>
          {/* Tabs */}
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
                <button
                  onClick={() => setActiveTab("activities")}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
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
              <h4 style={{ marginBottom: 16 }}>Your Activities</h4>
              <ActivityEntry weightKg={currentWeight!} onAdd={() => {}} />
              <ActivityList activities={[]} onRemove={() => {}} />
            </div>
          )}

          {activeTab === "settings" && <SettingsCard />}
        </>
      )}
    </div>
  );
};

export default App;
