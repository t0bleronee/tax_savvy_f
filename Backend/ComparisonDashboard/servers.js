const express = require('express');
const router = express.Router();

const calculateTax = (income, slabs) => {
  let tax = 0;
  let previousLimit = 0; 

  if (income <= 0) {
    return 0;  
  }

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    
    if (income <= previousLimit) break;

    const taxableIncome = Math.min(income, slab.limit) - previousLimit;
    tax += taxableIncome * slab.rate;
    previousLimit = slab.limit;
  }

  return tax;
};

const oldTaxSlabs = [
  { limit: 250000, rate: 0.05 },
  { limit: 500000, rate: 0.1 },
  { limit: 1000000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 }
];

const newTaxSlabs = [
  { limit: 400000, rate: 0.05 },
  { limit: 800000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1600000, rate: 0.2 },
  { limit: 2000000, rate: 0.25 },
  { limit: 2400000, rate: 0.3 },
  { limit: Infinity, rate: 0.3 }
];

router.get('/:income', (req, res) => {
  const { income } = req.params;

  const parsedIncome = parseFloat(income);
  if (!income || isNaN(parsedIncome) || parsedIncome <= 0) {
    return res.status(400).json({ error: 'Invalid income value. Please provide a positive number.' });
  }

  const oldTaxTotal = calculateTax(parsedIncome, oldTaxSlabs);
  const newTaxTotal = calculateTax(parsedIncome, newTaxSlabs);

  const oldTaxMonthly = oldTaxTotal / 12;
  const newTaxMonthly = newTaxTotal / 12;

  const taxSavings = oldTaxTotal - newTaxTotal;
  const betterRegime = taxSavings > 0 ? 'Old Tax Regime' : (taxSavings < 0 ? 'New Tax Regime' : 'Both regimes are equal');

  const taxComparisonData = {
    totalIncome: parsedIncome,
    oldTax: {
      totalTax: oldTaxTotal,
      monthlyTax: oldTaxMonthly
    },
    newTax: {
      totalTax: newTaxTotal,
      monthlyTax: newTaxMonthly
    },
    taxSavings: taxSavings > 0 ? taxSavings : 0, 
    betterRegime
  };

  res.json(taxComparisonData);
});

module.exports = router;