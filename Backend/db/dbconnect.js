const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Attempting MongoDB connection...");
        console.log("URI starts with:", process.env.MONGODB_CONNECT ? process.env.MONGODB_CONNECT.substring(0, 20) + "..." : "MISSING");

        await mongoose.connect(process.env.MONGODB_CONNECT, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            maxPoolSize: 10,
            retryWrites: true
        });

        console.log("✅ MongoDB Connected successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection FAILED:");
        console.error("Error:", error.message);
        console.error("Full error:", error);
        process.exit(1);  // Stop server if DB fails
    }
};

module.exports = connectDB;
