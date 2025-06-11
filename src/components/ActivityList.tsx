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
    return (
      <div className="text-center p-5 bg-gray-100 rounded-lg mt-4">
        <p className="text-gray-500 m-0">No activities logged yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {activities.map((act) => (
        <div
          key={act.id}
          className="bg-white rounded-lg p-3 mb-2 shadow flex justify-between items-center"
        >
          <div>
            <h4 className="m-0 mb-1 text-gray-800">{act.name}</h4>
            <div className="text-gray-500 text-sm">
              <span className="mr-3">⏱️ {act.duration} min</span>
              <span>🔥 {act.caloriesBurned} kcal burned</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(act.id)}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md cursor-pointer text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
