const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const sensorRoutes = require("./routes/sensorRoutes");
const pumpRoutes = require("./routes/pumpRoutes");
const alertRoutes = require("./routes/alertRoutes");

// Initialize Express app
const app = express();

// ============================================
// Global Middleware
// ============================================
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Request logging

// ============================================
// API Routes
// ============================================
app.use("/api/sensor-data", sensorRoutes);
app.use("/api/pump", pumpRoutes);
app.use("/api/alerts", alertRoutes);

// ============================================
// Health Check
// ============================================
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🌱 IoT Drip Irrigation API is running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ============================================
// Global Error Handler (must be last)
// ============================================
app.use(errorHandler);

module.exports = app;
