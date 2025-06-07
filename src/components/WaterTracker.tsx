import React, { useState } from "react";

const WaterTracker: React.FC = () => {
  const [cups, setCups] = useState<number>(0);

  const handleCupClick = (index: number) => {
    if (cups === index + 1) {
      setCups(index);
    } else {
      setCups(index + 1);
    }
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3>Did you drink water?</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "12px"
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleCupClick(i)}
            style={{
              width: "30px",
              height: "50px",
              border: "2px solid #007bff",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "background-color 0.3s",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* شبیه‌سازی سطح آب */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: i < cups ? "100%" : "0",
                backgroundColor: "#007bff",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                transition: "height 0.3s"
              }}
            />
          </div>
        ))}
      </div>
      <p>{cups} / 8 cups</p>
    </div>
  );
};

export default WaterTracker;
