const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: String,
    country: String,
    city: String,
    category: String,
    description: String,
    image: String,
    rating: Number,
    reviews: Number,
    price: String,
    bestTimeToVisit: String,
    activities: [String],
    highlights: [String],
    photos: [String],

    estimatedBudget: {
      low: Number,
      medium: Number,
      high: Number
    },

    location: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
