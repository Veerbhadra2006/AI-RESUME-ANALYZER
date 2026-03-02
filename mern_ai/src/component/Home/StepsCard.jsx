import React from "react";

const StepsCard = ({ step, index }) => {
  return (
    <div className="step-card dark">
      <p className="step-label">Step {index + 1}</p>
      <h4 className="step-title">{step.title}</h4>
      <p className="step-detail">{step.detail}</p>
    </div>
  );
};

export default StepsCard;
