import React, { useState } from "react";
import WeightForm from "@components/WeightForm";
import CalorieTracker from "@components/CalorieTracker";
import logo from "@assets/logo.png";

const App: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [goal, setGoal] = useState<"lose" | "gain" | "maintain" | null>(null);

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
