const express = require("express");
const router = express.Router();
const {
    submitSensorData,
    getLatestReading,
    getHistory,
} = require("../controllers/sensorController");
const {
    validateSensorData,
    validateHistoryQuery,
} = require("../utils/validators");

// POST /api/sensor-data — ESP32 submits sensor readings
router.post("/", validateSensorData, submitSensorData);

// GET /api/sensor-data/latest — Latest reading for dashboard
router.get("/latest", getLatestReading);

// GET /api/sensor-data/history — Paginated historical data
router.get("/history", validateHistoryQuery, getHistory);

module.exports = router;
