// src/components/WaterTracker.tsx
import React, { useState, useEffect } from "react";

interface WaterTrackerProps {
  fid: string;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ fid }) => {
  const [cups, setCups] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/water?fid=${fid}`)
      .then((r) => r.json())
      .then((d) => setCups(d.cups))
      .catch(console.error);
  }, [fid]);

  const handleCupClick = (i: number) => {
    const newCount = cups === i + 1 ? i : i + 1;
    fetch(`/api/water?fid=${fid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cups: newCount })
    }).catch(console.error);
    setCups(newCount);
  };

  return (
    <div style={{ marginTop: 20, textAlign: "center" }}>
      <h3>Did you drink water?</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleCupClick(i)}
            style={{
              width: 30,
              height: 50,
              border: "2px solid #007bff",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer"
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: i < cups ? "100%" : "0",
                backgroundColor: "#007bff",
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
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
