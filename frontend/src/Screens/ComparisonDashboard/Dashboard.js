
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import './Dashboard.css'; // Assuming you have a CSS file for styling
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);
const Dashboard = () => {
  const [income, setIncome] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState('');
  const fetchTaxComparison = async (income) => {
    try {
      const response = await axios.get(`http://localhost:5000/taxc/${income}`);
      setComparisonData(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    }
  };

  const handleIncomeChange = (e) => {
    setIncome(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (income <= 0 || isNaN(income)) {
      setError('Please enter a valid income greater than 0.');
    } else {
      fetchTaxComparison(income);
    }
  };

  const chartData = comparisonData ? {
    labels: ['Old Tax Regime', 'New Tax Regime'],
    datasets: [
      {
        label: 'Tax Difference (Old vs New Regime)',
        data: [comparisonData.oldTax.totalTax, comparisonData.newTax.totalTax],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      }
    ]
  } : {};

  return (
    <div>
      <Navbar />
    
 
    <div className="dashboard-container">
      <h1 className="dashboard-heading">TAX COMPARISON</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <input
          type="number"
          value={income}
          onChange={handleIncomeChange}
          placeholder="Enter your income"
          required
          className="income-input"
        />
        <button type="submit" className="submit-btn">Compare Tax Regimes</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {comparisonData && (
        <div className="summary-container">
          <div className="details-container">
            <h2>Tax Comparison Summary</h2>
            <p><strong>Total Income: </strong>{comparisonData.totalIncome}</p>
            <p><strong>Old Tax Regime Total Tax: </strong>{comparisonData.oldTax.totalTax}</p>
            <p><strong>New Tax Regime Total Tax: </strong>{comparisonData.newTax.totalTax}</p>
            <p><strong>Tax Savings: </strong>{comparisonData.taxSavings > 0 ? comparisonData.taxSavings : 'No savings'}</p>
            <p><strong>Better Regime: </strong>{comparisonData.betterRegime}</p>
          </div>
          <div className="graph-section">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Tax Regimes',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Tax Amount (INR)',
                    },
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>   </div>
  );
};

export default Dashboard;
