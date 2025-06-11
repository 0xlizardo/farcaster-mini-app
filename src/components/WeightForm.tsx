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
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-5 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        Enter Your Weight & Goal
      </h1>

      <div className="mb-4">
        <label
          htmlFor="currentWeight"
          className="block text-gray-700 font-medium mb-2"
        >
          Current Weight (kg):
        </label>
        <input
          type="number"
          id="currentWeight"
          value={currentWeightInput}
          onChange={(e) => setCurrentWeightInput(e.target.value)}
          placeholder="e.g. 75"
          min="1"
          step="0.1"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="targetWeight"
          className="block text-gray-700 font-medium mb-2"
        >
          Target Weight (kg):
        </label>
        <input
          type="number"
          id="targetWeight"
          value={targetWeightInput}
          onChange={(e) => setTargetWeightInput(e.target.value)}
          placeholder="e.g. 70"
          min="1"
          step="0.1"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="goal" className="block text-gray-700 font-medium mb-2">
          Select Your Goal:
        </label>
        <select
          id="goal"
          value={goalOption}
          onChange={(e) => setGoalOption(e.target.value as GoalOption)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="lose">Lose Weight</option>
          <option value="gain">Gain Weight</option>
          <option value="maintain">Maintain Weight</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default WeightForm;
