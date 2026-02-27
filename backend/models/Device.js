const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: [true, "Device ID is required"],
            unique: true,
            trim: true,
            index: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt
    }
);

module.exports = mongoose.model("Device", deviceSchema);
