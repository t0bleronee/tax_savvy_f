import React, { useState } from "react";
import { motion } from "framer-motion";
import "./BudgetReportc.css";
import Navbar from '../../Components/Navbar'; 
const professions = ["Agribusiness Entrepreneurs", "Agricultural Scientists", "Authors", "Banks", "Borrowers", "Businesses", "Children", "Community Workers", "Daily Wage Workers", "Dairy Farmers", "Economists", "Educators", "Entrepreneurs", "Exporters", "Farmers", "Female Workforce", "Fishermen", "General Public", "Healthcare Workers", "Industrial Workers", "Industry Professionals", "Innovators", "Investors", "Job Seekers", "Low-Income Individuals", "Manufacturers", "Mining Companies", "Policy Makers", "Publishers", "Researchers", "Retirees", "Rural Communities", "Rural Population", "Small Business Owners", "Students", "Teachers", "Technologists", "Textile Manufacturers", "Tourism Entrepreneurs", "Women", "Workers", "Workforce", "Working Population"];

const ageGroups = ["0-18", "18–60", "60+", "All age groups"];

const BudgetReport = () => {
  const [profession, setProfession] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  const handleSubmit = async () => {
    if (!profession || !ageGroup) {
      alert("Please select both profession and age group.");
      return;
    }

    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail")
      console.log("Stored Email:", email);
              const response = await fetch(`http://localhost:5000/api/fetch-features?profession=${profession}&ageGroup=${ageGroup}&email=${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      console.log("Fetched Data:", data);

      const getShortSummary = (text) => {
        if (!text) return "No summary available.";
        const words = text.split(" ");
        return words.length > 6 ? words.slice(0, 6).join(" ") + "..." : text;
      };

      setReportData({
        financialImpactFull: data?.financialImpactReport || "No financial impact report available.",
        socialImpactFull: data?.summary || "No AI summary available.",
        nationalImpactFull:  "The Union Budget 2025 focuses on making India self-reliant and developed by improving key aspects of life:\n\n" +
        "Zero Poverty & Jobs: New financial schemes and employment programs to uplift low-income groups.\n" +
        "Quality Education: Better schools, digital learning, and skill training for all.\n" +
        "Affordable Healthcare: Expanded medical facilities and cancer care centers for easy access to treatment.\n" +
        "Skilled Workforce & Employment: Training programs and business support to boost job opportunities.\n" +
        "Women’s Economic Empowerment: Policies to increase women’s workforce participation.\n" +
        "Stronger Agriculture: Modern farming support to make India a global food leader.\n" +
        "Infrastructure & Innovation: Major investments in transport, energy, and technology for a future-ready India.\n" +
        "Boosting Exports & Businesses: Support for startups, MSMEs, and global trade growth.\n\n" +
        "This budget builds a stronger economy with better education, jobs, healthcare, and opportunities for all.",
      financialImpact: getShortSummary(data.financialImpactReport),
        socialImpact: getShortSummary(data.summary),
        nationalImpact: "The Union Budget 2025 focuses on making India self-reliant ... " ,
   
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
     <div>
              <Navbar />  {/* Navigation Bar */}
    <div className="tax-savvy-report">
    <motion.div className="report-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <h1>TaxSavvy: Your Personalized Budget Report</h1>
      <p className="report-subtitle">Select your Profession and Age Group to generate a personalized budget report.</p>

      <div className="dropdown-container">
        <label>Profession:</label>
        <select className="custom-dropdown" value={profession} onChange={(e) => setProfession(e.target.value)}>
          <option value="">-- Select Profession --</option>
          {professions.map((prof) => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label>Age Group:</label>
        <select className="custom-dropdown" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">-- Select Age Group --</option>
          {ageGroups.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>

      <button className="generate-btn" onClick={handleSubmit}>Generate Report</button>

      {reportData && (
        <div className="impact-flow">
          {[ 
            { title: "💰 Financial Impact", shortText: reportData.financialImpact, fullText: reportData.financialImpactFull },
            { title: "🌍 Social Impact", shortText: reportData.socialImpact, fullText: reportData.socialImpactFull },
            { title: "🏛️ National Impact", shortText: reportData.nationalImpact, fullText: reportData.nationalImpactFull }
          ].map((item, index) => (
            <motion.div key={index} className={`impact-card ${expandedCards[index] ? "expanded" : ""}`} whileHover={{ scale: 1.03 }}>
              <h2>{item.title}</h2>
              <p>{expandedCards[index] ? item.fullText : item.shortText}</p>
              <button className="read-more-button" onClick={() => toggleExpand(index)}>
                {expandedCards[index] ? "🔼 Read Less" : "🔽 Read More"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div></div></div>
  );
};

export default BudgetReport;
