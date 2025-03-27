import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Screens/Home';
import LoginPage from './Screens/LoginPage';
import FinancialTips from './Screens/financialTipsForm';  // Import FinancialTips Page
import FinancialTipsPage from './Screens/FinancialTipsPage';
import MultiStepForm from "./Screens/TaxCalculator/MultiStepForm";  // Import Tax Calculator
import ComparisonTool from "./Screens/TaxCalculator/ComparisonTool";
import BudgetReport from "./Screens/BudgetInsights/BudgetReport";
import Chatbot from "./Screens/AIchatbot/Chatbot";
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap for styling 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/financial-tips" element={<FinancialTips />} />  
          <Route path="/financial-tips/:email" element={<FinancialTipsPage />} /> 
          <Route path="/tax-calculator" element={<MultiStepForm />} /> 
          <Route path="/comparison" element={<ComparisonTool />} /> 
          <Route path="/budget-report" element={<BudgetReport />} /> 
          <Route path="/ai-chatbot" element={<Chatbot />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
