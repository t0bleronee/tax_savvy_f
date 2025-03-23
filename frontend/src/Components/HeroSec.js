import React from 'react';
import './HeroSec.css'; // Keep it for other styles

export default function HeroSection() {
  return (
    <div className="hero-section text-white text-center">
       

      <img 
        src="/Assets/hero_img.jpg" 
        alt="Hero" 
        className="img-fluid w-100" 
        style={{ height: '80vh', objectFit: 'cover' }} 
      />
      <div className="hero-content position-absolute top-50 start-50 translate-middle text-center">
        <h1 className="display-4 fw-bold">
          We Help Individuals with Smart Tax Solutions
        </h1>
        <p className="lead">
          Whether you're a salaried individual or a business owner, our platform simplifies tax calculations and helps you make informed decisions.
        </p>
        <a href="#" className="btn btn-success btn-lg">Get Started</a>
      </div>
    </div>
  );
}
