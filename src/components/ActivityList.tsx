import React from "react";
import { ActivityItem } from "@types";

interface ActivityListProps {
  activities: ActivityItem[];
  onRemove: (id: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onRemove
}) => {
  if (activities.length === 0) {
<<<<<<< HEAD
    return (
      <div style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        marginTop: "16px"
      }}>
        <p style={{ color: "#6c757d", margin: 0 }}>No activities logged yet.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px" }}>
      {activities.map((act) => (
        <div
          key={act.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 4px 0", color: "#212529" }}>{act.name}</h4>
            <div style={{ color: "#6c757d", fontSize: "0.9em" }}>
              <span style={{ marginRight: "12px" }}>⏱️ {act.duration} min</span>
              <span>🔥 {act.caloriesBurned} kcal burned</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(act.id)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9em"
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
=======
    return <p>No activities logged.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
      {activities.map((act) => (
        <li
          key={act.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "4px 0",
            borderBottom: "1px solid #eee"
          }}
        >
          <span>
            {act.name} — {act.duration} min — {act.caloriesBurned} kcal burned
          </span>
          <button onClick={() => onRemove(act.id)}>Remove</button>
        </li>
      ))}
    </ul>
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
  );
};

export default ActivityList;
