const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Exits the Node process if the connection fails.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Attempt to connect using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    // Log the error and terminate the process on failure
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;