import React from "react";
import CardComponent from "./CardComp";
import "../css/TaxFeatures.css";


// Import the CSS file for styling

const features = [
  {
    header: "Tax Calculator",
    items: [
      "Enter your income details",
      "Add deductions & exemptions",
      "Get an estimated tax liability",
      "Compare tax regimes instantly",
    ],
    buttonText: "Calculate Now",
    buttonLink: "/tax-calculator",
  },
  {
    header: "Budget Insights",
    items: [
      "Latest budget policy updates",
      "Impact on tax savings",
      "Personalized financial analysis",
      "Interactive graphical insights",
    ],
    buttonText: "View Insights",
    buttonLink: "/budget-report",
  },
  {
    header: "Budget Features",
    items: [
      "Know about the new Union Budget Features",
      "Filter the features that affect you",
      "Understand how the feature affects you",
    ],
    buttonText: "Discover Schemes",
    buttonLink: "/budget-features",
  },
  {
    header: "Interactive Tax Visualization",
    items: [
      "Visualize tax savings with interactive charts",
      "Compare Old vs. New tax regime easily",
      "Understand deductions with graphical representations",
    ],
    buttonText: "Explore Charts",
    
    buttonLink: "/dashboard-charts",
  },
  {
    header: "AI Chatbot Assistant",
    items: [
      "Instant tax queries answered",
      "Personalized suggestions",
      "24/7 tax support",
    ],
    buttonText: "Ask Now",
    buttonLink: "/ai-chatbot",
  },
  {
    header: "Tax Saving Strategies",
    items: [
      "Maximize savings with deductions",
      "Best tax-saving investment plans",
      "Expert financial tips",
    ],
    buttonText: "Explore Strategies",
    buttonLink: "/financial-tipse",
  },
];

export default function TaxFeatures() {
  return (
    <div className="container mt-5">
      <div className="row g-4">
        {features.map((feature, index) => (
          <CardComponent key={index} {...feature} buttonClass="button-green" />
        ))}
      </div>
    </div>
  );
}
