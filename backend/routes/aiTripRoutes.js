const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const {
      startLocation,
      destinationCountry,
      budget,
      days,
      travelers,
      travelStyle,
      interests,
      notes,
    } = req.body;

    const prompt = `
Create a detailed travel plan.

Starting location: ${startLocation}
Destination: ${destinationCountry}
Budget: $${budget}
Days: ${days}
Travelers: ${travelers}
Travel Style: ${travelStyle}
Interests: ${interests?.join(", ")}
Notes: ${notes}

Return JSON only.

Format:
{
  "title": "",
  "summary": "",
  "totalBudget": 0,
  "travelers": 0,
  "days": 0,
  "budgetBreakdown": {
    "flight": 0,
    "hotel": 0,
    "food": 0,
    "transport": 0,
    "activities": 0
  },
  "dailyPlan": [
    {
      "day": 1,
      "title": "",
      "city": "",
      "route": "",
      "estimatedCost": 0,
      "activities": [
        {
          "time": "",
          "place": "",
          "activity": "",
          "cost": 0
        }
      ]
    }
  ],
  "recommendations": []
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional AI travel planner.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiPlan = JSON.parse(cleanText);

    res.json(aiPlan);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI trip generation failed",
      error: error.message,
    });
  }
});

module.exports = router;