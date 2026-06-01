"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Sparkles, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { AILoadingScreen } from "@/components/planner/AILoadingScreen";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const steps = [
  { id: 1, title: "Basics" },
  { id: 2, title: "Style" },
  { id: 3, title: "Preferences" },
];

export default function PlannerWizard() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Form State
  const [destination, setDestination] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [budget, setBudget] = React.useState("Moderate");
  const [travelStyle, setTravelStyle] = React.useState("");
  const [pace, setPace] = React.useState("");
  const [preferences, setPreferences] = React.useState<string[]>([]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("destination");
    if (dest) {
      setDestination(dest);
    }
  }, []);

  const isNextDisabled = React.useMemo(() => {
    if (currentStep === 1) {
      return !destination.trim() || !startDate || !endDate;
    }
    if (currentStep === 2) {
      return !budget || !travelStyle;
    }
    if (currentStep === 3) {
      return !pace || preferences.length === 0;
    }
    return false;
  }, [currentStep, destination, startDate, endDate, budget, travelStyle, pace, preferences]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "20%" : "-20%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "20%" : "-20%",
      opacity: 0,
    }),
  };

  const [direction, setDirection] = React.useState(1);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-24 pb-20 flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 md:px-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <Typography variant="h1" className="mb-4">Design Your Journey</Typography>
            <Typography variant="lead" className="text-muted-foreground">
              Let our AI craft the perfect itinerary tailored exclusively for you.
            </Typography>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 z-10 ${
                      currentStep >= step.id 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-surface border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Container */}
          <Card className="p-6 md:p-10 shadow-xl border-border bg-surface relative overflow-hidden min-h-[400px] flex flex-col">
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <AILoadingScreen />
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-1"
                  >
                    
                    {/* STEP 1 */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Where and when?</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Destination</label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <input 
                                type="text" 
                                placeholder="e.g. Kyoto, Japan" 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-foreground">Start Date</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input 
                                  type="date" 
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-foreground">End Date</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input 
                                  type="date" 
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold mb-6">How do you travel?</h2>
                        
                        <div>
                          <label className="block text-sm font-medium mb-4 text-foreground">Budget Level</label>
                          <div className="grid grid-cols-3 gap-3">
                            {["Budget", "Moderate", "Luxury"].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => setBudget(lvl)}
                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                                  budget === lvl 
                                    ? "border-primary bg-primary/10 text-primary" 
                                    : "border-border bg-background hover:bg-muted text-foreground"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-4 text-foreground">Travel Style</label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Solo", "Couple", "Family", "Friends"].map((style) => (
                              <button
                                key={style}
                                onClick={() => setTravelStyle(style)}
                                className={`py-4 px-4 rounded-xl border text-sm font-medium transition-all ${
                                  travelStyle === style 
                                    ? "border-primary bg-primary/10 text-primary" 
                                    : "border-border bg-background hover:bg-muted text-foreground"
                                }`}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold mb-6">Fine-tune your trip</h2>
                        
                        <div>
                          <label className="block text-sm font-medium mb-4 text-foreground">Trip Pace</label>
                          <div className="grid grid-cols-3 gap-3">
                            {["Relaxed", "Moderate", "Fast-paced"].map((p) => (
                              <button
                                key={p}
                                onClick={() => setPace(p)}
                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                                  pace === p 
                                    ? "border-primary bg-primary/10 text-primary" 
                                    : "border-border bg-background hover:bg-muted text-foreground"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-4 text-foreground">Interests & Preferences (Select multiple)</label>
                          <div className="flex flex-wrap gap-2">
                            {["Nature", "History", "Food", "Shopping", "Adventure", "Art & Culture", "Nightlife", "Wellness"].map((pref) => (
                              <button
                                key={pref}
                                onClick={() => togglePreference(pref)}
                                className={`py-2 px-4 rounded-full border text-sm font-medium transition-all ${
                                  preferences.includes(pref)
                                    ? "border-primary bg-primary text-primary-foreground" 
                                    : "border-border bg-background hover:bg-muted text-foreground"
                                }`}
                              >
                                {pref}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDirection(-1);
                      handlePrev();
                    }}
                    disabled={currentStep === 1}
                    className={`rounded-lg px-6 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button 
                      onClick={() => {
                        setDirection(1);
                        handleNext();
                      }}
                      disabled={isNextDisabled}
                      className="rounded-lg px-8"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      disabled={isNextDisabled}
                      className="rounded-lg px-8 shadow-lg shadow-primary/25"
                      onClick={async () => {
                        setIsGenerating(true);
                        try {
                          const response = await fetch("/api/itinerary", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              destination,
                              startDate,
                              endDate,
                              budget,
                              travelStyle,
                              pace,
                              preferences
                            })
                          });
                          
                          if (!response.ok) {
                            const errData = await response.json().catch(() => ({}));
                            throw new Error(errData.error || "Failed to generate itinerary");
                          }
                          
                          const data = await response.json();
                          localStorage.setItem("tourista_generated_itinerary", JSON.stringify(data));
                          window.location.href = "/itinerary";
                        } catch (error: any) {
                          console.error(error);
                          alert("Error: " + (error.message || "Failed to generate trip"));
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Trip
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}
