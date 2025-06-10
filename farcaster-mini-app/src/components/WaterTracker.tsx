import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ICE_CUBES = (
  <>
    <rect x="11" y="25" width="7" height="6" rx="2" fill="#e0f7fa" stroke="#b2ebf2" strokeWidth="0.8" />
    <rect x="20" y="29" width="6" height="5" rx="1.5" fill="#e0f7fa" stroke="#b2ebf2" strokeWidth="0.8" />
  </>
);

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
          gap: "12px",
          marginBottom: "12px"
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleCupClick(i)}
            style={{
              width: "40px",
              height: "60px",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "flex-end"
            }}
          >
            <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
              {/* Glass outline with more curvature */}
              <path
                d="M8 10 Q4 55 20 58 Q36 55 32 10 Q32 5 8 10 Z"
                fill="#fff"
                stroke="#007bff"
                strokeWidth="2.5"
                filter="url(#glassShadow)"
              />
              {/* Shine effect */}
              <path
                d="M13 15 Q12 35 18 40"
                stroke="#b3e5fc"
                strokeWidth="2"
                opacity="0.5"
                fill="none"
              />
              {/* Water fill - now fills the whole glass */}
              <motion.path
                d="M10 15 Q20 20 30 15 Q32 55 20 58 Q8 55 10 15 Z"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: i < cups ? 1 : 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{
                  transformOrigin: "20px 58px"
                }}
                fill="#2196f3"
                opacity="0.85"
              />
              {/* Two small ice cubes if filled */}
              {i < cups && ICE_CUBES}
              {/* Glass shadow filter */}
              <defs>
                <filter id="glassShadow" x="0" y="0" width="40" height="60">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#90caf9" />
                </filter>
              </defs>
            </svg>
          </div>
        ))}
      </div>
      <p>{cups} / 8 cups</p>
      {/* Celebration message below the water glasses */}
      <AnimatePresence>
        {cups === 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "10px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ff4081"
            }}
          >
            🎉 Great job!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaterTracker;
