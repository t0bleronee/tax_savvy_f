const express = require("express");
const { fetchReports } = require("../controllers/reportController.js");

const router = express.Router();

// Route to fetch AI-generated summary and financial report
router.get("/:userId", fetchReports);

module.exports = router;
