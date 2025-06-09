<<<<<<< HEAD
=======
// src/components/WeightForm.tsx
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
import React, { useState } from "react";
import { GoalOption } from "@types";

interface WeightFormProps {
<<<<<<< HEAD
  onSubmit: (currentWeight: number, targetWeight: number, goal: GoalOption) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onSubmit }) => {
  const [currentWeightInput, setCurrentWeightInput] = useState<string>("");
  const [targetWeightInput, setTargetWeightInput] = useState<string>("");
  const [goalOption, setGoalOption] = useState<GoalOption>("maintain");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cw = parseFloat(currentWeightInput);
    const tw = parseFloat(targetWeightInput);

    if (isNaN(cw) || isNaN(tw) || cw <= 0 || tw <= 0) {
      alert("Please enter valid numbers for current and target weight.");
      return;
    }

    onSubmit(cw, tw, goalOption);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter Your Weight & Goal</h1>

      <label htmlFor="currentWeight">Current Weight (kg):</label>
      <input
        type="number"
        id="currentWeight"
        value={currentWeightInput}
        onChange={(e) => setCurrentWeightInput(e.target.value)}
        placeholder="e.g. 75"
        min="1"
        step="0.1"
        required
      />

      <label htmlFor="targetWeight">Target Weight (kg):</label>
      <input
        type="number"
        id="targetWeight"
        value={targetWeightInput}
        onChange={(e) => setTargetWeightInput(e.target.value)}
        placeholder="e.g. 70"
        min="1"
        step="0.1"
        required
      />

      <label htmlFor="goal">Select Your Goal:</label>
      <select
        id="goal"
        value={goalOption}
        onChange={(e) => setGoalOption(e.target.value as GoalOption)}
      >
        <option value="lose">Lose Weight</option>
        <option value="gain">Gain Weight</option>
        <option value="maintain">Maintain Weight</option>
      </select>

      <button type="submit">Submit</button>
=======
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
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
    </form>
  );
};

export default WeightForm;
