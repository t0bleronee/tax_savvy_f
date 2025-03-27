import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [income, setIncome] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState('');

  const fetchTaxComparison = async (income) => {
    try {
      const response = await axios.get(`http://localhost:5000/tax-comparison?income=${income}`);
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
    labels: comparisonData.months,
    datasets: [
      {
        label: 'Old Tax Regime',
        data: comparisonData.oldTaxRegime,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
      {
        label: 'New Tax Regime',
        data: comparisonData.newTaxRegime,
        fill: false,
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.1,
      }
    ]
  } : {};

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Tax Comparison Dashboard</h1>
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
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
