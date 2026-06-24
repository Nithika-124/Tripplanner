const mongoose = require("mongoose");

/**
 * Mongoose schema definition for the User model.
 * Handles user profile details and authentication credentials.
 */
const userSchema = new mongoose.Schema(
  {
    // User's full display name
    fullName: String,

    // Unique email address for authentication
    email: {
      type: String,
      unique: true
    },

    // Hashed password for security
    password: String
  },
  { 
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true 
  }
);

/**
 * User model representing a registered user in the application.
 * @module models/User
 */
module.exports = mongoose.model("User", userSchema);