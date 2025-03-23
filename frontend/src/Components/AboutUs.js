import React from "react";
import "../css/aboutus.css"; // Make sure this CSS file is linked

const AboutUs = () => {
  return (
    <section className="about-us-container">
      <div className="about-us-image">
        <img src="/Assets/money_glass.jpg" alt="About TaxSavvy" />
      </div>
      <div className="about-us-content">
        <h2>About Us</h2>
        <p>
          TaxSavvy is a web-based platform designed to simplify the tax filing 
          process for individuals. Our goal is to make tax-related information 
          accessible, interactive, and actionable.
        </p>
        <p>
          With personalized tax calculations, budget insights, and financial 
          impact analysis, users can compare tax regimes, explore potential 
          savings, and get real-time assistance from our AI-powered chatbot. 
          We help individuals make informed financial decisions with ease.
        </p>
        <p>
          Our platform offers an intuitive dashboard, a smart tax calculator, 
          personalized budget reports, and actionable financial advice to ensure 
          users maximize their tax benefits effortlessly.
        </p>
        <button className="more-about-btn">More About Us</button>
      </div>
    </section>
  );
};

export default AboutUs;
