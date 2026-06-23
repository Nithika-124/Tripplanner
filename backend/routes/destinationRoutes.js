const express = require("express");
const axios = require("axios");
const Destination = require("../models/Destination");
const Country = require("../models/Country");

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
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.all;
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return null;

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  if (!url.startsWith("https://")) {
    return null;
  }

  if (url.includes("image.pollinations.ai")) {
    return null;
  }

  return url;
}

function normalizeDestinationImages(destination) {
  const item = destination.toObject ? destination.toObject() : destination;
  const fallbackImage = getDestinationImage(item.name, item.category || "all", item.country);
  const image = normalizeImageUrl(item.image) || fallbackImage;
  const photos = Array.isArray(item.photos)
    ? item.photos.map(normalizeImageUrl).filter(Boolean)
    : [];

  return {
    ...item,
    image,
    photos: photos.length > 0 ? photos : [image],
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
    const countries = await Country
      .find()
      .sort({ name: 1 });

    res.json(countries);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      return res.json(cached.map(normalizeDestinationImages));
    }

    const center = await Country.findOne({ 
      name: country,
    });

    if (!center) {
      return res.status(404).json({ message: "Country not found" });
    }

    const placesRes = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      {
        params: {
          radius: 500000,
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
        normalizeImageUrl(details?.preview?.source) ||
        normalizeImageUrl(await getUnsplashImage(
          place.name,
          center.name,
          category
        )) ||
        getDestinationImage(
          place.name,
          category,
          center.name
        );
        
      const destination = await Destination.findOneAndUpdate(
        { xid: place.xid },
        {
          xid: place.xid,
          name: place.name,
          country: center.name,
          city: details?.address?.city || details?.address?.town || "",
          category,
          description:
            details?.wikipedia_extracts?.text ||
            details?.info?.descr ||
            `${place.name} is a real travel destination in ${center.name}.`,
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
