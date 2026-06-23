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

    summary: String,

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
    },

    tasks: [taskSchema],

    image: String,

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

    hotels: [mongoose.Schema.Types.Mixed],

    restaurants: [mongoose.Schema.Types.Mixed],

    packing: [String],

    weather: mongoose.Schema.Types.Mixed,

    emergencyNumbers: [mongoose.Schema.Types.Mixed],

    interests: [String],

    notes: String,

    travelStyle: String,

    startLocation: String,

    travelers: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
