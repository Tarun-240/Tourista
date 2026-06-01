import { NextResponse } from "next/server";
import { ItineraryService } from "@/services/ai/itinerary-service";
import { TripRequest } from "@/types/itinerary";

export async function POST(request: Request) {
  try {
    const body: TripRequest = await request.json();

    // Basic Validation
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate Itinerary
    const itinerary = await ItineraryService.generate(body);

    // Return the JSON
    return NextResponse.json(itinerary, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/itinerary:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
