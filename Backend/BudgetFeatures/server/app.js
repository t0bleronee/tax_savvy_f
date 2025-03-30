
const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config(); 
const { db,initializeDatabase } = require("../../BudgetInsights/config/mysql"); // Adjust the path

/*const app = express();
const port = 5000;

// ✅ 1. Fix CORS for React Frontend
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000", "http://localhost:3002"],
    credentials: true
}));
app.use(express.json());

// ✅ 2. Serve Static Files (Optional, if needed)
app.use(express.static(path.join(__dirname, "public")));*/
/*
// ✅ 3. Setup MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "taxsavvy"
});
*/
// 3. Initialize Database (using your existing setup)
initializeDatabase().then(() => {
    console.log("✅ Database initialization complete");
}).catch(err => {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
});

// ✅ 4. Fix `/api/tips` route (Ensure JSON is always returned)
router.get("/api/tips", (req, res) => {
    const filePath = path.join(__dirname, "tips.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Error reading tips.json:", err);
            return res.status(500).json({ error: "Failed to load tips" });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error("❌ Error parsing tips.json:", parseError);
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
});

// ✅ 5. Fetch Filter Options (location, age, profession, category)
router.get("/filters/:type", async(req, res) => {
    const type = req.params.type;
    let query = "";

    switch (type) {
        case "location":
            query = "SELECT DISTINCT location AS value FROM FeatureLocations";
            break;
        case "age":
            query = "SELECT DISTINCT age_group AS value FROM FeatureAgeGroups";
            break;
        case "profession":
            query = "SELECT DISTINCT profession AS value FROM FeatureProfessions";
            break;
        case "category":
            query = "SELECT DISTINCT category FROM Features";
            break;
        default:
            return res.status(400).json({ error: "Invalid filter type" });
    }
    try {
        const [results] = await db.query(query);
        
        let values = new Set();
        if (type === "category") {
            results.forEach(row => {
                row.category.split(",").map(c => c.trim()).forEach(c => values.add(c));
            });
        } else {
            values = new Set(results.map(row => row.value));
        }

        res.json([...values]);
    } catch (err) {
        console.error("❌ Error fetching filters:", err);
        res.status(500).json({ error: "Error fetching filters" });
    }
});


// ✅ 6. Fetch Features Based on Selected Filters
router.get("/features", async(req, res) => {
    const { age, location, profession, category } = req.query;
    let conditions = [];
    let params = [];

    if (category) {
        conditions.push("FIND_IN_SET(?, REPLACE(F.category, ', ', ',')) > 0");
        params.push(category);
    }
    if (profession) {
        conditions.push("F.id IN (SELECT feature_id FROM FeatureProfessions WHERE profession = ?)");
        params.push(profession);
    }
    if (age) {
        conditions.push("F.id IN (SELECT feature_id FROM FeatureAgeGroups WHERE age_group = ?)");
        params.push(age);
    }
    if (location) {
        conditions.push("F.id IN (SELECT feature_id FROM FeatureLocations WHERE location = ?)");
        params.push(location);
    }

    let query = "SELECT id, name, description, category, detailed_explanation AS feature_detailed_explanation FROM Features F";
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        const [results] = await db.query(query, params);
        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching features:", err);
        res.status(500).json({ error: "Error fetching features" });
    }
});

// ✅ 7. Fix: Handle 404 for Unknown Routes (Prevents React from getting HTML errors)
router.use((req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

module.exports = router;