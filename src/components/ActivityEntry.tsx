import React, { useState } from "react";
import { ActivityItem } from "@types";

interface ActivityEntryProps {
  weightKg: number;
  onAdd: (activity: ActivityItem) => void;
}

const activityOptions = [
  { name: "Running (8 km/h)", met: 8 },
  { name: "Walking (5 km/h)", met: 3.8 },
  { name: "Cycling (moderate)", met: 6 },
  { name: "Swimming", met: 7 },
  { name: "Yoga", met: 2.5 },
  { name: "Strength Training", met: 6 }
];

const ActivityEntry: React.FC<ActivityEntryProps> = ({ weightKg, onAdd }) => {
  const [activityName, setActivityName] = useState(activityOptions[0].name);
  const [duration, setDuration] = useState<number>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = activityOptions.find((a) => a.name === activityName)!;
    // Calories burned = (MET × 3.5 × weightKg) / 200 × minutes
    const caloriesBurned =
      (found.met * 3.5 * weightKg) / 200 * duration;

    onAdd({
      id: Date.now(),
      name: activityName,
      duration,
      caloriesBurned: Math.round(caloriesBurned)
    });
    setDuration(30);
    setActivityName(activityOptions[0].name);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-5 rounded-lg mb-5"
    >
      <div className="mb-4">
        <label
          htmlFor="activity"
          className="block mb-2 text-gray-700 font-medium"
        >
          Select Activity:
        </label>
        <select
          id="activity"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 bg-white"
        >
          {activityOptions.map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="duration"
          className="block mb-2 text-gray-700 font-medium"
        >
          Duration (minutes):
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          min={1}
          required
          className="w-full p-2 rounded-md border border-gray-300 bg-white"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-md cursor-pointer w-full text-base font-medium"
      >
        Add Activity
      </button>
    </form>
  );
};

export default ActivityEntry;
