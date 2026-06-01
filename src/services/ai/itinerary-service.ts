import { TripRequest, ItineraryResponse } from "@/types/itinerary";
import { getAIProvider } from "./providers";

export class ItineraryService {
  static async generate(request: TripRequest): Promise<ItineraryResponse> {
    const provider = getAIProvider();

    const prompt = `
You are an expert travel planner.

Create a detailed day-wise itinerary.

Destination: ${request.destination}

Travel Dates:
From: ${request.startDate}
To: ${request.endDate}

Budget Level: ${request.budget}

Travel Style:
${request.travelStyle}

Trip Pace:
${request.pace}

Interests:
${request.preferences.join(", ")}

Requirements:

1. Generate a complete itinerary for every day.
2. Include:
   - Morning activities
   - Afternoon activities
   - Evening activities
   - Food recommendations
   - Transportation suggestions
3. Match the itinerary to the budget.
4. Avoid repetitive attractions.
5. Balance travel time efficiently.
6. Include estimated daily expenses.
7. Return valid JSON only.

JSON Format:

{
  "tripSummary": "",
  "days": [
    {
      "day": 1,
      "date": "",
      "theme": "",
      "morning": [],
      "afternoon": [],
      "evening": [],
      "food": [],
      "transport": "",
      "estimatedCost": ""
    }
  ]
}
`;

    const rawResponse = await provider.generateItinerary(prompt);
    
    try {
      // Clean up markdown formatting if the model still includes it
      const jsonString = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonString);
      
      // Inject the original request metadata so the frontend doesn't show "TBD"
      data.destination = request.destination;
      data.dates = `${request.startDate} - ${request.endDate}`;
      data.budgetLevel = request.budget;
      
      return data as ItineraryResponse;
    } catch (e) {
      console.error("Failed to parse AI response:", rawResponse);
      throw new Error("Invalid response format from AI");
    }
  }
}
