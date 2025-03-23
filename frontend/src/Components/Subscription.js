import React, { useState } from "react";
import "../css/subs.css"; // Import the CSS file

export default function SubscribeSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    occupation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Subscription successful! Stay tuned for tax and budget updates.");
    setFormData({ firstName: "", lastName: "", email: "", occupation: "" });
  };

  return (
    <div className="subscribe-container">
      {/* Left Section - Subscription Details */}
      <div className="subscribe-content">
        <h2>Subscribe for the Latest Tax & Budget Updates</h2>
        <ul>
          <li>📢 Stay informed about new tax regulations</li>
          <li>📊 Get updates on Union Budget changes</li>
          <li>💡 Exclusive financial insights & tax-saving tips</li>
        </ul>
      </div>

      {/* Right Section - Subscription Form */}
      <form className="subscribe-form" onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input type="text" name="occupation" placeholder="Occupation (e.g., Salaried, Business, Freelancer)" value={formData.occupation} onChange={handleChange} required />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}
