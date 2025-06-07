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
    <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
      <label htmlFor="activity">Activity:</label>
      <select
        id="activity"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
      >
        {activityOptions.map((opt) => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>

      <label htmlFor="duration">Duration (minutes):</label>
      <input
        id="duration"
        type="number"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
        min={1}
        required
      />

      <button type="submit" style={{ marginTop: "8px" }}>
        Add Activity
      </button>
    </form>
  );
};

export default ActivityEntry;
