import React, { useState } from "react";
import "./MultiStepForm.css";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  // State to store form data
  const [formData, setFormData] = useState({
    age: "",
    salary: "",
    interestIncome: "",
    rentalIncome: "",
    otherIncome: "",
    exemptAllowances: "",
    homeLoanInterestSelf: "",
    homeLoanInterestLetOut: "",
    digitalAssetsIncome: "",
    deductions80C: "",
    medicalInsurance80D: "",
    npsEmployee80CCD: "",
    npsEmployer80CCD2: "",
    interestFromDeposits80TTA: "",
    homeLoanInterest80EEA: "",
    donations80G: "",
    otherDeductions: "",
  });


  const goToStep = (stepNumber) => setStep(stepNumber);

  const navigate = useNavigate();
// Handle input changes without sanitizing directly
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
const sanitizeNumber = (value) => {
  return value !== "" && value !== null ? parseFloat(value) : undefined;
};

// Handle form submission with sanitization
const handleSubmit = async () => {
  try {
    // Sanitize all numerical values before sending
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, sanitizeNumber(value)])
    );

   const email = localStorage.getItem("userEmail");
 
   const method = "POST";
   const url = "http://localhost:5000/tax/save";
// Ensure email is included in the request body
const requestData = {
 email,  // Add email field
 ...sanitizedData,  // Spread the sanitized data
};
   const response = await fetch(url, {
     method,
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(requestData), // Send sanitized data to backend
   });

   if (!response.ok) {
     throw new Error("Network response was not ok");
   }

   const result = await response.json();
 
   // Store the result in localStorage and navigate to the results page
   localStorage.setItem("taxResult", JSON.stringify(result));
   navigate("/comparison");
 } catch (error) {
   console.error("Error submitting form:", error);
   alert("Error calculating tax. Please try again.");
 }
};

  return (
           <div>  <Navbar />  {/* Navigation Bar */}
              
<div className="app-container">
<h1 className="calculator-title">Income Tax Calculator</h1>

    <div className="form-container">
      
      <div className="form-content">
        {/* Tabs Navigation */}
        <div className="tab-header">
          <span className={step === 1 ? "active" : ""} onClick={() => goToStep(1)}>
            General
          </span>
          <span className={step === 2 ? "active" : ""} onClick={() => goToStep(2)}>
            Income Details
          </span>
          <span className={step === 3 ? "active" : ""} onClick={() => goToStep(3)}>
            Deductions
          </span>
        </div>

        {/* Step 1 - Basic Details */}
        {step === 1 && (
          <div className="form-step basic-details">
            <div className="two-column">
              <div className="financialYear">
                <label htmlFor="financialYear">Financial Year</label>
                <select
                  id="financialYear"
                  name="financialYear"
                >
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
              <div>
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter Age"
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value >= 0 && value <= 100) {
                      handleInputChange(e);
                    }
                  }}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="bottom-right">
              <button onClick={() => goToStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2 - Income Details */}
        {step === 2 && (
          <div className="form-step two-column">
            <div>
              <label>Income from Salary</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter Amount"
                value={formData.salary}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Income from Interest</label>
              <input
                type="number"
                name="interestIncome"
                placeholder="Enter Amount"
                value={formData.interestIncome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
            
              />

              <label>Rental Income Received</label>
              <input
                type="number"
                name="rentalIncome"
                placeholder="Enter Amount"
                value={formData.rentalIncome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Other Income</label>
              <input
                type="number"
                name="otherIncome"
                placeholder="Enter Amount"
                value={formData.otherIncome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />
            </div>

            <div>
              <label>Exempt Allowances</label>
              <input
                type="number"
                name="exemptAllowances"
                placeholder="Enter Amount"
                value={formData.exemptAllowances}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Interest on Home Loan - Self Occupied</label>
              <input
                type="number"
                name="homeLoanInterestSelf"
                placeholder="Enter Amount"
                value={formData.homeLoanInterestSelf}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Interest on Home Loan - Let Out</label>
              <input
                type="number"
                name="homeLoanInterestLetOut"
                placeholder="Enter Amount"
                value={formData.homeLoanInterestLetOut}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Income from Digital Assets</label>
              <input
                type="number"
                name="digitalAssetsIncome"
                placeholder="Enter Amount"
                value={formData.digitalAssetsIncome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />
            </div>

            <div className="bottom-left">
              <button onClick={() => goToStep(1)}>← Previous</button>
            </div>

            <div className="bottom-right">
              <button onClick={() => goToStep(3)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 - Deductions */}
        {step === 3 && (
          <div className="form-step two-column">
            <div>
              <label>Basic Deductions - 80C</label>
              <input
                type="number"
                name="deductions80C"
                placeholder="Enter Amount"
                value={formData.deductions80C}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Medical Insurance - 80D</label>
              <input
                type="number"
                name="medicalInsurance80D"
                placeholder="Enter Amount"
                value={formData.medicalInsurance80D}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Employee’s Contribution to NPS - 80CCD</label>
              <input
                type="number"
                name="npsEmployee80CCD"
                placeholder="Enter Amount"
                value={formData.npsEmployee80CCD}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Employer’s Contribution to NPS - 80CCD(2)</label>
              <input
                type="number"
                name="npsEmployer80CCD2"
                placeholder="Enter Amount"
                value={formData.npsEmployer80CCD2}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />
            </div>

            <div>
              <label>Interest from Deposits - 80TTA</label>
              <input
                type="number"
                name="interestFromDeposits80TTA"
                placeholder="Enter Amount"
                value={formData.interestFromDeposits80TTA}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Interest on Housing Loan - 80EEA</label>
              <input
                type="number"
                name="homeLoanInterest80EEA"
                placeholder="Enter Amount"
                value={formData.homeLoanInterest80EEA}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Donations to Charity - 80G</label>
              <input
                type="number"
                name="donations80G"
                placeholder="Enter Amount"
                value={formData.donations80G}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />

              <label>Any Other Deduction</label>
              <input
                type="number"
                name="otherDeductions"
                placeholder="Enter Amount"
                value={formData.otherDeductions}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Allows empty input and positive numbers including 0
                    handleInputChange(e);
                  }
                }}
                min="0"
              />
            </div>

            <div className="bottom-left">
              <button onClick={() => goToStep(2)}>← Previous</button>
            </div>

            <div className="bottom-right">
  <button 
    onClick={() => {
      if (!formData.age) {
        alert("Please enter your age.");
      } else {
        handleSubmit();
      }
    }}
  >
    Calculate
  </button>
</div>
          </div>
        )}
      </div>
    </div></div></div> 
  );
};

export default MultiStepForm;