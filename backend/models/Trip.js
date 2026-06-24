const mongoose = require("mongoose");

/**
 * Sub-schema for individual tasks within a trip.
 */
const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

/**
 * Sub-schema representing a destination stop in a trip.
 */
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

/**
 * Sub-schema for the transit routes between destinations.
 */
const routeSchema = new mongoose.Schema({
  from: String,
  to: String,
  transportMode: String,
  distanceKm: Number,
  durationMinutes: Number,
});

/**
 * Main Mongoose schema for the Trip model.
 * Handles the complete structure of a user's trip, including manual and AI-generated data.
 */
const tripSchema = new mongoose.Schema(
  {
    userId: String,

    title: String,

    summary: String,

    destinations: [destinationSchema],

    startDate: Date,
    endDate: Date,

    transportationPreference: {
      type: String,
      default: "driving-car",
    },

    hotelPreference: String, 
    // Preferred style/budget for accommodations

    route: [routeSchema], 
    // Transit routes between multiple destinations

    totalDistanceKm: Number,
    totalDurationMinutes: Number,

    budget: {
      type: Number,
      default: 0,
    },

    budgetBreakdown: {
      flight: Number,
      hotel: Number,
      food: Number,
      transport: Number,
      activities: Number,
    },

    progress: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "planned", 
      // Status can be 'planned', 'ongoing', 'completed'
    },

    tasks: [taskSchema], 
    // Checklist or tasks related to the trip

    image: String, 
    // Banner image for the trip

    // AI Trip specific fields
    aiGenerated: {
      type: Boolean,
      default: false,
    },

    dailyPlan: [{
      day: Number,
      title: String,
      route: String,
      city: String,
      estimatedCost: Number,
      hotelSuggestion: {
        name: String,
        area: String,
        estimatedNightlyCost: Number,
      },
      activities: [{
        time: String,
        place: String,
        activity: String,
        cost: Number,
        lat: Number,
        lng: Number,
      }],
    }],

    recommendations: [String], 
    // AI-generated recommendations
    hotels: [mongoose.Schema.Types.Mixed], 
    // Unstructured hotel data
    restaurants: [mongoose.Schema.Types.Mixed], 
    // Unstructured restaurant data
    packing: [String], 
    // Packing list items
    weather: mongoose.Schema.Types.Mixed, 
    // General weather info
    emergencyNumbers: [mongoose.Schema.Types.Mixed], 
    // Local emergency contacts
    interests: [String], 
    // User's travel interests
    notes: String, 
    // Personal notes about the trip
    travelStyle: String,

    startLocation: String,

    travelers: Number,
  },
  { timestamps: true }
);

/**
 * Trip model representing a user's planned or generated trip.
 * @module models/Trip
 */
module.exports = mongoose.model("Trip", tripSchema);
