const mongoose = require("mongoose");

/**
 * Mongoose schema definition for the Destination model.
 * Stores comprehensive information about a specific travel destination.
 */
const destinationSchema = new mongoose.Schema(
  {
    xid: String, // External ID (e.g., from an external API like OpenTripMap)

    name: String, 
    // Name of the destination
    country: String, 
    // Country where the destination is located
    city: String, 
    // City where the destination is located

    category: String, 
    // Category of the destination (e.g., 'museum', 'nature')

    description: String, 
    // Detailed description of the destination

    image: String, 
    // Main image URL for the destination

    photos: [String], 
    // Array of additional photo URLs

    rating: Number, 
    // Average rating score

    reviews: Number, 
    // Number of user reviews

    bestTimeToVisit: String, 
    // Recommended season or months to visit

    estimatedBudget: String, 
    // Approximate cost level (e.g., '$$$', 'Moderate')

    activities: [String], 
    // List of popular activities to do

    highlights: [String], 
    // Key highlights or attractions

    travelTips: [String], 
    // Useful tips for travelers

    location: {
      lat: Number, // Latitude coordinate
      lng: Number, // Longitude coordinate
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

/**
 * Destination model for storing and retrieving travel destinations.
 * @module models/Destination
 */
module.exports = mongoose.model(
  "Destination",
  destinationSchema
);