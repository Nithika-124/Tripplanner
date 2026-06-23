require("dotenv").config();

const mongoose = require("mongoose");

const Country = require("./models/Country");

const countries = require("./data/countries.json");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Country.deleteMany();

    await Country.insertMany(countries);

    console.log("Countries Seeded");

    process.exit();
  });