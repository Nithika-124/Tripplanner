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

    for (let i = 0; i < destinationStops.length - 1; i++) {
      const leg = await getRoute(
        destinationStops[i],
        destinationStops[i + 1],
        transportationPreference || "driving-car"
      );

      route.push(leg);
    }

    const totalDistanceKm = route.reduce((sum, leg) => sum + leg.distanceKm, 0);
    const totalDurationMinutes = route.reduce((sum, leg) => sum + leg.durationMinutes, 0);

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
    res.status(500).json({
      message: "Trip preview failed",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Trip creation failed",
      error: error.message,
    });
  }
});

router.get("/my-trips", protect, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
});

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

    task.completed = !task.completed;

    const completedTasks = trip.tasks.filter((task) => task.completed).length;
    trip.progress = Math.round((completedTasks / trip.tasks.length) * 100);

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

module.exports = router;