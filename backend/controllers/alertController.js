const AlertLog = require("../models/AlertLog");
const Device = require("../models/Device");

// ============================================
// GET /api/alerts
// Returns all alerts (newest first), with optional device filter
// ============================================
const getAlerts = async (req, res, next) => {
    try {
        const { deviceId, type, resolved } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        let filter = {};

        // Filter by device
        if (deviceId) {
            const device = await Device.findOne({ deviceId });
            if (!device) {
                return res.status(404).json({
                    success: false,
                    message: `Device '${deviceId}' not found`,
                });
            }
            filter.deviceId = device._id;
        }

        // Filter by alert type
        if (type) {
            filter.type = type.toUpperCase();
        }

        // Filter by resolved status
        if (resolved !== undefined) {
            filter.isResolved = resolved === "true";
        }

        const [alerts, total] = await Promise.all([
            AlertLog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("deviceId", "deviceId location")
                .lean(),
            AlertLog.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: alerts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// PATCH /api/alerts/:id/resolve
// Mark an alert as resolved
// ============================================
const resolveAlert = async (req, res, next) => {
    try {
        const alert = await AlertLog.findByIdAndUpdate(
            req.params.id,
            { isResolved: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Alert resolved",
            data: alert,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAlerts,
    resolveAlert,
};
