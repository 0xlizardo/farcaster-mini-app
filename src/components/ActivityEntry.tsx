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
<<<<<<< HEAD
    <form onSubmit={handleSubmit} style={{ 
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px"
    }}>
      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="activity" style={{ 
          display: "block",
          marginBottom: "8px",
          color: "#495057",
          fontWeight: "500"
        }}>
          Select Activity:
        </label>
        <select
          id="activity"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ced4da",
            backgroundColor: "#fff"
          }}
        >
          {activityOptions.map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="duration" style={{ 
          display: "block",
          marginBottom: "8px",
          color: "#495057",
          fontWeight: "500"
        }}>
          Duration (minutes):
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          min={1}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ced4da",
            backgroundColor: "#fff"
          }}
        />
      </div>

      <button 
        type="submit"
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
          fontSize: "1em",
          fontWeight: "500"
        }}
      >
=======
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
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
        Add Activity
      </button>
    </form>
  );
};

export default ActivityEntry;
