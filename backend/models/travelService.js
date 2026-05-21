const axios = require("axios");

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

async function getWeather(lat, lon) {
  const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });

  return {
    temperature: res.data.main.temp,
    condition: res.data.weather[0].description,
  };
}

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

function getLocalTime(timezone) {
  if (!timezone) return new Date().toLocaleString();

  return new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });
}

async function getHotelDetails(hotelName, destinationName) {
  if (!hotelName) return null;

  return {
    name: hotelName,
    address: destinationName,
    rating: 4.5,
    price: "Check hotel price",
  };
}

module.exports = {
  searchDestination,
  getWeather,
  getRoute,
  getLocalTime,
  getHotelDetails,
};