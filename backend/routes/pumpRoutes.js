const express = require("express");
const router = express.Router();
const {
    manualPumpControl,
    getPumpStatus,
} = require("../controllers/pumpController");
const { validatePumpControl } = require("../utils/validators");

// POST /api/pump/manual — Manual override ON/OFF
router.post("/manual", validatePumpControl, manualPumpControl);

// GET /api/pump/status — Current pump status
router.get("/status", getPumpStatus);

module.exports = router;
