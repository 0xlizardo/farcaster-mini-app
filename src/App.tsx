// src/App.tsx
import React, { useState, useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";          // ← import the SDK
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
import logo from "@assets/logo.png";

const App: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<"lose" | "gain" | "maintain" | null>(null);

  // **As soon as your layout is mounted**, tell Farcaster you're ready:
  useEffect(() => {
    (async () => {
      // Optionally disable swipe-to-close if you like:
      await sdk.actions.ready({ disableNativeGestures: true });
    })();
  }, []);

  const isFormSubmitted =
    currentWeight !== null && targetWeight !== null && goal !== null;

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={logo} alt="App Logo" style={{ maxWidth: "120px" }} />
      </header>

      {!isFormSubmitted ? (
        <WeightForm
          onSubmit={(cw, tw, g) => {
            setCurrentWeight(cw);
            setTargetWeight(tw);
            setGoal(g);
          }}
        />
      ) : (
        <CalorieTracker
          currentWeight={currentWeight!}
          targetWeight={targetWeight!}
          goal={goal!}
        />
      )}
    </div>
  );
};

export default App;
