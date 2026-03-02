import React from "react";

const FeaturesCard = ({ feature }) => {
  return (
    <article className="feature-card dark">
      <h4 className="feature-title">{feature.title}</h4>
      <p className="feature-desc">{feature.description}</p>
    </article>
  );
};

export default FeaturesCard;
