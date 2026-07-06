const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error);
    process.exit(1); // Agar DB connect na ho to server band ho jayega
  }
};

module.exports = connectDB;