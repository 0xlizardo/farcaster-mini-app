import React from "react";
import { MealProgress as MealProgressType } from "@types";

interface MealProgressProps {
  progress: MealProgressType;
}

const MealProgress: React.FC<MealProgressProps> = ({ progress }) => {
  const { mealType, target, consumed, remaining } = progress;
  const percentage = (consumed / target) * 100;

  const getMealEmoji = (type: string) => {
    switch (type) {
      case "breakfast":
        return "🍳";
      case "lunch":
        return "🍱";
      case "dinner":
        return "🍽️";
      case "snack":
        return "🍎";
      default:
        return "🍴";
    }
  };

  const getMealName = (type: string) => {
    switch (type) {
      case "breakfast":
        return "Breakfast";
      case "lunch":
        return "Lunch";
      case "dinner":
        return "Dinner";
      case "snack":
        return "Snack";
      default:
        return type;
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case "breakfast":
        return "#FFE4B5"; // Light orange
      case "lunch":
        return "#E6F3FF"; // Light blue
      case "dinner":
        return "#F0E6FF"; // Light purple
      case "snack":
        return "#E6FFE6"; // Light green
      default:
        return "#f8f9fa";
    }
  };

  return (
    <div
      style={{
        backgroundColor: getMealColor(mealType),
        borderRadius: "19px",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "192px",
        height: "192px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "10px",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          <span style={{ fontSize: "34px" }}>{getMealEmoji(mealType)}</span>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "26px", color: "#2c3e50" }}>
            {getMealName(mealType)}
          </h3>
          <p style={{ margin: "0", fontSize: "22px", color: "#666" }}>
            Target: {target} cal
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "5px" }}>
        <div
          style={{
            width: "100%",
            height: "14px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "7px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: percentage > 100 ? "#dc3545" : "#28a745",
              transition: "width 0.3s ease",
              borderRadius: "7px"
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "5px",
          backgroundColor: "white",
          padding: "5px",
          borderRadius: "7px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "19px", color: "#666", marginBottom: "0" }}>
            Consumed
          </div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50" }}>
            {consumed}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "19px", color: "#666", marginBottom: "0" }}>
            {remaining >= 0 ? "Remaining" : "Excess"}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: remaining < 0 ? "#dc3545" : "#28a745"
            }}
          >
            {remaining >= 0 ? remaining : -remaining}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealProgress; 