const mongoose = require("mongoose");

const alertLogSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: [true, "Device reference is required"],
            index: true,
        },
        type: {
            type: String,
            enum: {
                values: ["PH_ALERT", "LOW_MOISTURE", "SYSTEM"],
                message: "Alert type must be PH_ALERT, LOW_MOISTURE, or SYSTEM",
            },
            required: [true, "Alert type is required"],
        },
        message: {
            type: String,
            required: [true, "Alert message is required"],
            trim: true,
        },
        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM",
        },
        isResolved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt
    }
);

// Index for fetching recent alerts
alertLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AlertLog", alertLogSchema);
