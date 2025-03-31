import React from 'react';
import './ComparisonTool.css';
import Navbar from '../../Components/Navbar'; 
import TaxComparisonGraph from './graph'; // Import the TaxComparisonChart component
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
///do smtg and get the mailid from userdatabase
const ComparisonTool = () => {
  const [taxData, setTaxData] = useState(null);
  const email = localStorage.getItem("userEmail"); // Replace with the actual user email from context or statelocalStorage.getItem("userEmail")||
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching tax data...");
        const response = await fetch(`http://localhost:5000/tax/${email}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tax data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Fetched tax data:", result.data);
        setTaxData(result.data);
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };
  
    fetchData();
  }, [email]);

  if (!taxData || !taxData.oldRegime || !taxData.newRegime) {
    return <p>Loading tax data...</p>;
  }
  
  const data = [
    {
      category: 'Total Income',
      oldRegime: taxData.oldRegime.totalIncome,
      newRegime: taxData.newRegime.totalIncome,
    },
    {
      category: 'Taxable Income',
      oldRegime: taxData.oldRegime.taxableIncome,
      newRegime: taxData.newRegime.taxableIncome,
    },
    {
      category: 'Tax Payable',
      oldRegime: taxData.oldRegime.taxPayable,
      newRegime: taxData.newRegime.taxPayable,
    },
    {
      category: 'Deduction',
      oldRegime: taxData.oldRegime.chapterVIA,
      newRegime: taxData.newRegime.chapterVIA,
    },
  ];

  return (
     <div>
          <Navbar />  {/* Navigation Bar */}
          
    <div className="comparison-page-container">
      <div className="comparison-container1">
        
        {/* New Tax Regime Section */}
        <h2 className="section-header">New Tax Regime</h2>
        <div className="comparison-grid new-regime">
          <div className="left-column">
            <div className="card merged-card" style={{ height: '100%' }}>
              <h3>Total Income</h3>
              <p>₹{taxData.newRegime.totalIncome.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Exempt Allowances</span>
                  <span>₹{taxData.newRegime.exemptAllowances.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Standard Deductions</span>
                  <span>₹{taxData.newRegime.standardDeductions.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Chapter VI A Deductions</span>
                  <span>₹{taxData.newRegime.chapterVIA.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="center-column">
            <div className="card large-card" style={{ height: '100%' }}>
              <h3>Tax Payable</h3>
              <p>₹{taxData.newRegime.taxPayable.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Income Tax</span>
                  <span>₹{taxData.newRegime.incomeTax.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Surcharge</span>
                  <span>₹{taxData.newRegime.surcharge.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Health and Education Cess</span>
                  <span>₹{taxData.newRegime.cess.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="card" style={{ height: '100%' }}>
              <h3>Taxable Income</h3>
              <p>₹{taxData.newRegime.taxableIncome.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Net Income After Tax</span>
                  <span>₹{taxData.newRegime.netIncomeAfterTax.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Effective Tax Rate</span>
                  <span>{taxData.newRegime.effectiveTaxRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Old Tax Regime Section */}
        <h2 className="section-header1">Old Tax Regime</h2>
        <div className="comparison-grid old-regime">
          <div className="left-column">
            <div className="card merged-card" style={{ height: '100%' }}>
              <h3>Total Income</h3>
              <p>₹{taxData.oldRegime.totalIncome.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Exempt Allowances</span>
                  <span>₹{taxData.oldRegime.exemptAllowances.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Standard Deductions</span>
                  <span>₹{taxData.oldRegime.standardDeductions.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Chapter VI A Deductions</span>
                  <span>₹{taxData.oldRegime.chapterVIA.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="center-column">
            <div className="card large-card" style={{ height: '100%' }}>
              <h3>Tax Payable</h3>
              <p>₹{taxData.oldRegime.taxPayable.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Income Tax</span>
                  <span>₹{taxData.oldRegime.incomeTax.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Surcharge</span>
                  <span>₹{taxData.oldRegime.surcharge.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Health and Education Cess</span>
                  <span>₹{taxData.oldRegime.cess.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="card" style={{ height: '100%' }}>
              <h3>Taxable Income</h3>
              <p>₹{taxData.oldRegime.taxableIncome.toLocaleString()}</p>
              <div className="deductions-list">
                <div className="deduction-item">
                  <span>Net Income After Tax</span>
                  <span>₹{taxData.oldRegime.netIncomeAfterTax.toLocaleString()}</span>
                </div>
                <div className="deduction-item">
                  <span>Effective Tax Rate</span>
                  <span>{taxData.oldRegime.effectiveTaxRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Graph Comparison */}
        <h2 className="section-header1">Old vs New Regime Comparison</h2>
        <div className="comparison-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} barGap={0} barCategoryGap="10%">
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
  formatter={(value, name) => {
    const formattedValue = `₹${Number(value).toLocaleString()}`;
    const customName = name === "Old Regime" ? "🟦 Old Regime" : "🟩 New Regime";
    return [formattedValue, customName];
  }} 
/>
  <Legend />
              <Bar dataKey="oldRegime" fill="#1B4F72" name="Old Regime" radius={[10, 10, 0, 0]} />
              <Bar dataKey="newRegime" fill="#50C878" name="New Regime" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
   
 {/* Tax Payable Graph */}
 <h2 className="section-header1">Tax Payable Comparison</h2>
        <TaxComparisonGraph oldTax={taxData.oldRegime.taxPayable} newTax={taxData.newRegime.taxPayable} />


         {/* Additional Cards Section */}
         <div className="additional-cards-container">
            <div className="info-card">
              <h3>Budget Report</h3>
              <p>
              A quick summary of your taxes and Union Budget schemes!📊💰
              </p>
              <button className="learn-more-btn" onClick={() => navigate("/budget-report")}>View Insights</button>
            </div>
            
            <div className="info-card">
              <h3>Personalised Tips</h3>
              <p>
              Simple and clever strategies to effectively boost your savings! 🚀💡
              </p>
              <button className="learn-more-btn" onClick={() => navigate("/financial-tipse")}>Explore Stratergies</button>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
};

export default ComparisonTool;