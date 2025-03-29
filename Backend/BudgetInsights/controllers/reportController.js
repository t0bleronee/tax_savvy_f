const taxData = require("../../TaxCalculator/model/product.model");
const {db} = require("../config/mysql.js"); // Import MySQL connection
const { preprocessTaxData, generateTaxReport, generateAISummary } = require("../utils/ai_tax_utils.js");


const fetchReports = async (req, res) => {
    try {
        const { profession, ageGroup,email  } = req.query;
        if (!email || email === "undefined") return res.status(400).json({ message: "Please calculate the tax for generating the report." });

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValidEmail) return res.status(400).json({ message: "Invalid ObjectId format." });

        // Fetch tax data
        const userData = await taxData.findOne({ email}).sort({ createdAt: -1 });
        if (!userData) { // Change from userData.length
            return res.status(404).json({ success: false, message: 'Tax data not found' });
        }
        const cleanedData = preprocessTaxData(userData.toObject());

        const finalReport = await generateTaxReport(cleanedData);


        const query = `
        SELECT f.name, f.description 
        FROM features f
        JOIN featureprofessions fp ON f.id = fp.feature_id
        JOIN featureagegroups fa ON f.id = fa.feature_id
        WHERE fp.profession = ? AND (fa.age_group = ? OR fa.age_group = 'All age groups');
    `;
    
        const [rows] = await db.execute(query, [profession, ageGroup]);

      if (rows.length === 0) {
          summary = "No matching features found."; // Ensure summary is always defined
      } else {      
          const baseReport = rows.map((row) => ({
              details: {
                  feature: row.name, // Fetched feature from DB
                  explanation: row.description, // Fetched explanation from DB
              },
          }));
          
          // Process and generate reports
          summary = await generateAISummary(baseReport);
      }
      
      // Ensure finalReport is defined before using it
      res.json({ summary, financialImpactReport: finalReport || {} });
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { fetchReports };
