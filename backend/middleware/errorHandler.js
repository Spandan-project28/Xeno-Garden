/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns structured JSON responses.
 */

const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err.message);
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            error: "Validation Error",
            messages,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            error: "Duplicate Entry",
            message: `A record with this ${field} already exists.`,
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: "Invalid ID",
            message: `Invalid value for ${err.path}: ${err.value}`,
        });
    }

    // Default to 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;
