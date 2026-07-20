const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../models/User");

const router = express.Router();

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const serializeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  authMethod: user.authMethod,
  avatar: user.avatar,
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      authMethod: "local",
    });

    // Generate JWT token
    const token = createToken(user);

    // Send successful response with token
    res.status(201).json({
      message: "Registered successfully",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: "Register failed",
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Please use Google sign in for this account",
      });
    }

    // Verify password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = createToken(user);

    // Send successful response with token
    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate or register a user via Google OAuth
 * @access  Public
 */
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential was not provided",
      });
    }

    const googleResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { timeout: 10000 }
    );

    const payload = googleResponse.data;
    const expectedAudience = process.env.GOOGLE_CLIENT_ID;

    if (expectedAudience && payload.aud && payload.aud !== expectedAudience) {
      return res.status(401).json({
        message: "Google token audience mismatch",
      });
    }

    if (!payload.email || (payload.email_verified !== true && payload.email_verified !== "true")) {
      return res.status(401).json({
        message: "Google account could not be verified",
      });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const fullName = payload.name || payload.given_name || normalizedEmail.split("@")[0];
    const avatar = payload.picture || "";
    const googleId = payload.sub;

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        fullName,
        email: normalizedEmail,
        authMethod: "google",
        googleId,
        avatar,
      });
    } else {
      const updates = {};
      if (!user.googleId && googleId) updates.googleId = googleId;
      if (!user.avatar && avatar) updates.avatar = avatar;
      if (!user.authMethod || user.authMethod !== "google") updates.authMethod = "google";
      if (!user.fullName && fullName) updates.fullName = fullName;

      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    const token = createToken(user);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Google Login Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Google sign in failed",
    });
  }
});

module.exports = router;
