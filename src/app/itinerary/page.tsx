"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, Sun, CloudRain, Clock, DollarSign, Navigation, 
  MapPin, Coffee, Utensils, Moon, ChevronRight, Sparkles,
  Download, Share2, Pencil, Heart, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import * as LucideIcons from "lucide-react";
import jsPDF from "jspdf";

const itineraryData = {
  tripSummary: "A wonderful trip awaits.",
  destination: "Kyoto, Japan",
  dates: "Oct 12 - Oct 15",
  days: [
    {
      day: 1,
      date: "Oct 12",
      theme: "Arrival & Historic Higashiyama",
      morning: ["Visit Kiyomizu-dera Temple early to avoid crowds."],
      afternoon: ["Explore Sannenzaka & Ninenzaka traditional preserved streets.", "Stop for matcha ice cream."],
      evening: ["Gion District Walk to spot geishas.", "Dinner reservation at 7:30 PM."],
      food: ["Matcha ice cream", "Traditional Kaiseki dinner"],
      transport: "Taxi from hotel to Higashiyama, walking afterwards.",
      estimatedCost: "₹120"
    }
  ]
};

export default function ItineraryDashboard() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = React.useState(1);
  const [itinerary, setItinerary] = React.useState<any>(null);
  const [destinationName, setDestinationName] = React.useState("Your Destination");
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    // THIS IS WHERE WE GET THE GOOGLE AI DATA!
    // The Planner page generated it via the API and saved it here:
    const stored = localStorage.getItem("tourista_generated_itinerary");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItinerary(parsed);
        setDestinationName(parsed.destination || parsed.tripSummary);
      } catch (e) {
        console.error("Error loading AI data:", e);
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get("destination");
      if (dest) {
        setDestinationName(dest);
      }
    }
    
  }, []);

  React.useEffect(() => {
    if (user && itinerary && itinerary.id) {
      try {
        const savedStr = localStorage.getItem(`tourista_saved_trips_${user.uid}`);
        if (savedStr) {
          const savedTrips = JSON.parse(savedStr);
          const isAlreadySaved = savedTrips.some((t: any) => t.id === itinerary.id);
          setIsSaved(isAlreadySaved);
        }
      } catch (e) {
        console.error("Failed to check save status", e);
      }
    }
  }, [user, itinerary]);

  const handleSaveTrip = () => {
    if (!user || !itinerary) return;
    try {
      const stored = localStorage.getItem(`tourista_saved_trips_${user.uid}`);
      let savedTrips = stored ? JSON.parse(stored) : [];
      
      if (isSaved && itinerary.id) {
        // Unsave trip
        savedTrips = savedTrips.filter((t: any) => t.id !== itinerary.id);
        localStorage.setItem(`tourista_saved_trips_${user.uid}`, JSON.stringify(savedTrips));
        setIsSaved(false);
      } else {
        // Save trip
        const tripToSave = { ...itinerary, id: itinerary.id || Date.now().toString() };
        setItinerary(tripToSave);
        
        const existsIndex = savedTrips.findIndex((t: any) => t.id === tripToSave.id);
        if (existsIndex >= 0) {
          savedTrips[existsIndex] = tripToSave;
        } else {
          savedTrips.unshift(tripToSave);
        }
        
        localStorage.setItem(`tourista_saved_trips_${user.uid}`, JSON.stringify(savedTrips));
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Failed to process save request", e);
      alert("Failed to save or unsave trip. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const maxLineWidth = 180;
    let cursorY = 20;

    const addText = (text: string, isBold: boolean = false, size: number = 12) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(size);
      
      const lines = doc.splitTextToSize(text, maxLineWidth);
      lines.forEach((line: string) => {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, margin, cursorY);
        cursorY += size * 0.4 + 2; 
      });
      cursorY += 4;
    };

    addText(`Tourista Itinerary: ${destinationName}`, true, 18);
    addText(`Dates: ${itinerary.dates}`, true, 12);
    cursorY += 5;
    addText(itinerary.tripSummary || "Your personalized trip details", false, 11);
    cursorY += 5;
    
    itinerary.days.forEach((day: any) => {
      addText(`Day ${day.day}: ${day.theme} (${day.date})`, true, 14);
      addText(`Estimated Cost: ${day.estimatedCost} | Transport: ${day.transport}`, false, 10);
      
      if (day.morning?.length) {
        addText(`Morning:`, true, 11);
        day.morning.forEach((i: string) => addText(`- ${i}`, false, 10));
      }
      if (day.afternoon?.length) {
        addText(`Afternoon:`, true, 11);
        day.afternoon.forEach((i: string) => addText(`- ${i}`, false, 10));
      }
      if (day.evening?.length) {
        addText(`Evening:`, true, 11);
        day.evening.forEach((i: string) => addText(`- ${i}`, false, 10));
      }
      cursorY += 5;
    });
    
    doc.save(`Tourista_${destinationName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (!itinerary) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
          <p>No itinerary data found. Please generate a trip from the planner.</p>
        </div>
      </ProtectedRoute>
    );
  }

  const activeDayData = itinerary.days.find((d: any) => d.day === activeDay) || itinerary.days[0];

  const renderSection = (title: string, items: string[], icon: any) => {
    if (!items || items.length === 0) return null;
    const IconComponent = icon;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <IconComponent className="w-5 h-5 text-primary" /> {title}
        </h3>
        <Card className="overflow-hidden border-border shadow-sm">
          <CardContent className="p-5">
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <Typography variant="h1" className="mb-2">{destinationName}</Typography>
            <Typography variant="lead" className="text-muted-foreground">
              {itinerary.dates} • Curated AI Itinerary
            </Typography>
            <p className="mt-2 max-w-2xl text-muted-foreground">{itinerary.tripSummary}</p>
          </div>
          
          {/* Responsive Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-surface p-2 rounded-2xl border border-border shadow-sm w-full lg:w-auto">
            <Button 
              variant="outline" 
              className={`flex-1 lg:flex-none rounded-xl gap-2 h-10 px-3 sm:px-4 transition-colors ${isSaved ? 'border-red-500/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400' : ''}`}
              onClick={handleSaveTrip}
            >
              <motion.div
                animate={isSaved ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
              </motion.div>
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </Button>
            <Button variant="outline" className="flex-1 lg:flex-none rounded-xl gap-2 h-10 px-3 sm:px-4" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button className="flex-1 lg:flex-none rounded-xl gap-2 h-10 px-3 sm:px-4 bg-primary text-primary-foreground">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            

            {/* Day Timeline Progress Tracker */}
            <Card className="p-6 border-border shadow-sm bg-surface sticky top-24">
              <h3 className="font-bold text-lg mb-6">Trip Timeline</h3>
              <div className="relative border-l-2 border-muted ml-4 space-y-8">
                {itinerary.days.map((day: any) => (
                  <div 
                    key={day.day} 
                    className="relative pl-6 cursor-pointer group"
                    onClick={() => setActiveDay(day.day)}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-surface transition-colors ${
                      activeDay === day.day ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary/50"
                    }`} />
                    
                    <div className={`transition-colors ${activeDay === day.day ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}>
                      <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                        {day.date}
                      </div>
                      <h4 className={`font-bold leading-tight ${activeDay === day.day ? "text-foreground" : "text-muted-foreground"}`}>
                        Day {day.day}: {day.theme}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Activities */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{activeDayData.theme}</h2>
                    <p className="text-muted-foreground">{activeDayData.date}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm font-bold flex items-center md:justify-end gap-1"><DollarSign className="w-4 h-4 text-primary"/> {activeDayData.estimatedCost}</p>
                    <p className="text-sm text-muted-foreground flex items-center md:justify-end gap-1"><Navigation className="w-4 h-4 text-muted-foreground"/> {activeDayData.transport}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {renderSection("Morning", activeDayData.morning, Sun)}
                  {renderSection("Afternoon", activeDayData.afternoon, MapPin)}
                  {renderSection("Evening", activeDayData.evening, Moon)}
                  {renderSection("Food Recommendations", activeDayData.food, Utensils)}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
