import React, { useState } from "react";

const TOTAL_CUPS = 8;

const IceCube: React.FC<{ top: string; left: string }> = ({ top, left }) => (
  <div
    className="absolute w-2 h-2 bg-white bg-opacity-80 rounded-sm transform rotate-45 z-10"
    style={{ top, left }}
  />
);

const WaterTracker: React.FC = () => {
  const [cups, setCups] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const handleCupClick = (index: number) => {
    const newCups = cups === index + 1 ? index : index + 1;
    setCups(newCups);
    setShowCelebration(newCups === TOTAL_CUPS);
  };

  return (
    <div className="mt-5 text-center relative">
      <h3 className="text-lg font-semibold mb-3">Stay Hydrated!</h3>
      <div className="flex justify-center gap-2 mb-3 relative">
        {Array.from({ length: TOTAL_CUPS }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleCupClick(i)}
            className="w-8 h-12 border-2 border-blue-500 rounded-b-lg rounded-t-sm bg-white cursor-pointer transition-all duration-300 relative overflow-hidden"
          >
            {/* Water level */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b-lg transition-all duration-300"
              style={{ height: i < cups ? "100%" : "0" }}
            />
            {/* Ice cubes */}
            {i < cups && (
              <>
                <IceCube top="20%" left="30%" />
                <IceCube top="40%" left="60%" />
              </>
            )}
          </div>
        ))}
        {showCelebration && (
          <div className="absolute left-full bottom-0 ml-4 flex items-center animate-celebrate">
            <span className="text-3xl">🎉</span>
          </div>
        )}
      </div>
      <p className="text-gray-700">
        {cups} / {TOTAL_CUPS} cups
      </p>
    </div>
  );
};

export default WaterTracker;
