import React, { useState } from "react";

const WaterTracker: React.FC = () => {
  const [cups, setCups] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const TOTAL_CUPS = 8;

  const handleCupClick = (index: number) => {
    if (cups === index + 1) {
      setCups(index);
      setShowCelebration(false);
    } else {
      setCups(index + 1);
      if (index + 1 === TOTAL_CUPS) {
        setShowCelebration(true);
      }
    }
  };

  // Ice cube component
  const IceCube: React.FC<{ top: number; left: number }> = ({ top, left }) => (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        width: "8px",
        height: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "2px",
        transform: "rotate(45deg)",
        zIndex: 2
      }}
    />
  );

  return (
    <div style={{ marginTop: "20px", textAlign: "center", position: "relative" }}>
      <h3>Did you drink water?</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "12px",
          position: "relative"
        }}
      >
        {Array.from({ length: TOTAL_CUPS }).map((_, i) => (
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
              transition: "all 0.3s",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Water level */}
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
            {/* Ice cubes */}
            {i < cups && (
              <>
                <IceCube top={20} left={30} />
                <IceCube top={40} left={60} />
              </>
            )}
          </div>
        ))}
        {/* Celebration animation: exactly beside and below the glasses */}
        {showCelebration && (
          <div
            style={{
              position: "absolute",
              left: `100%`,
              bottom: "-10px",
              marginLeft: "16px",
              display: "flex",
              alignItems: "center",
              animation: "celebrate 1s ease-in-out infinite"
            }}
          >
            <span style={{ fontSize: 28 }}>🎉 🎊 🎈</span>
          </div>
        )}
      </div>
      <p>{cups} / {TOTAL_CUPS} cups</p>
      <style>
        {`
          @keyframes celebrate {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default WaterTracker;
