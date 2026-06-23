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
      startDate,
      budget,
      days,
      travelers,
      travelStyle,
      interests,
      notes,
    } = req.body;

    const prompt = `
    Generate THREE itinerary options for the traveler.

    Starting location: ${startLocation}
    Destination: ${destinationCountry}
    Budget: $${budget}
    Days: ${days}
    Travelers: ${travelers}
    Travel Style: ${travelStyle}
    Interests: ${interests?.join(", ")}
    Notes: ${notes}
    The trip starts on ${startDate}. Plan the itinerary beginning from this date and continue for ${days} days.


    IMPORTANT RULES:

    1. Never reject a trip.
    2. Always generate the best possible itinerary.
    3. Determine if the provided budget is realistic.
    4. If the budget is too low:
      - create the cheapest realistic itinerary
      - use budget hotels/hostels
      - use public transportation
      - prioritize free attractions
      - explain limitations
    5. If travel is domestic and flights are unnecessary,
      do not include flight costs.
    6. If travel is international,
      include realistic flight estimates.
    7. Return a recommended budget if the user's budget is too low.
    8. Be honest and realistic about costs.

    Return JSON only.

    Budget Rules:

    - If budget is realistic:

      "budgetFeasible": true

      "recommendedBudget":
      same as user budget

    - If budget is unrealistic:

      "budgetFeasible": false

      "recommendedBudget":
      realistic minimum budget

      "budgetMessage":
      explain why

    - Never refuse.
    - Always create the cheapest realistic itinerary.

    Return JSON only in this format:
    {
      "itineraries": [
        {
          "title": "",
          "optionType": "Most Popular Route",
          "summary": "",
          "cities": [],
          "tags": [],
          "rating": 5,
          "budgetFeasible": true,
          "recommendedBudget": 0,
          "budgetMessage": "",
          "destinationCountry": "",
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
          "hotels": [],
          "restaurants": [],
          "packing": [],
          "weather": {},
          "transportation": "",
          "emergencyNumbers": [],
          "coverImageQuery": "",
          "dailyPlan": [
            {
              "day": 1,
              "title": "",
              "route": "",
              "city": "",
              "estimatedCost": 0,
              "hotelSuggestion": {
                "name": "",
                "area": "",
                "estimatedNightlyCost": 0
              },
              "activities": [
                {
                  "time": "",
                  "place": "",
                  "activity": "",
                  "cost": 0,
                  "lat": 0,
                  "lng": 0
                }
              ]
            }
          ],
          "recommendations": []
        }
      ]
    }

    Option 1 must be the Most Popular Route.
    Option 2 must be Hidden Gems.
    Option 3 must be Balanced Route.
    Each option must satisfy the destination, budget, travelers, days, interests, travel style, and start date.
    Make coverImageQuery specific to the route, for example "Golden Route Kyoto Temple" instead of only the country name.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
            You are a professional AI travel planner.

            Rules:

            - Return valid JSON only.
            - Never reject a trip.
            - Always generate exactly three itinerary options.
            - If the budget is too low:
              - create the cheapest realistic itinerary
              - prioritize free attractions
              - use hostels or budget hotels
              - use public transport
              - explain limitations

            - If travel is domestic:
              - avoid flight costs unless necessary

            - If travel is international:
              - include realistic flight estimates

            - Include realistic costs.
            - Include hotel suggestions.
            - Include latitude and longitude for each place.
            - Budget breakdown should approximately match total budget.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    let aiResponse;

    try {
      aiResponse = JSON.parse(
        completion.choices[0].message.content
      );
    } catch (err) {
      return res.status(500).json({
        message: "Invalid AI response format",
      });
    }

    const itineraries = Array.isArray(aiResponse)
      ? aiResponse
      : aiResponse.itineraries || aiResponse.options || [];

    if (!Array.isArray(itineraries) || itineraries.length === 0) {
      return res.status(500).json({
        message: "AI did not return itinerary options",
      });
    }

    const normalizedPlans = itineraries.slice(0, 3).map((plan, index) => {
      const fallbackTypes = ["Most Popular Route", "Hidden Gems", "Balanced Route"];
      const aiPlan = {
        ...plan,
        optionType: plan.optionType || fallbackTypes[index],
        destinationCountry: plan.destinationCountry || destinationCountry,
        travelers: plan.travelers || Number(travelers),
        days: plan.days || Number(days),
        totalBudget: plan.totalBudget || Number(budget),
        dailyPlan: Array.isArray(plan.dailyPlan) ? plan.dailyPlan : [],
        recommendations: Array.isArray(plan.recommendations) ? plan.recommendations : [],
        cities: Array.isArray(plan.cities) ? plan.cities : [],
        tags: Array.isArray(plan.tags) ? plan.tags : [],
        hotels: Array.isArray(plan.hotels) ? plan.hotels : [],
        restaurants: Array.isArray(plan.restaurants) ? plan.restaurants : [],
        packing: Array.isArray(plan.packing) ? plan.packing : [],
        emergencyNumbers: Array.isArray(plan.emergencyNumbers) ? plan.emergencyNumbers : [],
      };

      if (aiPlan.budgetBreakdown) {
        const total =
          (aiPlan.budgetBreakdown.flight || 0) +
          (aiPlan.budgetBreakdown.hotel || 0) +
          (aiPlan.budgetBreakdown.food || 0) +
          (aiPlan.budgetBreakdown.transport || 0) +
          (aiPlan.budgetBreakdown.activities || 0);

        aiPlan.totalBudget = total || aiPlan.totalBudget;
      }

      return aiPlan;
    });

    res.json(normalizedPlans);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI trip generation failed",
      error: error.message,
    });
  }
});

module.exports = router;
