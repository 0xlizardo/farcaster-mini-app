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
  const [activeTab, setActiveTab] = useState<"calories" | "activities" | "settings">("calories");

  // 1) Handshake & fetch FID from frame context
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready({ disableNativeGestures: true });
        const context = await sdk.context;
        // FID may live on context.fid or context.me.fid depending on version:
        const userFid = (context as any).fid ?? (context as any).me?.fid;
        if (userFid != null) {
          setFid(userFid.toString());
        } else {
          console.warn("Unable to read FID from frame context:", context);
        }
      } catch (err) {
        console.error("Error initializing Farcaster SDK:", err);
      }
    })();
  }, []);

  // 2) Load saved weight & goal from localStorage
  useEffect(() => {
    const cw = localStorage.getItem(STORAGE_KEYS.currentWeight);
    const tw = localStorage.getItem(STORAGE_KEYS.targetWeight);
    const gl = localStorage.getItem(STORAGE_KEYS.goal);
    if (cw && tw && gl) {
      setCurrentWeight(parseFloat(cw));
      setTargetWeight(parseFloat(tw));
      setGoal(gl as GoalOption);
    }
  }, []);

  const isFormSubmitted =
    fid !== null &&
    currentWeight !== null &&
    targetWeight !== null &&
    goal !== null;

  const handleFormSubmit = (cw: number, tw: number, g: GoalOption) => {
    setCurrentWeight(cw);
    setTargetWeight(tw);
    setGoal(g);
    localStorage.setItem(STORAGE_KEYS.currentWeight, cw.toString());
    localStorage.setItem(STORAGE_KEYS.targetWeight, tw.toString());
    localStorage.setItem(STORAGE_KEYS.goal, g);
    setActiveTab("calories");
  };

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={logo} alt="FarFit Logo" style={{ maxWidth: "120px" }} />
      </header>

      {!isFormSubmitted ? (
        <WeightForm onSubmit={handleFormSubmit} />
      ) : (
        <>
          {/* Tabs */}
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
                fid={fid!}
                currentWeight={currentWeight!}
                targetWeight={targetWeight!}
                goal={goal!}
              />
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  onClick={() => setActiveTab("activities")}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
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
              <h4 style={{ marginBottom: "16px" }}>Your Activities</h4>
              {/* Make sure ActivityEntry & ActivityList accept fid as needed */}
              <ActivityEntry weightKg={currentWeight!} onAdd={() => {}} />
              <ActivityList activities={[]} onRemove={() => {}} />
            </div>
          )}

          {activeTab === "settings" && (
            <WeightForm onSubmit={handleFormSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
