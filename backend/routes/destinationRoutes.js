const express = require("express");
const axios = require("axios");
const Destination = require("../models/Destination");

const router = express.Router();

const CATEGORY_MAP = {
  all: "interesting_places",
  beach: "beaches",
  culture: "cultural",
  historic: "historic",
  nature: "natural",
  city: "architecture,urban_environment",
  museum: "museums",
  religion: "religion",
};

function normalizeCategory(category) {
  return CATEGORY_MAP[category] || CATEGORY_MAP.all;
}

async function getUnsplashImage(placeName, country, category) {
  try {
    const query = `${placeName} ${country} ${category} travel`;

    const res = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    return res.data.results[0]?.urls?.regular || null;
  } catch (error) {
    return null;
  }
}

function getDestinationImage(placeName, category, country) {
  const query = encodeURIComponent(`${placeName} ${country} travel`);
  return `https://image.pollinations.ai/prompt/${query}?width=1200&height=800&nologo=true`;
}

async function getCountryCenter(country) {
  const res = await axios.get(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`
  );

  const data = res.data[0];

  return {
    country: data.name.common,
    lat: data.latlng[0],
    lng: data.latlng[1],
  };
}

async function getPlaceDetails(xid) {
  try {
    const res = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}`,
      {
        params: {
          apikey: process.env.OPENTRIPMAP_API_KEY,
        },
      }
    );

    return res.data;
  } catch {
    return null;
  }
}

router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,flags"
    );

    const countries = response.data
      .map((c) => ({
        name: c.name.common,
        flag: c.flags?.png,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json(countries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch countries",
      error: error.message,
    });
  }
});

router.get("/live", async (req, res) => {
  try {
    const { country, category = "all", search = "" } = req.query;
    const normalizedSearch = search.trim().toLowerCase();

    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }

    const cacheFilter = {
      country: { $regex: country, $options: "i" },
      ...(category !== "all" ? { category } : {}),
      ...(search
        ? {
            $or: [
              { name: { $regex: normalizedSearch, $options: "i" } },
              { description: { $regex: normalizedSearch, $options: "i" } },
            ],
          }
        : {}),
    };

    const cached = await Destination.find(cacheFilter).limit(50);

    if (cached.length > 0) {
      return res.json(cached);
    }

    const center = await getCountryCenter(country);

    const placesRes = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      {
        params: {
          radius: 100000,
          lon: center.lng,
          lat: center.lat,
          kinds: normalizeCategory(category),
          rate: 2,
          limit: 30,
          format: "json",
          apikey: process.env.OPENTRIPMAP_API_KEY,
        },
      }
    );

    const results = [];

    for (const place of placesRes.data || []) {
      if (!place.name || !place.xid) continue;

      const details = await getPlaceDetails(place.xid);

      const imageUrl =
        details?.preview?.source ||
        await getUnsplashImage(place.name, center.country, category);

      const destination = await Destination.findOneAndUpdate(
        { xid: place.xid },
        {
          xid: place.xid,
          name: place.name,
          country: center.country,
          city: details?.address?.city || details?.address?.town || "",
          category,
          description:
            details?.wikipedia_extracts?.text ||
            details?.info?.descr ||
            `${place.name} is a real travel destination in ${center.country}.`,
          image: imageUrl,
          rating: Number((Math.random() * (5 - 4.2) + 4.2).toFixed(1)),
          reviews: Math.floor(Math.random() * 8000) + 300,
          activities: [category, "sightseeing", "photography"],
          highlights: [place.name],
          photos: imageUrl ? [imageUrl] : [],
          location: {
            lat: place.point.lat,
            lng: place.point.lon,
          },
        },
        { upsert: true, new: true }
      );

      results.push(destination);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch live destinations",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;