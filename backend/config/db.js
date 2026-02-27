const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 7+ uses these defaults, but explicit for clarity
      autoIndex: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
