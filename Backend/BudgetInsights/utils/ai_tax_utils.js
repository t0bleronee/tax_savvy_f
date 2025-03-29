const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

function preprocessTaxData(data) {
    return {
        name: data.name || "Unknown",
        email: data.email || "Not Provided",
        financialYear: data.financialYear || "N/A",
        age: data.age || 0,
        pan: data.pan || "Not Provided",
        salary: data.salary || 0,
        interestIncome: data.interestIncome || 0,
        rentalIncome: data.rentalIncome || 0,
        digitalAssetsIncome: data.digitalAssetsIncome || 0,
        exemptAllowances: data.exemptAllowances || 0,
        homeLoanInterestSelf: data.homeLoanInterestSelf || 0,
        homeLoanInterestLetOut: data.homeLoanInterestLetOut || 0,
        otherIncome: data.otherIncome || 0,

        section80C: data.deductions80C || 0,
        section80D: data.medicalInsurance80D || 0,
        section80EEA: data.homeLoanInterest80EEA || 0,
        section80CCD: data.npsEmployee80CCD || 0,
        section80CCD2: data.npsEmployer80CCD2 || 0,
        section80TTA: data.interestFromDeposits80TTA || 0,
        section80G: data.donations80G || 0,
        otherDeductions: data.otherDeductions || 0,

        // Old Regime Data
        oldRegime: {
            totalIncome: data.oldRegime?.totalIncome || 0,
            standardDeductions: data.oldRegime?.standardDeductions || 50000,
            taxableIncome: data.oldRegime?.taxableIncome || 0,
            taxPayable: data.oldRegime?.taxPayable || 0,
            incomeTax: data.oldRegime?.incomeTax || 0,
            surcharge: data.oldRegime?.surcharge || 0,
            cess: data.oldRegime?.cess || 0,
            netIncomeAfterTax: data.oldRegime?.netIncomeAfterTax || 0,
            effectiveTaxRate: data.oldRegime?.effectiveTaxRate || 0
        },

        // New Regime Data
        newRegime: {
            totalIncome: data.newRegime?.totalIncome || 0,
            standardDeductions: data.newRegime?.standardDeductions || 75000,
            taxableIncome: data.newRegime?.taxableIncome || 0,
            taxPayable: data.newRegime?.taxPayable || 0,
            incomeTax: data.newRegime?.incomeTax || 0,
            surcharge: data.newRegime?.surcharge || 0,
            cess: data.newRegime?.cess || 0,
            netIncomeAfterTax: data.newRegime?.netIncomeAfterTax || 0,
            effectiveTaxRate: data.newRegime?.effectiveTaxRate || 0
        }
    };
}

async function generateTaxReport(baseReport) {
    try {
        const oldRegime = baseReport.oldRegime;
        const newRegime = baseReport.newRegime;
        const data = baseReport;

        const netTaxOld = oldRegime.taxPayable;
        const netTaxNew = newRegime.taxPayable;
        const taxSavings = netTaxOld - netTaxNew;
        const deductionSavings = data.section80C + data.section80D + data.section80EEA +
            data.section80CCD + data.section80CCD2 + data.section80TTA +
            data.section80G + data.otherDeductions + data.exemptAllowances;
        const takeHomeIncomeOld = oldRegime.netIncomeAfterTax;
        const takeHomeIncomeNew = newRegime.netIncomeAfterTax;

        return `
1️⃣ Based on your income and deductions, your total tax liability under the Old Regime is ₹${oldRegime.taxPayable}, while under the New Regime, it is ₹${newRegime.taxPayable}.\n
2️⃣Since your taxable income is below ₹12L, you qualify for a rebate of upto ₹60,000 under Section 87A in the New Regime, reducing your final tax payable to ₹${netTaxNew}.\n
3️⃣${taxSavings > 0 ? `By opting for the Old Regime, you pay ₹${taxSavings} more in taxes compared to the New Regime.` : `By choosing the New Regime, you save ₹${Math.abs(taxSavings)} more in taxes over the Old Regime.`} \n
4️⃣Your total deductions and exemptions, including 80C, 80D, home loan interest, and other eligible sections, amount to ₹${deductionSavings}, effectively lowering your taxable income in the Old Regime.\n   
5️⃣After all deductions and tax rebates, your take-home income would be ₹${takeHomeIncomeOld} under the Old Regime and ₹${takeHomeIncomeNew} under the New Regime. \n   
6️⃣${takeHomeIncomeOld > takeHomeIncomeNew ? `This means you retain an additional ₹${takeHomeIncomeOld - takeHomeIncomeNew} by opting for the Old Regime.` : `Choosing the New Regime increases your take-home income by ₹${takeHomeIncomeNew - takeHomeIncomeOld}.`} \n 
7️⃣Making an informed tax decision is crucial to optimizing your savings and maximizing your take-home earnings. Choose the regime that aligns best with your financial goals and tax-saving strategy.
    `.trim();
    } catch (error) {
        console.error("Error generating tax report:", error);
        return "Error generating report.";
    }
}

// ✅ Initialize Google Gemini AI
const GEMINI_API_KEY = "AIzaSyC_4_kNsIl1y9uJSvLqk2RTa6hIRp7C9wM";

if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in environment variables");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateAISummary(baseReport) {
    try {
        const promptText = `The following initiatives are designed to provide direct benefits to individuals like you. Here's what you can gain from them:  

        - Clearly outline the benefits available to the user based on their profession, location, or situation.  
        - Use engaging and direct language like "You can access...", "This initiative helps you by...", "Here's what you get...".  
        - Focus on real, actionable advantages instead of general descriptions. 
        - Ensure the content is concise, informative, and tailored to the user's needs and the font style is easy to read no bold and also lets it be like a paragraph. 
        
        Data:\n\n${JSON.stringify(baseReport, null, 2)}`;
         
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: promptText }] }]
        });

        return response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    } catch (error) {
        console.error("❌ Error generating AI summary:", error);
        return "Error generating AI summary.";
    }
}

module.exports = {
    preprocessTaxData,
    generateTaxReport,
    generateAISummary
};
