const taxData = require("../../TaxCalculator/model/product.model");
const db = require("../config/mysql.js"); // Import MySQL connection
const { preprocessTaxData, generateTaxReport, generateAISummary } = require("../utils/ai_tax_utils.js");


const fetchReports = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || userId === "undefined") {
            return res.status(400).json({ message: "Please calculate the tax for generating the report." });
        }

        // Validate userId format
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return res.status(400).json({ message: "Invalid ObjectId format." });
        }

        // Fetch tax data from MongoDB
        const userData = await taxData.findById(userId);
        if (!userData) return res.status(404).json({ message: "User tax data not found." });

        const { profession, ageGroup } = userData;  // Assuming these fields exist in MongoDB

        // Fetch relevant features from MySQL
        const query = `
            SELECT f.feature_name, f.description 
            FROM Features f
            JOIN FeatureProfessions fp ON f.feature_id = fp.feature_id
            JOIN FeatureAgeGroups fa ON f.feature_id = fa.feature_id
            WHERE fp.profession = ? AND (fa.age_group = ? OR fa.age_group = 'All age groups');
        `;
        const [rows] = await db.execute(query, [profession, ageGroup]);

        // Transform data into baseReport format
        const baseReport = rows.map(row => ({
            details: {
                explanation: row.feature_name,
                affects: row.description
            }
        }));

        // Process and generate reports
        const cleanedData = preprocessTaxData(userData.toObject());
        const financialImpactReport = await generateTaxReport(cleanedData);
        const summary = await generateAISummary(baseReport);

        res.json({ summary, financialImpactReport });
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { fetchReports };
