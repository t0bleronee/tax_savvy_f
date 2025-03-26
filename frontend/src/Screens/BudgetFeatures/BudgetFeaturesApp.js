import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './BudgetFeaturesStyles.css';
import Navbar from '../../Components/Navbar'; 
import { useState, useEffect } from 'react';


// Helper: split text into paginated HTML lists
function paginateBulletList(text, itemsPerPage = 5) {
  const lines = text.split("\n").filter(line => line.trim() !== "");
  if (lines.length === 0) {
    return [`<ul><li>${text.trim()}</li></ul>`];
  }
  const pages = [];
  for (let i = 0; i < lines.length; i += itemsPerPage) {
    pages.push(
      `<ul>${lines.slice(i, i + itemsPerPage)
        .map(line => `<li>${line.trim()}</li>`)
        .join("")}</ul>`
    );
  }
  return pages;
}

// Sidebar component: contains profile, filters, tooltips, and dark mode toggle
function Sidebar({
  filters,
  profession,
  setProfession,
  ageGroup,
  setAgeGroup,
  location,
  setLocation,
  category,
  setCategory,
  showTip,
  tip,
  closeTip,
  darkMode,
  toggleDarkMode,
}) {
  return (
    
    <aside className="sidebar">
      <h2>📊 Budget Explorer</h2>
      <section className="profile">
        <h3>👤 Your Profile</h3>
        <label htmlFor="profession">What is your profession?</label>
        <select
          id="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        >
          <option value="all">All</option>
          {filters.profession.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor="age-group">Which age group do you belong to?</label>
        <select
          id="age-group"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
        >
          <option value="all">All</option>
          {filters.age.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>
      <section className="filters">
        <h3>📌 Location</h3>
        <label htmlFor="location">Filter by location:</label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="all">All</option>
          {filters.location.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>
      <section className="categories">
        <h3>📂 Budget Categories</h3>
        <label htmlFor="budget-category">Filter by category:</label>
        <select
          id="budget-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          {filters.category.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>
      <section className="tooltip-section">
        <div className="tooltip-category">
          <button
            className="tooltip-btn"
            onClick={() => showTip('tax')}
            aria-label="Tax Facts"
          >
            💰
          </button>
          <button
            className="tooltip-btn"
            onClick={() => showTip('education')}
            aria-label="Education Budget"
          >
            🎓
          </button>
          <button
            className="tooltip-btn"
            onClick={() => showTip('healthcare')}
            aria-label="Healthcare"
          >
            🏥
          </button>
        </div>
        {tip && (
          <div className="tooltip-box">
            <p>{tip.text}</p>
            <a href={tip.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
            <button onClick={closeTip} aria-label="Close tip">
              ✖
            </button>
          </div>
        )}
      </section>
      <section className="dark-mode-toggle-container">
        <label className="switch" aria-label="Toggle dark mode">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span>Dark Mode</span>
      </section>
    </aside>
  );
}

// FeatureList component: shows header and feature cards
function FeatureList({ features, loading, error, onFeatureClick }) {
  return (
    <main className="content">
      <header className="header">
        <h1>TaxSavvy Budget Explorer</h1>
        <p>Find relevant budget features based on your profession and age.</p>
      </header>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : null}
      <section id="budget-features">
        <h2 id="title1">Budget Features</h2>
        <div id="features-container" className="features-container">
          {features.length === 0 ? (
            <p className="no-results">
              No features found for selected filters.
            </p>
          ) : (
            features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                onClick={() => onFeatureClick(feature)}
              >
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <p>
                  <strong>Category:</strong> {feature.category}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

// FeatureModal component: shows modal with feature details
function FeatureModal({ feature, paginationData, setPaginationData, closeModal }) {
  const [activeAccordion, setActiveAccordion] = useState({
    explanation: true,
    affects: false,
  });

  const toggleAccordion = (section) => {
    setActiveAccordion((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const prevPage = (section) => {
    setPaginationData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        currentPage: Math.max(prev[section].currentPage - 1, 0),
      },
    }));
  };

  const nextPage = (section) => {
    setPaginationData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        currentPage: Math.min(
          prev[section].currentPage + 1,
          prev[section].pages.length - 1
        ),
      },
    }));
  };

  return (
    <div className="modal-overlay">
      {/* Add "active" to ensure CSS shows the modal */}
      <div className="modal active">
        <div className="modal-header">
          <h2>{feature.name}</h2>
          <button
            className="close-modal"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="accordion" id="accordion">
          {/* Explanation Section */}
          <div className={`accordion-item ${activeAccordion.explanation ? "active" : ""}`}>
            <div className="accordion-header" onClick={() => toggleAccordion("explanation")}>
              <h3>Explanation</h3>
              <i className="fas fa-chevron-down"></i>
            </div>
            {activeAccordion.explanation && (
              <div className="accordion-content">
                <div
                  className="section-content"
                  dangerouslySetInnerHTML={{
                    __html: paginationData.explanation.pages[paginationData.explanation.currentPage],
                  }}
                ></div>
                <div className="section-nav">
                  <button
                    className="section-prev"
                    onClick={() => prevPage("explanation")}
                    disabled={paginationData.explanation.currentPage === 0}
                  >
                    Prev
                  </button>
                  <span className="section-page-indicator">
                    Page {paginationData.explanation.currentPage + 1} of {paginationData.explanation.pages.length}
                  </span>
                  <button
                    className="section-next"
                    onClick={() => nextPage("explanation")}
                    disabled={paginationData.explanation.currentPage >= paginationData.explanation.pages.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* How It Affects You Section */}
          <div className={`accordion-item ${activeAccordion.affects ? "active" : ""}`}>
            <div className="accordion-header" onClick={() => toggleAccordion("affects")}>
              <h3>How It Affects You</h3>
              <i className="fas fa-chevron-down"></i>
            </div>
            {activeAccordion.affects && (
              <div className="accordion-content">
                <div
                  className="section-content"
                  dangerouslySetInnerHTML={{
                    __html: paginationData.affects.pages[paginationData.affects.currentPage],
                  }}
                ></div>
                <div className="section-nav">
                  <button
                    className="section-prev"
                    onClick={() => prevPage("affects")}
                    disabled={paginationData.affects.currentPage === 0}
                  >
                    Prev
                  </button>
                  <span className="section-page-indicator">
                    Page {paginationData.affects.currentPage + 1} of {paginationData.affects.pages.length}
                  </span>
                  <button
                    className="section-next"
                    onClick={() => nextPage("affects")}
                    disabled={paginationData.affects.currentPage >= paginationData.affects.pages.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ********************************************************************
// The following is your original "Main App component" renamed as HomePage
// ********************************************************************
function BudgetFeaturesApp() {
  // Filter states
  const [profession, setProfession] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState("all");

  // Other states
  const [tips, setTips] = useState({});
  const [tip, setTip] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: [],
    age: [],
    profession: [],
    category: [],
  });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginationData, setPaginationData] = useState({
    explanation: { pages: [""], currentPage: 0 },
    affects: { pages: [""], currentPage: 0 },
  });

  // Fetch tips from API
  useEffect(() => {
    fetch("http://localhost:3000/api/tips")
      .then((response) => response.json())
      .then((data) => setTips(data))
      .catch((error) => console.error("❌ Error fetching tips:", error));
  }, []);

  // Retrieve dark mode setting from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class and persist setting
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
  }, [darkMode]);

  // Fetch features when filters change
  const fetchFeatures = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (profession !== "all") params.append("profession", profession);
    if (ageGroup !== "all") params.append("age", ageGroup);
    if (location !== "all") params.append("location", location);
    if (category !== "all") params.append("category", category);
    fetch(`http://localhost:3000/features?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching features:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeatures();
  }, [profession, ageGroup, location, category]);

  // Fetch filter options dynamically
  useEffect(() => {
    ["location", "age", "profession", "category"].forEach((type) => {
      fetch(`http://localhost:3000/filters/${type}`)
        .then((res) => res.json())
        .then((data) => {
          if (type === "location") {
            data = data.filter(
              (item) =>
                ![
                  "Industrial Zones",
                  "Nationwide",
                  "Port Cities",
                  "Urban & Rural Areas",
                ].includes(item)
            );
          }
          setFilters((prev) => ({ ...prev, [type]: data }));
        })
        .catch((error) =>
          console.error(`❌ Error fetching ${type} options:`, error)
        );
    });
  }, []);

  // --------------------------------------------------------------------
  // The following is your nested accordion demo component, renamed as AccordionDemo
  // --------------------------------------------------------------------
  const AccordionDemo = () => {
    const [openAccordion, setOpenAccordion] = useState(null);
  
    const toggleAccordion = (index) => {
      setOpenAccordion(openAccordion === index ? null : index);
    };
  
    return (
      <div className="accordion-container">
        <div className={`accordion-item ${openAccordion === 1 ? 'active' : ''}`}>
          <div className="accordion-header" onClick={() => toggleAccordion(1)}>
            Section 1 {openAccordion === 1 ? '▲' : '▼'}
          </div>
          {openAccordion === 1 && <div className="accordion-content">Content for section 1</div>}
        </div>
  
        <div className={`accordion-item ${openAccordion === 2 ? 'active' : ''}`}>
          <div className="accordion-header" onClick={() => toggleAccordion(2)}>
            Section 2 {openAccordion === 2 ? '▲' : '▼'}
          </div>
          {openAccordion === 2 && <div className="accordion-content">Content for section 2</div>}
        </div>
      </div>
    );
  };

  const openModal = (feature) => {
    console.log("openModal called with feature:", feature);
  
    // Ensure we have a safe string to work with
    const explanationText = feature.feature_detailed_explanation || "";
    let explanationData;
    try {
      explanationData = JSON.parse(explanationText);
    } catch (error) {
      console.error("JSON parse error:", error);
      explanationData = { explanation: explanationText, affects: "" };
    }
    console.log("Parsed explanationData:", explanationData);
  
    setPaginationData({
      explanation: {
        pages: paginateBulletList(explanationData.explanation || ""),
        currentPage: 0,
      },
      affects: {
        pages: paginateBulletList(explanationData.affects || ""),
        currentPage: 0,
      },
    });
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };
  
  function paginateBulletList(text, itemsPerPage = 5) {
    const safeText = text || "";
    const lines = safeText.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      return [`<ul><li>${safeText.trim()}</li></ul>`];
    }
    const pages = [];
    for (let i = 0; i < lines.length; i += itemsPerPage) {
      pages.push(
        `<ul>${lines
          .slice(i, i + itemsPerPage)
          .map((line) => `<li>${line.trim()}</li>`)
          .join("")}</ul>`
      );
    }
    return pages;
  }
  
  useEffect(() => {
    console.log("Modal state changed:", isModalOpen, selectedFeature);
  }, [isModalOpen, selectedFeature]);
  
  // Show tooltip with a random tip for the given category
  const showTip = (type) => {
    if (!tips[type] || tips[type].length === 0) {
      console.error("❌ No tips found for category:", type);
      return;
    }
    setTip(tips[type][Math.floor(Math.random() * tips[type].length)]);
  };
  
  // Close tooltip
  const closeTip = () => {
    setTip(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Close modal
  const closeModal = () => {
    setSelectedFeature(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <Sidebar
        filters={filters}
        profession={profession}
        setProfession={setProfession}
        ageGroup={ageGroup}
        setAgeGroup={setAgeGroup}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
        showTip={showTip}
        tip={tip}
        closeTip={closeTip}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <FeatureList
        features={features}
        loading={loading}
        error={error}
        onFeatureClick={openModal}
      />
      {isModalOpen && selectedFeature && (
        <FeatureModal
          feature={selectedFeature}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default BudgetFeaturesApp;