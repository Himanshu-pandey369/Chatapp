const mongoose = require("mongoose");

const connectDB = async () => {
    try {
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
        process.exit(1);  
    }
};

module.exports = connectDB;
