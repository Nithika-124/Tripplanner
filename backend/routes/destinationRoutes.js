const express = require("express");
const axios = require("axios");
const Destination = require("../models/Destination");
const Country = require("../models/Country");
const countriesData = require("../data/countries.json");

const router = express.Router();

const FALLBACK_IMAGES = {
  all: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop&auto=format",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&auto=format",
  culture: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=800&fit=crop&auto=format",
  historic: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=800&fit=crop&auto=format",
  nature: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop&auto=format",
  city: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1200&h=800&fit=crop&auto=format",
  museum: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1200&h=800&fit=crop&auto=format",
  religion: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop&auto=format",
};

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

const CURATED_DESTINATIONS = {
  "Sri Lanka": [
    ["Sigiriya Rock Fortress", "Dambulla", "historic", FALLBACK_IMAGES.historic],
    ["Galle Fort", "Galle", "culture", FALLBACK_IMAGES.culture],
    ["Mirissa Beach", "Mirissa", "beach", FALLBACK_IMAGES.beach],
    ["Temple of the Sacred Tooth Relic", "Kandy", "religion", FALLBACK_IMAGES.religion],
    ["Ella Nine Arch Bridge", "Ella", "nature", FALLBACK_IMAGES.nature],
    ["Colombo Fort", "Colombo", "city", FALLBACK_IMAGES.city],
  ],
  Japan: [
    ["Fushimi Inari Shrine", "Kyoto", "religion", "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&h=800&fit=crop&auto=format"],
    ["Shibuya Crossing", "Tokyo", "city", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop&auto=format"],
    ["Mount Fuji", "Fujikawaguchiko", "nature", "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1200&h=800&fit=crop&auto=format"],
    ["Kiyomizu-dera", "Kyoto", "historic", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop&auto=format"],
    ["Osaka Castle", "Osaka", "historic", FALLBACK_IMAGES.historic],
    ["Nara Park", "Nara", "nature", FALLBACK_IMAGES.nature],
  ],
  India: [
    ["Taj Mahal", "Agra", "historic", "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop&auto=format"],
    ["Jaipur City Palace", "Jaipur", "culture", FALLBACK_IMAGES.culture],
    ["Goa Beaches", "Goa", "beach", FALLBACK_IMAGES.beach],
    ["Kerala Backwaters", "Alappuzha", "nature", FALLBACK_IMAGES.nature],
    ["Qutub Minar", "Delhi", "historic", FALLBACK_IMAGES.historic],
    ["Gateway of India", "Mumbai", "city", FALLBACK_IMAGES.city],
  ],
  Thailand: [
    ["Grand Palace", "Bangkok", "culture", "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=800&fit=crop&auto=format"],
    ["Phi Phi Islands", "Krabi", "beach", FALLBACK_IMAGES.beach],
    ["Wat Arun", "Bangkok", "religion", FALLBACK_IMAGES.religion],
    ["Doi Inthanon", "Chiang Mai", "nature", FALLBACK_IMAGES.nature],
    ["Ayutthaya Historical Park", "Ayutthaya", "historic", FALLBACK_IMAGES.historic],
  ],
  Indonesia: [
    ["Ubud Rice Terraces", "Bali", "nature", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop&auto=format"],
    ["Borobudur Temple", "Magelang", "historic", FALLBACK_IMAGES.historic],
    ["Kuta Beach", "Bali", "beach", FALLBACK_IMAGES.beach],
    ["Jakarta Old Town", "Jakarta", "city", FALLBACK_IMAGES.city],
  ],
  Maldives: [
    ["Male City", "Male", "city", FALLBACK_IMAGES.city],
    ["Maafushi Island", "Maafushi", "beach", "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=800&fit=crop&auto=format"],
    ["Banana Reef", "North Male Atoll", "nature", FALLBACK_IMAGES.nature],
  ],
  Singapore: [
    ["Marina Bay Sands", "Singapore", "city", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=800&fit=crop&auto=format"],
    ["Gardens by the Bay", "Singapore", "nature", FALLBACK_IMAGES.nature],
    ["National Gallery Singapore", "Singapore", "museum", FALLBACK_IMAGES.museum],
    ["Chinatown", "Singapore", "culture", FALLBACK_IMAGES.culture],
  ],
};

function normalizeCategory(category) {
  return CATEGORY_MAP[category] || CATEGORY_MAP.all;
}

async function getUnsplashImage(placeName, country, category) {
  if (!process.env.UNSPLASH_ACCESS_KEY) return null;

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

  if (url.includes("image.pollinations.ai") || url.includes("source.unsplash.com")) {
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

function getCuratedDestinations(country, category = "all", search = "") {
  const center =
    countriesData.countries.find(
      (item) => item.name.toLowerCase() === String(country).toLowerCase()
    ) || { name: country, lat: null, lng: null };

  const places = CURATED_DESTINATIONS[center.name] || [
    [`${center.name} Cultural District`, "", "culture", FALLBACK_IMAGES.culture],
    [`${center.name} Nature Escape`, "", "nature", FALLBACK_IMAGES.nature],
    [`${center.name} City Center`, "", "city", FALLBACK_IMAGES.city],
    [`${center.name} Historic Landmark`, "", "historic", FALLBACK_IMAGES.historic],
  ];

  const normalizedSearch = String(search || "").trim().toLowerCase();

  return places
    .filter(([, , itemCategory]) => category === "all" || itemCategory === category)
    .filter(([name, city]) => {
      if (!normalizedSearch) return true;
      return `${name} ${city} ${center.name}`.toLowerCase().includes(normalizedSearch);
    })
    .map(([name, city, itemCategory, image], index) =>
      normalizeDestinationImages({
        xid: `curated-${center.name}-${index}-${name}`.replace(/\s+/g, "-").toLowerCase(),
        name,
        country: center.name,
        city,
        category: itemCategory,
        description: `${name} is a popular travel destination in ${center.name}, known for memorable sightseeing, local culture, and photo-worthy experiences.`,
        image,
        photos: [image, getDestinationImage(name, itemCategory, center.name), FALLBACK_IMAGES.all],
        rating: Number((4.9 - index * 0.1).toFixed(1)),
        reviews: 1200 + index * 430,
        activities: [itemCategory, "sightseeing", "photography"],
        highlights: [name, city || center.name, `${titleCase(itemCategory)} experience`],
        travelTips: [
          "Check opening hours before visiting.",
          "Visit early for fewer crowds and better photos.",
          "Keep local weather and transport times in mind.",
        ],
        location: {
          lat: center.lat,
          lng: center.lng,
        },
      })
    );
}

function titleCase(value) {
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

    res.json(countries.length > 0 ? countries : countriesData.countries);
  } catch (error) {
    res.json(countriesData.countries);
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

    if (!process.env.OPENTRIPMAP_API_KEY) {
      return res.json(getCuratedDestinations(country, category, search));
    }

    const center =
      (await Country.findOne({
        name: country,
      })) ||
      countriesData.countries.find(
        (item) => item.name.toLowerCase() === country.toLowerCase()
      );

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

    res.json(results.map(normalizeDestinationImages));
  } catch (error) {
    const { country, category = "all", search = "" } = req.query;
    const curated = getCuratedDestinations(country, category, search);

    if (curated.length > 0) {
      return res.json(curated);
    }

    res.status(500).json({
      message: "Failed to fetch live destinations",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
