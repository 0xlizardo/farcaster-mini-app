// src/components/WeightForm.tsx
import React, { useState } from "react";
import { GoalOption } from "@types";

interface WeightFormProps {
  onSubmit: (
    currentWeight: number,
    targetWeight: number,
    goal: GoalOption
  ) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onSubmit }) => {
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [goal, setGoal] = useState<GoalOption>("maintain");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cw = Number(currentWeight);
    const tw = Number(targetWeight);
    if (!cw || !tw || cw <= 0 || tw <= 0) {
      alert("Please enter valid positive numbers.");
      return;
    }
    onSubmit(cw, tw, goal);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "0 auto" }}>
      <label style={{ display: "block", marginBottom: 8 }}>
        Current Weight (kg)
        <input
          type="number"
          step="0.1"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          required
          min={1}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Target Weight (kg)
        <input
          type="number"
          step="0.1"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          required
          min={1}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Goal
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value as GoalOption)}
          required
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        >
          <option value="lose">Lose weight</option>
          <option value="gain">Gain weight</option>
          <option value="maintain">Maintain weight</option>
        </select>
      </label>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default WeightForm;
