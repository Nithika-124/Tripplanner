const express = require("express");
const Destination = require("../models/Destination");

const router = express.Router();

// GET all destinations
// Example: /api/destinations
router.get("/", async (req, res) => {
  try {
    const { search, category, country } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }

    const destinations = await Destination.find(filter);

    res.json(destinations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch destinations",
      error: error.message
    });
  }
});

// GET one destination by ID
// Example: /api/destinations/665f...
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found"
      });
    }

    res.json(destination);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch destination",
      error: error.message
    });
  }
});

// POST add destination
// Example: /api/destinations
router.post("/", async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create destination",
      error: error.message
    });
  }
});

// DELETE destination
router.delete("/:id", async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);

    res.json({
      message: "Destination deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete destination",
      error: error.message
    });
  }
});

module.exports = router;