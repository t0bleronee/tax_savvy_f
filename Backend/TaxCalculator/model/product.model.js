const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const regimeSchema = new Schema({
  totalIncome: { type: Number ,default: 0},
  exemptAllowances: { type: Number ,default: 0},
  standardDeductions: { type: Number,default: 0 },
  chapterVIA: { type: Number ,default: 0},
  taxableIncome: { type: Number ,default: 0},
  taxPayable: { type: Number ,default: 0},
  incomeTax: { type: Number ,default: 0},
  surcharge: { type: Number ,default: 0},
  cess: { type: Number,default: 0 },
  netIncomeAfterTax: { type: Number ,default: 0},
  effectiveTaxRate: { type: String ,default: "0%"}
}, { _id: false });  // Prevents creating an unnecessary ID for subschema
const taxSchema = new Schema({
    email: { type: String },
    age: { type: Number ,default: 59}, // Optional field with default value
    salary: { type: Number, default: 0 }, // Optional field with default value
    interestIncome: { type: Number, default: 0 }, // Optional field with default value
    rentalIncome: { type: Number, default: 0 }, // Optional field with default value
    digitalAssetsIncome: { type: Number, default: 0 }, // Optional field with default value
    exemptAllowances: { type: Number, default: 0 }, // Optional field with default value
    homeLoanInterestSelf: { type: Number, default: 0 }, // Optional field with default value
    homeLoanInterestLetOut: { type: Number, default: 0 }, // Optional field with default value
    otherIncome: { type: Number, default: 0 }, // Optional field with default value
    deductions80C: { type: Number, default: 0 }, // Optional field with default value
    medicalInsurance80D: { type: Number, default: 0 }, // Optional field with default value
    homeLoanInterest80EEA: { type: Number, default: 0 }, // Optional field with default value
    npsEmployer80CCD2: { type: Number, default: 0 }, // Optional field with default value
    interestFromDeposits80TTA: { type: Number, default: 0 }, // Optional field with default value
    donations80G: { type: Number, default: 0 }, // Optional field with default value
    npsEmployee80CCD: { type: Number, default: 0 }, // Optional field with default value
    otherDeductions: { type: Number, default: 0 }, // Optional field with default value
    oldRegime: { type: regimeSchema }, // Not required
    newRegime: { type: regimeSchema }, // Not required
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });

  const taxData = model('taxData', taxSchema);

  module.exports = taxData;