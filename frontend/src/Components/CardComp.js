import React from "react";
import "../css/cardcomp.css"; // Import the CSS for styling

export default function CardComponent({ header, emoji, items, buttonText, buttonLink }) {
  return (
    <div className="col-md-4">
      <div className="custom-card">
        <div className="card-header">{header}</div>
        <div className="card-emoji">{emoji}</div>
        <div className="card-body">
          <ul className="card-items">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <a href={buttonLink} className="custom-btn">
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
