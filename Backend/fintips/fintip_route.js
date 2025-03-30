// Connect to MongoDB
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const taxData = require("../TaxCalculator/model/product.model"); // MongoDB Model
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { useReducedMotion } = require("framer-motion");
const { list } = require("postcss");

// ✅ Initialize Google Gemini AI
const GEMINI_API_KEY = "AIzaSyC_4_kNsIl1y9uJSvLqk2RTa6hIRp7C9wM";

if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in environment variables");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//const { connectDB } = require("../TaxCalculator/config/db"); // Database connection
dotenv.config();
//connectDB();
const router = express.Router();


// -----------------------------------
// Generate Financial Tips Function
// -----------------------------------
const generateFinancialTips = async(user) => {
    let tips = [];
try{
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
        tips.push("Your employer contributes ₹${user.npsEmployer80CCD2} to NPS. Ensure it's fully utilized under Section 80CCD(2).");
    }

    // 80CCD(1B): NPS Employee Self Contribution
    const npsSelfContribution = user.npsEmployee80CCD || 0;
    const maxNPSLimit = 50000;
    const remainingNPS = maxNPSLimit - npsSelfContribution;
    if (remainingNPS > 0) {
        tips.push("Invest an additional ₹${remainingNPS} in NPS to avail extra tax savings under Section 80CCD(1B).");
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
        tips.push("You can claim deductions on ₹${user.donations80G} donated to eligible charities under Section 80G.");
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

    const promptText = `
    You are an expert Indian tax advisor analyzing a taxpayer's complete financial profile. 
    Generate personalized, actionable tax optimization recommendations based on these exact financial details:

    Taxpayer Profile:
    - Age: ${user.age || 'Not specified'}
    - Email: ${user.email || 'Not provided'}
    - Salary Income: ₹${user.salary?.toLocaleString('en-IN') || 0}
    - Rental Income: ₹${user.rentalIncome?.toLocaleString('en-IN') || 0}
    - Interest Income: ₹${user.interestIncome?.toLocaleString('en-IN') || 0}
    - Digital Assets Income: ₹${user.digitalAssetsIncome?.toLocaleString('en-IN') || 0}
    - Home Loan Interest (Self-occupied): ₹${user.homeLoanInterestSelf?.toLocaleString('en-IN') || 0}
    - Home Loan Interest (Let-out): ₹${user.homeLoanInterestLetOut?.toLocaleString('en-IN') || 0}

    Current Deductions:
    - 80C (Investments): ₹${user.deductions80C?.toLocaleString('en-IN') || 0}/1.5L
    - 80D (Health Insurance): ₹${user.medicalInsurance80D?.toLocaleString('en-IN') || 0}/25K
    - 80CCD(1) (NPS Employee): ₹${user.npsEmployee80CCD?.toLocaleString('en-IN') || 0}/50K
    - 80CCD(2) (NPS Employer): ₹${user.npsEmployer80CCD2?.toLocaleString('en-IN') || 0}
    - 80EEA (Home Loan Interest): ₹${user.homeLoanInterest80EEA?.toLocaleString('en-IN') || 0}
    - 80G (Donations): ₹${user.donations80G?.toLocaleString('en-IN') || 0}

    Tax Calculation Results:
    Old Regime:
    - Taxable Income: ₹${user.oldRegime?.taxableIncome?.toLocaleString('en-IN') || 'Not calculated'}
    - Total Tax: ₹${user.oldRegime?.taxPayable?.toLocaleString('en-IN') || 'Not calculated'}
    - Effective Rate: ${user.oldRegime?.effectiveTaxRate || '0%'}

    New Regime:
    - Taxable Income: ₹${user.newRegime?.taxableIncome?.toLocaleString('en-IN') || 'Not calculated'}
    - Total Tax: ₹${user.newRegime?.taxPayable?.toLocaleString('en-IN') || 'Not calculated'}
    - Effective Rate: ${user.newRegime?.effectiveTaxRate || '0%'}

    Generate specific recommendations with these guidelines:
    1. Compare both tax regimes and suggest optimal choice
    2. Identify deduction gaps (like unused 80C limit)
    3. Suggest income-specific strategies (rental, capital gains)
    4. Highlight sector-specific deductions (NPS, home loan)
    5. Flag any potential red flags (digital assets taxation)
    6. Provide exact amounts to invest/save for maximum benefit
    7. Use Indian numbering system (₹1,50,000 not 150000)

    Format requirements:
    - Return only bullet points
    - Each point must include exact ₹ amounts
    - Reference specific sections (80C, 80D, etc.)
    - Prioritize by potential tax savings
    - Keep each point under 20 words

    INITIAL TIPS:
    ${tips.join('\n')}
    
    
    EXAMPLE OUTPUT:
    - " Invest ₹45k more in ELSS (80C) to save ₹13,950 tax"
    - " Add ₹5k health insurance (80D) for ₹1,550 savings"
    - " Switch to old regime to save ₹8,200 annually"
     Return bullet points with exact amounts. Format each with "- " prefix.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await Promise.race([
        model.generateContent({ contents: [{ role: "user", parts: [{ text: promptText }] }]}),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 5000))
    ]);
    //console.log("Full AI response structure:", JSON.stringify(result, null, 2));
    
    // 2. Try the modern way to get text first
    try {
        let tipsText = await result.response.text();
        //console.log("Raw AI Response:", tipsText);

        // Method 2: Legacy way (fallback)
        if (!tipsText) {
            console.warn("Modern text() method failed, falling back to legacy method");
            tipsText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        //console.log("AI Response:", tipsText); // Debug log

        const uniqueTips = tipsText.split('\n')
        .filter(line => line.match(/^[*-]\s/))
        .map(tip => tip.replace(/^[*-]\s/, '').trim())
        .filter(tip => tip.length > 0);
          
        //console.log("AI tips Response:", uniqueTips[0]); // Debug log
        
        return uniqueTips.length > 0 ? uniqueTips : tips;}
    catch (modernMethodError) {
        console.warn("Modern text() method failed, falling back to legacy method:", modernMethodError.message);
    }

   /* // 3. Fallback to legacy method if modern method fails
    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("AI response text (legacy method):", responseText || "No text found");
    
    if (responseText) {
        const aiTips = responseText.split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(tip => tip.replace(/^- /, '').trim());
        
        return aiTips.length > 0 ? aiTips : tips;
    }*/

    return tips;}
catch (error) {
    console.error("AI tips generation failed:", error);
    return tips; // Fallback to initial tips
}
};



// -----------------------------------
// API: Get Financial Tips By Email
// -----------------------------------
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params;
        //console.log("Fetching tax data for email:", email);
        const taxdata = await taxData.find({ email }).sort({ createdAt: -1 });
       
        if (!taxdata.length) {
            return res.status(200).json({  // Still return 200 but with empty tips
                success: false,
                email,
                tips: ["No tax data found - please complete your tax profile"],
                message: "User tax data not found"
            });
        
    }
        const tipss = await generateFinancialTips(taxdata[0]);
        //console.log("Generated tips:", tipss[0]); // Debug log
        res.json({
            success: true,
            email,
            tips: tipss || [], // Ensure it's always an array
            count: tipss.length,
            lastUpdated: taxdata.updatedAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error",
            tips: ["System temporarily unavailable - please try again later"]   });
    }
});
module.exports = router;