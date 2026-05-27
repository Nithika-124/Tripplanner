const express = require("express");
const OpenAI = require("openai");
const axios = require("axios");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

async function getDestinations(country, interests = []) {
  const center = await getCountryCenter(country);

  const res = await axios.get("https://api.opentripmap.com/0.1/en/places/radius", {
    params: {
      radius: 120000,
      lon: center.lng,
      lat: center.lat,
      kinds: "interesting_places,cultural,historic,natural,architecture,museums",
      rate: 2,
      limit: 20,
      format: "json",
      apikey: process.env.OPENTRIPMAP_API_KEY,
    },
  });

  return (res.data || [])
    .filter((p) => p.name && p.point)
    .slice(0, 12)
    .map((p) => ({
      name: p.name,
      lat: p.point.lat,
      lng: p.point.lon,
      kinds: p.kinds,
    }));
}

router.post("/generate", protect, async (req, res) => {
  try {
    const {
      startLocation,
      destinationCountry,
      budget,
      days,
      travelers,
      interests,
      travelStyle,
    } = req.body;

    const destinations = await getDestinations(destinationCountry, interests);

    const prompt = `
Create a realistic travel plan as JSON only.

User:
Start location: ${startLocation}
Destination country: ${destinationCountry}
Budget: ${budget}
Days: ${days}
Travelers: ${travelers}
Interests: ${(interests || []).join(", ")}
Travel style: ${travelStyle}

Use only these candidate destinations:
${JSON.stringify(destinations)}

Return JSON with this shape:
{
  "title": "",
  "summary": "",
  "totalBudget": number,
  "budgetBreakdown": {
    "flights": number,
    "hotels": number,
    "food": number,
    "transport": number,
    "activities": number,
    "buffer": number
  },
  "dailyPlan": [
    {
      "day": 1,
      "city": "",
      "estimatedCost": number,
      "schedule": [
        {
          "time": "09:00",
          "place": "",
          "activity": "",
          "estimatedCost": number,
          "lat": number,
          "lng": number
        }
      ],
      "hotelSuggestion": {
        "area": "",
        "estimatedNightlyCost": number,
        "reason": ""
      }
    }
  ],
  "tips": []
}

Rules:
- Keep total estimated cost within budget.
- Distribute activities logically by distance and time.
- If days > 1, include hotel suggestion per day.
- If start location is another country, include estimated flight budget.
- Return valid JSON only.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.5",
      messages: [
        {
          role: "system",
          content:
            "You are a travel planning assistant. Return only valid JSON. No markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const plan = JSON.parse(completion.choices[0].message.content);

    res.json(plan);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "AI trip generation failed",
      error: error.message,
    });
  }
});

module.exports = router;