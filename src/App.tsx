// src/App.tsx

import React, { useState, useEffect } from "react";
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
import logo from "@assets/logo.png";
import { GoalOption } from "@types";

const STORAGE_KEYS = {
  currentWeight: "farfit-currentWeight",
  targetWeight: "farfit-targetWeight",
  goal: "farfit-goal"
};

const App: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<GoalOption | null>(null);
  const [activeTab, setActiveTab] = useState<"tracker" | "settings">("tracker");

  // 1. On mount, load saved weight/goal if present
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
    currentWeight !== null &&
    targetWeight !== null &&
    goal !== null;

  // 2. Handle form submission: save to state + localStorage + switch to Tracker tab
  const handleFormSubmit = (
    cw: number,
    tw: number,
    g: GoalOption
  ) => {
    setCurrentWeight(cw);
    setTargetWeight(tw);
    setGoal(g);
    localStorage.setItem(STORAGE_KEYS.currentWeight, cw.toString());
    localStorage.setItem(STORAGE_KEYS.targetWeight, tw.toString());
    localStorage.setItem(STORAGE_KEYS.goal, g);
    setActiveTab("tracker");
  };

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <img
          src={logo}
          alt="FarFit Logo"
          style={{ maxWidth: "120px" }}
        />
      </header>

      {!isFormSubmitted ? (
        // If never submitted, show WeightForm
        <WeightForm onSubmit={handleFormSubmit} />
      ) : (
        // Otherwise show Tabbar + corresponding content
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px"
            }}
          >
            <button
              onClick={() => setActiveTab("tracker")}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "tracker" ? "#0d6efd" : "#e9ecef",
                color:
                  activeTab === "tracker" ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px 0 0 4px"
              }}
            >
              Tracker
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "settings" ? "#0d6efd" : "#e9ecef",
                color:
                  activeTab === "settings" ? "#fff" : "#000",
                border: "none",
                borderRadius: "0 4px 4px 0"
              }}
            >
              Settings
            </button>
          </div>

          {activeTab === "tracker" ? (
            <CalorieTracker
              currentWeight={currentWeight!}
              targetWeight={targetWeight!}
              goal={goal!}
            />
          ) : (
            <WeightForm onSubmit={handleFormSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
