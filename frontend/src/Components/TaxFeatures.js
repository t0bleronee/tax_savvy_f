import React from "react";
import CardComponent from "./CardComp";

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
    buttonLink: "/tax-calculator", // Redirects to Tax Calculator Page
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
    buttonLink: "/budget-report", // Redirects to Budget Report Page
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
    header: "Smart Tax Filing",
    items: [
      "Step-by-step guided filing",
      "Auto-fetch tax documents",
      "Minimize tax errors",
    ],
    buttonText: "File Now",
    buttonLink: "/dashboard-charts", // Redirects to Dashboard Page
  },
  {
    header: "AI Chatbot Assistant",
    items: [
      "Instant tax queries answered",
      "Personalized suggestions",
      "24/7 tax support",
    ],
    buttonText: "Ask Now",
    buttonLink: "/ai-chatbot", // Redirects to AI Chatbot Page
  },
  {
    header: "Tax Saving Strategies",
    items: [
      "Maximize savings with deductions",
      "Best tax-saving investment plans",
      "Expert financial tips",
    ],
    buttonText: "Explore Strategies",
    buttonLink: "/financial-tips", // Redirects to Financial Tips Page
  },
];

export default function TaxFeatures() {
  return (
    <div className="container mt-5">
      <div className="row g-4">
        {features.map((feature, index) => (
          <CardComponent key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}