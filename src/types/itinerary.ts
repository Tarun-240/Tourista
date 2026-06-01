export interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  pace: string;
  preferences: string[];
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  food: string[];
  transport: string;
  estimatedCost: string;
}

export interface ItineraryResponse {
  tripSummary: string;
  destination: string;
  dates: string;
  days: DayPlan[];
}
