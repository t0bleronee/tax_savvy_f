const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const taxRoutes = require("./TaxCalculator/routes/taxRoutes");
const reportRoutes =require( "./BudgetInsights/routes/reportRoutes");
const taxComparisonRoutes = require("./ComparisonDashboard/servers");
const authRoutes = require("./userprofile/authroutes"); // User authentication routes
const financialTipsRoutes = require("./fintips/fintip_route");
//const featuresRoutes = require("./BudgetFeatures/server/app.js"); // Budget features routes
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Express has built-in JSON parsing
app.use(express.urlencoded({ extended: true })); // For form submissions
// Tax Calculation Routes
app.use("/tax", taxRoutes);
app.use("/api", reportRoutes);
app.use("/taxc", taxComparisonRoutes);
app.use("/auth", authRoutes); // User authentication routes
app.use("/get-financial-tips", financialTipsRoutes); // Financial tips routes
//app.use("/budget-features", featuresRoutes); // Budget features routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Connect to MongoDB
/*connectDB();


// -----------------------------------
// Generate Financial Tips Function
// -----------------------------------
const generateFinancialTips = (user) => {
    let tips = [];

    // 80C: Max allowed is ₹1,50,000
    if (user.deductions80C < 150000) {
        tips.push("Increase your investments under Section 80C like PPF, ELSS, and EPF up to ₹1.5 lakh.");
    }

    // 80D: Health Insurance
    if (user.medicalInsurance80D < 25000 && user.age < 60) {
        tips.push("Consider increasing your health insurance premium under Section 80D to ₹25,000.");
    }
    if (user.age >= 60 && user.medicalInsurance80D < 50000) {
        tips.push("As a senior citizen, you can claim up to ₹50,000 for medical insurance under Section 80D.");
    }

    // 80CCD(2): NPS Employer Contribution
    if (user.npsEmployer80CCD2 > 0) {
        tips.push(`Your employer contributes ₹${user.npsEmployer80CCD2} to NPS. Ensure it's fully utilized under Section 80CCD(2).`);
    }

    // 80CCD(1B): NPS Employee Self Contribution
    const npsSelfContribution = user.npsEmployee80CCD || 0;
    const maxNPSLimit = 50000;
    const remainingNPS = maxNPSLimit - npsSelfContribution;
    if (remainingNPS > 0) {
        tips.push(`Invest an additional ₹${remainingNPS} in NPS to avail extra tax savings under Section 80CCD(1B).`);
    }

    // 80EEA: Interest on Home Loan for first-time buyers
    if (user.homeLoanInterest80EEA > 0) {
        tips.push("Claim deductions on home loan interest up to ₹1.5 lakh under Section 80EEA (first-time homebuyers).");
    }

    // 80TTA: Interest from Savings Account (non-senior citizens)
    if (user.age < 60 && user.interestFromDeposits80TTA > 0) {
        tips.push("Claim up to ₹10,000 on savings account interest under Section 80TTA.");
    }

    // 80TTB: For senior citizens on deposits
    if (user.age >= 60 && user.interestFromDeposits80TTA > 0) {
        tips.push("As a senior citizen, claim up to ₹50,000 interest on deposits under Section 80TTB.");
    }

    // 80G: Donations
    if (user.donations80G > 0) {
        tips.push(`You can claim deductions on ₹${user.donations80G} donated to eligible charities under Section 80G.`);
    }

    // Home Loan Interest (Self-Occupied & Let Out)
    if (user.homeLoanInterestSelf > 0) {
        tips.push("Claim deductions on self-occupied home loan interest up to ₹2 lakh under Section 24(b).");
    }
    if (user.homeLoanInterestLetOut > 0) {
        tips.push("Deduct interest paid on let-out property loans from your rental income to reduce taxable income.");
    }

    // Rental Income
    if (user.rentalIncome > 0) {
        tips.push("Declare your rental income and claim deductions like property tax and 30% standard deduction.");
    }

    // Salary-based tips
    if (user.salary > 1000000) {
        tips.push("Consider investing in tax-saving bonds or ELSS to reduce your taxable salary income.");
    }

    // Digital Assets Taxation
    if (user.digitalAssetsIncome > 0) {
        tips.push("Ensure digital asset gains are reported and taxed as per the latest regulations (30% flat rate).");
    }

    return tips;
};

// -----------------------------------
// API: Get Financial Tips By Email
// -----------------------------------
app.get("/get-financial-tips/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const user = await taxData.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found with this email!" });
        }

        const tips = generateFinancialTips(user);
        res.json({ email: user.email, tips });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});*/

// -----------------------------------
// Start Server
// -----------------------------------
