const express = require("express");
const Trip = require("../models/Trip");
const protect = require("../middleware/authMiddleware");
const generateTripTasks = require("../utils/generateTripTasks");

const {
  searchDestination,
  getWeather,
  getRoute,
  getLocalTime,
  getHotelDetails,
} = require("../models/travelService");

const router = express.Router();

/**
 * @route   POST /api/trips/preview
 * @desc    Generate a trip preview with destinations, weather, and routes
 * @access  Private
 */
router.post("/preview", protect, async (req, res) => {
  try {
    const {
      title,
      destinations,
      startDate,
      endDate,
      hotelPreference,
      transportationPreference,
      budget,
    } = req.body;

    const destinationStops = [];

    // Fetch details for each destination
    for (const destinationName of destinations) {
      const destination = await searchDestination(destinationName);
      const weather = await getWeather(destination.lat, destination.lng);
      const hotel = await getHotelDetails(hotelPreference, destination.name);

      destinationStops.push({
        name: destination.name,
        country: destination.country,
        city: destination.city,
        lat: destination.lat,
        lng: destination.lng,
        weather,
        localTime: getLocalTime(destination.timezone),
        hotel,
      });
    }

    const route = [];

    // Calculate routes between consecutive destinations
    for (let i = 0; i < destinationStops.length - 1; i++) {
      const leg = await getRoute(
        destinationStops[i],
        destinationStops[i + 1],
        transportationPreference || "driving-car"
      );

      route.push(leg);
    }

    // Calculate totals
    const totalDistanceKm = route.reduce((sum, leg) => sum + leg.distanceKm, 0);
    const totalDurationMinutes = route.reduce((sum, leg) => sum + leg.durationMinutes, 0);

    // Generate initial task list
    const tasks = generateTripTasks({ hotelPreference });

    res.json({
      title,
      destinations: destinationStops,
      startDate,
      endDate,
      hotelPreference,
      transportationPreference,
      budget,
      route,
      totalDistanceKm,
      totalDurationMinutes,
      progress: 0,
      status: "planned",
      tasks,
    });
  } catch (error) {
    console.error("Trip Preview Error:", error);
    res.status(500).json({
      message: "Trip preview failed",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/trips
 * @desc    Create and save a new trip
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Trip Creation Error:", error);
    res.status(500).json({
      message: "Trip creation failed",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/trips/my-trips
 * @desc    Get all trips for the authenticated user
 * @access  Private
 */
router.get("/my-trips", protect, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error("Fetch Trips Error:", error);
    res.status(500).json({
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/trips/:id
 * @desc    Get a specific trip by ID
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Fetch Trip Error:", error);
    res.status(500).json({
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/trips/:id/tasks/:taskId
 * @desc    Toggle completion status of a trip task
 * @access  Private
 */
router.patch("/:id/tasks/:taskId", protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const task = trip.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle task completion
    task.completed = !task.completed;

    // Update overall trip progress
    const completedTasks = trip.tasks.filter((task) => task.completed).length;
    trip.progress = Math.round((completedTasks / trip.tasks.length) * 100);

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a specific trip by ID
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await Trip.deleteOne({ _id: req.params.id });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete Trip Error:", error);
    res.status(500).json({
      message: "Failed to delete trip",
      error: error.message,
    });
  }
});

module.exports = router;