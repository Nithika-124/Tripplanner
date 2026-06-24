const axios = require("axios");

/**
 * Searches for a destination by name using OpenTripMap API.
 *
 * @async
 * @param {string} name - Name of the destination to search for.
 * @returns {Promise<Object>} An object containing location coordinates and metadata.
 */
async function searchDestination(name) {
  const res = await axios.get("https://api.opentripmap.com/0.1/en/places/geoname", {
    params: {
      name,
      apikey: process.env.OPENTRIPMAP_API_KEY,
    },
  });

  return {
    name: res.data.name || name,
    country: res.data.country || "",
    city: res.data.name || name,
    lat: res.data.lat,
    lng: res.data.lon,
    timezone: res.data.timezone,
  };
}

/**
 * Retrieves the current weather conditions for specific coordinates.
 *
 * @async
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 * @returns {Promise<Object>} Object containing temperature and weather condition.
 */
async function getWeather(lat, lon) {
  const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric", // Use Celsius for temperature
    },
  });

  return {
    temperature: res.data.main.temp,
    condition: res.data.weather[0].description,
  };
}

/**
 * Calculates a route between two destinations using OpenRouteService API.
 *
 * @async
 * @param {Object} start - Starting location with lat, lng, and name.
 * @param {Object} end - Ending location with lat, lng, and name.
 * @param {string} [transportMode="driving-car"] - Mode of transportation.
 * @returns {Promise<Object>} Route summary including distance and duration.
 */
async function getRoute(start, end, transportMode = "driving-car") {
  const res = await axios.post(
    `https://api.openrouteservice.org/v2/directions/${transportMode}`,
    {
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
    },
    {
      headers: {
        Authorization: process.env.OPENROUTESERVICE_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const summary = res.data.routes[0].summary;

  return {
    from: start.name,
    to: end.name,
    transportMode,
    distanceKm: Number((summary.distance / 1000).toFixed(2)),
    durationMinutes: Math.round(summary.duration / 60),
  };
}

/**
 * Gets the localized time for a given timezone.
 *
 * @param {string} timezone - Valid timezone string (e.g., "America/New_York").
 * @returns {string} Formatted local time string.
 */
function getLocalTime(timezone) {
  if (!timezone) return new Date().toLocaleString();

  return new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });
}

/**
 * Retrieves preliminary details for a specified hotel and destination.
 *
 * @async
 * @param {string} hotelName - The name of the hotel.
 * @param {string} destinationName - The name of the destination city.
 * @returns {Promise<Object|null>} Basic hotel details or null if no name is provided.
 */
async function getHotelDetails(hotelName, destinationName) {
  if (!hotelName) return null;

  return {
    name: hotelName,
    address: destinationName,
    rating: 4.5, // Placeholder rating
    price: "Check hotel price", // Placeholder price string
  };
}

module.exports = {
  searchDestination,
  getWeather,
  getRoute,
  getLocalTime,
  getHotelDetails,
};