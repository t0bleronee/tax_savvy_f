// src/components/TaxComparisonGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const TaxComparisonGraph = ({ oldTax, newTax }) => {
  const chartData = {
    labels: ['Old Tax Regime', 'New Tax Regime'],
    datasets: [
      {
        label: 'Tax Payable Comparison',
        data: [oldTax, newTax],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.4)',
        tension: 0.1,
      }
    ]
  };

  return (
    <div className="graph-section">
      <Line 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `₹${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return `₹${value.toLocaleString()}`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

export default TaxComparisonGraph;