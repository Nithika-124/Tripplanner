const mongoose = require("mongoose");

/**
 * Mongoose schema definition for the Country model.
 * Stores basic geographical and identify information for a country.
 */
const countrySchema = new mongoose.Schema({
  name: String,
  flag: String,
  lat: Number,
  lng: Number,
  continent: String,
});

/**
 * Country model for retrieving supported countries in the system.
 * @module models/Country
 */
module.exports = mongoose.model("Country", countrySchema);