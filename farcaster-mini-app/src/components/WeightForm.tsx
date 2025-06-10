import React, { useState } from "react";
import { GoalOption } from "@types";

interface WeightFormProps {
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
    </form>
  );
};

export default WeightForm;
