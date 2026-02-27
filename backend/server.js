const dotenv = require("dotenv");

// Load environment variables BEFORE anything else
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ============================================
// Start Server
// ============================================
const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        // 2. Start Express server
        app.listen(PORT, () => {
            console.log(`\n🌱 ========================================`);
            console.log(`   IoT Drip Irrigation System - Backend`);
            console.log(`   ========================================`);
            console.log(`   🚀 Server:  http://localhost:${PORT}`);
            console.log(`   📡 API:     http://localhost:${PORT}/api`);
            console.log(`   💚 Health:  http://localhost:${PORT}/api/health`);
            console.log(`   🌐 Mode:    ${process.env.NODE_ENV || "development"}`);
            console.log(`   ========================================\n`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    process.exit(1);
});

startServer();
