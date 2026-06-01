"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { DestinationCard } from "@/components/destinations/DestinationCard";

const categories = ["All", "Beaches", "Mountains", "Heritage", "Wildlife", "Adventure", "Spiritual"];
const durations = ["Any", "1-3 Days", "4-7 Days", "8+ Days"];
const sortOptions = ["Popularity", "Price: Low to High", "Price: High to Low", "Rating"];

const allDestinations = [
  {
    id: 1,
    title: "Goa",
    category: "Beaches",
    budget: 300,
    duration: "4-7 Days",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "/images/7.jpg",
    ],
    description: "Tropical beaches and vibrant nightlife. Experience the perfect blend of Indian and Portuguese cultures."
  },
  {
    id: 2,
    title: "Manali",
    category: "Mountains",
    budget: 200,
    duration: "4-7 Days",
    rating: 4.7,
    images: [
      "/images/6.jpg",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Snow-capped peaks and adventure sports. A high-altitude Himalayan resort town perfect for trekking."
  },
  {
    id: 3,
    title: "Jaipur",
    category: "Heritage",
    budget: 400,
    duration: "1-3 Days",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The pink city with royal palaces. Immerse yourself in the majestic history of the Rajput royals."
  },
  {
    id: 4,
    title: "Araku",
    category: "Wildlife",
    budget: 250,
    duration: "1-3 Days",
    rating: 4.6,
    images: [
      "/images/4.jpg",
      "/images/5.jpg"
    ],
    description: "A picturesque, organic hill station in the Eastern Ghats of Andhra Pradesh."
  },
  {
    id: 5,
    title: "Rishikesh",
    category: "Adventure",
    budget: 150,
    duration: "1-3 Days",
    rating: 4.8,
    images: [
      "/images/2.jpg",
      "/images/3.jpg"
    ],
    description: "River rafting and spiritual retreats. The Yoga Capital of the World along the sacred Ganges."
  },
  {
    id: 6,
    title: "Varanasi",
    category: "Spiritual",
    budget: 100,
    duration: "1-3 Days",
    rating: 4.9,
    images: [
      "/images/srivatsan-balaji-T5s48osIQTU-unsplash.jpg",
      "/images/arka-dutta--jGi48cZXJ8-unsplash.jpg",
    ],
    description: "Ancient city on the banks of the Ganges. Witness mesmerizing Aarti ceremonies and ancient temples."
  },
];

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [budget, setBudget] = React.useState(1000);
  const [activeDuration, setActiveDuration] = React.useState("Any");
  const [sortBy, setSortBy] = React.useState("Popularity");
  const [showFilters, setShowFilters] = React.useState(false);

  const filteredDestinations = React.useMemo(() => {
    let result = allDestinations;

    if (activeCategory !== "All") {
      result = result.filter(d => d.category === activeCategory);
    }

    if (activeDuration !== "Any") {
      result = result.filter(d => d.duration === activeDuration);
    }

    result = result.filter(d => d.budget <= budget);

    if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.budget - b.budget);
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.budget - a.budget);
    } else if (sortBy === "Rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, budget, activeDuration, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">

        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <Typography variant="h1" className="mb-4">Explore Destinations</Typography>
          <Typography variant="lead" className="max-w-2xl">
            Discover the perfect place for your next adventure. Use our advanced filters to find exactly what you&apos;re looking for.
          </Typography>
        </div>

        {/* Top Filter Bar */}
        <div className="bg-surface border rounded-2xl p-4 md:p-6 shadow-sm mb-10 sticky top-20 z-40">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Categories Scrollable Row */}
            <div className="flex-1 overflow-x-auto pb-2 -mb-2 no-scrollbar">
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background border hover:bg-muted text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden w-full flex items-center justify-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "More Filters"}
            </Button>

            {/* Right Side Filters (Desktop or Expanded Mobile) */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 ${showFilters ? 'flex' : 'hidden lg:flex'}`}>

              {/* Budget Slider */}
              <div className="flex flex-col w-full sm:w-48">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium">Max Budget</span>
                  <span className="text-primary font-bold">₹{budget}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Duration Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={activeDuration}
                  onChange={(e) => setActiveDuration(e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                >
                  <option disabled value="">Duration</option>
                  {durations.map(dur => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                >
                  <option disabled value="">Sort By</option>
                  {sortOptions.map(sort => (
                    <option key={sort} value={sort}>{sort}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="popLayout">
          {filteredDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <Typography variant="h3" className="mb-2">No destinations found</Typography>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setActiveCategory("All");
                  setBudget(1000);
                  setActiveDuration("Any");
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDestinations.map((dest) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={dest.id}
                >
                  <DestinationCard {...dest} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
