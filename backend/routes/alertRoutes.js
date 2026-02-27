const express = require("express");
const router = express.Router();
const { getAlerts, resolveAlert } = require("../controllers/alertController");

// GET /api/alerts — All alerts (filterable by device, type, resolved)
router.get("/", getAlerts);

// PATCH /api/alerts/:id/resolve — Mark alert as resolved
router.patch("/:id/resolve", resolveAlert);

module.exports = router;
