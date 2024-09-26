import React from "react";

const RaindropEffect = () => {
  return (
    <>
      {/* Render multiple raindrop divs */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="raindrop"></div>
      ))}
    </>
  );
};

export default RaindropEffect;
