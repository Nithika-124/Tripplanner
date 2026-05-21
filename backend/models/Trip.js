const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const destinationSchema = new mongoose.Schema({
  name: String,
  country: String,
  city: String,
  lat: Number,
  lng: Number,

  weather: {
    temperature: Number,
    condition: String,
  },

  localTime: String,

  hotel: {
    name: String,
    address: String,
    rating: Number,
    price: String,
  },
});

const routeSchema = new mongoose.Schema({
  from: String,
  to: String,
  transportMode: String,
  distanceKm: Number,
  durationMinutes: Number,
});

const tripSchema = new mongoose.Schema(
  {
    userId: String,

    title: String,

    destinations: [destinationSchema],

    startDate: Date,
    endDate: Date,

    transportationPreference: {
      type: String,
      default: "driving-car",
    },

    hotelPreference: String,

    route: [routeSchema],

    totalDistanceKm: Number,
    totalDurationMinutes: Number,

    budget: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "planned",
    },

    tasks: [taskSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);