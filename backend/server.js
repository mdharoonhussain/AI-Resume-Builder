require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
