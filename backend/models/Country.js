const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: String,
  flag: String,
  lat: Number,
  lng: Number,
  continent: String,
});

module.exports = mongoose.model("Country", countrySchema);