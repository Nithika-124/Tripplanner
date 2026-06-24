require("dotenv").config();

const mongoose = require("mongoose");
const Country = require("./models/Country");
const countries = require("./data/countries.json");

/**
 * Database seeding script.
 * Connects to MongoDB, clears existing countries, and populates the database
 * with data from the local JSON file.
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    // Remove any existing data to prevent duplicates
    await Country.deleteMany();

    // Insert new data from JSON
    await Country.insertMany(countries);

    console.log("Countries Seeded Successfully");

    // Exit script upon completion
    process.exit();
  })
  .catch((error) => {
    console.error("Error seeding countries:", error);
    process.exit(1);
  });