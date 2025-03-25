// Tax calculation function
function calculateTax(data) {
  const {
      age = 0,
      salary = 0,
      interestIncome = 0,
      rentalIncome = 0,
      otherIncome = 0,
      exemptAllowances = 0,
      homeLoanInterestSelf = 0,
      homeLoanInterestLetOut = 0,
      digitalAssetsIncome = 0,
      deductions80C = 0,
      medicalInsurance80D = 0,
      npsEmployee80CCD = 0,
      npsEmployer80CCD2 = 0,
      interestFromDeposits80TTA = 0,
      homeLoanInterest80EEA = 0,
      donations80G = 0,
      otherDeductions = 0
  } = data;

  // Total Income calculation
  const netIncome = salary + interestIncome + rentalIncome + digitalAssetsIncome + otherIncome;

  // Old Regime Deductions
  const totalDeductions = deductions80C + medicalInsurance80D + homeLoanInterest80EEA + npsEmployer80CCD2 + donations80G + npsEmployee80CCD + otherDeductions + interestFromDeposits80TTA;
  const rebates_old = 0.3 * rentalIncome + homeLoanInterestSelf + homeLoanInterestLetOut;
  const taxableIncomeOldRegime = Math.max(0, netIncome - totalDeductions - rebates_old - 50000 - exemptAllowances);

  const rebates_new = 0.3 * rentalIncome + Math.max(homeLoanInterestSelf, homeLoanInterestLetOut);
  // New Regime Deductions
  const taxableIncomeNewRegime = Math.max(0, netIncome - npsEmployer80CCD2 - rebates_new - 75000);

  // Tax slabs for Old Regime based on age
  function calculateOldRegimeTax(income, age) {
      if (age < 60) {
          if (income <= 250000) return 0;
          else if (income <= 500000) return (income - 250000) * 0.05;
          else if (income <= 1000000) return 12500 + (income - 500000) * 0.2;
          return 12500 + 100000 + (income - 1000000) * 0.3;
      } else if (age < 80) {
          if (income <= 300000) return 0;
          else if (income <= 500000) return (income - 300000) * 0.05;
          else if (income <= 1000000) return 10000 + (income - 500000) * 0.2;
          return 10000 + 100000 + (income - 1000000) * 0.3;
      } else {
          if (income <= 500000) return 0;
          else if (income <= 1000000) return (income - 500000) * 0.2;
          return 100000 + (income - 1000000) * 0.3;
      }
  }

  // Tax slabs for New Regime
  function calculateNewRegimeTax(income) {
      if (income <= 400000) return 0;
      else if (income <= 800000) return (income - 400000) * 0.05;
      else if (income <= 1200000) return 20000 + (income - 800000) * 0.1;
      else if (income <= 1600000) return 60000 + (income - 1200000) * 0.15;
      else if (income <= 2000000) return 120000 + (income - 1600000) * 0.2;
      else if (income <= 2400000) return 200000 + (income - 2000000) * 0.25;
      return 300000 + (income - 2400000) * 0.3;
  }

  // Surcharge calculation
  function calculateSurcharge(tax, income, isNewRegime) {
      if (income > 50000000) return tax * (isNewRegime ? 0.25 : 0.37);
      if (income > 20000000) return tax * 0.25;
      if (income > 10000000) return tax * 0.15;
      if (income > 5000000) return tax * 0.1;
      return 0;
  }

  // Calculate taxes
  let oldRegimeTax = calculateOldRegimeTax(taxableIncomeOldRegime, age);
  let newRegimeTax = 0;

  if (taxableIncomeNewRegime <= 1200000) {
      newRegimeTax = 0;
  } else if (taxableIncomeNewRegime <= 1275000) {
      newRegimeTax = (taxableIncomeNewRegime - 1200000);
  } else {
      newRegimeTax = calculateNewRegimeTax(taxableIncomeNewRegime);
  }

  // Surcharge and Cess
  const oldSurcharge = calculateSurcharge(oldRegimeTax, taxableIncomeOldRegime, false);
  const newSurcharge = calculateSurcharge(newRegimeTax, taxableIncomeNewRegime, true);

  const oldCess = 0.04 * (oldRegimeTax + oldSurcharge);
  const newCess = 0.04 * (newRegimeTax + newSurcharge);

  // Final taxes
  oldRegimeTax = Math.round(oldRegimeTax + oldSurcharge + oldCess);
  newRegimeTax = Math.round(newRegimeTax + newSurcharge + newCess);

  const safeDivide = (numerator, denominator) => {
      if (!denominator || isNaN(denominator) || isNaN(numerator)) return "0%";
      return ((numerator / denominator) * 100).toFixed(2) + "%";
  };

  // Effective tax rates
  const oldEffectiveTaxRate = safeDivide(oldRegimeTax, netIncome);
  const newEffectiveTaxRate = safeDivide(newRegimeTax, netIncome);

  // Outputs
  return {
      oldRegime: {
          totalIncome: netIncome,
          exemptAllowances,
          standardDeductions: 50000,
          chapterVIA: totalDeductions,
          taxableIncome: taxableIncomeOldRegime,
          taxPayable: oldRegimeTax,
          incomeTax: oldRegimeTax - oldSurcharge - oldCess,
          surcharge: oldSurcharge,
          cess: oldCess,
          netIncomeAfterTax: netIncome - oldRegimeTax,
          effectiveTaxRate: oldEffectiveTaxRate
      },
      newRegime: {
          totalIncome: netIncome,
          exemptAllowances: 0,
          standardDeductions: 75000,
          chapterVIA: npsEmployer80CCD2,
          taxableIncome: taxableIncomeNewRegime,
          taxPayable: newRegimeTax,
          incomeTax: newRegimeTax - newSurcharge - newCess,
          surcharge: newSurcharge,
          cess: newCess,
          netIncomeAfterTax: netIncome - newRegimeTax,
          effectiveTaxRate: newEffectiveTaxRate
      }
  };
}
module.exports = { calculateTax };
