const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    xid: String,

    name: String,
    country: String,
    city: String,

    category: String,

    description: String,

    image: String,

    photos: [String],

    rating: Number,

    reviews: Number,

    bestTimeToVisit: String,

    estimatedBudget: String,

    activities: [String],

    highlights: [String],

    travelTips: [String],

    location: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Destination",
  destinationSchema
);