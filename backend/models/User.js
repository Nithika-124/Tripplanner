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
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password for security
    password: {
      type: String,
      default: "",
    },

    // Authentication method used for this account
    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Google account identifier for OAuth users
    googleId: String,

    // Optional profile picture URL from Google
    avatar: String,
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * User model representing a registered user in the application.
 * @module models/User
 */
module.exports = mongoose.model("User", userSchema);