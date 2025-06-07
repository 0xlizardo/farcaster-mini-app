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
  );
};

export default ActivityList;
