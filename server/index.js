const cors = require("cors");
require("dotenv").config();

const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authOptional = require("./middleware/optionalAuth");

const app = express();
connectDB();
app.use(cors());

const PORT = 5000;

// Middleware

app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Routes
// const authOptional = require("./middleware/OptionalAuth");

app.use(
  "/api/chat",
  authOptional,
  chatRoutes
);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Nova AI Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
