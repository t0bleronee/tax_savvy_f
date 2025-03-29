const taxData = require("../model/product.model.js");
const { calculateTax } = require("../utils/taxCalculator.js");
const { sanitizeNumber } = require("../utils/sanitizeNumber.js");

// Convert values to numbers safely
const convertToNumber = (value) => {
    const converted = parseFloat(value);
    return isNaN(converted) ? 0 : converted;
};

// Controller to save tax data
saveTaxData = async (req, res) => {
    try {
        const { email, ...taxingData } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Convert fields to numbers
        const sanitizedData = {};
        for (const key in taxingData) {
            sanitizedData[key] = convertToNumber(taxingData[key]);
        }

        const calculatedTax = calculateTax(sanitizedData);

        // Sanitize calculated tax data before saving
        const sanitizeRegime = (regime) => ({
            totalIncome: sanitizeNumber(regime.totalIncome),
            exemptAllowances: sanitizeNumber(regime.exemptAllowances),
            standardDeductions: sanitizeNumber(regime.standardDeductions),
            chapterVIA: sanitizeNumber(regime.chapterVIA),
            taxableIncome: sanitizeNumber(regime.taxableIncome),
            taxPayable: sanitizeNumber(regime.taxPayable),
            incomeTax: sanitizeNumber(regime.incomeTax),
            surcharge: sanitizeNumber(regime.surcharge),
            cess: sanitizeNumber(regime.cess),
            netIncomeAfterTax: sanitizeNumber(regime.netIncomeAfterTax),
            effectiveTaxRate: regime.effectiveTaxRate,
        });

        const newTaxData = new taxData({
            email,
            ...sanitizedData,
            oldRegime: sanitizeRegime(calculatedTax.oldRegime),
            newRegime: sanitizeRegime(calculatedTax.newRegime),
        });

        await newTaxData.save();
       
console.log("✅ Tax data saved successfully!");


        res.status(200).json({ success: true, oldRegime: calculatedTax.oldRegime, newRegime: calculatedTax.newRegime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller to fetch tax data by email
getTaxData = async (req, res) => {
    try {
        const { email } = req.params;
        const taxdata = await taxData.find({ email }).sort({ createdAt: -1 });
        if (!taxdata.length) {
            return res.status(404).json({ success: false, message: 'Tax data not found' });
        }
        res.status(200).json({ success: true, data: taxdata[0] });
    } catch (error) {
        console.error("Error fetching tax data: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller to update tax data by ID
updateTaxData = async (req, res) => {
    try {
        const { id } = req.params;
        const taxingData = req.body;

        const updatedTaxData = await taxData.findByIdAndUpdate(id, taxingData, { new: true, overwrite: true });

        if (!updatedTaxData) {
            return res.status(404).json({ success: false, message: 'Tax data not found' });
        }
        res.status(200).json({ success: true, message: 'Tax data updated successfully' });
    } catch (error) {
        console.error("Error updating tax data:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
module.exports = { saveTaxData, getTaxData, updateTaxData };