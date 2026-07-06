const cors = require("cors");
require("dotenv").config();

const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const connectDB = require("./config/db");

const app = express();
connectDB();
app.use(cors());

const PORT = 5000;

// Middleware

app.use(express.json());


// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Nova AI Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});