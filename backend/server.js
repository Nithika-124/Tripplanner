/**
 * Main application server for Trip Planner Backend.
 * Sets up Express server, middleware, routes, and database connection.
 */
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import configuration and route modules
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const aiTripRoutes = require("./routes/aiTripRoutes");

// Initialize Express application
const app = express();

// Establish connection to MongoDB
connectDB();

// Apply global middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON request bodies

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/ai-trip", aiTripRoutes); 

// Determine listening port
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});