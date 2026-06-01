"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, DollarSign, Clock, MapPin, 
  MoreVertical, Edit2, Copy, Trash2, Eye, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

type TripStatus = "Upcoming" | "Completed";

const tabs: TripStatus[] = ["Upcoming", "Completed"];

export default function SavedTripsDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TripStatus>("Upcoming");
  const [savedTrips, setSavedTrips] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`tourista_saved_trips_${user.uid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Map the AI JSON format to the Card format
        const mappedTrips = parsed.map((trip: any) => ({
          id: trip.id,
          destination: trip.destination || "Saved Itinerary",
          date: trip.dates || "",
          budget: trip.days && trip.days[0] ? trip.days[0].estimatedCost : "TBD",
          duration: trip.days ? `${trip.days.length} Days` : "Unknown",
          status: (trip.status as TripStatus) || "Upcoming",
          image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", // Default travel placeholder
          rawData: trip // Keep the original JSON so we can load it when clicked
        }));

        setSavedTrips(mappedTrips);
      }
    } catch (e) {
      console.error("Failed to load saved trips", e);
    }
  }, [user]);

  const filteredTrips = React.useMemo(() => {
    return savedTrips.filter(trip => trip.status === activeTab);
  }, [activeTab, savedTrips]);

  const handleViewTrip = (trip: any) => {
    if (trip.isMock) {
      alert("This is just a mock trip placeholder! Try creating and saving your own real trip first.");
      return;
    }
    
    // Set the viewed trip as the current generated itinerary so the itinerary page picks it up
    localStorage.setItem("tourista_generated_itinerary", JSON.stringify(trip.rawData));
    window.location.href = "/itinerary";
  };

  const handleDeleteTrip = (tripId: any) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this trip?")) {
      const updated = savedTrips.filter(t => t.id !== tripId);
      setSavedTrips(updated);
      
      const toSave = updated.map(t => t.rawData);
      localStorage.setItem(`tourista_saved_trips_${user.uid}`, JSON.stringify(toSave));
    }
  }

  const handleToggleStatus = (tripId: any) => {
    if (!user) return;
    const updated = savedTrips.map(t => {
      if (t.id === tripId) {
        const newStatus = t.status === "Upcoming" ? "Completed" : "Upcoming";
        return {
          ...t,
          status: newStatus,
          rawData: {
            ...t.rawData,
            status: newStatus
          }
        };
      }
      return t;
    });
    
    setSavedTrips(updated);
    const toSave = updated.map(t => t.rawData);
    localStorage.setItem(`tourista_saved_trips_${user.uid}`, JSON.stringify(toSave));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <Typography variant="h1" className="mb-4">Saved Trips</Typography>
          <Typography variant="lead" className="text-muted-foreground">
            Manage your past adventures, upcoming journeys, and trip drafts in one place.
          </Typography>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-border mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {/* Active Tab Indicator */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTrips.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-surface border border-dashed rounded-2xl">
                <Typography variant="h3" className="mb-2 text-muted-foreground">No {activeTab.toLowerCase()} trips found.</Typography>
                <p className="text-muted-foreground/70 mb-6">Time to start planning your next great adventure!</p>
                <Button onClick={() => window.location.href = '/planner'}>Plan a New Trip</Button>
              </div>
            ) : (
              filteredTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow group border-border bg-gradient-to-br from-surface to-surface/50 hover:border-primary/40 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Card Content */}
                  <CardContent className="p-6 flex flex-col flex-1">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground shadow-sm">
                        {trip.status}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {trip.destination}
                    </h3>
                    
                    {trip.date && (
                      <div className="text-sm text-muted-foreground mb-6 line-clamp-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        {trip.date}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-background/50 p-3 rounded-xl border border-border/50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Budget</span>
                        <span className="font-semibold text-foreground">{trip.budget}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Duration</span>
                        <span className="font-semibold text-foreground">{trip.duration}</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2">
                      <Button variant="secondary" size="sm" className="flex-1 gap-2 rounded-xl text-xs h-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all" onClick={() => handleViewTrip(trip)}>
                        <Eye className="w-4 h-4" />
                        View Itinerary
                      </Button>
                      
                      <div className="flex gap-1">
                        <button 
                          className={`p-2.5 rounded-xl transition-colors border ${trip.status === 'Completed' ? 'text-green-500 bg-green-500/10 border-green-500/20 hover:bg-green-500/20' : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10 border-transparent hover:border-green-500/20'}`} 
                          title={trip.status === 'Upcoming' ? "Mark as Completed" : "Mark as Upcoming"} 
                          onClick={() => handleToggleStatus(trip.id)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20" title="Delete" aria-label="Delete Trip" onClick={() => handleDeleteTrip(trip.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </AnimatePresence>

      </div>
      </div>
    </ProtectedRoute>
  );
}
