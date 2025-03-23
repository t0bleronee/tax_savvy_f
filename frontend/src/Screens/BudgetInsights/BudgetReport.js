const React = require("react");
const { useState } = require("react");
const { motion } = require("framer-motion");
require("./BudgetReportc.css");

const professions = [
  "Agribusiness Entrepreneurs", "Agricultural Scientists", "Authors", "Banks",
  "Borrowers", "Businesses", "Children", "Community Workers", "Daily Wage Workers",
  "Dairy Farmers", "Economists", "Educators", "Entrepreneurs", "Exporters",
  "Farmers", "Female Workforce", "Fishermen", "General Public", "Healthcare Workers",
  "Industrial Workers", "Industry Professionals", "Innovators", "Investors",
  "Job Seekers", "Low-Income Individuals", "Manufacturers", "Mining Companies",
  "Policy Makers", "Publishers", "Researchers", "Retirees", "Rural Communities",
  "Rural Population", "Small Business Owners", "Students", "Teachers",
  "Technologists", "Textile Manufacturers", "Tourism Entrepreneurs", "Women",
  "Workers", "Workforce", "Working Population"
];

const ageGroups = ["0-18", "18–60", "60+", "All age groups"];

const BudgetReport = () => {
  const [profession, setProfession] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [reportData, setReportData] = useState({}); // ✅ Initialize as an empty object

  const handleSubmit = async () => {
    if (!profession || !ageGroup) {
      alert("Please select both profession and age group.");
      return;
    }

    setLoading(true);
    const userId = "67da54411a49c5b82e6b720d"; // Replace with actual user ID

    try {
      const response = await fetch(`http://localhost:5000/budgetrep/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profession, ageGroup, userId }),
      });

      if (!response.ok) throw new Error("Failed to fetch report");

      const data = await response.json();
      console.log("Fetched Combined Report:", data);

      setSummary(data.summary);
      setReportData({
        financialImpactFull: data.financialImpactReport || "No financial impact report available.",
        socialImpactFull: data.summary || "No AI summary available.",
        nationalImpactFull:
          "Government investments in tax compliance & automation promise smoother tax filing. " +
          "With the latest reforms, businesses will experience better compliance tools, " +
          "and individuals will see automated tax filing assistance through AI-driven platforms.",
        financialImpact: data.financialImpactReport?.split(" ").slice(0, 6).join(" ") + "..." || "No financial impact summary.",
        socialImpact: data.summary?.split(" ").slice(0, 6).join(" ") + "..." || "No AI summary available.",
        nationalImpact: "Government investments in tax compliance & automation...",
      });

    } catch (error) {
      console.error("Error fetching combined report:", error);
      setSummary("Error loading report.");
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
    <div className="tax-savvy-report">
    <motion.div
      className="report-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1>TaxSavvy: Your Personalized Budget Report</h1>
      <p className="report-subtitle">Select your Profession and Age Group to generate a personalized budget report.</p>

      {/* ✅ Profession Dropdown */}
      <div className="dropdown-container">
        <label>Profession:</label>
        <select className="custom-dropdown" value={profession} onChange={(e) => setProfession(e.target.value)}>
          <option value="">-- Select Profession --</option>
          {professions.map((prof) => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>
      </div>

      {/* ✅ Age Group Dropdown */}
      <div className="dropdown-container">
        <label>Age Group:</label>
        <select className="custom-dropdown" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">-- Select Age Group --</option>
          {ageGroups.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>

      <button className="generate-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </button>

      {/* ✅ Loading and Error Handling */}
      {loading && <p>Loading report...</p>}
      {!loading && summary && (
        <div className="impact-flow">
          {[
            { title: "💰 Financial Impact", shortText: reportData.financialImpact, fullText: reportData.financialImpactFull },
            { title: "🌍 Social Impact", shortText: reportData.socialImpact, fullText: reportData.socialImpactFull },
            { title: "🏛️ National Impact", shortText: reportData.nationalImpact, fullText: reportData.nationalImpactFull }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`impact-card ${expandedCards[index] ? "expanded" : ""}`}
              whileHover={{ scale: 1.03 }}
            >
              <h2>{item.title}</h2>
              <p>{expandedCards[index] ? item.fullText : item.shortText}</p>
              <button className="read-more-button" onClick={() => toggleExpand(index)}>
                {expandedCards[index] ? "🔼 Read Less" : "🔽 Read More"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div></div>
  );
};

export default BudgetReport;
