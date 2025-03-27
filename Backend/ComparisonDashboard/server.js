const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const calculateTax = (income) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let oldTaxRegime = [];
  const oldTaxSlabs = [
    { limit: 250000, rate: 0.05 },
    { limit: 500000, rate: 0.1 },
    { limit: 1000000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 }
  ];

  let newTaxRegime = [];
  const newTaxSlabs = [
    { limit: 400000, rate: 0.05 },
    { limit: 800000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1600000, rate: 0.2 },
    { limit: 2000000, rate: 0.25 },
    { limit: 2400000, rate: 0.3 },
    { limit: Infinity, rate: 0.3 }
  ];

  const calculateTaxForSlabs = (slabs, income) => {
    let tax = 0;
    let remainingIncome = income;
    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      const taxableIncome = Math.min(remainingIncome, slab.limit) - (slabs[i - 1]?.limit || 0);
      if (taxableIncome > 0) {
        tax += taxableIncome * slab.rate;
        remainingIncome -= taxableIncome;
      }
      if (remainingIncome <= 0) break;
    }
    return tax;
  };

  for (let i = 0; i < months.length; i++) {
    oldTaxRegime.push(calculateTaxForSlabs(oldTaxSlabs, income) / 12); // Monthly tax for old regime
    newTaxRegime.push(calculateTaxForSlabs(newTaxSlabs, income) / 12); // Monthly tax for new regime
  }

  return {
    months,
    oldTaxRegime,
    newTaxRegime,
  };
};

app.get('/tax-comparison', (req, res) => {
  const { income } = req.query;

  if (!income || isNaN(income) || income <= 0) {
    return res.status(400).json({ error: 'Invalid income value. Please provide a positive number.' });
  }

  const taxComparisonData = calculateTax(parseFloat(income));
  res.json(taxComparisonData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
